# LibreSpeed Server for Scout.gg

## Setup Instructions

### Prerequisites
- Install Docker Desktop: https://www.docker.com/products/docker-desktop/

### Start the Server

1. Open terminal in this folder
2. Run:
   ```bash
   docker-compose up -d
   ```
3. Server will be available at: http://localhost:8080

### Stop the Server
```bash
docker-compose down
```

### Check Status
```bash
docker-compose ps
```

---

## What's Running

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 8080 | Speed test interface |
| Backend | 3001 | Stores test results (optional) |

---

## For Production (Recommended)

1. Get a VPS ($5/month): DigitalOcean, Vultr, or Hetzner
2. Install Docker on VPS
3. Upload these files
4. Run `docker-compose up -d`
5. Point your domain to the VPS IP

Then update Scout.gg to use your server URL instead of public demo.
