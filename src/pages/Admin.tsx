import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

function toKSTDateString(utcString: string): string {
  const d = new Date(utcString);
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kst.getUTCDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function nowKST(): string {
  const d = new Date();
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.getUTCFullYear()}.${String(kst.getUTCMonth() + 1).padStart(2, '0')}.${String(kst.getUTCDate()).padStart(2, '0')} ${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')}:${String(kst.getUTCSeconds()).padStart(2, '0')}`;
}

interface Stats {
  totalUsers: number;
  totalVotes: number;
  totalSuggestions: number;
  dailyVisitors: { date: string; visitors: number; votes: number }[];
  dailyVotes: { date: string; votes: number }[];
  topWant: { name: string; brand: string; want: number }[];
  topBad: { name: string; brand: string; bad: number }[];
  suggestions: { brand: string; name: string; price_range: string; vote_count: number }[];
}

export default function Admin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);

    const [sessRes, votesRes, sugRes, gifRes, allSessionsRes, allVotesRes] = await Promise.all([
      supabase.from('user_sessions').select('session_id', { count: 'exact', head: true }),
      supabase.from('votes').select('id', { count: 'exact', head: true }),
      supabase.from('suggestions').select('brand, name, price_range, vote_count').order('vote_count', { ascending: false }),
      supabase.from('gifticons').select('name, brand, vote_count_want, vote_count_bad').order('vote_count_want', { ascending: false }),
      supabase.from('user_sessions').select('created_at'),
      supabase.from('votes').select('voted_at'),
    ]);

    // Daily visitors
    const visitorMap: Record<string, number> = {};
    (allSessionsRes.data || []).forEach(s => {
      const d = toKSTDateString(s.created_at);
      visitorMap[d] = (visitorMap[d] || 0) + 1;
    });

    // Daily votes
    const voteMap: Record<string, number> = {};
    (allVotesRes.data || []).forEach(v => {
      const d = toKSTDateString(v.voted_at);
      voteMap[d] = (voteMap[d] || 0) + 1;
    });

    const allDates = [...new Set([...Object.keys(visitorMap), ...Object.keys(voteMap)])].sort().reverse();

    const dailyVisitors = allDates.map(date => ({
      date,
      visitors: visitorMap[date] || 0,
      votes: voteMap[date] || 0,
    }));

    const dailyVotes = allDates.filter(d => voteMap[d]).map(date => ({
      date,
      votes: voteMap[date] || 0,
    }));

    const gifs = gifRes.data || [];
    const topWant = gifs.slice(0, 5).map(g => ({ name: g.name, brand: g.brand, want: g.vote_count_want }));
    const topBad = [...gifs].sort((a, b) => b.vote_count_bad - a.vote_count_bad).slice(0, 5).map(g => ({ name: g.name, brand: g.brand, bad: g.vote_count_bad }));

    setStats({
      totalUsers: sessRes.count || 0,
      totalVotes: votesRes.count || 0,
      totalSuggestions: (sugRes.data || []).length,
      dailyVisitors,
      dailyVotes,
      topWant,
      topBad,
      suggestions: (sugRes.data || []).map(s => ({ brand: s.brand, name: s.name, price_range: s.price_range, vote_count: s.vote_count })),
    });
    setLastUpdated(nowKST());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (searchParams.get('admin') !== 'giftrank2026') {
      navigate('/', { replace: true });
      return;
    }
    fetchStats();
  }, [searchParams, navigate, fetchStats]);

  if (searchParams.get('admin') !== 'giftrank2026') return null;

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (!stats) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">📊 기프트랭크 관리자</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">업데이트: {lastUpdated} KST</span>
          <button onClick={fetchStats} className="px-3 py-1.5 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition">🔄 새로고침</button>
        </div>
      </div>

      {/* 전체 요약 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          ['총 참여자', stats.totalUsers],
          ['총 투표수', stats.totalVotes],
          ['총 제안 수', stats.totalSuggestions],
        ].map(([label, val], i) => (
          <div key={i} className="border rounded-lg p-4 text-center">
            <div className="text-xs text-gray-500">{label as string}</div>
            <div className="text-2xl font-bold mt-1">{val as number}</div>
          </div>
        ))}
      </div>

      {/* 일별 방문자 */}
      <Section title="📅 일별 방문자 & 투표">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-gray-500"><th className="p-2">날짜</th><th className="p-2 text-right">신규 방문자</th><th className="p-2 text-right">투표수</th></tr></thead>
          <tbody>
            {stats.dailyVisitors.map(d => (
              <tr key={d.date} className="border-b"><td className="p-2">{d.date}</td><td className="p-2 text-right">{d.visitors}</td><td className="p-2 text-right">{d.votes}</td></tr>
            ))}
            {stats.dailyVisitors.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-gray-400">데이터 없음</td></tr>}
          </tbody>
        </table>
      </Section>

      {/* 인기 기프티콘 */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <Section title="🏆 받고싶어요 TOP5">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-gray-500"><th className="p-2">#</th><th className="p-2">브랜드</th><th className="p-2">상품명</th><th className="p-2 text-right">투표</th></tr></thead>
            <tbody>
              {stats.topWant.map((g, i) => (
                <tr key={i} className="border-b"><td className="p-2">{i + 1}</td><td className="p-2">{g.brand}</td><td className="p-2">{g.name}</td><td className="p-2 text-right font-semibold">{g.want}</td></tr>
              ))}
            </tbody>
          </table>
        </Section>
        <Section title="👎 별로예요 TOP5">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-gray-500"><th className="p-2">#</th><th className="p-2">브랜드</th><th className="p-2">상품명</th><th className="p-2 text-right">투표</th></tr></thead>
            <tbody>
              {stats.topBad.map((g, i) => (
                <tr key={i} className="border-b"><td className="p-2">{i + 1}</td><td className="p-2">{g.brand}</td><td className="p-2">{g.name}</td><td className="p-2 text-right font-semibold">{g.bad}</td></tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>

      {/* 제안된 기프티콘 */}
      <Section title="💡 제안된 기프티콘">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-gray-500"><th className="p-2">브랜드</th><th className="p-2">상품명</th><th className="p-2">가격대</th><th className="p-2 text-right">투표수</th></tr></thead>
          <tbody>
            {stats.suggestions.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-400">아직 제안 없음</td></tr>
            ) : stats.suggestions.map((s, i) => (
              <tr key={i} className="border-b"><td className="p-2">{s.brand}</td><td className="p-2">{s.name}</td><td className="p-2">{s.price_range}</td><td className="p-2 text-right font-semibold">{s.vote_count}</td></tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div className="border rounded-lg overflow-hidden">{children}</div>
    </div>
  );
}
