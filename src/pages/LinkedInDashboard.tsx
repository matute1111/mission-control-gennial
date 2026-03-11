import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, MessageSquare, TrendingUp, Users, BarChart3 } from 'lucide-react';

interface LinkedInPost {
  id: string;
  content: string;
  posted_at: string;
  impressions: number;
  reactions: number;
  comments: number;
  status: string;
  theme: string;
  hashtags: string[];
}

interface LinkedInOutreach {
  id: string;
  recipient_name: string;
  recipient_company: string;
  recipient_title: string;
  status: string;
  sent_at: string;
  company_size: string;
}

interface LinkedInCalendar {
  id: string;
  scheduled_date: string;
  content_draft: string;
  theme: string;
  status: string;
}

interface LinkedInMetrics {
  week_start: string;
  followers: number;
  total_impressions: number;
  connections_sent: number;
  connections_accepted: number;
  posts_published: number;
  engagement_rate: number;
}

export default function LinkedInDashboard() {
  const [posts, setPosts] = useState<LinkedInPost[]>([]);
  const [outreach, setOutreach] = useState<LinkedInOutreach[]>([]);
  const [calendar, setCalendar] = useState<LinkedInCalendar[]>([]);
  const [metrics, setMetrics] = useState<LinkedInMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'posts' | 'outreach' | 'metrics'>('calendar');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    
    // Load posts
    const { data: postsData } = await supabase
      .from('linkedin_posts')
      .select('*')
      .order('posted_at', { ascending: false });
    
    // Load outreach
    const { data: outreachData } = await supabase
      .from('linkedin_outreach')
      .select('*')
      .order('sent_at', { ascending: false });
    
    // Load calendar
    const { data: calendarData } = await supabase
      .from('linkedin_calendar')
      .select('*')
      .order('scheduled_date', { ascending: true });
    
    // Load metrics
    const { data: metricsData } = await supabase
      .from('linkedin_metrics')
      .select('*')
      .order('week_start', { ascending: false })
      .limit(1)
      .single();
    
    setPosts(postsData || []);
    setOutreach(outreachData || []);
    setCalendar(calendarData || []);
    setMetrics(metricsData);
    setLoading(false);
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'published': 'bg-green-100 text-green-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'draft': 'bg-gray-100 text-gray-800',
      'sent': 'bg-yellow-100 text-yellow-800',
      'accepted': 'bg-green-100 text-green-800',
      'replied': 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">LinkedIn Growth Dashboard</h1>
        <p className="text-gray-600">Tracking de posts, outreach y métricas</p>
      </div>

      {/* Stats Cards */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Followers</p>
                <p className="text-2xl font-bold">{metrics.followers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Impresiones</p>
                <p className="text-2xl font-bold">{metrics.total_impressions}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conexiones</p>
                <p className="text-2xl font-bold">{metrics.connections_accepted}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Posts</p>
                <p className="text-2xl font-bold">{metrics.posts_published}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b flex">
          {[
            { id: 'calendar', label: 'Calendario', icon: Calendar },
            { id: 'posts', label: 'Posts', icon: MessageSquare },
            { id: 'outreach', label: 'Outreach', icon: Users },
            { id: 'metrics', label: 'Métricas', icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Calendario de Contenido</h3>
              <div className="grid gap-4">
                {calendar.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        {new Date(item.scheduled_date).toLocaleDateString('es-AR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">{item.theme}</p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.content_draft}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Posts Publicados</h3>
              <div className="grid gap-4">
                {posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(post.posted_at).toLocaleDateString('es-AR')}
                      </span>
                      <span className="text-xs text-gray-400">{post.theme}</span>
                    </div>
                    <p className="text-gray-900 mb-3 line-clamp-3">{post.content}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>👁 {post.impressions} impresiones</span>
                      <span>👍 {post.reactions} reacciones</span>
                      <span>💬 {post.comments} comentarios</span>
                    </div>
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {post.hashtags.map((tag) => (
                          <span key={tag} className="text-xs text-blue-600">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outreach Tab */}
          {activeTab === 'outreach' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Outreach a Leads</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Nombre</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Empresa</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Cargo</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Tamaño</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Estado</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {outreach.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm">{item.recipient_name}</td>
                        <td className="py-2 px-3 text-sm text-gray-600">{item.recipient_company || '-'}</td>
                        <td className="py-2 px-3 text-sm text-gray-600">{item.recipient_title || '-'}</td>
                        <td className="py-2 px-3 text-sm text-gray-600">{item.company_size || '-'}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-500">
                          {new Date(item.sent_at).toLocaleDateString('es-AR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Metrics Tab */}
          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Métricas Semanales</h3>
              {metrics && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Semana</p>
                    <p className="font-medium">
                      {new Date(metrics.week_start).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                    <p className="font-medium">{metrics.engagement_rate}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Invitaciones Enviadas</p>
                    <p className="font-medium">{metrics.connections_sent}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Invitaciones Aceptadas</p>
                    <p className="font-medium">{metrics.connections_accepted}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
