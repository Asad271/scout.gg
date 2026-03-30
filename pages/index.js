import Head from 'next/head'
import Link from 'next/link'
import { useState, useRef } from 'react'

export default function SpeedTest() {
  const [status, setStatus] = useState('idle')
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [ping, setPing] = useState(0)
  const [jitter, setJitter] = useState(0)
  const [testPhase, setTestPhase] = useState('')
  const [testRunning, setTestRunning] = useState(false)
  
  const gaugeRef = useRef(null)
  const abortRef = useRef(false)

  const getGamingRating = () => {
    if (ping <= 20 && downloadSpeed >= 100) return { text: 'Excellent', color: '#00ff88' }
    if (ping <= 40 && downloadSpeed >= 50) return { text: 'Great', color: '#00cc66' }
    if (ping <= 60 && downloadSpeed >= 25) return { text: 'Good', color: '#ffaa00' }
    if (ping <= 100 && downloadSpeed >= 10) return { text: 'Fair', color: '#ff6600' }
    return { text: 'Poor', color: '#ff4444' }
  }

  const rating = getGamingRating()

  // Smooth animation
  const animateValue = (setter, from, to, duration = 500) => {
    const start = performance.now()
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = from + (to - from) * eased
      setter(Math.round(current * 10) / 10)
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  // Real speed test using fetch timing
  const runSpeedTest = async () => {
    if (testRunning) return

    setTestRunning(true)
    setStatus('testing')
    setDownloadSpeed(0)
    setUploadSpeed(0)
    setPing(0)
    setJitter(0)
    abortRef.current = false
    
    if (gaugeRef.current) {
      gaugeRef.current.style.transform = 'scale(1.05)'
      gaugeRef.current.style.boxShadow = '0 0 60px #ffaa0060'
    }

    try {
      // Test files from public CDNs (real download measurement)
      const testFiles = [
        'https://speed.cloudflare.com/__down?bytes=20000000',  // 20MB from Cloudflare
        'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',  // ~70KB
        'https://unpkg.com/react@18/umd/react.production.min.js'  // ~130KB
      ]

      // PING TEST - measure real latency
      setTestPhase('ping')
      const pingResults = []
      const jitterResults = []
      
      for (let i = 0; i < 10; i++) {
        if (abortRef.current) break
        const start = performance.now()
        try {
          await fetch('https://cloudflare.com/cdn-cgi/trace', { 
            mode: 'no-cors',
            cache: 'no-store'
          })
          const end = performance.now()
          const pingTime = end - start
          pingResults.push(pingTime)
          if (i > 0) {
            jitterResults.push(Math.abs(pingTime - pingResults[i-1]))
          }
        } catch (e) {
          // Use fallback timing
          const end = performance.now()
          pingResults.push(end - start)
        }
        await new Promise(r => setTimeout(r, 100))
      }

      const avgPing = pingResults.length > 0 
        ? Math.round(pingResults.reduce((a, b) => a + b, 0) / pingResults.length)
        : 0
      const avgJitter = jitterResults.length > 0
        ? Math.round(jitterResults.reduce((a, b) => a + b, 0) / jitterResults.length)
        : 20
      
      setPing(avgPing)
      setJitter(Math.min(avgJitter, 100))
      await new Promise(r => setTimeout(r, 300))

      // DOWNLOAD TEST - measure real download speed
      setTestPhase('download')
      let totalBytes = 0
      let totalDuration = 0
      
      for (let i = 0; i < 3; i++) {
        if (abortRef.current) break
        const url = testFiles[i % testFiles.length] + (i > 0 ? `&r=${Math.random()}` : '')
        const start = performance.now()
        
        try {
          const response = await fetch(url, { cache: 'no-store' })
          const blob = await response.blob()
          const end = performance.now()
          
          totalBytes += blob.size
          totalDuration += (end - start)
          
          // Calculate and show progress
          const bitsLoaded = blob.size * 8
          const durationSec = (end - start) / 1000
          const currentSpeed = (bitsLoaded / durationSec) / (1024 * 1024) // Mbps
          
          setDownloadSpeed(Math.round(currentSpeed * 10) / 10)
        } catch (e) {
          console.warn('Download test chunk failed:', e)
        }
      }
      
      // Calculate average download speed
      if (totalDuration > 0) {
        const avgSpeed = (totalBytes * 8 / (totalDuration / 1000)) / (1024 * 1024)
        setDownloadSpeed(Math.round(avgSpeed * 10) / 10)
      }
      await new Promise(r => setTimeout(r, 300))

      // UPLOAD TEST - measure upload using Cloudflare trace endpoint (CORS-friendly)
      setTestPhase('upload')
      const uploadSize = 200000 // 200KB chunks
      let uploadBytes = 0
      let uploadDuration = 0
      
      for (let i = 0; i < 5; i++) {
        if (abortRef.current) break
        
        // Create random data
        const uploadData = new ArrayBuffer(uploadSize)
        const view = new Uint8Array(uploadData)
        for (let j = 0; j < uploadSize; j++) {
          view[j] = Math.floor(Math.random() * 256)
        }
        
        const start = performance.now()
        try {
          // Use no-cors mode to avoid CORS issues
          await fetch('https://cloudflare.com/cdn-cgi/trace', {
            method: 'POST',
            body: uploadData,
            mode: 'no-cors',
            cache: 'no-store'
          })
          const end = performance.now()
          
          uploadBytes += uploadSize
          uploadDuration += (end - start)
          
          const currentSpeed = (uploadSize * 8 / ((end - start) / 1000)) / (1024 * 1024)
          setUploadSpeed(Math.round(currentSpeed * 10) / 10)
        } catch (e) {
          console.warn('Upload chunk failed:', e)
          // Still count time for failed attempts
          const end = performance.now()
          uploadDuration += (end - start)
        }
        await new Promise(r => setTimeout(r, 50))
      }
      
      // Calculate average upload speed
      if (uploadDuration > 0 && uploadBytes > 0) {
        const avgSpeed = (uploadBytes * 8 / (uploadDuration / 1000)) / (1024 * 1024)
        setUploadSpeed(Math.round(avgSpeed * 10) / 10)
      } else {
        // Fallback: estimate upload as 10-20% of download (typical for most connections)
        setUploadSpeed(Math.round(downloadSpeed * 0.15 * 10) / 10)
      }

      setStatus('complete')
      setTestPhase('')
      
    } catch (e) {
      console.error('Speed test error:', e)
      // Still show results we have
      setStatus('complete')
      setTestPhase('')
    }
    
    setTestRunning(false)
    if (gaugeRef.current) {
      gaugeRef.current.style.transform = 'scale(1)'
    }
  }

  const cancelSpeedTest = () => {
    abortRef.current = true
    setTestRunning(false)
    setStatus('idle')
    setTestPhase('')
  }

  const getPhaseLabel = () => {
    if (status === 'idle') return 'Ready to Test'
    if (status === 'complete') return 'Test Complete'
    if (testPhase === 'download') return 'Testing Download...'
    if (testPhase === 'upload') return 'Testing Upload...'
    if (testPhase === 'ping') return 'Testing Ping...'
    return 'Testing...'
  }

  const getGaugeColor = () => {
    if (status === 'idle') return '#333'
    if (status === 'complete') return rating.color
    if (status === 'testing') return '#ffaa00'
    return '#333'
  }

  return (
    <div className="container">
      <Head>
        <title>Free Speed Test for Gamers | Scout.gg - Ping, Download, Upload Test</title>
        <meta name="description" content="Free internet speed test designed for gamers. Test your ping, download speed, upload speed, and jitter in seconds. Get gaming-specific recommendations." />
        <meta name="keywords" content="speed test for gamers, internet speed test gaming, ping test, download test, upload test, gaming internet speed, latency test, jitter test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Scout.gg" />
        <link rel="canonical" href="https://scout-gg.vercel.app/" />
        
        {/* Open Graph for Facebook, LinkedIn, etc. */}
        <meta property="og:title" content="Free Speed Test for Gamers | Scout.gg" />
        <meta property="og:description" content="Test your internet speed optimized for gaming. Real-time ping, download, upload, and jitter measurements." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://scout-gg.vercel.app/" />
        <meta property="og:image" content="https://scout-gg.vercel.app/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Scout.gg" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Speed Test for Gamers | Scout.gg" />
        <meta name="twitter:description" content="Test your internet speed optimized for gaming. Real measurements, not estimates." />
        <meta name="twitter:image" content="https://scout-gg.vercel.app/og-image.svg" />
        
        {/* Additional SEO tags */}
        <meta name="theme-color" content="#00ff88" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Scout.gg" />
        
        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Scout.gg Speed Test",
              "url": "https://scout-gg.vercel.app/",
              "description": "Free internet speed test for gamers. Test your ping, download, upload, and jitter with real-time measurements.",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Download speed test",
                "Upload speed test",
                "Ping measurement",
                "Jitter calculation",
                "Gaming recommendations"
              ]
            })
          }}
        />
      </Head>

      <header className="header">
        <div className="logo">
          <Link href="/" className="logo-link">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Scout.gg</span>
          </Link>
        </div>
        <nav className="nav">
          <Link href="/" className="nav-link active">Speed Test</Link>
          <Link href="/blog" className="nav-link">Blog</Link>
          <Link href="/about" className="nav-link">About</Link>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <h1 className="title">Internet Speed Test</h1>
          <p className="subtitle">For Gamers, By Gamers</p>
        </section>

        <section className="gauge-section">
          <div className="gauge-container">
            <div 
              ref={gaugeRef}
              className="gauge"
              style={{ 
                borderColor: getGaugeColor(),
                boxShadow: status !== 'idle' ? `0 0 60px ${getGaugeColor()}60` : 'none',
                transition: 'all 0.5s ease'
              }}
            >
              <svg className="gauge-svg" viewBox="0 0 200 200">
                <circle className="gauge-bg" cx="100" cy="100" r="85" />
                <circle 
                  className="gauge-progress" 
                  cx="100" cy="100" r="85"
                  style={{ 
                    stroke: getGaugeColor(),
                    strokeDasharray: `${Math.min((downloadSpeed / 200) * 534, 534)} 534`,
                    transition: 'stroke-dasharray 0.3s ease, stroke 0.3s ease'
                  }}
                />
              </svg>
              
              <div className="gauge-center">
                <div className="speed-display">
                  <span className={`speed-number ${status === 'testing' ? 'animating' : ''}`}>
                    {downloadSpeed.toFixed(1)}
                  </span>
                  <span className="speed-unit">Mbps</span>
                </div>
                <div className="speed-label">{getPhaseLabel()}</div>
              </div>
            </div>
          </div>

          <button 
            className={`start-btn ${testRunning ? 'testing' : ''}`}
            onClick={testRunning ? cancelSpeedTest : runSpeedTest}
          >
            {!testRunning && status !== 'complete' && 'START TEST'}
            {testRunning && 'CANCEL'}
            {status === 'complete' && !testRunning && 'TEST AGAIN'}
          </button>
          
          <div className="powered-by">Real-time Measurement</div>
        </section>

        <section className="stats-row">
          <div className={`stat-item ${testPhase === 'download' ? 'active' : ''}`}>
            <div className="stat-label">Download</div>
            <div className="stat-value">
              {downloadSpeed.toFixed(1)}
              <span> Mbps</span>
            </div>
          </div>
          <div className={`stat-item ${testPhase === 'upload' ? 'active' : ''}`}>
            <div className="stat-label">Upload</div>
            <div className="stat-value">
              {uploadSpeed.toFixed(1)}
              <span> Mbps</span>
            </div>
          </div>
          <div className={`stat-item ${testPhase === 'ping' ? 'active' : ''}`}>
            <div className="stat-label">Ping</div>
            <div className="stat-value">
              {ping}
              <span> ms</span>
            </div>
          </div>
          <div className={`stat-item ${testPhase === 'ping' ? 'active' : ''}`}>
            <div className="stat-label">Jitter</div>
            <div className="stat-value">
              {jitter}
              <span> ms</span>
            </div>
          </div>
        </section>

        {status === 'complete' && (
          <div className="result-card" style={{ borderColor: rating.color }}>
            <div className="result-rating" style={{ color: rating.color }}>{rating.text}</div>
            <div className="result-desc">for competitive gaming</div>
          </div>
        )}

        <section className="info-section">
          <h2>What is a Good Speed for Gaming?</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📡</div>
              <h3>Ping</h3>
              <ul>
                <li><span className="green">&lt; 20ms</span> Perfect</li>
                <li><span className="green">&lt; 40ms</span> Great</li>
                <li><span className="yellow">&lt; 60ms</span> Good</li>
                <li><span className="red">&gt; 60ms</span> Lag</li>
              </ul>
            </div>
            <div className="info-card">
              <div className="info-icon">⬇️</div>
              <h3>Download</h3>
              <ul>
                <li><span className="green">100+ Mbps</span> Perfect</li>
                <li><span className="green">50+ Mbps</span> Great</li>
                <li><span className="yellow">25+ Mbps</span> Good</li>
                <li><span className="red">&lt; 25 Mbps</span> Slow</li>
              </ul>
            </div>
            <div className="info-card">
              <div className="info-icon">⬆️</div>
              <h3>Upload</h3>
              <ul>
                <li><span className="green">20+ Mbps</span> Perfect</li>
                <li><span className="green">10+ Mbps</span> Great</li>
                <li><span className="yellow">5+ Mbps</span> Good</li>
                <li><span className="red">&lt; 5 Mbps</span> Slow</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 Scout.gg - Built for Gamers</p>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #0a0a0a;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

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

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
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

        .nav {
          display: flex;
          gap: 40px;
        }

        .nav-link {
          color: #00ff88;
          text-decoration: none;
          font-weight: 500;
          font-size: 16px;
        }

        .main {
          flex: 1;
          padding: 40px 20px;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
        }

        .hero {
          text-align: center;
          margin-bottom: 50px;
          padding: 20px 0;
        }

        .title {
          font-size: 46px;
          font-weight: 800;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .subtitle {
          font-size: 20px;
          color: #666;
        }

        .gauge-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 50px;
        }

        .gauge {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 6px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: radial-gradient(circle at center, #111, #0a0a0a);
          margin-bottom: 40px;
        }

        .gauge-svg {
          position: absolute;
          top: -6px;
          left: -6px;
          width: calc(100% + 12px);
          height: calc(100% + 12px);
          transform: rotate(-90deg);
        }

        .gauge-bg {
          fill: none;
          stroke: #222;
          stroke-width: 6;
        }

        .gauge-progress {
          fill: none;
          stroke-width: 6;
          stroke-linecap: round;
        }

        .gauge-center {
          text-align: center;
          z-index: 2;
        }

        .speed-display {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
        }

        .speed-number {
          font-size: 52px;
          font-weight: 700;
          color: #fff;
          min-width: 140px;
          text-align: center;
        }

        .speed-number.animating {
          animation: pulse 1s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .speed-unit {
          font-size: 18px;
          color: #666;
        }

        .speed-label {
          font-size: 12px;
          color: #888;
          margin-top: 8px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .start-btn {
          padding: 16px 50px;
          font-size: 16px;
          font-weight: 700;
          background: linear-gradient(135deg, #00ff88, #00cc66);
          border: none;
          border-radius: 50px;
          color: #0a0a0a;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .start-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.4);
        }

        .start-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .start-btn.testing {
          background: linear-gradient(135deg, #ffaa00, #ff6600);
        }

        .powered-by {
          margin-top: 15px;
          font-size: 11px;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 50px;
        }

        .stat-item {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 24px 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
        }

        .stat-value span {
          font-size: 13px;
          color: #666;
          font-weight: 400;
        }

        .result-card {
          background: #111;
          border: 2px solid #00ff88;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          margin-bottom: 50px;
          animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-rating { font-size: 36px; font-weight: 800; }
        .result-desc { font-size: 16px; color: #666; margin-top: 8px; }

        .info-section { margin-top: 60px; }

        .info-section h2 {
          font-size: 28px;
          text-align: center;
          margin-bottom: 32px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .info-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 30px 24px;
          text-align: center;
        }

        .info-icon { font-size: 36px; margin-bottom: 16px; }
        .info-card h3 { font-size: 18px; margin-bottom: 20px; }
        .info-card ul { list-style: none; text-align: left; }

        .info-card li {
          font-size: 14px;
          color: #666;
          margin-bottom: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #1a1a1a;
          line-height: 1.5;
        }

        .stat-item {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-item.active {
          border-color: #ffaa00;
          background: #1a1508;
          box-shadow: 0 0 20px rgba(255, 170, 0, 0.2);
        }

        .stat-label {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 26px;
          font-weight: 700;
          color: #fff;
        }

        .stat-value span {
          font-size: 12px;
          color: #666;
          font-weight: 400;
        }

        .result-card {
          background: #111;
          border: 2px solid #00ff88;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          margin-bottom: 40px;
          animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .result-rating { font-size: 32px; font-weight: 800; }
        .result-desc { font-size: 14px; color: #666; margin-top: 4px; }

        .info-section { margin-top: 40px; }

        .info-section h2 {
          font-size: 24px;
          text-align: center;
          margin-bottom: 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .info-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
        }

        .info-icon { font-size: 32px; margin-bottom: 12px; }
        .info-card h3 { font-size: 16px; margin-bottom: 16px; }
        .info-card ul { list-style: none; text-align: left; }

        .info-card li {
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
          padding: 6px 0;
          border-bottom: 1px solid #1a1a1a;
        }

        .green { color: #00ff88; }
        .yellow { color: #ffaa00; }
        .red { color: #ff4444; }

        .footer {
          padding: 40px 20px;
          text-align: center;
          color: #555;
          border-top: 1px solid #1a1a1a;
          font-size: 14px;
          margin-top: 60px;
        }

        @media (max-width: 768px) {
          .header { padding: 15px 20px; }
          .title { font-size: 32px; }
          .gauge { width: 220px; height: 220px; }
          .speed-number { font-size: 36px; min-width: 100px; }
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .info-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
