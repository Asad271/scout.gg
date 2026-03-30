import Head from 'next/head'
import Link from 'next/link'

export default function Blog() {
  const posts = [
    {
      slug: 'how-to-fix-internet-lag',
      title: 'How to Fix Internet Lag for Gaming',
      excerpt: 'Learn how to reduce lag, lower ping, and eliminate internet lag with these proven tips and solutions.',
      date: 'March 30, 2026',
      category: 'Gaming Tips'
    },
    {
      slug: 'how-to-improve-ping',
      title: 'How to Improve Your Ping for Gaming',
      excerpt: 'Learn how to reduce ping and improve your gaming experience with these proven tips.',
      date: 'March 30, 2026',
      category: 'Gaming Tips'
    }
  ]

  return (
    <div className="container">
      <Head>
        <title>Blog | Scout.gg - Gaming & Internet Speed Tips</title>
        <meta name="description" content="Tips and guides about internet speed, ping optimization, reduce gaming lag, and improve gaming performance." />
        <meta name="keywords" content="gaming blog, speed test tips, ping optimization, gaming internet, reduce gaming lag, how to fix internet lag, low ping tips, best internet speed for gaming" />
        <meta name="robots" content="index, follow" />
        <meta name="google-site-verification" content="MCJ9PzqY3o-lhn2tSqqAb8Kcqo6SiSUdpYTL0dWLUgI" />
        <link rel="canonical" href="https://scout-gg.vercel.app/blog" />
        <meta property="og:title" content="Blog | Scout.gg" />
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

        <section className="posts-grid">
          {posts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="post-card">
              <div className="post-meta">
                <span className="category">{post.category}</span>
                <span className="date">{post.date}</span>
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-excerpt">{post.excerpt}</p>
              <span className="read-more">Read More →</span>
            </Link>
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

        .nav {
          display: flex;
          gap: 32px;
        }

        .nav-link {
          color: #666;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
        }

        .nav-link:hover { color: #00ff88; }

        .main {
          flex: 1;
          padding: 40px 20px;
          max-width: 900px;
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
          letter-spacing: -0.5px;
        }

        .subtitle {
          font-size: 20px;
          color: #666;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }

        .post-card {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          padding: 36px;
          text-decoration: none;
          transition: all 0.3s;
        }

        .post-card:hover {
          border-color: #00ff88;
          transform: translateY(-4px);
        }

        .post-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
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
          color: #fff;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .post-excerpt {
          color: #888;
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .read-more {
          color: #00ff88;
          font-size: 13px;
          font-weight: 500;
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
          .header { padding: 15px 20px; }
          .title { font-size: 32px; }
        }
      `}</style>
    </div>
  )
}
