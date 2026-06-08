import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => {
    e.preventDefault();
    if (!u || !p) return setErr('Please fill all fields');
    setLoading(true);
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    })
      .then(r => r.json())
      .then(d => { setLoading(false); if (d.token) onLogin(d); else setErr(d.error || 'Login failed'); })
      .catch(() => { setLoading(false); onLogin({ token: 'mock', user: { username: u } }); });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter,sans-serif', background: '#080c14' }}>
      {/* Left: Animated Chart Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0d1421 0%,#0a1628 100%)', position: 'relative', overflow: 'hidden' }}>
        <AnimatedLoginChart />
        <div style={{ position: 'absolute', bottom: 40, left: 40, right: 40 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>
            Smart Market Analysis
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
            Real-time candlestick charts, OHLC data, portfolio tracking,<br />and AI-powered investment recommendations.
          </p>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 50% 0%,rgba(99,102,241,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
      </div>

      {/* Right: Login Form */}
      <div style={{ width: '460px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', background: 'rgba(13,18,33,0.95)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 900, color: '#fff' }}>S</div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Stock<span style={{ background: 'linear-gradient(90deg,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lens</span></span>
            </div>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Welcome back</h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Sign in to access your dashboard</p>
          </div>

          {err && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
              {err}
            </div>
          )}

          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.06em' }}>USERNAME</label>
              <input value={u} onChange={e => setU(e.target.value)} placeholder='Enter your username'
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', padding: '13px 15px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.06em' }}>PASSWORD</label>
              <input type='password' value={p} onChange={e => setP(e.target.value)} placeholder='Enter your password'
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', padding: '13px 15px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <button type='submit' disabled={loading}
              style={{ background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#06b6d4)', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'default' : 'pointer', marginTop: '4px', transition: 'opacity 0.2s' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: '28px', padding: '16px', background: 'rgba(99,102,241,0.06)', border: '1px dashed rgba(99,102,241,0.25)', borderRadius: '10px' }}>
            <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>
              <span style={{ color: '#9ca3af', fontWeight: 600 }}>Demo access:</span> Enter any username &amp; password to explore the platform. Backend auth via JWT when DB is connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated candlestick + line chart for the login left panel
function AnimatedLoginChart() {
  const canvasRef = React.useRef(null);
  const candlesRef = React.useRef([]);
  const frameRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    // Generate initial candles
    const NUM = 20;
    let base = 150;
    candlesRef.current = Array.from({ length: NUM }, (_, i) => {
      const o = base + (Math.random() - 0.5) * 8;
      const c = o + (Math.random() - 0.45) * 10;
      const hi = Math.max(o, c) + Math.random() * 5;
      const lo = Math.min(o, c) - Math.random() * 5;
      base = c;
      return { o, c, hi, lo };
    });

    let tick = 0;

    const draw = () => {
      tick++;
      // Scroll: every 30 frames add a new candle
      if (tick % 30 === 0) {
        const last = candlesRef.current[candlesRef.current.length - 1];
        const o = last.c;
        const c = o + (Math.random() - 0.45) * 10;
        const hi = Math.max(o, c) + Math.random() * 4;
        const lo = Math.min(o, c) - Math.random() * 4;
        candlesRef.current.push({ o, c, hi, lo });
        if (candlesRef.current.length > NUM + 1) candlesRef.current.shift();
      }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0d1421';
      ctx.fillRect(0, 0, W, H);

      const candles = candlesRef.current;
      const allH = candles.map(c => c.hi), allL = candles.map(c => c.lo);
      const mn = Math.min(...allL) - 5, mx = Math.max(...allH) + 5;
      const rng = mx - mn || 1;
      const PL = 10, PR = 10, PT = 40, PB = 60;
      const cW = W - PL - PR, cH = H - PT - PB;
      const toY = v => PT + cH - ((v - mn) / rng) * cH;

      // Grid
      for (let i = 0; i <= 4; i++) {
        const y = PT + (cH / 4) * i;
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1; ctx.setLineDash([4, 6]);
        ctx.beginPath(); ctx.moveTo(PL, y); ctx.lineTo(W - PR, y); ctx.stroke();
        ctx.setLineDash([]);
      }

      const slotW = cW / NUM;
      const bodyW = Math.max(5, slotW * 0.55);

      // Candles
      candles.forEach((cd, i) => {
        const cx = PL + slotW * i + slotW / 2;
        const bull = cd.c >= cd.o;
        const col = bull ? '#00c9a7' : '#ff4d4d';
        const yO = toY(cd.o), yC = toY(cd.c), yH = toY(cd.hi), yL = toY(cd.lo);
        const yT = Math.min(yO, yC), yB = Math.max(yO, yC);
        const bH = Math.max(1.5, yB - yT);

        ctx.strokeStyle = col; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx, yH); ctx.lineTo(cx, yT); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, yB); ctx.lineTo(cx, yL); ctx.stroke();

        if (bull) {
          ctx.fillStyle = col;
          ctx.fillRect(cx - bodyW / 2, yT, bodyW, bH);
        } else {
          ctx.fillStyle = 'rgba(255,77,77,0.2)';
          ctx.fillRect(cx - bodyW / 2, yT, bodyW, bH);
          ctx.strokeStyle = col; ctx.lineWidth = 1.5;
          ctx.strokeRect(cx - bodyW / 2, yT, bodyW, bH);
        }
      });

      // Overlay line chart (closing prices)
      const closes = candles.map(c => c.c);
      const grad = ctx.createLinearGradient(0, PT, 0, PT + cH);
      grad.addColorStop(0, 'rgba(99,102,241,0.35)');
      grad.addColorStop(1, 'rgba(99,102,241,0)');

      ctx.beginPath();
      closes.forEach((cl, i) => {
        const x = PL + slotW * i + slotW / 2;
        const y = toY(cl);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(99,102,241,0.6)'; ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Fill
      ctx.lineTo(PL + slotW * (closes.length - 1) + slotW / 2, PT + cH);
      ctx.lineTo(PL + slotW / 2, PT + cH);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Title
      ctx.fillStyle = '#e5e7eb'; ctx.font = 'bold 15px Inter,sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText('LIVE MARKET OVERVIEW', PL + 4, 12);
      ctx.fillStyle = '#00c9a7'; ctx.font = '12px Inter,sans-serif';
      ctx.fillText(`₹${closes[closes.length - 1].toFixed(2)}  +${((closes[closes.length - 1] - closes[0]) / closes[0] * 100).toFixed(2)}%`, PL + 4, 30);

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  return <canvas ref={canvasRef} width={700} height={480} style={{ width: '100%', height: '480px', display: 'block' }} />;
}
