'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  MapPin, 
  Plus, 
  Settings, 
  Users, 
  Activity, 
  Eye, 
  Heart,
  Database,
  History,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface Stats {
  plans: number;
  activities: number;
  locations: number;
  logs: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ plans: 0, activities: 0, locations: 0, logs: 0 });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleTriggerAI = async () => {
    setIsGenerating(true);
    setNotification(null);
    try {
      // In a real admin dashboard, you would use the service_role key 
      // from a secure server-side action. For local dev, we use the env var.
      const { data, error } = await supabase.functions.invoke('generate-plans', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ''}`
        }
      });

      if (error) throw error;
      
      setNotification({ type: 'success', message: 'AI generation started successfully!' });
      // Refresh logs after a short delay
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      console.error('AI Trigger Error:', error);
      setNotification({ type: 'error', message: error.message || 'Failed to trigger AI' });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          { count: plansCount },
          { count: activitiesCount },
          { count: locationsCount },
          { count: logsCount },
          { data: logs }
        ] = await Promise.all([
          supabase.from('plans').select('*', { count: 'exact', head: true }),
          supabase.from('activities').select('*', { count: 'exact', head: true }),
          supabase.from('target_locations').select('*', { count: 'exact', head: true }),
          supabase.from('generation_logs').select('*', { count: 'exact', head: true }),
          supabase.from('generation_logs')
            .select('*, target_locations(city, country)')
            .order('created_at', { ascending: false })
            .limit(10)
        ]);

        setStats({
          plans: plansCount || 0,
          activities: activitiesCount || 0,
          locations: locationsCount || 0,
          logs: logsCount || 0
        });
        setRecentLogs(logs || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Database size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Lovixa Admin</span>
        </div>
        
        <nav className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-indigo-600/10 text-indigo-400 rounded-lg font-medium cursor-pointer">
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition cursor-pointer">
            <MapPin size={20} /> Locations
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition cursor-pointer">
            <Activity size={20} /> Plans
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition cursor-pointer">
            <History size={20} /> AI Logs
          </div>
          <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition cursor-pointer">
            <Settings size={20} /> Settings
          </div>
        </nav>
      </aside>

      <main className="ml-64 p-10">
        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${
            notification.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'
          }`}>
            <AlertCircle size={20} />
            <span className="font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-auto text-current opacity-50 hover:opacity-100">&times;</button>
          </div>
        )}

        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Overview</h1>
            <p className="text-slate-500 mt-1">Real-time stats from Lovixa Database</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleTriggerAI}
              disabled={isGenerating}
              className={`bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 shadow-lg shadow-slate-900/10 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Sparkles size={20} className={isGenerating ? 'animate-spin' : ''} />
              {isGenerating ? 'Generating...' : 'Trigger AI Run'}
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 shadow-lg shadow-indigo-600/20">
              <Plus size={20} /> Add Location
            </button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Plans" value={stats.plans} icon={<Activity className="text-blue-500" />} />
          <StatCard title="Activities" value={stats.activities} icon={<Plus className="text-emerald-500" />} />
          <StatCard title="Target Cities" value={stats.locations} icon={<MapPin className="text-orange-500" />} />
          <StatCard title="AI Generations" value={stats.logs} icon={<History className="text-purple-500" />} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Recent AI Generation Logs</h2>
            <button className="text-indigo-600 font-semibold text-sm hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded"></div></td>
                    </tr>
                  ))
                ) : recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium">
                      {log.target_locations?.city}, {log.target_locations?.country}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold uppercase tracking-tighter text-slate-600">
                        {log.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        log.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status === 'success' ? 'SUCCESS' : 'ERROR'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {log.latency_ms}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-xl">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
