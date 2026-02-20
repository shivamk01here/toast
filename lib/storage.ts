import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const WAITLIST_FILE = path.join(DATA_DIR, 'waitlist.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// --- Helper to read/write JSON ---
function readJSON(filePath: string): any[] {
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

function writeJSON(filePath: string, data: any[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// --- Waitlist ---
export function saveWaitlistEmail(email: string) {
  const current = readJSON(WAITLIST_FILE);
  // Simple dedup
  if (!current.find((entry) => entry.email === email)) {
    current.push({ email, timestamp: new Date().toISOString() });
    writeJSON(WAITLIST_FILE, current);
  }
}

export function getWaitlist() {
  return readJSON(WAITLIST_FILE);
}

// --- Feedback ---
export function saveFeedback(data: any) {
  const current = readJSON(FEEDBACK_FILE);
  current.push({ ...data, timestamp: new Date().toISOString() });
  writeJSON(FEEDBACK_FILE, current);
}

export function getFeedback() {
  return readJSON(FEEDBACK_FILE);
}

// --- Analytics ---
// Separated into two files:
// 1. analytics.json -> Historical events (page_view, roast_complete, etc.) - NO HEARTBEATS
// 2. active_users.json -> Transient state for real-time users (cleaned up every request)

const ACTIVE_USERS_FILE = path.join(DATA_DIR, 'active_users.json');

// Helper to read active users with correct typing
function readActiveUsers(): any[] {
  return readJSON(ACTIVE_USERS_FILE) || [];
}

interface AnalyticsEvent {
  type: string;
  data?: any;
  timestamp: string;
}

export function saveAnalyticsEvent(type: string, data?: any) {
  // 1. Handle Heartbeat (Real-time only)
  if (type === 'heartbeat') {
    updateActiveUser(data);
    return;
  }

  // 2. Handle Historical Events (Audit Log)
  const current = readJSON(ANALYTICS_FILE);
  
  // Optional: Prevent massive file growth by capping events (e.g. last 10k)
  if (current.length > 10000) {
    current.splice(0, current.length - 10000); // Keep last 10k
  }

  current.push({ type, data, timestamp: new Date().toISOString() });
  writeJSON(ANALYTICS_FILE, current);
}

function updateActiveUser(data: any) {
  const sessionId = data?.sessionId;
  if (!sessionId) return;

  const now = Date.now();
  let users = readActiveUsers();
  
  // Remove users inactive for > 2 minutes
  users = users.filter((u: any) => now - (u.lastSeen || 0) < 2 * 60 * 1000);

  // Update or Add current user
  const existingIndex = users.findIndex((u: any) => u.sessionId === sessionId);
  if (existingIndex >= 0) {
    users[existingIndex].lastSeen = now;
    users[existingIndex].timestamp = new Date().toISOString();
    if (data.country) users[existingIndex].country = data.country; // Update country if provided
  } else {
    users.push({
      sessionId,
      timestamp: new Date().toISOString(),
      country: data.country || 'Unknown',
      lastSeen: now
    });
  }

  writeJSON(ACTIVE_USERS_FILE, users);
}

export function getAnalyticsData() {
  const events = readJSON(ANALYTICS_FILE);
  
  // Get real-time active users from the dedicated file
  // Filter one last time to be sure (in case no writes happened recently)
  const now = Date.now();
  const activeUsersList = readActiveUsers().filter((u: any) => now - (u.lastSeen || 0) < 2 * 60 * 1000);
  
  return {
    events,
    activeUsers: activeUsersList.length,
    activeUsersList // Optional: pass full list if admin needs to see who is online
  };
}


// --- Rate Limiting ---
const RATE_LIMIT_FILE = path.join(DATA_DIR, 'rate_limits.json');
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface RateLimitEntry {
  ip: string;
  timestamps: string[];
}

function readRateLimits(): RateLimitEntry[] {
  if (!fs.existsSync(RATE_LIMIT_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(RATE_LIMIT_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeRateLimits(data: RateLimitEntry[]) {
  try {
    fs.writeFileSync(RATE_LIMIT_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing rate limits:', error);
  }
}

export function checkAndIncrementRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const cutoff = new Date(now - RATE_LIMIT_WINDOW_MS).toISOString();

  const all = readRateLimits();
  const entry = all.find(e => e.ip === ip) || { ip, timestamps: [] };

  // Filter out timestamps older than 24 hours
  entry.timestamps = entry.timestamps.filter(ts => ts > cutoff);

  if (entry.timestamps.length >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  // Record this usage
  entry.timestamps.push(new Date(now).toISOString());

  const updated = all.filter(e => e.ip !== ip);
  updated.push(entry);
  writeRateLimits(updated);

  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.timestamps.length };
}

export function getRateLimitStatus(ip: string): { remaining: number } {
  const now = Date.now();
  const cutoff = new Date(now - RATE_LIMIT_WINDOW_MS).toISOString();

  const all = readRateLimits();
  const entry = all.find(e => e.ip === ip);
  if (!entry) return { remaining: RATE_LIMIT_MAX };

  const recent = entry.timestamps.filter(ts => ts > cutoff);
  return { remaining: Math.max(0, RATE_LIMIT_MAX - recent.length) };
}
