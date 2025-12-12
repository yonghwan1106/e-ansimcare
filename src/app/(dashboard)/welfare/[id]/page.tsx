'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Calendar,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Heart,
  Flame,
  Snowflake,
  Home,
  Zap,
  TrendingUp,
  Download,
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
} from 'recharts';
import { welfarePrograms, households } from '@/data/mock-data';

const categoryIcons: Record<string, React.ElementType> = {
  heating: Flame,
  cooling: Snowflake,
  housing: Home,
  voucher: Zap,
  emergency: Heart,
};

const categoryLabels: Record<string, string> = {
  heating: '난방지원',
  cooling: '냉방지원',
  housing: '주거개선',
  voucher: '에너지바우처',
  emergency: '긴급지원',
};

const categoryColors: Record<string, string> = {
  heating: 'bg-orange-100 text-orange-700 border-orange-200',
  cooling: 'bg-blue-100 text-blue-700 border-blue-200',
  housing: 'bg-green-100 text-green-700 border-green-200',
  voucher: 'bg-purple-100 text-purple-700 border-purple-200',
  emergency: 'bg-red-100 text-red-700 border-red-200',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  upcoming: 'bg-blue-100 text-blue-700',
  ended: 'bg-gray-100 text-gray-700',
};

const statusLabels: Record<string, string> = {
  active: '진행중',
  upcoming: '예정',
  ended: '종료',
};

// 월별 지원 현황 더미 데이터
const monthlySupport = [
  { month: '1월', applications: 45, approved: 42, completed: 40 },
  { month: '2월', applications: 52, approved: 48, completed: 45 },
  { month: '3월', applications: 38, approved: 35, completed: 33 },
  { month: '4월', applications: 61, approved: 58, completed: 55 },
  { month: '5월', applications: 73, approved: 70, completed: 68 },
  { month: '6월', applications: 55, approved: 52, completed: 50 },
];

// 지역별 수혜 현황
const regionalStats = [
  { region: '서울', count: 125 },
  { region: '경기', count: 98 },
  { region: '부산', count: 67 },
  { region: '대구', count: 45 },
  { region: '인천', count: 52 },
  { region: '광주', count: 38 },
];

export default function WelfareDetailPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.id as string;

  const program = welfarePrograms.find(p => p.id === programId);

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">사업을 찾을 수 없습니다</h2>
        <p className="text-muted-foreground">요청하신 복지사업 정보가 존재하지 않습니다.</p>
        <Button className="mt-4" onClick={() => router.push('/welfare')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const Icon = categoryIcons[program.category] || Heart;
  const progress = (program.currentBeneficiaries / program.maxBeneficiaries) * 100;
  const budgetUsed = (program.currentBeneficiaries * program.supportAmount);
  const budgetProgress = (budgetUsed / program.budget) * 100;

  // 해당 사업에 연계된 가구 (더미)
  const linkedHouseholds = households
    .filter(h => h.connectedPrograms.includes(program.id))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${categoryColors[program.category]?.split(' ')[0]} border`}>
              <Icon className={`h-6 w-6 ${categoryColors[program.category]?.split(' ')[1]}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{program.name}</h1>
              <p className="text-muted-foreground">{program.provider}</p>
            </div>
          </div>
        </div>
        <Badge className={`${statusColors[program.status]} px-3 py-1 text-sm`}>
          {statusLabels[program.status]}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{program.currentBeneficiaries.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">현재 수혜자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{progress.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">목표 달성률</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{(program.supportAmount / 10000).toLocaleString()}만원</p>
                <p className="text-sm text-muted-foreground">1인당 지원금</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.ceil((new Date(program.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일
                </p>
                <p className="text-sm text-muted-foreground">남은 기간</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>사업 개요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{program.description}</p>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">지원 대상</h4>
                  <div className="flex flex-wrap gap-1">
                    {program.eligibility.map((item, i) => (
                      <Badge key={i} variant="outline">{item}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">필요 서류</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {program.requiredDocuments.map((doc, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>월별 신청/승인 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlySupport}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
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
                      dataKey="applications"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="신청"
                    />
                    <Line
                      type="monotone"
                      dataKey="approved"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="승인"
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#a855f7"
                      strokeWidth={2}
                      name="완료"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Regional Stats */}
          <Card>
            <CardHeader>
              <CardTitle>지역별 수혜 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalStats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="region" type="category" width={50} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" name="수혜자 수" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Linked Households */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>연계 가구 목록</CardTitle>
              <Badge variant="secondary">{linkedHouseholds.length}가구</Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>가구 ID</TableHead>
                    <TableHead>지역</TableHead>
                    <TableHead>위험등급</TableHead>
                    <TableHead>연계일</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkedHouseholds.map((household) => (
                    <TableRow key={household.id}>
                      <TableCell className="font-medium">
                        <Link href={`/detection/${household.id}`} className="text-primary hover:underline">
                          {household.id}
                        </Link>
                      </TableCell>
                      <TableCell>{household.region.sigungu}</TableCell>
                      <TableCell>
                        <Badge variant={household.riskLevel === 'critical' || household.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                          {household.riskLevel === 'critical' ? '긴급' :
                           household.riskLevel === 'high' ? '고위험' :
                           household.riskLevel === 'medium' ? '중위험' : '관심'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(household.detectedAt).toLocaleDateString('ko-KR')}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">지원완료</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">사업 진행 현황</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>수혜자 달성률</span>
                  <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {program.currentBeneficiaries.toLocaleString()} / {program.maxBeneficiaries.toLocaleString()}명
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>예산 집행률</span>
                  <span className="font-medium">{budgetProgress.toFixed(1)}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {(budgetUsed / 100000000).toFixed(2)}억 / {(program.budget / 100000000).toFixed(2)}억원
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Period Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">사업 기간</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">시작일</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(program.startDate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">종료일</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(program.endDate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">담당 기관</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{program.provider}</p>
                  <p className="text-sm text-muted-foreground">제공 기관</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">1588-0000</p>
                  <p className="text-sm text-muted-foreground">문의 전화</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">welfare@khnp.co.kr</p>
                  <p className="text-sm text-muted-foreground">이메일</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Link href={`/welfare/apply?program=${program.id}`}>
              <Button className="w-full gap-2">
                <Heart className="h-4 w-4" />
                가구 연계 신청
              </Button>
            </Link>
            <Button variant="outline" className="w-full gap-2">
              <Download className="h-4 w-4" />
              사업 안내서 다운로드
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
