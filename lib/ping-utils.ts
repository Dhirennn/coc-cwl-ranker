// Ping utility to prevent server from going idle on Render
let pingInterval: NodeJS.Timeout | null = null;

/**
 * Get the base host URL for pinging
 */
function getBaseHost(): string {
  // In production, use the actual domain
  if (process.env.NODE_ENV === 'production') {
    return process.env.RENDER_EXTERNAL_URL || 'https://clashwarcouncil.com';
  }
  
  // In development, use localhost
  return `http://localhost:${process.env.PORT || 3000}`;
}

/**
 * Ping the server to keep it alive
 */
async function pingServer(): Promise<void> {
  try {
    const baseHost = getBaseHost();
    const pingUrl = `${baseHost}/api/ping`;
    
    console.log(`🏓 Pinging server at: ${pingUrl}`);
    
    const response = await fetch(pingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'CWL-Ranker-KeepAlive/1.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Server ping successful: ${data.message} at ${data.timestamp}`);
    } else {
      console.warn(`⚠️ Server ping failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Ping failed:`, error);
  }
}

/**
 * Initialize the ping mechanism
 * Pings every 14 minutes to prevent Render's 15-minute timeout
 */
export function initializePing(): void {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('🏓 Ping not initialized - running in development mode');
    return;
  }
  
  // Clear any existing interval
  if (pingInterval) {
    clearInterval(pingInterval);
  }
  
  // Ping every 14 minutes (840000 ms)
  // We use 14 minutes to be safe before Render's 15-minute timeout
  const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds
  
  pingInterval = setInterval(pingServer, PING_INTERVAL);
  
  console.log(`🏓 Self-ping initialized - will ping every ${PING_INTERVAL / 1000 / 60} minutes`);
  
  // Do an initial ping after 30 seconds to test the setup
  setTimeout(pingServer, 30000);
}

/**
 * Stop the ping mechanism
 */
export function stopPing(): void {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
    console.log('🏓 Self-ping stopped');
  }
} 