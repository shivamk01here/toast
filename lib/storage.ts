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
// For "Real-time", we'll track "heartbeats". 
// A heartbeat is just a timestamped update from a client.
// We clean up heartbeats older than 1 minute to get "active users".

interface AnalyticsEvent {
  type: string; // 'page_view', 'click_extension', 'click_waitlist', 'heartbeat'
  data?: any;
  timestamp: string;
}

export function saveAnalyticsEvent(type: string, data?: any) {
  const current = readJSON(ANALYTICS_FILE);
  current.push({ type, data, timestamp: new Date().toISOString() });
  writeJSON(ANALYTICS_FILE, current);
}

export function getAnalyticsData() {
  const events = readJSON(ANALYTICS_FILE);
  
  // Calculate Active Users (heartbeats in last 60 seconds)
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60000);
  
  const activeUsers = events.filter((e: AnalyticsEvent) => {
    return e.type === 'heartbeat' && new Date(e.timestamp) > oneMinuteAgo;
  });

  // Unique active users could be roughly tracked by a session ID if we had one,
  // but for now, we'll just count raw heartbeats / 4 (since we send every 15s) 
  // or just distinct logic if we pass a random session ID.
  // For simplicity: unique session IDs in heartbeats.
  const uniqueActive = new Set(activeUsers.map((e: any) => e.data?.sessionId)).size;

  return {
    events,
    activeUsers: uniqueActive || 0
  };
}
