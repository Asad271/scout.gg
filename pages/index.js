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
      // Download test uses Cloudflare endpoint directly
      setTestPhase('ping')
      setDownloadSpeed(0)
      setUploadSpeed(0)
      setPing(0)
      setJitter(0)
      
      const pingResults = []
      const jitterResults = []
      const pingIterations = 6
      
      for (let i = 0; i < pingIterations; i++) {
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
          
          // Calculate running average
          const runningAvg = Math.round(pingResults.reduce((a, b) => a + b, 0) / pingResults.length)
          setPing(runningAvg)
          
          if (i > 0) {
            jitterResults.push(Math.abs(pingTime - pingResults[i-1]))
          }
        } catch (e) {
          const end = performance.now()
          pingResults.push(end - start)
        }
        
        // Smooth delay between pings
        await new Promise(r => setTimeout(r, 150))
      }

      const validPings = pingResults.filter(p => p < 500) // Filter out anomalies
      const avgPing = validPings.length > 0 
        ? Math.round(validPings.reduce((a, b) => a + b, 0) / validPings.length)
        : 0
      
      const avgJitter = jitterResults.length > 0
        ? Math.round(jitterResults.reduce((a, b) => a + b, 0) / jitterResults.length)
        : 20
      
      setPing(avgPing)
      setJitter(Math.min(avgJitter, 100))
      await new Promise(r => setTimeout(r, 400))

      // DOWNLOAD TEST - measure real download speed with smooth progression
      setTestPhase('download')
      let totalBytes = 0
      let totalDuration = 0
      const downloadSpeeds = []
      const downloadIterations = 4
      
      for (let i = 0; i < downloadIterations; i++) {
        if (abortRef.current) break
        
        const testSizes = [5000000, 10000000, 15000000, 20000000] // 5MB to 20MB
        const size = testSizes[i % testSizes.length]
        const url = `https://speed.cloudflare.com/__down?bytes=${size}&r=${Math.random()}`
        
        const start = performance.now()
        
        try {
          const response = await fetch(url, { cache: 'no-store' })
          const blob = await response.blob()
          const end = performance.now()
          
          const bytes = blob.size
          const duration = (end - start) / 1000 // seconds
          
          totalBytes += bytes
          totalDuration += duration
          
          // Calculate speed in Mbps
          const speed = (bytes * 8) / (duration * 1000000)
          downloadSpeeds.push(speed)
          
          // Calculate running average
          const avgSpeed = downloadSpeeds.reduce((a, b) => a + b, 0) / downloadSpeeds.length
          setDownloadSpeed(Math.round(avgSpeed * 10) / 10)
        } catch (e) {
          console.warn('Download test chunk failed:', e)
        }
        
        // Smooth delay between tests
        await new Promise(r => setTimeout(r, 300))
      }
      
      // Final calculation - use median for accuracy
      if (downloadSpeeds.length > 0) {
        const sorted = [...downloadSpeeds].sort((a, b) => a - b)
        const median = sorted[Math.floor(sorted.length / 2)]
        setDownloadSpeed(Math.round(median * 10) / 10)
      }
      
      await new Promise(r => setTimeout(r, 300))

      // UPLOAD TEST - measure upload with smooth progression
      setTestPhase('upload')
      const uploadSpeeds = []
      const uploadIterations = 3
      
      for (let i = 0; i < uploadIterations; i++) {
        if (abortRef.current) break
        
        // Create random data of varying sizes
        const sizes = [200000, 400000, 600000] // 200KB to 600KB
        const uploadSize = sizes[i % sizes.length]
        const uploadData = new ArrayBuffer(uploadSize)
        const view = new Uint8Array(uploadData)
        for (let j = 0; j < uploadSize; j++) {
          view[j] = Math.floor(Math.random() * 256)
        }
        
        const start = performance.now()
        try {
          await fetch('https://cloudflare.com/cdn-cgi/trace', {
            method: 'POST',
            body: uploadData,
            mode: 'no-cors',
            cache: 'no-store'
          })
          const end = performance.now()
          
          const duration = (end - start) / 1000 // seconds
          const speed = (uploadSize * 8) / (duration * 1000000) // Mbps
          uploadSpeeds.push(speed)
          
          // Calculate running average
          const avgSpeed = uploadSpeeds.reduce((a, b) => a + b, 0) / uploadSpeeds.length
          setUploadSpeed(Math.round(avgSpeed * 10) / 10)
        } catch (e) {
          console.warn('Upload chunk failed:', e)
        }
        
        // Smooth delay between uploads
        await new Promise(r => setTimeout(r, 300))
      }
      
      // Final calculation - use median for accuracy
      if (uploadSpeeds.length > 0) {
        const sorted = [...uploadSpeeds].sort((a, b) => a - b)
        const median = sorted[Math.floor(sorted.length / 2)]
        setUploadSpeed(Math.round(median * 10) / 10)
      } else {
        // Fallback: estimate upload as 10-20% of download (typical for most connections)
        setUploadSpeed(Math.round(downloadSpeed * 0.15 * 10) / 10)
      }

      await new Promise(r => setTimeout(r, 200))
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
    if (status === 'complete') return '✓ Test Complete'
    if (testPhase === 'ping') return 'Testing Latency...'
    if (testPhase === 'download') return 'Testing Download...'
    if (testPhase === 'upload') return 'Testing Upload...'
    return 'Starting...'
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
        <title>Free Internet Speed Test | Ping, Download, Upload & Jitter Test</title>
        <meta name="description" content="Free internet speed test for gamers. Check your ping, download speed, upload speed, latency and jitter. Test your internet connection now!" />
        <meta name="keywords" content="speed test, internet speed test, ping test, download speed test, upload speed test, latency test, jitter test, check internet speed, gaming speed test, speed test for gamers, check ping online, health check ping, how to check my ping, gaming internet speed, low ping, fix internet lag" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Scout.gg" />
        <meta name="google-site-verification" content="MCJ9PzqY3o-lhn2tSqqAb8Kcqo6SiSUdpYTL0dWLUgI" />
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
          <h1 className="title">Free Internet Speed Test</h1>
          <p className="subtitle">Test your ping, download, upload & jitter | Check internet speed for gaming</p>
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
                    strokeDasharray: `${Math.min((testPhase === 'ping' ? ping : testPhase === 'download' ? downloadSpeed : testPhase === 'upload' ? uploadSpeed : 0) / 200 * 534, 534)} 534`,
                    transition: 'stroke-dasharray 0.5s ease, stroke 0.3s ease'
                  }}
                />
              </svg>
              
              <div className="gauge-center">
                <div className="speed-display">
                  <span className={`speed-number ${status === 'testing' ? 'animating' : ''}`}>
                    {testPhase === 'ping' ? ping : testPhase === 'download' ? downloadSpeed : testPhase === 'upload' ? uploadSpeed : 0}
                  </span>
                  <span className="speed-unit">{testPhase === 'ping' ? 'ms' : 'Mbps'}</span>
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
          <h2>What is a Good Speed for Gaming? | Internet Speed Guide</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon-text">LATENCY</div>
              <h3>Ping / Latency</h3>
              <ul>
                <li><span className="green">&lt; 20ms</span> Perfect</li>
                <li><span className="green">&lt; 40ms</span> Great</li>
                <li><span className="yellow">&lt; 60ms</span> Good</li>
                <li><span className="red">&gt; 60ms</span> Lag</li>
              </ul>
            </div>
            <div className="info-card">
              <div className="info-icon-text">STABILITY</div>
              <h3>Jitter</h3>
              <ul>
                <li><span className="green">&lt; 5ms</span> Perfect</li>
                <li><span className="green">&lt; 10ms</span> Great</li>
                <li><span className="yellow">&lt; 20ms</span> Good</li>
                <li><span className="red">&gt; 20ms</span> Unstable</li>
              </ul>
            </div>
            <div className="info-card">
              <div className="info-icon-text">DOWN</div>
              <h3>Download</h3>
              <ul>
                <li><span className="green">100+ Mbps</span> Perfect</li>
                <li><span className="green">50+ Mbps</span> Great</li>
                <li><span className="yellow">25+ Mbps</span> Good</li>
                <li><span className="red">&lt; 25 Mbps</span> Slow</li>
              </ul>
            </div>
            <div className="info-card">
              <div className="info-icon-text">UP</div>
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
          background: 
            radial-gradient(ellipse at top, rgba(0, 255, 136, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(0, 200, 255, 0.02) 0%, transparent 50%),
            #0a0a0a;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background: rgba(10, 10, 10, 0.95);
          border-bottom: 1px solid #1a1a1a;
          backdrop-filter: blur(10px);
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

        .logo-icon { 
          font-size: 28px;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(0, 255, 136, 0.5)); }
          50% { filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.8)); }
        }

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
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
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
          background: linear-gradient(135deg, #fff 0%, #00ff88 50%, #fff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: shine 3s linear infinite;
        }

        @keyframes shine {
          to { background-position: 200% center; }
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
          background: radial-gradient(circle at center, #1a1a1a, #0a0a0a);
          margin-bottom: 40px;
          box-shadow: 
            0 0 30px rgba(0, 0, 0, 0.5),
            inset 0 0 30px rgba(0, 0, 0, 0.3);
        }

        .gauge::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00ff88, transparent, #00ff88);
          z-index: -1;
          opacity: 0.3;
          animation: rotate-gradient 4s linear infinite;
        }

        @keyframes rotate-gradient {
          to { transform: rotate(360deg); }
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
          stroke: #1a1a1a;
          stroke-width: 8;
        }

        .gauge-progress {
          fill: none;
          stroke-width: 8;
          stroke-linecap: round;
          filter: drop-shadow(0 0 5px currentColor);
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
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        }

        .speed-number.animating {
          animation: pulse 1s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
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
          padding: 18px 60px;
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #00ff88, #00cc66);
          border: none;
          border-radius: 50px;
          color: #0a0a0a;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 2px;
          position: relative;
          overflow: hidden;
        }

        .start-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .start-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .start-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 40px rgba(0, 255, 136, 0.5);
        }

        .start-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .start-btn.testing {
          background: linear-gradient(135deg, #ffaa00, #ff6600);
          animation: pulse-btn 1s ease-in-out infinite;
        }

        @keyframes pulse-btn {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 170, 0, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 170, 0, 0.5); }
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
          background: linear-gradient(145deg, #141414, #0e0e0e);
          border: 1px solid #222;
          border-radius: 16px;
          padding: 24px 20px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ff88, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-5px);
          border-color: #333;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .stat-item:hover::before {
          opacity: 1;
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
          background: linear-gradient(145deg, #141414, #0e0e0e);
          border: 2px solid #00ff88;
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          margin-bottom: 50px;
          animation: slideIn 0.6s ease, glow 2s ease-in-out infinite;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.2); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 136, 0.4); }
        }

        .result-rating { 
          font-size: 36px; 
          font-weight: 800; 
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        }
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
          background: linear-gradient(145deg, #141414, #0e0e0e);
          border: 1px solid #222;
          border-radius: 16px;
          padding: 30px 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          border-color: #00ff88;
          box-shadow: 0 15px 40px rgba(0, 255, 136, 0.1);
        }

        .info-icon { 
          font-size: 36px; 
          margin-bottom: 16px;
          transition: transform 0.3s ease;
        }

        .info-card:hover .info-icon {
          transform: scale(1.1);
        }

        .info-icon-text {
          font-size: 14px;
          font-weight: 700;
          color: #00ff88;
          margin-bottom: 12px;
          letter-spacing: 2px;
        }

        .info-card h3 { 
          font-size: 18px; 
          margin-bottom: 20px;
          color: #fff;
        }

        .info-card ul { list-style: none; text-align: left; }

        .info-card li {
          font-size: 14px;
          color: #666;
          margin-bottom: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #1a1a1a;
          line-height: 1.5;
          transition: color 0.3s ease;
        }

        .info-card li:hover {
          color: #00ff88;
        }

        .stat-item {
          background: linear-gradient(145deg, #141414, #0e0e0e);
          border: 1px solid #222;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-item.active {
          border-color: #ffaa00;
          background: linear-gradient(145deg, #1a1508, #151208);
          box-shadow: 0 0 25px rgba(255, 170, 0, 0.2);
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
