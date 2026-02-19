"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Auto-refresh data every 5s if authorized
  useEffect(() => {
    if (!authorized) return;

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [authorized]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") { // Simple protection
      setAuthorized(true);
    } else {
      alert("Wrong password!");
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 border-2 border-black shadow-[8px_8px_0_0_#000] flex flex-col gap-4">
          <h1 className="font-bold text-2xl uppercase">Admin Login</h1>
          <input 
            type="password" 
            placeholder="Enter Password" 
            className="p-3 border-2 border-black"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-black text-white p-3 font-bold hover:bg-gray-800">Login</button>
        </form>
      </div>
    );
  }

  if (!data) return <div className="p-10 font-bold">Loading Dashboard...</div>;

  const { analytics, waitlist, feedback } = data;
  const { events, activeUsers } = analytics;

  // Process Analytics
  const totalPageViews = events.filter((e: any) => e.type === 'page_view').length;
  const totalRoasts = events.filter((e: any) => e.type === 'roast_complete').length;

  // Top 5 Personas
  const personaCounts: Record<string, number> = {};
  events.filter((e: any) => e.type === 'roast_complete').forEach((e: any) => {
    const p = e.data?.persona || 'unknown';
    personaCounts[p] = (personaCounts[p] || 0) + 1;
  });
  const topPersonas = Object.entries(personaCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Unique Users (Sessions) by Country
  const countryUsers: Record<string, Set<string>> = {};
  events.filter((e: any) => e.type === 'page_view').forEach((e: any) => {
    const c = e.data?.country || 'Unknown';
    const s = e.data?.sessionId || 'anon';
    if (!countryUsers[c]) countryUsers[c] = new Set();
    countryUsers[c].add(s);
  });
  const uniqueByCountry = Object.entries(countryUsers)
    .map(([country, sessions]) => ({ country, count: sessions.size }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-mono">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black uppercase">Admin Dashboard 📊</h1>
          <button onClick={fetchData} className="flex items-center gap-2 bg-white px-4 py-2 border-2 border-black hover:bg-gray-100">
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Active Users (Real-time)" value={activeUsers} color="bg-green-400" />
          <StatCard label="Total Roasts Sent" value={totalRoasts} color="bg-orange-400" />
          <StatCard label="Waitlist Signups" value={waitlist.length} color="bg-yellow-300" />
          <StatCard label="Total Page Views" value={totalPageViews} color="bg-blue-300" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* TOP PERSONAS RANKING */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000]">
            <h2 className="font-bold text-xl uppercase mb-4 border-b-2 border-black pb-2">Top 5 Personas 🏆</h2>
            <div className="flex flex-col gap-2">
              {topPersonas.map(([name, count], i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-gray-50 border border-black/10">
                  <span className="font-bold uppercase text-sm">#{i+1} {name}</span>
                  <span className="bg-black text-white px-2 py-0.5 text-xs font-bold">{count} roasts</span>
                </div>
              ))}
              {topPersonas.length === 0 && <p className="opacity-50 text-center py-4">No roasts recorded yet</p>}
            </div>
          </div>

          {/* USERS BY COUNTRY */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000]">
            <h2 className="font-bold text-xl uppercase mb-4 border-b-2 border-black pb-2">Unique Users by Country 🌍</h2>
            <div className="grid grid-cols-2 gap-4">
              {uniqueByCountry.map((item, i) => (
                <div key={i} className="flex justify-between border-b pb-1">
                  <span className="font-bold text-xs uppercase">{item.country}</span>
                  <span className="font-black text-xs">{item.count}</span>
                </div>
              ))}
              {uniqueByCountry.length === 0 && <p className="col-span-2 opacity-50 text-center py-4">Waiting for data...</p>}
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* WAITLIST TABLE */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000]">
            <h2 className="font-bold text-xl uppercase mb-4 border-b-2 border-black pb-2">Waitlist ({waitlist.length})</h2>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 font-bold">
                  <tr>
                    <th className="p-2">Email</th>
                    <th className="p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.slice().reverse().map((entry: any, i: number) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{entry.email}</td>
                      <td className="p-2 opacity-60 text-xs">{new Date(entry.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                  {waitlist.length === 0 && <tr><td colSpan={2} className="p-4 text-center opacity-50">No signups yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* FEEDBACK TABLE */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0_0_#000]">
            <h2 className="font-bold text-xl uppercase mb-4 border-b-2 border-black pb-2">Recent Feedback ({feedback.length})</h2>
             <div className="max-h-64 overflow-y-auto">
              <div className="flex flex-col gap-3">
                 {feedback.slice().reverse().map((f: any, i: number) => (
                    <div key={i} className="bg-gray-50 p-3 border border-gray-200">
                       <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-xs uppercase bg-black text-white px-1">Vibe: {f.vibe || 'N/A'}</span>
                          <span className="text-[10px] opacity-50">{new Date(f.timestamp).toLocaleString()}</span>
                       </div>
                       {f.characterRequest && (
                          <div className="text-xs mb-1"><strong>Req:</strong> {f.characterRequest}</div>
                       )}
                       {f.feedbackText && (
                          <div className="text-xs italic opacity-80">&quot;{f.feedbackText}&quot;</div>
                       )}
                    </div>
                 ))}
                 {feedback.length === 0 && <div className="text-center opacity-50 p-4">No feedback yet</div>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className={`p-6 border-2 border-black shadow-[4px_4px_0_0_#000] ${color}`}>
      <div className="font-bold uppercase text-xs opacity-70 mb-1">{label}</div>
      <div className="font-black text-4xl">{value}</div>
    </div>
  );
}
