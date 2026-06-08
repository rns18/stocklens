-- ============================================================================
-- StockLens: Seed Mock Data Script (MySQL)
-- Populates the database with stocks, histories, users, and portfolio items
-- ============================================================================

-- USE stocklens;

-- 1. Seed USERS (Passwords are mocked bcrypt hashes of 'password123')
INSERT INTO USERS (username, email, password_hash) VALUES
('alex_mercer', 'alex@stocklens.io', '$2b$10$wK1W/X3i6MvC0XgO92G1XeX9Mpyb7s1GskmO0i5n.rB.F98V/NWe.'),
('sarah_connor', 'sarah@horizon.net', '$2b$10$wK1W/X3i6MvC0XgO92G1XeX9Mpyb7s1GskmO0i5n.rB.F98V/NWe.'),
('david_finch', 'david@finchcap.com', '$2b$10$wK1W/X3i6MvC0XgO92G1XeX9Mpyb7s1GskmO0i5n.rB.F98V/NWe.');

-- 2. Seed STOCKS (including new Indian Stocks)
INSERT INTO STOCKS (ticker, company_name, sector, market, beta, dividend_yield) VALUES
('AAPL', 'Apple Inc.', 'Technology', 'NASDAQ', 1.20, 0.55),
('MSFT', 'Microsoft Corporation', 'Technology', 'NASDAQ', 0.90, 0.72),
('TSLA', 'Tesla Inc.', 'Automotive', 'NASDAQ', 1.85, 0.00),
('AMZN', 'Amazon.com, Inc.', 'Consumer Cyclical', 'NASDAQ', 1.15, 0.00),
('NVDA', 'NVIDIA Corporation', 'Technology', 'NASDAQ', 1.75, 0.02),
('JPM', 'JPMorgan Chase & Co.', 'Financial Services', 'NYSE', 1.10, 2.45),
('KO', 'The Coca-Cola Company', 'Consumer Defensive', 'NYSE', 0.55, 3.10),
('JNJ', 'Johnson & Johnson', 'Healthcare', 'NYSE', 0.60, 2.90),
('RELIANCE', 'Reliance Industries Ltd.', 'Energy', 'NSE', 1.05, 0.32),
('TCS', 'Tata Consultancy Services', 'Technology', 'NSE', 0.78, 1.15),
('INFY', 'Infosys Limited', 'Technology', 'NSE', 0.85, 1.50),
('HDFCBANK', 'HDFC Bank Ltd.', 'Financial Services', 'NSE', 0.95, 0.90);

-- 3. Seed MARKET Details
INSERT INTO MARKET (stock_id, market_name, country) VALUES
(1, 'NASDAQ GS', 'United States'),
(2, 'NASDAQ GS', 'United States'),
(3, 'NASDAQ GS', 'United States'),
(4, 'NASDAQ GS', 'United States'),
(5, 'NASDAQ GS', 'United States'),
(6, 'NYSE', 'United States'),
(7, 'NYSE', 'United States'),
(8, 'NYSE', 'United States'),
(9, 'NSE', 'India'),
(10, 'NSE', 'India'),
(11, 'NSE', 'India'),
(12, 'NSE', 'India');

-- 4. Seed PRICE_HISTORY (OHLC format for Candlestick charts)
-- format: stock_id, price_date, open_price, high_price, low_price, closing_price

-- Apple (AAPL)
INSERT INTO PRICE_HISTORY (stock_id, price_date, open_price, high_price, low_price, closing_price) VALUES
(1, '2026-06-01', 174.00, 176.50, 173.80, 175.50),
(1, '2026-06-02', 175.20, 177.00, 174.90, 176.20),
(1, '2026-06-03', 176.50, 176.80, 174.20, 174.80),
(1, '2026-06-04', 174.50, 178.00, 174.00, 177.10),
(1, '2026-06-05', 177.00, 179.20, 176.50, 178.45);

-- Microsoft (MSFT)
INSERT INTO PRICE_HISTORY (stock_id, price_date, open_price, high_price, low_price, closing_price) VALUES
(2, '2026-06-01', 412.00, 416.50, 411.00, 415.00),
(2, '2026-06-02', 415.50, 418.00, 414.80, 417.30),
(2, '2026-06-03', 417.00, 417.50, 413.00, 414.20),
(2, '2026-06-04', 413.80, 421.00, 413.50, 420.10),
(2, '2026-06-05', 419.50, 424.00, 419.00, 422.50);

-- Tesla (TSLA)
INSERT INTO PRICE_HISTORY (stock_id, price_date, open_price, high_price, low_price, closing_price) VALUES
(3, '2026-06-01', 182.00, 184.50, 179.00, 180.20),
(3, '2026-06-02', 179.80, 181.00, 177.50, 178.50),
(3, '2026-06-03', 178.20, 178.50, 171.00, 172.10),
(3, '2026-06-04', 171.50, 176.50, 171.20, 175.40),
(3, '2026-06-05', 176.00, 179.00, 175.50, 177.90);

