import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, 
  Briefcase, Award, ArrowUpRight, Search, Plus, 
  Trash2, RefreshCw, Layers, ShieldAlert, BarChart3
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [buyTicker, setBuyTicker] = useState('AAPL');
  const [buyShares, setBuyShares] = useState(10);
  const [buyPrice, setBuyPrice] = useState(175);
  const [historyData, setHistoryData] = useState([]);
  
  // Historical chart canvas ref
  const canvasRef = useRef(null);

  // High fidelity default data for standalone prototyping
  const mockStocks = [
    { stock_id: 1, ticker: 'AAPL', company_name: 'Apple Inc.', sector: 'Technology', market: 'NASDAQ GS', beta: 1.20, dividend_yield: 0.55, avg_price: 175.39, min_price: 174.8, max_price: 178.45, standard_deviation: 1.48, recommendation_type: 'BUY' },
    { stock_id: 2, ticker: 'MSFT', company_name: 'Microsoft Corp.', sector: 'Technology', market: 'NASDAQ GS', beta: 0.90, dividend_yield: 0.72, avg_price: 417.22, min_price: 414.2, max_price: 422.5, standard_deviation: 3.56, recommendation_type: 'HOLD' },
    { stock_id: 3, ticker: 'TSLA', company_name: 'Tesla Inc.', sector: 'Automotive', market: 'NASDAQ GS', beta: 1.85, dividend_yield: 0.00, avg_price: 176.92, min_price: 172.1, max_price: 180.2, standard_deviation: 3.20, recommendation_type: 'SELL' },
    { stock_id: 5, ticker: 'NVDA', company_name: 'NVIDIA Corp.', sector: 'Technology', market: 'NASDAQ GS', beta: 1.75, dividend_yield: 0.02, avg_price: 932.58, min_price: 915.2, max_price: 950.1, standard_deviation: 15.11, recommendation_type: 'BUY' },
    { stock_id: 7, ticker: 'KO', company_name: 'The Coca-Cola Co.', sector: 'Consumer Defensive', market: 'NYSE', beta: 0.55, dividend_yield: 3.10, avg_price: 61.45, min_price: 61.1, max_price: 61.9, standard_deviation: 0.35, recommendation_type: 'BUY' },
    { stock_id: 9, ticker: 'RELIANCE', company_name: 'Reliance Industries Ltd.', sector: 'Energy', market: 'NSE', beta: 1.05, dividend_yield: 0.32, avg_price: 2458.90, min_price: 2415.00, max_price: 2495.00, standard_deviation: 32.14, recommendation_type: 'BUY' },
    { stock_id: 10, ticker: 'TCS', company_name: 'Tata Consultancy Services', sector: 'Technology', market: 'NSE', beta: 0.78, dividend_yield: 1.15, avg_price: 3872.50, min_price: 3810.00, max_price: 3940.00, standard_deviation: 53.20, recommendation_type: 'HOLD' },
    { stock_id: 11, ticker: 'INFY', company_name: 'Infosys Limited', sector: 'Technology', market: 'NSE', beta: 0.85, dividend_yield: 1.50, avg_price: 1452.30, min_price: 1412.00, max_price: 1485.00, standard_deviation: 29.50, recommendation_type: 'BUY' },
    { stock_id: 12, ticker: 'HDFCBANK', company_name: 'HDFC Bank Ltd.', sector: 'Financial Services', market: 'NSE', beta: 0.95, dividend_yield: 0.90, avg_price: 1538.10, min_price: 1505.00, max_price: 1565.00, standard_deviation: 21.80, recommendation_type: 'HOLD' }
  ];

  const mockPortfolio = [
    { portfolio_id: 101, ticker: 'AAPL', company_name: 'Apple Inc.', shares: 15, buy_price: 168.50, current_price: 178.45, total_investment: 2527.50, current_value: 2676.75, profit_loss: 149.25, return_percentage: 5.90, invest_date: '2026-05-10' },
    { portfolio_id: 102, ticker: 'MSFT', company_name: 'Microsoft Corp.', shares: 8, buy_price: 405.00, current_price: 422.50, total_investment: 3240.00, current_value: 3380.00, profit_loss: 140.00, return_percentage: 4.32, invest_date: '2026-05-15' },
    { portfolio_id: 103, ticker: 'TSLA', company_name: 'Tesla Inc.', shares: 12, buy_price: 185.00, current_price: 177.90, total_investment: 2220.00, current_value: 2134.80, profit_loss: -85.20, return_percentage: -3.84, invest_date: '2026-05-20' },
    { portfolio_id: 104, ticker: 'RELIANCE', company_name: 'Reliance Industries Ltd.', shares: 20, buy_price: 2400.00, current_price: 2488.90, total_investment: 48000.00, current_value: 49778.00, profit_loss: 1778.00, return_percentage: 3.70, invest_date: '2026-05-20' },
    { portfolio_id: 105, ticker: 'TCS', company_name: 'Tata Consultancy Services', shares: 8, buy_price: 3800.00, current_price: 3922.50, total_investment: 30400.00, current_value: 31380.00, profit_loss: 980.00, return_percentage: 3.22, invest_date: '2026-05-25' }
  ];

  const mockHistories = {
    'AAPL': [
      { price_date: '2026-06-01', open_price: 174.00, high_price: 176.50, low_price: 173.80, closing_price: 175.50 },
      { price_date: '2026-06-02', open_price: 175.20, high_price: 177.00, low_price: 174.90, closing_price: 176.20 },
      { price_date: '2026-06-03', open_price: 176.50, high_price: 176.80, low_price: 174.20, closing_price: 174.80 },
      { price_date: '2026-06-04', open_price: 174.50, high_price: 178.00, low_price: 174.00, closing_price: 177.10 },
      { price_date: '2026-06-05', open_price: 177.00, high_price: 179.20, low_price: 176.50, closing_price: 178.45 }
    ],
    'MSFT': [
      { price_date: '2026-06-01', open_price: 412.00, high_price: 416.50, low_price: 411.00, closing_price: 415.00 },
      { price_date: '2026-06-02', open_price: 415.50, high_price: 418.00, low_price: 414.80, closing_price: 417.30 },
      { price_date: '2026-06-03', open_price: 417.00, high_price: 417.50, low_price: 413.00, closing_price: 414.20 },
      { price_date: '2026-06-04', open_price: 413.80, high_price: 421.00, low_price: 413.50, closing_price: 420.10 },
      { price_date: '2026-06-05', open_price: 419.50, high_price: 424.00, low_price: 419.00, closing_price: 422.50 }
    ],
    'TSLA': [
      { price_date: '2026-06-01', open_price: 182.00, high_price: 184.50, low_price: 179.00, closing_price: 180.20 },
      { price_date: '2026-06-02', open_price: 179.80, high_price: 181.00, low_price: 177.50, closing_price: 178.50 },
      { price_date: '2026-06-03', open_price: 178.20, high_price: 178.50, low_price: 171.00, closing_price: 172.10 },
      { price_date: '2026-06-04', open_price: 171.50, high_price: 176.50, low_price: 171.20, closing_price: 175.40 },
      { price_date: '2026-06-05', open_price: 176.00, high_price: 179.00, low_price: 175.50, closing_price: 177.90 }
    ],
    'NVDA': [
      { price_date: '2026-06-01', open_price: 910.00, high_price: 928.00, low_price: 905.00, closing_price: 920.00 },
      { price_date: '2026-06-02', open_price: 922.00, high_price: 938.00, low_price: 918.00, closing_price: 935.50 },
      { price_date: '2026-06-03', open_price: 937.00, high_price: 940.00, low_price: 912.00, closing_price: 915.20 },
      { price_date: '2026-06-04', open_price: 914.50, high_price: 945.00, low_price: 914.00, closing_price: 942.00 },
      { price_date: '2026-06-05', open_price: 943.00, high_price: 955.00, low_price: 940.00, closing_price: 950.10 }
    ],
    'KO': [
      { price_date: '2026-06-01', open_price: 61.00, high_price: 61.50, low_price: 60.90, closing_price: 61.20 },
      { price_date: '2026-06-02', open_price: 61.15, high_price: 61.60, low_price: 61.10, closing_price: 61.40 },
      { price_date: '2026-06-03', open_price: 61.45, high_price: 61.50, low_price: 60.95, closing_price: 61.10 },
      { price_date: '2026-06-04', open_price: 61.05, high_price: 61.80, low_price: 61.00, closing_price: 61.65 },
      { price_date: '2026-06-05', open_price: 61.70, high_price: 62.00, low_price: 61.60, closing_price: 61.90 }
    ],
    'RELIANCE': [
      { price_date: '2026-06-01', open_price: 2420.00, high_price: 2450.00, low_price: 2415.00, closing_price: 2435.00 },
      { price_date: '2026-06-02', open_price: 2438.00, high_price: 2465.00, low_price: 2432.00, closing_price: 2458.50 },
      { price_date: '2026-06-03', open_price: 2460.00, high_price: 2462.00, low_price: 2428.00, closing_price: 2442.00 },
      { price_date: '2026-06-04', open_price: 2439.00, high_price: 2480.00, low_price: 2435.00, closing_price: 2472.00 },
      { price_date: '2026-06-05', open_price: 2475.00, high_price: 2495.00, low_price: 2470.00, closing_price: 2488.90 }
    ],
    'TCS': [
      { price_date: '2026-06-01', open_price: 3820.00, high_price: 3865.00, low_price: 3810.00, closing_price: 3850.00 },
      { price_date: '2026-06-02', open_price: 3855.00, high_price: 3880.00, low_price: 3848.00, closing_price: 3872.30 },
      { price_date: '2026-06-03', open_price: 3875.00, high_price: 3878.00, low_price: 3830.00, closing_price: 3842.00 },
      { price_date: '2026-06-04', open_price: 3840.80, high_price: 3910.00, low_price: 3838.50, closing_price: 3902.10 },
      { price_date: '2026-06-05', open_price: 3895.50, high_price: 3940.00, low_price: 3890.00, closing_price: 3922.50 }
    ],
    'INFY': [
      { price_date: '2026-06-01', open_price: 1420.00, high_price: 1445.50, low_price: 1412.00, closing_price: 1435.00 },
      { price_date: '2026-06-02', open_price: 1436.00, high_price: 1458.00, low_price: 1431.10, closing_price: 1452.30 },
      { price_date: '2026-06-03', open_price: 1453.00, high_price: 1455.00, low_price: 1422.00, closing_price: 1430.20 },
      { price_date: '2026-06-04', open_price: 1428.80, high_price: 1470.00, low_price: 1425.50, closing_price: 1465.10 },
      { price_date: '2026-06-05', open_price: 1466.50, high_price: 1485.00, low_price: 1462.00, closing_price: 1478.90 }
    ],
    'HDFCBANK': [
      { price_date: '2026-06-01', open_price: 1510.00, high_price: 1532.00, low_price: 1505.00, closing_price: 1525.00 },
      { price_date: '2026-06-02', open_price: 1526.00, high_price: 1545.00, low_price: 1522.00, closing_price: 1538.50 },
      { price_date: '2026-06-03', open_price: 1540.00, high_price: 1541.00, low_price: 1512.00, closing_price: 1520.20 },
      { price_date: '2026-06-04', open_price: 1518.50, high_price: 1550.00, low_price: 1515.00, closing_price: 1542.00 },
      { price_date: '2026-06-05', open_price: 1543.00, high_price: 1565.00, low_price: 1540.00, closing_price: 1558.10 }
    ]
  };

  useEffect(() => {
    // Attempt to fetch from real API if running, fallback to mock details
    fetch('/api/stocks')
      .then(res => res.json())
      .then(data => {
        const list = data.length ? data : mockStocks;
        setStocks(list);
        if (list.length) setSelectedStock(list[0]);
      })
      .catch(() => {
        setStocks(mockStocks);
        setSelectedStock(mockStocks[0]);
      });

    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => setPortfolio(data.length ? data : mockPortfolio))
      .catch(() => setPortfolio(mockPortfolio));
  }, []);

  useEffect(() => {
    if (selectedStock) {
      fetch(`/api/stocks/${selectedStock.stock_id}/history`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0 && !data.error) {
            setHistoryData(data);
          } else {
            setHistoryData(mockHistories[selectedStock.ticker] || []);
          }
        })
        .catch(() => {
          setHistoryData(mockHistories[selectedStock.ticker] || []);
        });
    }
  }, [selectedStock]);

  // Professional Groww/Angel One-style Candlestick Chart Renderer
  useEffect(() => {
    if (!canvasRef.current || !selectedStock || historyData.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    // Dark chart background
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1421';
    ctx.fillRect(0, 0, W, H);

    const PL = 70, PR = 12, PT = 16, PB = 34;
    const cW = W - PL - PR, cH = H - PT - PB;

    // Price range with breathing room
    const highs = historyData.map(h => Number(h.high_price || h.closing_price));
    const lows  = historyData.map(h => Number(h.low_price  || h.closing_price));
    const rMin  = Math.min(...lows), rMax = Math.max(...highs);
    const margin = (rMax - rMin) * 0.12 || rMax * 0.01;
    const minV = rMin - margin, maxV = rMax + margin;
    const range = maxV - minV;
    const toY = v => PT + cH - ((v - minV) / range) * cH;

    // Dashed grid + y-axis price labels
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const v = minV + (range / steps) * i;
      const y = toY(v);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(PL, y); ctx.lineTo(W - PR, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#9ca3af'; ctx.font = '10px Inter,sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(v >= 1000 ? v.toFixed(0) : v.toFixed(2), PL - 4, y);
    }

    // Candle slots
    const n = historyData.length;
    const slotW = cW / n;
    const bodyW = Math.max(6, Math.min(22, slotW * 0.5));

    historyData.forEach((item, i) => {
      const cx   = PL + slotW * i + slotW / 2;
      const o    = Number(item.open_price || item.closing_price);
      const c    = Number(item.closing_price);
      const hi   = Number(item.high_price  || item.closing_price);
      const lo   = Number(item.low_price   || item.closing_price);
      const bull = c >= o;
      const fill = bull ? '#00c9a7' : '#ff4d4d';  // teal = bull, red = bear

      const yO = toY(o), yC = toY(c), yH = toY(hi), yL = toY(lo);
      const yTop = Math.min(yO, yC), yBot = Math.max(yO, yC);
      const bH   = Math.max(1.5, yBot - yTop);

      // Upper wick
      ctx.strokeStyle = fill; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, yH); ctx.lineTo(cx, yTop); ctx.stroke();
      // Lower wick
      ctx.beginPath(); ctx.moveTo(cx, yBot); ctx.lineTo(cx, yL);  ctx.stroke();

      // Body (solid for bull, hollow-ish for bear like TradingView)
      if (bull) {
        ctx.fillStyle = fill;
        ctx.fillRect(cx - bodyW / 2, yTop, bodyW, bH);
      } else {
        ctx.fillStyle = 'rgba(255,77,77,0.25)';
        ctx.fillRect(cx - bodyW / 2, yTop, bodyW, bH);
        ctx.strokeStyle = fill; ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - bodyW / 2, yTop, bodyW, bH);
      }

      // Date label
      ctx.fillStyle = '#6b7280'; ctx.font = '9px Inter,sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      if (item.price_date) {
        const d = new Date(item.price_date);
        ctx.fillText(`${d.getDate()}/${d.getMonth() + 1}`, cx, H - PB + 6);
      }
    });

    // Border
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.strokeRect(PL, PT, cW, cH);
  }, [selectedStock, historyData, activeTab]);

  // Aggregate Calculations (Calculated dynamically)
  const totalInvestment = portfolio.reduce((sum, item) => sum + Number(item.total_investment), 0);
  const currentPortfolioValue = portfolio.reduce((sum, item) => sum + Number(item.current_value || (item.shares * item.buy_price)), 0);
  const netProfitLoss = currentPortfolioValue - totalInvestment;
  const netReturnPercentage = totalInvestment ? (netProfitLoss / totalInvestment) * 100 : 0;

  // Portfolio Weighted Beta (Risk Index)
  const portfolioBeta = portfolio.reduce((sum, item) => {
    const stockInfo = stocks.find(s => s.ticker === item.ticker);
    const beta = stockInfo ? Number(stockInfo.beta) : 1.00;
    const weight = totalInvestment ? Number(item.total_investment) / totalInvestment : 0;
    return sum + (beta * weight);
  }, 0);

  const getRiskLabel = (beta) => {
    if (beta < 0.8) return { label: 'Conservative (Low Volatility)', color: 'var(--success)' };
    if (beta <= 1.3) return { label: 'Moderate Growth (Balanced)', color: 'var(--secondary)' };
    return { label: 'Aggressive / High Risk (High Volatility)', color: 'var(--danger)' };
  };

  const handleBuyStock = (e) => {
    e.preventDefault();
    const targetStock = stocks.find(s => s.ticker === buyTicker);
    if (!targetStock) return alert('Ticker not supported');

    const newPosition = {
      portfolio_id: Date.now(),
      ticker: buyTicker,
      company_name: targetStock.company_name,
      shares: Number(buyShares),
      buy_price: Number(buyPrice),
      current_price: buyPrice,
      total_investment: Number(buyShares) * Number(buyPrice),
      current_value: Number(buyShares) * Number(buyPrice),
      profit_loss: 0,
      return_percentage: 0,
      invest_date: new Date().toISOString().split('T')[0]
    };

    setPortfolio([...portfolio, newPosition]);
    alert(`Success: Portfolio position created for ${buyTicker}!`);
  };

  const handleDeletePosition = (id) => {
    setPortfolio(portfolio.filter(item => item.portfolio_id !== id));
  };

  const filteredStocks = stocks.filter(s => 
    s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header style={{
        background: 'rgba(15, 17, 28, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            S
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Stock<span className="gradient-text">Lens</span>
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '8px' }}>
          {['overview', 'stocks', 'portfolio', 'recommendations'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                transition: 'var(--transition)'
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 12px' }}>
            <Search size={16} style={{ color: 'var(--text-secondary)', marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Search ticker..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.85rem' }} 
            />
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main style={{ flex: 1, padding: '40px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        
        {/* KPI Panel Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          
          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>PORTFOLIO VALUE</p>
              <h2 style={{ fontSize: '2rem', margin: '6px 0 0 0' }}>${currentPortfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
            </div>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
              <Briefcase size={28} />
            </div>
          </div>

          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>TOTAL INVESTED</p>
              <h2 style={{ fontSize: '2rem', margin: '6px 0 0 0' }}>${totalInvestment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
            </div>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '12px', borderRadius: '12px', color: 'var(--secondary)' }}>
              <DollarSign size={28} />
            </div>
          </div>

          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>TOTAL RETURN (P&L)</p>
              <h2 className={netProfitLoss >= 0 ? "green-text" : "red-text"} style={{ fontSize: '2rem', margin: '6px 0 0 0' }}>
                {netProfitLoss >= 0 ? '+' : ''}${netProfitLoss.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </h2>
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }} className={netProfitLoss >= 0 ? "green-text" : "red-text"}>
                {netProfitLoss >= 0 ? '▲' : '▼'} {netReturnPercentage.toFixed(2)}%
              </span>
            </div>
            <div style={{ background: netProfitLoss >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', padding: '12px', borderRadius: '12px', color: netProfitLoss >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              {netProfitLoss >= 0 ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
            </div>
          </div>

          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>PORTFOLIO BETA (RISK)</p>
              <h2 style={{ fontSize: '2rem', margin: '6px 0 0 0' }}>{portfolioBeta.toFixed(2)}</h2>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: getRiskLabel(portfolioBeta).color }}>
                {getRiskLabel(portfolioBeta).label}
              </span>
            </div>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '12px', borderRadius: '12px', color: 'var(--accent)' }}>
              <ShieldAlert size={28} />
            </div>
          </div>

        </div>

        {/* Tab 1: OVERVIEW — full width dual chart */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Stock Detail & Analytics Panel */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Market Analysis Engine</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time trends, index metrics, and historical logs</p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: '420px', justifyContent: 'flex-end' }}>
                  {stocks.slice(0, 9).map(st => (
                    <button
                      key={st.ticker}
                      onClick={() => setSelectedStock(st)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: selectedStock?.ticker === st.ticker ? '1px solid #00c9a7' : '1px solid rgba(255,255,255,0.1)',
                        background: selectedStock?.ticker === st.ticker ? 'rgba(0,201,167,0.12)' : 'rgba(255,255,255,0.03)',
                        color: selectedStock?.ticker === st.ticker ? '#00c9a7' : '#9ca3af',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {st.ticker}
                    </button>
                  ))}
                </div>
              </div>

              {selectedStock && (
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase' }}>{selectedStock.sector}</span>
                      <h4 style={{ fontSize: '1.4rem' }}>{selectedStock.company_name} ({selectedStock.ticker})</h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recommendation</span>
                      <div style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        marginTop: '4px',
                        background: selectedStock.recommendation_type === 'BUY' ? 'rgba(16,185,129,0.1)' : selectedStock.recommendation_type === 'SELL' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                        color: selectedStock.recommendation_type === 'BUY' ? 'var(--success)' : selectedStock.recommendation_type === 'SELL' ? 'var(--danger)' : 'var(--warning)',
                        display: 'inline-block'
                      }}>{selectedStock.recommendation_type}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>BETA RISK</p>
                      <h4 style={{ fontSize: '1.2rem', marginTop: '4px' }}>{selectedStock.beta}</h4>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>DIVIDEND YIELD</p>
                      <h4 style={{ fontSize: '1.2rem', marginTop: '4px' }}>{selectedStock.dividend_yield}%</h4>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>VOLATILITY (STDDEV)</p>
                      <h4 style={{ fontSize: '1.2rem', marginTop: '4px' }}>{Number(selectedStock.standard_deviation || 0).toFixed(2)}</h4>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>HISTORICAL AVG</p>
                       <h4 style={{ fontSize: '1.2rem', marginTop: '4px' }}>{['NSE','BSE'].includes(selectedStock.market) ? '₹' : '$'}{Number(selectedStock.avg_price || 0).toFixed(2)}</h4>
                     </div>
                  </div>

                  {/* Draw Chart Canvas */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h5 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>5-Day Candlestick Chart (OHLC)</h5>
                      {historyData.length > 0 && (() => {
                        const last = historyData[historyData.length - 1];
                        const sym = ['NSE','BSE'].includes(selectedStock?.market) ? '₹' : '$';
                        return (
                          <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#9ca3af', letterSpacing: '0.03em' }}>
                            <span style={{ marginRight: '10px' }}>O: <span style={{ color: '#e5e7eb', fontWeight: 700 }}>{sym}{Number(last.open_price||0).toFixed(2)}</span></span>
                            <span style={{ marginRight: '10px' }}>H: <span style={{ color: '#00c9a7', fontWeight: 700 }}>{sym}{Number(last.high_price||0).toFixed(2)}</span></span>
                            <span style={{ marginRight: '10px' }}>L: <span style={{ color: '#ff4d4d', fontWeight: 700 }}>{sym}{Number(last.low_price||0).toFixed(2)}</span></span>
                            <span>C: <span style={{ color: '#e5e7eb', fontWeight: 700 }}>{sym}{Number(last.closing_price||0).toFixed(2)}</span></span>
                          </div>
                        );
                      })()}
                    </div>
                    <div style={{ background: '#0d1421', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <canvas ref={canvasRef} width="800" height="300" style={{ width: '100%', height: '260px', display: 'block' }}></canvas>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Right panel: Animated area/line chart for closing prices */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 4px' }}>Price Trend</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>Closing price area chart with moving average</p>
              </div>
              {selectedStock && historyData.length > 0 && (
                <div>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {['avg', 'high', 'low'].map(k => {
                      const vals = { avg: historyData.map(h => Number(h.closing_price)), high: historyData.map(h => Number(h.high_price || h.closing_price)), low: historyData.map(h => Number(h.low_price || h.closing_price)) };
                      const arr = vals[k]; const last = arr[arr.length - 1];
                      const sym = ['NSE','BSE'].includes(selectedStock?.market) ? '₹' : '$';
                      const colors = { avg: '#6366f1', high: '#00c9a7', low: '#ff4d4d' };
                      return (
                        <div key={k} style={{ fontSize: '0.8rem' }}>
                          <span style={{ color: '#6b7280', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{k === 'avg' ? 'Close' : k}</span>
                          <div style={{ color: colors[k], fontWeight: 700, fontFamily: 'monospace' }}>{sym}{last.toFixed(2)}</div>
                        </div>
                      );
                    })}
                  </div>
                  <AreaChart data={historyData} market={selectedStock.market} />
                </div>
              )}
              {/* Stock metrics list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                {stocks.slice(0, 6).map(st => {
                  const sym = ['NSE','BSE'].includes(st.market) ? '₹' : '$';
                  const isUp = st.recommendation_type === 'BUY';
                  return (
                    <div key={st.ticker} onClick={() => setSelectedStock(st)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: selectedStock?.ticker === st.ticker ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)', borderRadius: '8px', border: selectedStock?.ticker === st.ticker ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{st.ticker}</div>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '2px' }}>{st.sector}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.9rem' }}>{sym}{Number(st.avg_price || 0).toFixed(2)}</div>
                        <div style={{ fontSize: '0.75rem', color: isUp ? '#00c9a7' : '#ff4d4d', fontWeight: 600 }}>{st.recommendation_type}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: STOCKS CATALOGUE */}
        {activeTab === 'stocks' && (
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem' }}>Supported Equity Securities</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Current system catalog with volatility metrics</p>
              </div>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Company Name</th>
                    <th>Sector</th>
                    <th>Exchange</th>
                    <th>Beta</th>
                    <th>Div. Yield</th>
                    <th>Avg Price</th>
                    <th>Recommendation</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map(stock => (
                    <tr key={stock.stock_id} style={{ cursor: 'pointer' }} onClick={() => { setSelectedStock(stock); setActiveTab('overview'); }}>
                      <td style={{ fontWeight: 700, color: 'var(--secondary)' }}>{stock.ticker}</td>
                      <td>{stock.company_name}</td>
                      <td>{stock.sector}</td>
                      <td>{stock.market}</td>
                      <td>{stock.beta}</td>
                      <td>{stock.dividend_yield}%</td>
                      <td>{['NSE','BSE'].includes(stock.market) ? '₹' : '$'}{stock.avg_price ? Number(stock.avg_price).toFixed(2) : 'N/A'}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: stock.recommendation_type === 'BUY' ? 'rgba(16,185,129,0.1)' : stock.recommendation_type === 'SELL' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                          color: stock.recommendation_type === 'BUY' ? 'var(--success)' : stock.recommendation_type === 'SELL' ? 'var(--danger)' : 'var(--warning)',
                        }}>{stock.recommendation_type}</span>
                      </td>
                      <td>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setBuyTicker(stock.ticker);
                            setBuyPrice(stock.avg_price || 150);
                            setActiveTab('overview');
                          }}
                          style={{
                            background: 'rgba(6, 182, 212, 0.1)',
                            color: 'var(--secondary)',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: MY PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem' }}>Asset Allocations & Holdings</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Track, manage, and liquidate active investments</p>
              </div>
            </div>

            {portfolio.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No positions currently open. Go to the dashboard to simulate transactions.</p>
              </div>
            ) : (
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Buy Date</th>
                      <th>Quantity</th>
                      <th>Avg. Cost</th>
                      <th>Current Price</th>
                      <th>Total Principal</th>
                      <th>Market Value</th>
                      <th>Total Return (P&L)</th>
                      <th>Return %</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map(pos => {
                      const pnl = Number(pos.profit_loss);
                      return (
                        <tr key={pos.portfolio_id}>
                          <td style={{ fontWeight: 700 }}>{pos.ticker}</td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pos.invest_date}</td>
                          <td>{pos.shares}</td>
                          <td>${Number(pos.buy_price).toFixed(2)}</td>
                          <td>${Number(pos.current_price || pos.buy_price).toFixed(2)}</td>
                          <td>${Number(pos.total_investment).toFixed(2)}</td>
                          <td>${Number(pos.current_value || pos.total_investment).toFixed(2)}</td>
                          <td className={pnl >= 0 ? 'green-text' : 'red-text'} style={{ fontWeight: 600 }}>
                            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                          </td>
                          <td className={pnl >= 0 ? 'green-text' : 'red-text'} style={{ fontWeight: 600 }}>
                            {pnl >= 0 ? '▲' : '▼'} {Number(pos.return_percentage || 0).toFixed(2)}%
                          </td>
                          <td>
                            <button 
                              onClick={() => handleDeletePosition(pos.portfolio_id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--danger)',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'var(--transition)'
                              }}
                              title="Liquidate position"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="glass-panel">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Intelligent Decision Engine</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
                Algorithmic purchase and liquidation signals computed utilizing moving average crossovers, beta indices, and dividend profiles.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                
                {/* Buy Panel */}
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 className="green-text" style={{ fontSize: '1.1rem' }}>BUY SIGNALS</h4>
                    <span style={{ fontSize: '0.75rem', background: 'var(--success)', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>UNDERVALUED</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stocks.filter(s => s.recommendation_type === 'BUY').map(st => (
                      <div key={st.ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem' }}>{st.ticker}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Beta: {st.beta}</div>
                        </div>
                        <button 
                          onClick={() => { setBuyTicker(st.ticker); setBuyPrice(st.avg_price); setActiveTab('overview'); }}
                          style={{ background: 'var(--success)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}
                        >
                          Execute
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hold Panel */}
                <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 className="gradient-text" style={{ fontSize: '1.1rem', color: 'var(--warning)' }}>HOLD SIGNALS</h4>
                    <span style={{ fontSize: '0.75rem', background: 'var(--warning)', color: '#000', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>STABLE</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stocks.filter(s => s.recommendation_type === 'HOLD').map(st => (
                      <div key={st.ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem' }}>{st.ticker}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Yield: {st.dividend_yield}%</div>
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Neutral</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sell Panel */}
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 className="red-text" style={{ fontSize: '1.1rem' }}>SELL SIGNALS</h4>
                    <span style={{ fontSize: '0.75rem', background: 'var(--danger)', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>OVERVALUED</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stocks.filter(s => s.recommendation_type === 'SELL').map(st => (
                      <div key={st.ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem' }}>{st.ticker}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Beta: {st.beta}</div>
                        </div>
                        <span className="red-text" style={{ fontSize: '0.8rem', fontWeight: 700 }}>High Volatility</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '30px',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        marginTop: 'auto',
        background: 'rgba(15, 17, 28, 0.4)'
      }}>
        <p>© 2026 StockLens. Designed as a capstone relational DBMS platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

// AreaChart: canvas-based gradient area + MA line for the right panel
function AreaChart({ data, market }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !data || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1421';
    ctx.fillRect(0, 0, W, H);

    const PL = 60, PR = 12, PT = 14, PB = 28;
    const cW = W - PL - PR, cH = H - PT - PB;

    const closes = data.map(d => Number(d.closing_price));
    const highs  = data.map(d => Number(d.high_price  || d.closing_price));
    const lows   = data.map(d => Number(d.low_price   || d.closing_price));
    const mn = Math.min(...lows)  * 0.998;
    const mx = Math.max(...highs) * 1.002;
    const rng = mx - mn || 1;
    const toY  = v => PT + cH - ((v - mn) / rng) * cH;
    const toX  = i => PL + (i / (closes.length - 1 || 1)) * cW;
    const sym  = ['NSE','BSE'].includes(market) ? '₹' : '$';

    // Grid
    for (let i = 0; i <= 4; i++) {
      const v = mn + (rng / 4) * i;
      const y = toY(v);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1; ctx.setLineDash([3,5]);
      ctx.beginPath(); ctx.moveTo(PL, y); ctx.lineTo(W - PR, y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#9ca3af'; ctx.font = '9px Inter,sans-serif';
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(v >= 1000 ? v.toFixed(0) : v.toFixed(2), PL - 4, y);
    }

    // High-Low band
    ctx.beginPath();
    highs.forEach((v, i) => { const x = toX(i), y = toY(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    lows.slice().reverse().forEach((v, i) => { const x = toX(lows.length - 1 - i), y = toY(v); ctx.lineTo(x, y); });
    ctx.closePath();
    ctx.fillStyle = 'rgba(99,102,241,0.07)';
    ctx.fill();

    // Close area gradient
    const grad = ctx.createLinearGradient(0, PT, 0, PT + cH);
    grad.addColorStop(0, 'rgba(0,201,167,0.35)');
    grad.addColorStop(1, 'rgba(0,201,167,0)');
    ctx.beginPath();
    closes.forEach((v, i) => { const x = toX(i), y = toY(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.lineTo(toX(closes.length - 1), PT + cH);
    ctx.lineTo(toX(0), PT + cH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Close line
    ctx.beginPath();
    closes.forEach((v, i) => { const x = toX(i), y = toY(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.strokeStyle = '#00c9a7'; ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(0,201,167,0.5)'; ctx.shadowBlur = 8;
    ctx.stroke(); ctx.shadowBlur = 0;

    // 3-period MA line
    const ma = closes.map((_, i) => {
      if (i < 2) return null;
      return (closes[i] + closes[i-1] + closes[i-2]) / 3;
    });
    ctx.beginPath();
    let started = false;
    ma.forEach((v, i) => {
      if (v === null) return;
      const x = toX(i), y = toY(v);
      if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    ctx.stroke(); ctx.setLineDash([]);

    // Dots on close line
    closes.forEach((v, i) => {
      ctx.beginPath(); ctx.arc(toX(i), toY(v), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00c9a7'; ctx.fill();
      ctx.strokeStyle = '#0d1421'; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Date labels
    data.forEach((item, i) => {
      if (!item.price_date) return;
      const d = new Date(item.price_date);
      ctx.fillStyle = '#6b7280'; ctx.font = '9px Inter,sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(`${d.getDate()}/${d.getMonth()+1}`, toX(i), H - PB + 6);
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.strokeRect(PL, PT, cW, cH);
  }, [data, market]);

  return (
    <div style={{ background: '#0d1421', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
      <canvas ref={ref} width={600} height={240} style={{ width: '100%', height: '220px', display: 'block' }} />
      <div style={{ padding: '6px 12px', display: 'flex', gap: '16px', fontSize: '0.72rem', color: '#6b7280', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '2px', background: '#00c9a7', display: 'inline-block', borderRadius: '2px' }}></span>Close</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '2px', background: '#6366f1', display: 'inline-block', borderRadius: '2px', opacity: 0.7 }}></span>3-period MA</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '10px', height: '8px', background: 'rgba(99,102,241,0.2)', display: 'inline-block', borderRadius: '2px' }}></span>Hi-Lo band</span>
      </div>
    </div>
  );
}