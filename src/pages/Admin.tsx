import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

function getKSTDate(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

interface Stats {
  totalUsers: number;
  todayUsers: number;
  totalVotes: number;
  todayVotes: number;
  top3: { name: string; brand: string; want: number; bad: number }[];
  suggestions: { brand: string; name: string; price_range: string; vote_count: number }[];
}

export default function Admin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get('admin') !== 'giftrank2026') {
      navigate('/', { replace: true });
      return;
    }

    const fetchStats = async () => {
      const todayKST = getKSTDate();

      const [sessRes, todaySessRes, gifRes, votesRes, sugRes] = await Promise.all([
        supabase.from('user_sessions').select('session_id', { count: 'exact', head: true }),
        supabase.from('user_sessions').select('session_id', { count: 'exact', head: true }).gte('created_at', todayKST + 'T00:00:00+09:00').lt('created_at', todayKST + 'T23:59:59+09:00'),
        supabase.from('gifticons').select('name, brand, vote_count_want, vote_count_bad').order('vote_count_want', { ascending: false }),
        supabase.from('votes').select('id', { count: 'exact', head: true }),
        supabase.from('suggestions').select('brand, name, price_range, vote_count').order('vote_count', { ascending: false }),
      ]);

      const todayVotesRes = await supabase.from('votes').select('id', { count: 'exact', head: true }).gte('voted_at', todayKST + 'T00:00:00+09:00');

      const gifs = gifRes.data || [];
      const top3 = gifs.slice(0, 3).map(g => ({
        name: g.name,
        brand: g.brand,
        want: g.vote_count_want,
        bad: g.vote_count_bad,
      }));

      setStats({
        totalUsers: sessRes.count || 0,
        todayUsers: todaySessRes.count || 0,
        totalVotes: votesRes.count || 0,
        todayVotes: todayVotesRes.count || 0,
        top3,
        suggestions: (sugRes.data || []).map(s => ({ brand: s.brand, name: s.name, price_range: s.price_range, vote_count: s.vote_count })),
      });
      setLoading(false);
    };

    fetchStats();
  }, [searchParams, navigate]);

  if (searchParams.get('admin') !== 'giftrank2026') return null;

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (!stats) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">📊 기프트랭크 관리자 대시보드</h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">총 참여자 수</div>
          <div className="text-3xl font-bold">{stats.totalUsers}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">오늘 참여자 수</div>
          <div className="text-3xl font-bold">{stats.todayUsers}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">총 투표수</div>
          <div className="text-3xl font-bold">{stats.totalVotes}</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">오늘 투표수</div>
          <div className="text-3xl font-bold">{stats.todayVotes}</div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-3">🏆 TOP 3 기프티콘</h2>
      <table className="w-full border-collapse mb-8">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">#</th>
            <th className="text-left p-2">브랜드</th>
            <th className="text-left p-2">상품명</th>
            <th className="text-right p-2">받고싶어요</th>
            <th className="text-right p-2">별로에요</th>
          </tr>
        </thead>
        <tbody>
          {stats.top3.map((g, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{g.brand}</td>
              <td className="p-2">{g.name}</td>
              <td className="p-2 text-right">{g.want}</td>
              <td className="p-2 text-right">{g.bad}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mb-3">💡 제안된 기프티콘</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">브랜드</th>
            <th className="text-left p-2">상품명</th>
            <th className="text-left p-2">가격대</th>
            <th className="text-right p-2">투표수</th>
          </tr>
        </thead>
        <tbody>
          {stats.suggestions.length === 0 ? (
            <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">아직 제안이 없습니다</td></tr>
          ) : stats.suggestions.map((s, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{s.brand}</td>
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.price_range}</td>
              <td className="p-2 text-right">{s.vote_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
