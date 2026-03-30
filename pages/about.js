import Head from 'next/head'
import Link from 'next/link'

export default function About() {
  return (
    <div className="container">
      <Head>
        <title>About | Scout.gg - Free Speed Test for Gamers</title>
        <meta name="description" content="Learn about Scout.gg - a free internet speed test designed specifically for gamers. Test your ping, download, upload, and jitter." />
        <meta name="keywords" content="about speed test, about scout.gg, gaming speed test, internet speed test" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://scout-gg.vercel.app/about" />
        <meta property="og:title" content="About Scout.gg - Free Speed Test for Gamers" />
        <meta property="og:description" content="Learn about Scout.gg - a free internet speed test designed specifically for gamers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://scout-gg.vercel.app/about" />
        <meta property="og:site_name" content="Scout.gg" />
      </Head>

      <header className="header">
        <div className="logo">
          <Link href="/" className="logo-link">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Scout.gg</span>
          </Link>
        </div>
        <nav className="nav">
          <Link href="/" className="nav-link">Speed Test</Link>
          <Link href="/about" className="nav-link active">About</Link>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <h1 className="title">About Scout.gg</h1>
          <p className="subtitle">Free Internet Speed Test for Gamers</p>
        </section>

        <section className="content-section">
          <div className="content-card">
            <h2>Our Mission</h2>
            <p>
              Scout.gg was built with one goal in mind: to provide gamers with accurate, 
              real-time internet speed measurements that actually matter for gaming performance.
            </p>
            <p>
              Most speed tests focus on download and upload speeds, but for gamers, 
              <strong> ping</strong> and <strong>jitter</strong> are equally (if not more) important.
            </p>
          </div>

          <div className="content-card">
            <h2>What We Test</h2>
            <ul className="feature-list">
              <li>
                <strong>Download Speed</strong> - How fast you can receive data
              </li>
              <li>
                <strong>Upload Speed</strong> - How fast you can send data
              </li>
              <li>
                <strong>Ping</strong> - Latency in milliseconds (lower is better)
              </li>
              <li>
                <strong>Jitter</strong> - Stability of your connection (lower is better)
              </li>
            </ul>
          </div>

          <div className="content-card">
            <h2>Why Gaming-Specific?</h2>
            <p>
              Traditional speed tests are designed for general internet usage like streaming 
              and downloading files. But gaming requires:
            </p>
            <ul className="feature-list">
              <li><strong>Low Ping</strong> - Under 20ms is ideal, under 50ms is good</li>
              <li><strong>Low Jitter</strong> - High jitter causes lag spikes</li>
              <li><strong>Stable Connection</strong> - Packet loss ruins gaming</li>
              <li><strong>Symmetrical Speeds</strong> - Upload matters for gaming</li>
            </ul>
          </div>

          <div className="content-card">
            <h2>Our Vision</h2>
            <p>
              We believe every gamer deserves to know their true internet speed. 
              Scout.gg is built to give you accurate, honest results without any strings attached.
            </p>
            <p>
              Our goal is to become the go-to speed test for gamers worldwide, 
              helping players make informed decisions about their internet connection.
            </p>
          </div>

          <div className="content-card">
            <h2>Join Our Community</h2>
            <p>
              Scout.gg is growing! Connect with us to stay updated:
            </p>
            <ul className="feature-list">
              <li>Follow for updates on new features</li>
              <li>Share your feedback and suggestions</li>
              <li>Help us improve for gamers everywhere</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Scout.gg - Built for Gamers</p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background: rgba(10, 10, 10, 0.95);
          border-bottom: 1px solid #1a1a1a;
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-icon { font-size: 28px; }

        .logo-text {
          font-size: 24px;
          font-weight: 800;
          background: linear-gradient(135deg, #00ff88, #00cc66);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-link {
          color: #666;
          text-decoration: none;
          font-weight: 500;
          margin-left: 20px;
          transition: color 0.3s;
        }

        .nav-link:hover, .nav-link.active {
          color: #00ff88;
        }

        .main {
          flex: 1;
          padding: 40px 20px;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .hero {
          text-align: center;
          margin-bottom: 60px;
          padding: 20px 0;
        }

        .title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }

        .subtitle {
          font-size: 20px;
          color: #666;
        }

        .content-section {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .content-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 36px;
        }

        .content-card h2 {
          font-size: 26px;
          margin-bottom: 20px;
          color: #00ff88;
        }

        .content-card p {
          color: #aaa;
          line-height: 1.9;
          margin-bottom: 18px;
          font-size: 16px;
        }

        .content-card strong {
          color: #fff;
        }

        .feature-list {
          list-style: none;
          margin-top: 20px;
        }

        .feature-list li {
          color: #aaa;
          padding: 14px 0;
          border-bottom: 1px solid #1a1a1a;
          font-size: 15px;
          line-height: 1.6;
        }

        .feature-list li:last-child {
          border-bottom: none;
        }

        .feature-list strong {
          color: #00ff88;
        }

        .contact-email {
          color: #00ff88 !important;
          font-weight: 500;
        }

        .footer {
          padding: 30px 20px;
          text-align: center;
          color: #444;
          border-top: 1px solid #1a1a1a;
        }

        @media (max-width: 768px) {
          .header { padding: 15px 20px; }
          .title { font-size: 32px; }
          .content-card { padding: 20px; }
        }
      `}</style>
    </div>
  )
}
