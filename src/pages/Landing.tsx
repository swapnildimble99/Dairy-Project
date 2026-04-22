import { Link } from 'react-router-dom';
import { Store, ShieldCheck, Milk, Leaf, Truck } from 'lucide-react';

export default function Landing() {
  return (
    <div className="landing-root">

      {/* ── Full-screen background image with overlay ── */}
      <div className="bg-image" />
      <div className="bg-overlay" />

      {/* ── Floating particles ── */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className={`particle p-${i}`} />
      ))}

      {/* ── Top announcement bar ── */}
      <div className="top-bar">
        <div className="top-bar-inner">
          <span><Milk size={13} style={{display:'inline',marginRight:5,verticalAlign:'middle'}}/>Fresh Every Morning</span>
          <span className="dot">·</span>
          <span><Leaf size={13} style={{display:'inline',marginRight:5,verticalAlign:'middle'}}/>100% Natural</span>
          <span className="dot">·</span>
          <span><Truck size={13} style={{display:'inline',marginRight:5,verticalAlign:'middle'}}/>Farm to Doorstep</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="main-content">

        {/* ── Brand header ── */}
        <div className="brand-section">
          <div className="brand-pill">Est. Since 2001 · Maharashtra</div>

          <div className="brand-title">
            <span className="brand-mahadev">Mahadev</span>
            <span className="brand-dairy">Dairy</span>
          </div>

          <p className="brand-tagline">
            Trust our milk &mdash; <em>Trust your health</em>
          </p>

          <div className="brand-divider">
            <span className="divider-dot" />
            <span className="divider-line-seg" />
            <span className="divider-diamond">◆</span>
            <span className="divider-line-seg" />
            <span className="divider-dot" />
          </div>
        </div>

        {/* ── Portal cards ── */}
        <div className="cards-grid">

          {/* Customer card */}
          <Link to="/shop" className="card card-light">
            <div className="card-shine" />
            <div className="card-top-accent accent-blue" />
            <div className="icon-wrap icon-wrap-blue">
              <Store size={32} strokeWidth={1.6} />
            </div>
            <div className="card-label">CUSTOMER PORTAL</div>
            <h2 className="card-heading">Customer Ordering</h2>
            <p className="card-text">
              Browse fresh dairy products, place orders online, and track your deliveries with ease.
            </p>
            <div className="card-footer-row">
              <span className="card-cta cta-blue">
                Visit Shop
                <svg viewBox="0 0 20 20" fill="currentColor" className="cta-arrow">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </span>
            </div>
          </Link>

          {/* Staff card */}
          <Link to="/login" className="card card-dark">
            <div className="card-shine" />
            <div className="card-top-accent accent-slate" />
            <div className="icon-wrap icon-wrap-slate">
              <ShieldCheck size={32} strokeWidth={1.6} />
            </div>
            <div className="card-label label-slate">STAFF PORTAL</div>
            <h2 className="card-heading heading-light">Staff Portal</h2>
            <p className="card-text text-muted">
              Internal dashboard for Admin, Supervisors, Production, and Delivery staff.
            </p>
            <div className="card-footer-row">
              <span className="card-cta cta-slate">
                Staff Login
                <svg viewBox="0 0 20 20" fill="currentColor" className="cta-arrow">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </span>
            </div>
          </Link>

        </div>

        {/* ── Footer ── */}
        <p className="footer-note">
          © 2024 Mahadev Dairy Pvt. Ltd. · Serving Maharashtra's finest dairy
        </p>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Root ── */
        .landing-root {
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        /* ── Background image ── */
        .bg-image {
          position: fixed;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1600&q=80&auto=format&fit=crop');
          background-size: cover;
          background-position: center 30%;
          z-index: 0;
        }
        .bg-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(160deg,
            rgba(10,20,50,0.82) 0%,
            rgba(15,40,90,0.70) 40%,
            rgba(5,15,40,0.88) 100%
          );
          z-index: 1;
        }

        /* ── Floating particles ── */
        .particle {
          position: fixed;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(147,197,253,0.5);
          z-index: 2;
          pointer-events: none;
          animation: drift linear infinite;
        }
        .p-0 { left:8%;  top:80%; animation-duration:18s; animation-delay:0s;   width:4px; height:4px; }
        .p-1 { left:18%; top:90%; animation-duration:22s; animation-delay:-4s;  opacity:0.4; }
        .p-2 { left:35%; top:95%; animation-duration:16s; animation-delay:-8s;  width:3px; height:3px; }
        .p-3 { left:55%; top:88%; animation-duration:20s; animation-delay:-2s;  opacity:0.6; }
        .p-4 { left:70%; top:92%; animation-duration:24s; animation-delay:-6s;  width:6px; height:6px; background:rgba(191,219,254,0.35); }
        .p-5 { left:82%; top:85%; animation-duration:19s; animation-delay:-10s; width:3px; height:3px; }
        .p-6 { left:90%; top:95%; animation-duration:21s; animation-delay:-14s; opacity:0.3; }
        .p-7 { left:48%; top:98%; animation-duration:17s; animation-delay:-7s;  width:4px; height:4px; background:rgba(224,242,254,0.4); }
        @keyframes drift {
          0%   { transform:translateY(0) translateX(0) scale(1); opacity:0; }
          10%  { opacity:0.8; }
          90%  { opacity:0.6; }
          100% { transform:translateY(-100vh) translateX(30px) scale(0.5); opacity:0; }
        }

        /* ── Top bar ── */
        .top-bar {
          width: 100%;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          position: relative;
          z-index: 10;
        }
        .top-bar-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 9px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: rgba(219,234,254,0.85);
          font-size: 0.73rem;
          font-weight: 500;
          letter-spacing: 0.07em;
        }
        .dot { opacity: 0.35; }

        /* ── Main ── */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 52px 24px 60px;
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
        }

        /* ── Brand section ── */
        .brand-section {
          text-align: center;
          margin-bottom: 48px;
          animation: riseIn 0.9s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes riseIn {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .brand-pill {
          display: inline-block;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(147,197,253,0.30);
          color: #bfdbfe;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 5px 16px;
          margin-bottom: 24px;
          backdrop-filter: blur(8px);
        }

        /* Clean brand name: big serif + light sans side by side */
        .brand-title {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 14px;
          line-height: 1;
          flex-wrap: wrap;
        }
        .brand-mahadev {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 7.5vw, 5.2rem);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.01em;
        }
        .brand-dairy {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.5rem, 3.8vw, 2.6rem);
          font-weight: 300;
          color: #7dd3fc;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          padding-bottom: 4px;
        }

        .brand-tagline {
          margin-top: 14px;
          font-size: 1rem;
          color: rgba(186,213,255,0.75);
          font-weight: 300;
          letter-spacing: 0.025em;
        }
        .brand-tagline em {
          font-style: italic;
          color: #e0f2fe;
          font-weight: 400;
        }

        /* Ornamental divider */
        .brand-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 22px;
        }
        .divider-dot {
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #3b82f6;
        }
        .divider-line-seg {
          display: inline-block;
          width: 40px; height: 1px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
        }
        .divider-diamond { font-size: 0.55rem; color: #60a5fa; }

        /* ── Cards grid ── */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
          gap: 22px;
          width: 100%;
          animation: riseIn 0.9s 0.18s cubic-bezier(.22,1,.36,1) both;
        }

        /* ── Card base ── */
        .card {
          position: relative;
          border-radius: 20px;
          padding: 0 0 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          text-decoration: none;
          overflow: hidden;
          transition: transform 0.32s cubic-bezier(.22,1,.36,1), box-shadow 0.32s ease;
        }
        .card:hover { transform: translateY(-8px) scale(1.01); }

        .card-light {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 8px 32px rgba(10,30,80,0.22), 0 1px 0 rgba(255,255,255,0.6) inset;
        }
        .card-light:hover { box-shadow: 0 24px 56px rgba(10,30,80,0.30), 0 1px 0 rgba(255,255,255,0.6) inset; }

        .card-dark {
          background: rgba(10,18,40,0.80);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(100,130,200,0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.38);
        }
        .card-dark:hover { box-shadow: 0 24px 56px rgba(0,0,0,0.55); }

        /* Shine sweep */
        .card-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 70%);
          background-size: 200% 100%;
          background-position: -100% 0;
          transition: background-position 0.6s ease;
          pointer-events: none;
          border-radius: inherit;
        }
        .card:hover .card-shine { background-position: 200% 0; }

        /* Top accent bar */
        .card-top-accent {
          width: 100%; height: 4px;
          border-radius: 20px 20px 0 0;
        }
        .accent-blue  { background: linear-gradient(90deg, #2563eb, #38bdf8, #2563eb); }
        .accent-slate { background: linear-gradient(90deg, #475569, #94a3b8, #475569); }

        /* Icon */
        .icon-wrap {
          width: 72px; height: 72px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 28px 0 18px;
          transition: transform 0.38s cubic-bezier(.34,1.56,.64,1);
        }
        .card:hover .icon-wrap { transform: scale(1.15) rotate(-5deg); }
        .icon-wrap-blue {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          box-shadow: 0 0 0 8px rgba(59,130,246,0.1), 0 4px 16px rgba(37,99,235,0.2);
          color: #1d4ed8;
        }
        .icon-wrap-slate {
          background: linear-gradient(135deg, #1e293b, #2d3f55);
          box-shadow: 0 0 0 8px rgba(100,116,139,0.12), 0 4px 16px rgba(0,0,0,0.25);
          color: #94a3b8;
        }

        /* Card text */
        .card-label {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #3b82f6;
          margin-bottom: 8px;
        }
        .label-slate { color: #64748b; }

        .card-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.65rem;
          font-weight: 700;
          color: #0f2040;
          margin-bottom: 10px;
          padding: 0 24px;
        }
        .heading-light { color: #e2e8f0; }

        .card-text {
          font-size: 0.9rem;
          color: #5a6a82;
          line-height: 1.7;
          padding: 0 28px;
          font-weight: 400;
        }
        .text-muted { color: #8899b0; }

        .card-footer-row {
          width: 100%;
          padding: 22px 28px 0;
          margin-top: auto;
        }

        /* CTA */
        .card-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px 20px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.25s ease;
        }
        .cta-blue {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          box-shadow: 0 4px 18px rgba(37,99,235,0.38);
        }
        .cta-blue:hover { box-shadow: 0 8px 28px rgba(37,99,235,0.55); }
        .cta-slate {
          background: linear-gradient(135deg, #334155, #1e293b);
          color: #e2e8f0;
          box-shadow: 0 4px 18px rgba(0,0,0,0.35);
        }
        .cta-slate:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.5); }

        .cta-arrow {
          width: 17px; height: 17px;
          transition: transform 0.25s ease;
        }
        .card:hover .cta-arrow { transform: translateX(5px); }

        /* Footer */
        .footer-note {
          margin-top: 42px;
          font-size: 0.74rem;
          color: rgba(148,180,220,0.55);
          letter-spacing: 0.06em;
          text-align: center;
          animation: riseIn 0.9s 0.36s cubic-bezier(.22,1,.36,1) both;
        }

        @media (max-width: 640px) {
          .top-bar-inner { gap: 10px; font-size: 0.66rem; }
          .brand-mahadev { font-size: 2.6rem; }
          .brand-dairy    { font-size: 1.4rem; }
          .main-content { padding: 40px 16px 52px; }
          .card { padding-bottom: 22px; }
          .card-heading { font-size: 1.45rem; }
        }
      `}</style>
    </div>
  );
}