import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Blog() {
  const [expandedPost, setExpandedPost] = useState(null)

  const posts = [
    {
      id: 'how-to-fix-internet-lag',
      title: 'How to Fix Internet Lag for Gaming',
      excerpt: 'Learn how to reduce lag, lower ping, and eliminate internet lag with these proven tips and solutions.',
      date: 'March 30, 2026',
      category: 'Gaming Tips',
      content: `
        <p class="intro">Internet lag can ruin your gaming experience. Whether you're in a competitive match or exploring open worlds, lag makes everything frustrating. Here's how to fix internet lag and get smooth gameplay.</p>

        <h2>What Causes Internet Lag?</h2>
        <p>Before fixing lag, understand what causes it:</p>
        <ul>
          <li><strong>High Ping</strong> - Data takes too long to travel to server</li>
          <li><strong>Packet Loss</strong> - Data packets getting lost in transit</li>
          <li><strong>Jitter</strong> - Unstable connection causing spikes</li>
          <li><strong>Bandwidth Congestion</strong> - Too many devices using internet</li>
          <li><strong>WiFi Interference</strong> - Wireless signal issues</li>
        </ul>

        <h2>1. Switch to Wired Ethernet</h2>
        <p>The #1 fix for lag is using a wired connection instead of WiFi. Ethernet provides lower, more consistent ping, zero WiFi interference, and faster response times.</p>

        <h2>2. Close Bandwidth-Heavy Apps</h2>
        <p>Other devices and apps consuming bandwidth cause lag. Close streaming services, game updates, cloud sync, and other gamers on your network before gaming.</p>

        <h2>3. Use Quality of Service (QoS)</h2>
        <p>QoS prioritizes gaming traffic on your router. Access your router settings and enable gaming priority.</p>

        <h2>4. Choose the Right Server</h2>
        <p>Always play on servers closest to you. Most games let you select servers - choose the one nearest to your location.</p>

        <h2>Quick Fixes Summary</h2>
        <ul>
          <li>● Use Ethernet cable (biggest fix)</li>
          <li>● Close background downloads</li>
          <li>● Enable router QoS</li>
          <li>● Select nearest game server</li>
          <li>● Test your connection with Scout.gg</li>
        </ul>
      `
    },
    {
      id: 'how-to-improve-ping',
      title: 'How to Improve Your Ping for Gaming',
      excerpt: 'Learn how to reduce ping and improve your gaming experience with these proven tips.',
      date: 'March 30, 2026',
      category: 'Gaming Tips',
      content: `
        <p class="intro">High ping can ruin your gaming experience, causing lag, rubber-banding, and delayed reactions. Here's how to reduce your ping and get a smoother connection.</p>

        <h2>What is Ping and Why Does It Matter?</h2>
        <p>Ping (latency) is the time it takes for data to travel from your device to the game server and back. Measured in milliseconds (ms), lower ping means faster response times.</p>
        <ul>
          <li><strong>0-20ms:</strong> Excellent - Professional level</li>
          <li><strong>20-40ms:</strong> Great - Competitive gaming</li>
          <li><strong>40-60ms:</strong> Good - Casual gaming</li>
          <li><strong>60ms+:</strong> Noticeable lag - May affect performance</li>
        </ul>

        <h2>1. Use a Wired Connection</h2>
        <p>WiFi adds latency due to signal interference. Connect your PC or console directly to your router with an Ethernet cable.</p>

        <h2>2. Close Bandwidth-Heavy Applications</h2>
        <p>Streaming, downloads, and other bandwidth-intensive activities can increase ping. Close Netflix, Steam updates, cloud sync before gaming.</p>

        <h2>3. Choose the Right Game Server</h2>
        <p>Most games let you select servers. Choose the one closest to your physical location.</p>

        <h2>4. Enable Quality of Service (QoS) on Your Router</h2>
        <p>QoS prioritizes gaming traffic over other types. Access your router settings and enable gaming priority.</p>

        <h2>Quick Tips Summary</h2>
        <ul>
          <li>● Always use Ethernet over WiFi</li>
          <li>● Close background downloads</li>
          <li>● Select nearest game server</li>
          <li>● Enable router QoS</li>
          <li>● Test your ping regularly with Scout.gg</li>
        </ul>
      `
    },
    {
      id: 'best-internet-speed-gaming',
      title: 'Best Internet Speed for Gaming in 2026',
      excerpt: 'What internet speeds do you actually need for competitive gaming? We break it down.',
      date: 'March 30, 2026',
      category: 'Gaming Guide',
      content: `
        <p class="intro">What internet speeds do you actually need for competitive gaming in 2026? More speed doesn't always mean better gaming. Here's what you really need.</p>

        <h2>The Truth About Gaming Internet</h2>
        <p>Contrary to popular belief, you don't need extremely fast internet for gaming. What matters most is:</p>
        <ul>
          <li><strong>Low Latency</strong> - More important than speed</li>
          <li><strong>Stable Connection</strong> - Consistent ping</li>
          <li><strong>Low Jitter</strong> - No ping spikes</li>
          <li><strong>Reliability</strong> - No packet loss</li>
        </ul>

        <h2>Minimum Internet for Gaming</h2>
        <ul>
          <li><strong>Download:</strong> 15-25 Mbps</li>
          <li><strong>Upload:</strong> 5-10 Mbps</li>
          <li><strong>Ping:</strong> Under 50ms</li>
          <li><strong>Jitter:</strong> Under 20ms</li>
        </ul>

        <h2>Recommended Internet for Gaming</h2>
        <ul>
          <li><strong>Download:</strong> 50-100 Mbps</li>
          <li><strong>Upload:</strong> 10-20 Mbps</li>
          <li><strong>Ping:</strong> Under 30ms</li>
          <li><strong>Jitter:</strong> Under 10ms</li>
        </ul>

        <h2>Internet Type Rankings</h2>
        <ul>
          <li><strong>Fiber:</strong> Best - Low latency, fast upload/download</li>
          <li><strong>Cable:</strong> Good - Decent speeds, higher latency</li>
          <li><strong>DSL:</strong> Okay - Can work, but higher ping</li>
          <li><strong>5G Home:</strong> Good option if available</li>
          <li><strong>Satellite:</strong> Avoid - High latency kills gaming</li>
        </ul>

        <h2>Quick Checklist</h2>
        <ul>
          <li>● Have at least 25 Mbps download</li>
          <li>● Have at least 5 Mbps upload</li>
          <li>● Ping under 50ms</li>
          <li>● Jitter under 20ms</li>
          <li>● Use Ethernet, not WiFi</li>
        </ul>
      `
    }
  ]

  const togglePost = (id) => {
    setExpandedPost(expandedPost === id ? null : id)
  }

  return (
    <div className="container">
      <Head>
        <title>Scout.gg - Blog | Gaming & Internet Speed Tips</title>
        <meta name="description" content="Tips and guides about internet speed, ping optimization, reduce gaming lag, and improve gaming performance." />
        <meta name="keywords" content="gaming blog, speed test tips, ping optimization, gaming internet, reduce gaming lag, how to fix internet lag, low ping tips, best internet speed for gaming" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://scout-gg.vercel.app/blog" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:title" content="Scout.gg - Blog" />
        <meta property="og:description" content="Tips and guides about internet speed for gaming." />
        <meta property="og:type" content="website" />
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
          <Link href="/blog" className="nav-link">Blog</Link>
          <Link href="/about" className="nav-link">About</Link>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <h1 className="title">Blog</h1>
          <p className="subtitle">Tips, guides, and everything about gaming internet</p>
        </section>

        <section className="posts-section">
          {posts.map((post, index) => (
            <article key={post.id} className={`blog-post ${expandedPost === post.id ? 'expanded' : ''}`}>
              <div className="post-header">
                <div className="post-meta">
                  <span className="category">{post.category}</span>
                  <span className="date">{post.date}</span>
                </div>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{post.excerpt}</p>
                <button 
                  className="read-more-btn"
                  onClick={() => togglePost(post.id)}
                >
                  {expandedPost === post.id ? 'Show Less' : 'Read More'}
                </button>
              </div>
              
              <div 
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          ))}
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
          margin-left: 32px;
        }

        .nav-link:hover { color: #00ff88; }

        .main {
          flex: 1;
          padding: 40px 20px;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .hero {
          text-align: center;
          margin-bottom: 50px;
          padding: 20px 0;
        }

        .title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .subtitle {
          font-size: 20px;
          color: #666;
        }

        .posts-section {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .blog-post {
          background: linear-gradient(145deg, #141414, #0e0e0e);
          border: 1px solid #222;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .blog-post:hover {
          border-color: #333;
        }

        .blog-post.expanded {
          border-color: #00ff88;
          box-shadow: 0 0 30px rgba(0, 255, 136, 0.1);
        }

        .post-header {
          padding: 30px;
        }

        .post-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .category {
          color: #00ff88;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .date {
          color: #666;
          font-size: 12px;
        }

        .post-title {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
        }

        .post-excerpt {
          color: #888;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .read-more-btn {
          padding: 12px 28px;
          background: transparent;
          border: 1px solid #00ff88;
          border-radius: 50px;
          color: #00ff88;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .read-more-btn:hover {
          background: #00ff88;
          color: #0a0a0a;
        }

        .post-content {
          padding: 0 30px 30px;
          display: none;
        }

        .blog-post.expanded .post-content {
          display: block;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .post-content :global(h2) {
          color: #fff;
          font-size: 22px;
          margin: 28px 0 16px;
        }

        .post-content :global(p) {
          color: #aaa;
          line-height: 1.8;
          margin-bottom: 16px;
        }

        .post-content :global(.intro) {
          font-size: 17px;
          color: #fff !important;
        }

        .post-content :global(ul) {
          margin: 16px 0;
          padding-left: 20px;
        }

        .post-content :global(li) {
          color: #aaa;
          margin-bottom: 10px;
          line-height: 1.6;
        }

        .post-content :global(li strong) {
          color: #00ff88;
        }

        .footer {
          padding: 40px 20px;
          text-align: center;
          color: #555;
          border-top: 1px solid #1a1a1a;
          font-size: 14px;
          margin-top: 60px;
        }

        @media (max-width: 768px) {
          .header { padding: 15px 20px; flex-direction: column; gap: 15px; }
          .title { font-size: 32px; }
          .post-header { padding: 20px; }
          .post-content { padding: 0 20px 20px; }
          .nav { gap: 20px; }
        }
      `}</style>
    </div>
  )
}
