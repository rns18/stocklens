-- ============================================================================
-- StockLens: DBMS Schema Definition (MySQL)
-- Enterprise-grade stock analysis and portfolio management database architecture
-- ============================================================================

-- CREATE DATABASE IF NOT EXISTS stocklens;
-- USE stocklens;

-- Disable foreign key checks to allow clean rebuilds
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS RECOMMENDATION;
DROP TABLE IF EXISTS PORTFOLIO;
DROP TABLE IF EXISTS PRICE_HISTORY;
DROP TABLE IF EXISTS MARKET;
DROP TABLE IF EXISTS STOCKS;
DROP TABLE IF EXISTS USERS;
DROP VIEW IF EXISTS v_portfolio_details;
DROP VIEW IF EXISTS v_stock_analytics;
DROP PROCEDURE IF EXISTS GetStockMovingAverage;
DROP PROCEDURE IF EXISTS PurchaseStock;
DROP PROCEDURE IF EXISTS GenerateRecommendations;
DROP TRIGGER IF EXISTS after_stock_insert;
DROP TRIGGER IF EXISTS before_price_insert;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- Table: USERS (User management & authentication)
-- ----------------------------------------------------------------------------
CREATE TABLE USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_email CHECK (email LIKE '%_@_%._%')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table: STOCKS (Core company records)
-- ----------------------------------------------------------------------------
CREATE TABLE STOCKS (
    stock_id INT AUTO_INCREMENT PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    sector VARCHAR(100) DEFAULT 'General',
    market VARCHAR(50) DEFAULT 'NASDAQ',
    beta DECIMAL(5,2) DEFAULT 1.00,
    dividend_yield DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_ticker CHECK (ticker REGEXP '^[A-Z0-9.-]+$'),
    CONSTRAINT chk_beta CHECK (beta >= -5.00 AND beta <= 5.00),
    CONSTRAINT chk_div_yield CHECK (dividend_yield >= 0.00 AND dividend_yield <= 100.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table: MARKET (Geographical and Exchange details)
-- ----------------------------------------------------------------------------
CREATE TABLE MARKET (
    stock_id INT PRIMARY KEY,
    market_name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    FOREIGN KEY (stock_id) REFERENCES STOCKS(stock_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table: PRICE_HISTORY (Time-series stock price logs)
-- ----------------------------------------------------------------------------
CREATE TABLE PRICE_HISTORY (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    stock_id INT NOT NULL,
    price_date DATE NOT NULL,
    open_price DECIMAL(10,2) NOT NULL,
    high_price DECIMAL(10,2) NOT NULL,
    low_price DECIMAL(10,2) NOT NULL,
    closing_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES STOCKS(stock_id) ON DELETE CASCADE,
    UNIQUE KEY uq_stock_date (stock_id, price_date),
    CONSTRAINT chk_open_price CHECK (open_price > 0.00),
    CONSTRAINT chk_high_price CHECK (high_price > 0.00),
    CONSTRAINT chk_low_price CHECK (low_price > 0.00),
    CONSTRAINT chk_closing_price CHECK (closing_price > 0.00),
    CONSTRAINT chk_high_low CHECK (high_price >= low_price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table: PORTFOLIO (User stock holding records)
-- ----------------------------------------------------------------------------
CREATE TABLE PORTFOLIO (
    portfolio_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    stock_id INT NOT NULL,
    shares DECIMAL(12,4) NOT NULL,
    buy_price DECIMAL(10,2) NOT NULL,
    invest_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES STOCKS(stock_id) ON DELETE CASCADE,
    CONSTRAINT chk_shares CHECK (shares > 0.0000),
    CONSTRAINT chk_buy_price CHECK (buy_price > 0.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table: RECOMMENDATION (Algorithmic action trigger data)
-- ----------------------------------------------------------------------------
CREATE TABLE RECOMMENDATION (
    recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
    stock_id INT NOT NULL UNIQUE,
    recommendation_type ENUM('BUY', 'SELL', 'HOLD') NOT NULL DEFAULT 'HOLD',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES STOCKS(stock_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ============================================================================
CREATE INDEX idx_stocks_ticker ON STOCKS(ticker);
CREATE INDEX idx_price_history_date ON PRICE_HISTORY(price_date);
CREATE INDEX idx_portfolio_user ON PORTFOLIO(user_id);
CREATE INDEX idx_portfolio_stock ON PORTFOLIO(stock_id);

-- ============================================================================
-- VIEWS FOR SIMPLIFIED READS & DATA AGGREGATION
-- ============================================================================

-- 1. View to track portfolio stats including current pricing and profits/losses
CREATE VIEW v_portfolio_details AS
SELECT 
    p.portfolio_id,
    p.user_id,
    u.username,
    s.stock_id,
    s.ticker,
    s.company_name,
    p.shares,
    p.buy_price,
    (p.shares * p.buy_price) AS total_investment,
    ph.closing_price AS current_price,
    (p.shares * ph.closing_price) AS current_value,
    ((p.shares * ph.closing_price) - (p.shares * p.buy_price)) AS profit_loss,
    (((ph.closing_price - p.buy_price) / p.buy_price) * 100) AS return_percentage,
    p.invest_date
FROM PORTFOLIO p
JOIN USERS u ON p.user_id = u.user_id
JOIN STOCKS s ON p.stock_id = s.stock_id
JOIN PRICE_HISTORY ph ON p.stock_id = ph.stock_id
-- Join with the latest closing price date
WHERE ph.price_date = (
    SELECT MAX(price_date) 
    FROM PRICE_HISTORY 
    WHERE stock_id = p.stock_id
);

-- 2. View to track comprehensive stock performance profiles
CREATE VIEW v_stock_analytics AS
SELECT 
    s.stock_id,
    s.ticker,
    s.company_name,
    s.sector,
    s.beta,
    s.dividend_yield,
    COUNT(ph.history_id) AS total_data_points,
    MIN(ph.closing_price) AS min_price,
    MAX(ph.closing_price) AS max_price,
    AVG(ph.closing_price) AS avg_price,
    -- Simple historical price volatility estimation (Standard Deviation of close price)
    STDDEV_SAMP(ph.closing_price) AS standard_deviation,
    r.recommendation_type
FROM STOCKS s
LEFT JOIN PRICE_HISTORY ph ON s.stock_id = ph.stock_id
LEFT JOIN RECOMMENDATION r ON s.stock_id = r.stock_id
GROUP BY s.stock_id, r.recommendation_type;

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

DELIMITER //

-- Stored Procedure to calculate rolling/moving averages for a stock over a given time span
CREATE PROCEDURE GetStockMovingAverage(
    IN p_stock_id INT,
    IN p_days INT,
    OUT p_moving_avg DECIMAL(10,2)
)
BEGIN
    SELECT AVG(closing_price) INTO p_moving_avg
    FROM (
        SELECT closing_price 
        FROM PRICE_HISTORY 
        WHERE stock_id = p_stock_id 
        ORDER BY price_date DESC 
        LIMIT p_days
    ) AS temp_history;
END //

-- Stored Procedure to process simulated stock purchases with validations
CREATE PROCEDURE PurchaseStock(
    IN p_user_id INT,
    IN p_ticker VARCHAR(10),
    IN p_shares DECIMAL(12,4),
    IN p_buy_price DECIMAL(10,2),
    IN p_invest_date DATE,
    OUT p_status_message VARCHAR(100)
)
BEGIN
    DECLARE v_stock_id INT;
    
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM USERS WHERE user_id = p_user_id) THEN
        SET p_status_message = 'ERROR: User does not exist';
    -- Check if stock ticker exists
    ELSEIF NOT EXISTS (SELECT 1 FROM STOCKS WHERE ticker = p_ticker) THEN
        SET p_status_message = 'ERROR: Ticker not found';
    ELSE
        SELECT stock_id INTO v_stock_id FROM STOCKS WHERE ticker = p_ticker;
        
        -- Insert new investment transaction
        INSERT INTO PORTFOLIO (user_id, stock_id, shares, buy_price, invest_date)
        VALUES (p_user_id, v_stock_id, p_shares, p_buy_price, p_invest_date);
        
        SET p_status_message = 'SUCCESS: Portfolio position created';
    END IF;
END //

-- Stored Procedure to auto-generate Recommendations based on beta, volatility, and dividend yield metrics
CREATE PROCEDURE GenerateRecommendations()
BEGIN
    -- Declare variables for cursor loop
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur_stock_id INT;
    DECLARE cur_beta DECIMAL(5,2);
    DECLARE cur_yield DECIMAL(5,2);
    DECLARE cur_avg_price DECIMAL(10,2);
    DECLARE cur_latest_price DECIMAL(10,2);
    
    -- Cursor to select all stocks and their performance statistics
    DECLARE stock_cursor CURSOR FOR 
        SELECT s.stock_id, s.beta, s.dividend_yield, 
               (SELECT AVG(closing_price) FROM PRICE_HISTORY WHERE stock_id = s.stock_id) as avg_price,
               (SELECT closing_price FROM PRICE_HISTORY WHERE stock_id = s.stock_id ORDER BY price_date DESC LIMIT 1) as latest_price
        FROM STOCKS s;
        
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN stock_cursor;
    
    read_loop: LOOP
        FETCH stock_cursor INTO cur_stock_id, cur_beta, cur_yield, cur_avg_price, cur_latest_price;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Recommendation Logic Rule Engine
        -- If stock is currently undervalued (latest price < avg historical price) AND beta is stable (< 1.2), recommend BUY
        -- If stock is overvalued (latest price > avg historical price * 1.25) AND beta is high, recommend SELL
        -- Else, HOLD
        IF cur_latest_price IS NOT NULL AND cur_avg_price IS NOT NULL THEN
            IF cur_latest_price < cur_avg_price AND cur_beta < 1.30 THEN
                INSERT INTO RECOMMENDATION (stock_id, recommendation_type) 
                VALUES (cur_stock_id, 'BUY')
                ON DUPLICATE KEY UPDATE recommendation_type = 'BUY';
            ELSEIF cur_latest_price > (cur_avg_price * 1.20) OR cur_beta > 1.80 THEN
                INSERT INTO RECOMMENDATION (stock_id, recommendation_type) 
                VALUES (cur_stock_id, 'SELL')
                ON DUPLICATE KEY UPDATE recommendation_type = 'SELL';
            ELSE
                INSERT INTO RECOMMENDATION (stock_id, recommendation_type) 
                VALUES (cur_stock_id, 'HOLD')
                ON DUPLICATE KEY UPDATE recommendation_type = 'HOLD';
            END IF;
        END IF;
        
    END LOOP;
    
    CLOSE stock_cursor;
END //

DELIMITER ;

-- ============================================================================
-- TRIGGERS FOR INTEGRITY & AUTOMATED LOGIC
-- =================================================---------------------------

DELIMITER //

-- Trigger: Automatically seed a HOLD recommendation when a new stock is added
CREATE TRIGGER after_stock_insert
AFTER INSERT ON STOCKS
FOR EACH ROW
BEGIN
    INSERT INTO RECOMMENDATION (stock_id, recommendation_type)
    VALUES (NEW.stock_id, 'HOLD');
END //

-- Trigger: Automatically validate price date on PRICE_HISTORY entries
CREATE TRIGGER before_price_insert
BEFORE INSERT ON PRICE_HISTORY
FOR EACH ROW
BEGIN
    -- Prevent future price entries
    IF NEW.price_date > CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'ERROR: Cannot enter stock price for a future date';
    END IF;
END //

DELIMITER ;
