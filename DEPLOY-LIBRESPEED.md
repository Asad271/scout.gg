# Self-Hosting LibreSpeed for Scout.gg

## Option 1: Free VPS (Recommended)

### Step 1: Get Free VPS
- **Oracle Cloud Free Tier** - Always free VPS (1-4 cores, 24GB RAM)
- **Google Cloud Free Tier** - $300 credit for 90 days
- **Hetzner** - €3.50/month VPS

### Step 2: Setup Server
```bash
# SSH into your VPS
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com | sh

# Create project directory
mkdir -p /opt/librespeed && cd /opt/librespeed

# Upload docker-compose.yml (from librespeed-backend folder)
# Then run:
docker-compose up -d
```

### Step 3: Update Scout.gg Config
In `pages/index.js`, update the server config:

```javascript
const LIBRESPEED_CONFIG = {
  servers: [
    {
      name: 'My Server',
      server: 'http://YOUR_SERVER_IP:8080',
      dlURL: '/garbage.php?ckSize=10',
      ulURL: '/empty.php',
      pingURL: '/empty.php',
      jitterURL: '/empty.php',
      getIPURL: '/getIP.php'
    }
  ]
}
```

---

## Option 2: Quick Test (Local)

### Install Docker Desktop
https://www.docker.com/products/docker-desktop/

### Run Locally
```bash
cd librespeed-backend
docker-compose up -d
```

### Access
- Frontend: http://localhost:8080
- Backend API: http://localhost:3001

---

## Option 3: Use Public LibreSpeed Servers (Free, Less Reliable)

Just keep the current config - it uses Cloudflare and Tele2 public servers.

---

## Which Should You Use?

| Option | Cost | Reliability | Setup Time |
|--------|------|-------------|------------|
| Oracle Cloud | Free | High | 30 min |
| Local Docker | Free | High | 5 min |
| Public servers | Free | Medium | 0 min |
| Hetzner VPS | €3.50/mo | Very High | 15 min |

---

## My Recommendation

1. **Start with public servers** (already working)
2. **When you get traffic**, setup Oracle Cloud Free VPS
3. **When monetized**, consider Hetzner for better uptime

---

## Files Created

- `librespeed-backend/docker-compose.yml` - Docker config
- `librespeed-backend/README.md` - Setup instructions
