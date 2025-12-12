'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Users,
  Zap,
  Calendar,
  Phone,
  FileText,
  Heart,
  TrendingDown,
  Home,
  Flame,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { households, welfarePrograms } from '@/data/mock-data';

const riskLevelColors = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const riskLevelLabels = {
  critical: '긴급',
  high: '고위험',
  medium: '중위험',
  low: '관심',
};

const statusLabels = {
  detected: '미확인',
  investigating: '확인중',
  connected: '연계중',
  supported: '지원완료',
  monitoring: '모니터링',
};

export default function DetectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const household = useMemo(() => {
    return households.find(h => h.id === id);
  }, [id]);

  if (!household) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">가구를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-4">요청하신 가구 정보가 존재하지 않습니다.</p>
        <Link href="/detection">
          <Button>목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const radarData = [
    { factor: '전력 패턴', value: household.riskFactors.powerUsageAnomaly, fullMark: 100 },
    { factor: '요금 체납', value: household.riskFactors.paymentDelay, fullMark: 100 },
    { factor: '단전 이력', value: household.riskFactors.disconnectionHistory, fullMark: 100 },
    { factor: '복지 변동', value: household.riskFactors.welfareChange, fullMark: 100 },
    { factor: '가구 특성', value: household.riskFactors.householdRisk, fullMark: 100 },
    { factor: '계절 위험', value: household.riskFactors.seasonalRisk, fullMark: 100 },
  ];

  const recommendedPrograms = welfarePrograms
    .filter(p => p.status === 'active')
    .map(p => {
      let score = 50;
      // 간단한 매칭 로직
      if (household.heatingType === '연탄' && p.id === 'K001') score += 40;
      if (household.heatingType === '기름보일러' && p.id === 'K002') score += 40;
      if (household.characteristics.includes('독거노인')) score += 10;
      if (household.characteristics.includes('기초수급') && p.eligibility.includes('기초수급')) score += 20;
      return { ...p, matchScore: Math.min(score, 100) };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/detection">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{household.id}</h1>
            <Badge className={riskLevelColors[household.riskLevel]}>
              {riskLevelLabels[household.riskLevel]}
            </Badge>
            <Badge variant="outline">
              {statusLabels[household.status]}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {household.region.sido} {household.region.sigungu} {household.region.dong}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            연락하기
          </Button>
          <Button className="gap-2">
            <Heart className="h-4 w-4" />
            복지 연계
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                AI 위험도 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative">
                    <svg className="h-40 w-40 -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-muted"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * household.riskScore) / 100}
                        className={
                          household.riskScore >= 80 ? 'text-red-500' :
                          household.riskScore >= 60 ? 'text-orange-500' :
                          household.riskScore >= 40 ? 'text-yellow-500' : 'text-green-500'
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{household.riskScore}</span>
                      <span className="text-sm text-muted-foreground">위험도 점수</span>
                    </div>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="factor" className="text-xs" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                      <Radar
                        name="위험 요인"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid gap-4 md:grid-cols-3">
                {radarData.map((item) => (
                  <div key={item.factor} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.factor}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.value >= 70 ? 'bg-red-500' :
                            item.value >= 50 ? 'bg-orange-500' :
                            item.value >= 30 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Power Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                월별 전력 사용량
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={household.monthlyPowerUsage}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(value) => value.split('-')[1] + '월'}
                      className="text-xs"
                    />
                    <YAxis className="text-xs" unit="kWh" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value} kWh`, '사용량']}
                    />
                    <ReferenceLine
                      y={household.averageUsage}
                      stroke="#888"
                      strokeDasharray="5 5"
                      label={{ value: '평균', position: 'right', fill: '#888', fontSize: 12 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="usage"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">최근 3개월 사용량 감소 추세</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">평균:</span>
                  <span className="font-medium">{household.averageUsage} kWh</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support History */}
          {household.supportHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  지원 이력
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {household.supportHistory.map((support) => (
                    <div
                      key={support.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{support.programName}</p>
                        <p className="text-sm text-muted-foreground">{support.supportAmount}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={support.status === 'completed' ? 'default' : 'secondary'}>
                          {support.status === 'completed' ? '완료' : '진행중'}
                        </Badge>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(support.appliedAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Household Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">가구 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">거주지</p>
                  <p className="font-medium">{household.region.sigungu} {household.region.dong}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">가구원 수</p>
                  <p className="font-medium">{household.householdSize}인 가구</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Home className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">주거 유형</p>
                  <p className="font-medium">{household.housingType}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Flame className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">난방 유형</p>
                  <p className="font-medium">{household.heatingType}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">발굴일</p>
                  <p className="font-medium">{new Date(household.detectedAt).toLocaleDateString('ko-KR')}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">가구 특성</p>
                <div className="flex flex-wrap gap-2">
                  {household.characteristics.map((char) => (
                    <Badge key={char} variant="secondary">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5" />
                추천 복지사업
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendedPrograms.map((program) => (
                <div
                  key={program.id}
                  className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={program.provider === '한국수력원자력' ? 'default' : 'outline'}>
                      {program.provider === '한국수력원자력' ? '한수원' : program.provider.includes('부') ? '정부' : '지자체'}
                    </Badge>
                    <span className="text-sm font-medium text-primary">
                      적합도 {program.matchScore}%
                    </span>
                  </div>
                  <p className="font-medium">{program.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{program.description}</p>
                </div>
              ))}
              <Link href={`/welfare?household=${household.id}`}>
                <Button className="w-full mt-2">복지 연계 신청</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">빠른 조치</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                봉사단 방문 배정
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Phone className="h-4 w-4" />
                담당자 연락
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="h-4 w-4" />
                상담 기록 작성
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
