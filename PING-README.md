# Ping Functionality - Keep Server Alive

This project includes a ping mechanism to prevent the server from going idle on Render's free tier, which has a 15-minute timeout for inactive services.

## How It Works

### 1. Ping API Endpoint
- **URL**: `/api/ping`
- **Method**: GET
- **Purpose**: Health check endpoint that responds with server status

### 2. Auto-Ping System
- **Interval**: Every 14 minutes (840,000 ms)
- **Trigger**: Automatically starts when the CWL API is first used
- **Safety**: Only runs in production (NODE_ENV=production)

### 3. Implementation Files

#### `/lib/ping-utils.ts`
- Contains the ping logic and interval management
- Pings the `/api/ping` endpoint every 14 minutes
- Uses the domain from `RENDER_EXTERNAL_URL` or fallback to `clashwarcouncil.com`

#### `/app/api/ping/route.ts`
- Simple health check endpoint
- Returns JSON with status, timestamp, and message

#### `/app/api/startup/route.ts`
- Manual initialization endpoint (optional)
- Can be called to manually start the ping mechanism

#### `/app/api/cwl/route.ts`
- Auto-initializes ping on first API usage
- Ensures ping starts when users actually use the app

## Benefits

1. **No Manual Setup**: Ping starts automatically when someone uses the app
2. **Production Only**: Won't interfere with local development
3. **Safe Timing**: 14-minute interval stays well within the 15-minute timeout
4. **Logging**: Console logs show ping status for monitoring
5. **Error Handling**: Graceful failure if ping doesn't work

## Usage

The ping system works automatically - no manual intervention needed:

1. User visits the site and uses the CWL ranking tool
2. Ping mechanism initializes automatically
3. Server stays alive by pinging itself every 14 minutes
4. Server logs show ping activity: `🏓 Pinging server at: https://clashwarcouncil.com/api/ping`

## Monitoring

Check your Render logs to see ping activity:
```
🏓 Self-ping initialized - will ping every 14 minutes
🏓 Pinging server at: https://clashwarcouncil.com/api/ping
✅ Server ping successful: Server is alive at 2024-01-15T10:30:00.000Z
```

## Manual Control (Optional)

If needed, you can manually trigger ping initialization by calling:
- `GET /api/startup` - Initialize ping mechanism
- `GET /api/ping` - Check server health

This ping system ensures your CWL Ranker stays responsive 24/7 without any additional costs or complex configuration! 