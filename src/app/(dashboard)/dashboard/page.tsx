'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DashboardSkeleton } from '@/components/ui/loading-skeletons';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Bell,
  ArrowRight,
  Search,
  Heart,
  MapPin,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import Link from 'next/link';
import { dashboardStats, monthlyTrends, regionStats, alerts, households } from '@/data/mock-data';

// KHNP CI Colors
const KHNP_BLUE = '#0066B3';
const KHNP_GREEN = '#00A651';

const statCards = [
  {
    title: '총 발굴 가구',
    value: dashboardStats.totalHouseholds,
    change: `+${dashboardStats.newThisMonth} 이번 달`,
    trend: 'up',
    icon: Search,
    color: 'text-[#0066B3]',
    bgColor: 'bg-[#E6F0F8]',
  },
  {
    title: '고위험 가구',
    value: dashboardStats.highRisk,
    change: '즉시 조치 필요',
    trend: 'alert',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    title: '지원 완료',
    value: dashboardStats.supported,
    change: `${Math.round((dashboardStats.supported / dashboardStats.totalHouseholds) * 100)}% 완료율`,
    trend: 'up',
    icon: CheckCircle2,
    color: 'text-[#00A651]',
    bgColor: 'bg-[#E6F5EC]',
  },
  {
    title: '봉사단 활동',
    value: `${dashboardStats.thisMonthVisits}회`,
    change: `${dashboardStats.thisMonthHours}시간 봉사`,
    trend: 'up',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

const riskDistribution = [
  { name: '고위험', value: dashboardStats.highRisk, color: '#ef4444' },
  { name: '중위험', value: dashboardStats.mediumRisk, color: '#f59e0b' },
  { name: '관심', value: dashboardStats.lowRisk, color: '#22c55e' },
];

const recentHighRiskHouseholds = households
  .filter(h => h.riskLevel === 'critical' || h.riskLevel === 'high')
  .sort((a, b) => b.riskScore - a.riskScore)
  .slice(0, 5);

const recentAlerts = alerts.filter(a => !a.isRead).slice(0, 5);

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 데이터 로딩 시뮬레이션 (실제 API 연동 시 대체)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">E-안심케어 통합 현황을 한눈에 확인하세요.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/detection">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              AI 발굴 현황
            </Button>
          </Link>
          <Link href="/welfare">
            <Button className="gap-2">
              <Heart className="h-4 w-4" />
              복지 연계
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                {stat.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                {stat.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                {stat.trend === 'alert' && <AlertTriangle className="h-4 w-4 text-red-500" />}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">월별 발굴/지원 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => value.split('-')[1] + '월'}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="detected"
                    stroke={KHNP_BLUE}
                    strokeWidth={2}
                    dot={{ fill: KHNP_BLUE, strokeWidth: 2 }}
                    name="발굴"
                  />
                  <Line
                    type="monotone"
                    dataKey="supported"
                    stroke={KHNP_GREEN}
                    strokeWidth={2}
                    dot={{ fill: KHNP_GREEN, strokeWidth: 2 }}
                    name="지원"
                  />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={{ fill: '#7c3aed', strokeWidth: 2 }}
                    name="방문"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">위험도별 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* High Risk Households */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">고위험 가구 목록</CardTitle>
            <Link href="/detection?risk=high">
              <Button variant="ghost" size="sm" className="gap-1">
                전체보기 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentHighRiskHouseholds.map((household) => (
                <Link
                  key={household.id}
                  href={`/detection/${household.id}`}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{household.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {household.region.sigungu} {household.region.dong}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{household.riskScore}점</p>
                      <div className="flex gap-1">
                        {household.characteristics.slice(0, 2).map((char) => (
                          <Badge key={char} variant="secondary" className="text-xs">
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge
                      variant={household.status === 'detected' ? 'destructive' : 'secondary'}
                    >
                      {household.status === 'detected' && '미확인'}
                      {household.status === 'investigating' && '확인중'}
                      {household.status === 'connected' && '연계중'}
                      {household.status === 'supported' && '지원완료'}
                      {household.status === 'monitoring' && '모니터링'}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림
            </CardTitle>
            <Badge variant="secondary">{recentAlerts.length}건</Badge>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 h-2 w-2 rounded-full ${
                          alert.priority === 'critical'
                            ? 'bg-red-500'
                            : alert.priority === 'high'
                            ? 'bg-orange-500'
                            : alert.priority === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Regional Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            지역별 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionStats.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis
                  dataKey="sido"
                  type="category"
                  width={80}
                  className="text-xs"
                  tickFormatter={(value) => value.replace(/특별시|광역시|도/g, '')}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="total" fill={KHNP_BLUE} name="전체" radius={[0, 4, 4, 0]} />
                <Bar dataKey="highRisk" fill="#ef4444" name="고위험" radius={[0, 4, 4, 0]} />
                <Bar dataKey="supported" fill={KHNP_GREEN} name="지원완료" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
