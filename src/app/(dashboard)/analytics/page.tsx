'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Home,
  Heart,
  Clock,
  Target,
  Award,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  MapPin,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ComposedChart,
} from 'recharts';
import { dashboardStats, monthlyTrends, regionStats, households, welfarePrograms, volunteers } from '@/data/mock-data';

// KPI 데이터
const kpiData = [
  {
    title: '복지 사각지대 발굴률',
    value: 32.5,
    target: 30,
    unit: '%',
    trend: 8.2,
    description: '전년 대비 발굴률 증가',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: '지원 연계 완료율',
    value: 89.3,
    target: 85,
    unit: '%',
    trend: 4.1,
    description: '발굴 가구 대비 지원 완료',
    icon: Heart,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: '평균 지원 소요일',
    value: 5.2,
    target: 7,
    unit: '일',
    trend: -2.3,
    description: '발굴부터 지원까지 평균 기간',
    icon: Clock,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: '수혜자 만족도',
    value: 4.6,
    target: 4.5,
    unit: '/5',
    trend: 0.3,
    description: '설문조사 기준 평균 점수',
    icon: Award,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

// 월별 상세 트렌드
const detailedTrends = [
  { month: '1월', detected: 42, supported: 38, pending: 4, budget: 1200 },
  { month: '2월', detected: 48, supported: 45, pending: 3, budget: 1350 },
  { month: '3월', detected: 55, supported: 52, pending: 3, budget: 1560 },
  { month: '4월', detected: 51, supported: 48, pending: 3, budget: 1440 },
  { month: '5월', detected: 63, supported: 58, pending: 5, budget: 1740 },
  { month: '6월', detected: 58, supported: 55, pending: 3, budget: 1650 },
  { month: '7월', detected: 71, supported: 65, pending: 6, budget: 1950 },
  { month: '8월', detected: 68, supported: 64, pending: 4, budget: 1920 },
  { month: '9월', detected: 54, supported: 51, pending: 3, budget: 1530 },
  { month: '10월', detected: 49, supported: 46, pending: 3, budget: 1380 },
  { month: '11월', detected: 56, supported: 52, pending: 4, budget: 1560 },
  { month: '12월', detected: 45, supported: 42, pending: 3, budget: 1260 },
];

// 위험 등급별 분포
const riskDistribution = [
  { name: '긴급', value: 45, color: '#ef4444' },
  { name: '고위험', value: 120, color: '#f97316' },
  { name: '중위험', value: 185, color: '#eab308' },
  { name: '관심', value: 173, color: '#22c55e' },
];

// 가구 특성별 분포
const characteristicsDistribution = [
  { name: '독거노인', count: 156 },
  { name: '기초수급', count: 134 },
  { name: '장애인', count: 98 },
  { name: '한부모', count: 67 },
  { name: '다문화', count: 43 },
  { name: '기타', count: 25 },
];

// 복지사업별 효과 분석
const programEffectiveness = [
  { program: '연탄나눔', beneficiaries: 245, satisfaction: 4.7, costPerPerson: 15 },
  { program: '난방유지원', beneficiaries: 156, satisfaction: 4.5, costPerPerson: 45 },
  { program: 'E-안심하우스', beneficiaries: 89, satisfaction: 4.8, costPerPerson: 120 },
  { program: '에너지바우처', beneficiaries: 312, satisfaction: 4.4, costPerPerson: 18 },
  { program: '냉방비지원', beneficiaries: 134, satisfaction: 4.3, costPerPerson: 20 },
];

// AI 성과 지표
const aiPerformance = [
  { metric: '발굴 정확도', value: 92 },
  { metric: '위험도 예측', value: 88 },
  { metric: '복지 매칭', value: 85 },
  { metric: '이상 탐지', value: 90 },
  { metric: '처리 속도', value: 95 },
  { metric: '사용자 만족', value: 87 },
];

// 봉사활동 효과
const volunteerImpact = [
  { month: '1월', visits: 45, hours: 135, households: 38 },
  { month: '2월', visits: 52, hours: 156, households: 42 },
  { month: '3월', visits: 48, hours: 144, households: 40 },
  { month: '4월', visits: 61, hours: 183, households: 52 },
  { month: '5월', visits: 73, hours: 219, households: 58 },
  { month: '6월', visits: 68, hours: 204, households: 55 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('year');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">데이터 분석</h1>
          <p className="text-muted-foreground">E-안심케어 사업 성과를 분석하고 인사이트를 확인합니다.</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="기간" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">이번 달</SelectItem>
              <SelectItem value="quarter">이번 분기</SelectItem>
              <SelectItem value="year">올해</SelectItem>
              <SelectItem value="all">전체</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => {
          const isPositive = kpi.title === '평균 지원 소요일' ? kpi.trend < 0 : kpi.trend > 0;
          const isOnTarget = kpi.title === '평균 지원 소요일'
            ? kpi.value <= kpi.target
            : kpi.value >= kpi.target;

          return (
            <Card key={kpi.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`rounded-full p-3 ${kpi.bgColor}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <Badge variant={isOnTarget ? 'default' : 'secondary'} className={isOnTarget ? 'bg-green-100 text-green-700' : ''}>
                    {isOnTarget ? '목표 달성' : '진행중'}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold">
                    {kpi.value}{kpi.unit}
                  </p>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {isPositive ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : kpi.trend < 0 ? (
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-500" />
                  )}
                  <span className={`text-sm ${isPositive || (kpi.title === '평균 지원 소요일' && kpi.trend < 0) ? 'text-green-600' : 'text-gray-600'}`}>
                    {Math.abs(kpi.trend)}{kpi.title === '평균 지원 소요일' ? '일' : '%p'} {kpi.description}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  목표: {kpi.target}{kpi.unit}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">종합 현황</TabsTrigger>
          <TabsTrigger value="welfare">복지사업 분석</TabsTrigger>
          <TabsTrigger value="ai">AI 성과</TabsTrigger>
          <TabsTrigger value="volunteer">봉사활동</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>월별 발굴/지원 추이</CardTitle>
              <CardDescription>AI 발굴 가구 수와 지원 완료 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={detailedTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="detected" fill="#3b82f6" name="발굴" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="supported" fill="#22c55e" name="지원완료" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="budget" stroke="#a855f7" strokeWidth={2} name="예산(만원)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>위험등급별 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Characteristics Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>가구 특성별 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={characteristicsDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" width={70} className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>지역별 상세 현황</CardTitle>
              <CardDescription>시도별 발굴, 고위험, 지원완료 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionStats.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="sido"
                      className="text-xs"
                      tickFormatter={(value) => value.replace(/특별시|광역시|도/g, '')}
                    />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3b82f6" name="전체" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="highRisk" fill="#ef4444" name="고위험" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="supported" fill="#22c55e" name="지원완료" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="welfare" className="space-y-6">
          {/* Program Effectiveness */}
          <Card>
            <CardHeader>
              <CardTitle>복지사업별 효과 분석</CardTitle>
              <CardDescription>수혜자 수, 만족도, 1인당 비용 비교</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={programEffectiveness}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="program" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="beneficiaries" fill="#3b82f6" name="수혜자 수" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#22c55e" strokeWidth={2} name="만족도" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Program Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{programEffectiveness.reduce((sum, p) => sum + p.beneficiaries, 0).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">총 수혜자</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {(programEffectiveness.reduce((sum, p) => sum + p.satisfaction, 0) / programEffectiveness.length).toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">평균 만족도</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{welfarePrograms.filter(p => p.status === 'active').length}</p>
                    <p className="text-sm text-muted-foreground">진행중 사업</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>예산 집행 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {welfarePrograms.slice(0, 5).map((program) => {
                  const used = program.currentBeneficiaries * program.supportAmount;
                  const progress = (used / program.budget) * 100;

                  return (
                    <div key={program.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{program.name}</span>
                        <span className="text-muted-foreground">
                          {(used / 100000000).toFixed(2)}억 / {(program.budget / 100000000).toFixed(2)}억원
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            progress >= 90 ? 'bg-red-500' :
                            progress >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-right">{progress.toFixed(1)}% 집행</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* AI Performance Radar */}
            <Card>
              <CardHeader>
                <CardTitle>AI 시스템 성과 지표</CardTitle>
                <CardDescription>각 지표별 달성률 (%)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={aiPerformance}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" className="text-xs" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="성과"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.5}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* AI Stats */}
            <Card>
              <CardHeader>
                <CardTitle>AI 발굴 성과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">523</p>
                    <p className="text-sm text-muted-foreground">AI 발굴 가구</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">92%</p>
                    <p className="text-sm text-muted-foreground">발굴 정확도</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-3xl font-bold text-purple-600">45</p>
                    <p className="text-sm text-muted-foreground">긴급 발굴</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-3xl font-bold text-orange-600">5.2일</p>
                    <p className="text-sm text-muted-foreground">평균 대응시간</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">AI 발굴 근거 분석</h4>
                  {[
                    { factor: '전력사용량 급감', percentage: 35 },
                    { factor: '요금 체납', percentage: 28 },
                    { factor: '단전 이력', percentage: 18 },
                    { factor: '복지변동', percentage: 12 },
                    { factor: '계절 위험', percentage: 7 },
                  ].map((item) => (
                    <div key={item.factor} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.factor}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Prediction Accuracy */}
          <Card>
            <CardHeader>
              <CardTitle>위험도 예측 정확도 추이</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { month: '1월', accuracy: 85, precision: 82, recall: 88 },
                    { month: '2월', accuracy: 86, precision: 84, recall: 87 },
                    { month: '3월', accuracy: 88, precision: 86, recall: 89 },
                    { month: '4월', accuracy: 87, precision: 85, recall: 88 },
                    { month: '5월', accuracy: 90, precision: 88, recall: 91 },
                    { month: '6월', accuracy: 92, precision: 90, recall: 93 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis domain={[75, 100]} className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="accuracy" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="정확도" />
                    <Area type="monotone" dataKey="precision" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="정밀도" />
                    <Area type="monotone" dataKey="recall" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} name="재현율" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteer" className="space-y-6">
          {/* Volunteer Impact */}
          <Card>
            <CardHeader>
              <CardTitle>봉사활동 효과 분석</CardTitle>
              <CardDescription>월별 방문 횟수, 봉사시간, 방문 가구 수</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={volunteerImpact}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="visits" fill="#3b82f6" name="방문 횟수" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="households" fill="#22c55e" name="방문 가구" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="hours" stroke="#a855f7" strokeWidth={2} name="봉사시간" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Volunteer Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{volunteers.length}</p>
                    <p className="text-sm text-muted-foreground">총 봉사자</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {volunteers.reduce((sum, v) => sum + v.totalHours, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">누적 봉사시간</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {volunteers.reduce((sum, v) => sum + v.totalVisits, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">누적 방문</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3">
                    <Heart className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {volunteers.filter(v => v.status === 'active').length}
                    </p>
                    <p className="text-sm text-muted-foreground">활동중</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Volunteer Distribution */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>봉사단 유형별 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '시니어봉사단', value: volunteers.filter(v => v.type === 'senior').length, color: '#a855f7' },
                          { name: '임직원봉사단', value: volunteers.filter(v => v.type === 'employee').length, color: '#3b82f6' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}명`}
                      >
                        {[{ color: '#a855f7' }, { color: '#3b82f6' }].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>지역별 봉사자 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={(() => {
                        const regionCounts: Record<string, number> = {};
                        volunteers.forEach(v => {
                          regionCounts[v.region] = (regionCounts[v.region] || 0) + 1;
                        });
                        return Object.entries(regionCounts)
                          .map(([region, count]) => ({ region, count }))
                          .sort((a, b) => b.count - a.count)
                          .slice(0, 6);
                      })()}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="region" type="category" width={60} className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