-- NVIDIA (NVDA)
INSERT INTO PRICE_HISTORY (stock_id, price_date, open_price, high_price, low_price, closing_price) VALUES
(5, '2026-06-01', 910.00, 928.00, 905.00, 920.00),
(5, '2026-06-02', 922.00, 938.00, 918.00, 935.50),
(5, '2026-06-03', 937.00, 940.00, 912.00, 915.20),
(5, '2026-06-04', 914.50, 945.00, 914.00, 942.00),
(5, '2026-06-05', 943.00, 955.00, 940.00, 950.10);

-- Coca-Cola (KO)
INSERT INTO PRICE_HISTORY (stock_id, price_date, open_price, high_price, low_price, closing_price) VALUES
(7, '2026-06-01', 61.00, 61.50, 60.90, 61.20),
(7, '2026-06-02', 61.15, 61.60, 61.10, 61.40),
(7, '2026-06-03', 61.45, 61.50, 60.95, 61.10),
(7, '2026-06-04', 61.05, 61.80, 61.00, 61.65),
(7, '2026-06-05', 61.70, 62.00, 61.60, 61.90);

-- Reliance Industries (RELIANCE)
INSERT INTO PRICE_HISTORY (stock_id, price_date, open_price, high_price, low_price, closing_price) VALUES
(9, '2026-06-01', 2420.00, 2450.00, 2415.00, 2435.00),
(9, '2026-06-02', 2438.00, 2465.00, 2432.00, 2458.50),
(9, '2026-06-03', 2460.00, 2462.00, 2428.00, 2442.00),
(9, '2026-06-04', 2439.00, 2480.00, 2435.00, 2472.00),
(9, '2026-06-05', 2475.00, 2495.00, 2470.00, 2488.90);

-- TCS (TCS)
INSERT INTO PRICE_HISTORY (stock_id, price_date, open_price, high_price, low_price, closing_price) VALUES
(10, '2026-06-01', 3820.00, 3865.00, 3810.00, 3850.00),
(10, '2026-06-02', 3855.00, 3880.00, 3848.00, 3872.30),
(10, '2026-06-03', 3875.00, 3878.00, 3830.00, 3842.00),
(10, '2026-06-04', 3840.80, 3910.00, 3838.50, 3902.10),
(10, '2026-06-05', 3895.50, 3940.00, 3890.00, 3922.50);

-- Infosys (INFY)
INSERT INTO PRICE_HISTORY (stock_id, price_date, open_price, high_price, low_price, closing_price) VALUES
(11, '2026-06-01', 1420.00, 1445.50, 1412.00, 1435.00),
(11, '2026-06-02', 1436.00, 1458.00, 1431.10, 1452.30),
(11, '2026-06-03', 1453.00, 1455.00, 1422.00, 1430.20),
(11, '2026-06-04', 1428.80, 1470.00, 1425.50, 1465.10),
(11, '2026-06-05', 1466.50, 1485.00, 1462.00, 1478.90);

-- HDFC Bank (HDFCBANK)
INSERT INTO PRICE_HISTORY (stock_id, price_date, open_price, high_price, low_price, closing_price) VALUES
(12, '2026-06-01', 1510.00, 1532.00, 1505.00, 1525.00),
(12, '2026-06-02', 1526.00, 1545.00, 1522.00, 1538.50),
(12, '2026-06-03', 1540.00, 1541.00, 1512.00, 1520.20),
(12, '2026-06-04', 1518.50, 1550.00, 1515.00, 1542.00),
(12, '2026-06-05', 1543.00, 1565.00, 1540.00, 1558.10);


-- 5. Seed PORTFOLIO positions
-- User 1 positions
INSERT INTO PORTFOLIO (user_id, stock_id, shares, buy_price, invest_date) VALUES
(1, 1, 10.0000, 170.00, '2026-05-10'),    -- Apple position
(1, 2, 5.0000, 400.00, '2026-05-15'),     -- Microsoft position
(1, 9, 20.0000, 2400.00, '2026-05-20'),   -- Reliance position
(1, 10, 8.0000, 3800.00, '2026-05-25');    -- TCS position

-- User 2 positions
INSERT INTO PORTFOLIO (user_id, stock_id, shares, buy_price, invest_date) VALUES
(2, 3, 15.0000, 190.00, '2026-05-20'),    -- Tesla position
(2, 11, 35.0000, 1430.00, '2026-05-22');   -- Infosys position

-- 6. Trigger Recommendation engine to initialize recommendation metrics
CALL GenerateRecommendations();
