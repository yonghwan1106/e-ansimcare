'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Search,
  Users,
  Clock,
  Calendar,
  Award,
  MapPin,
  Phone,
  Star,
  TrendingUp,
  Heart,
  ChevronRight,
  UserPlus,
  FileText,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { volunteers, activities } from '@/data/mock-data';

const typeLabels: Record<string, string> = {
  senior: '시니어봉사단',
  employee: '임직원봉사단',
};

const typeColors: Record<string, string> = {
  senior: 'bg-purple-100 text-purple-700',
  employee: 'bg-blue-100 text-blue-700',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
};

// 월별 활동 통계
const monthlyStats = [
  { month: '1월', visits: 45, hours: 135 },
  { month: '2월', visits: 52, hours: 156 },
  { month: '3월', visits: 48, hours: 144 },
  { month: '4월', visits: 61, hours: 183 },
  { month: '5월', visits: 73, hours: 219 },
  { month: '6월', visits: 68, hours: 204 },
];

// 봉사단 유형별 분포
const typeDistribution = [
  { name: '시니어봉사단', value: 150, color: '#a855f7' },
  { name: '임직원봉사단', value: 50, color: '#3b82f6' },
];

export default function VolunteerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(volunteers.map(v => v.region))];
    return uniqueRegions.sort();
  }, []);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      if (searchTerm &&
          !v.name.includes(searchTerm) &&
          !v.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (typeFilter !== 'all' && v.type !== typeFilter) return false;
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      if (regionFilter !== 'all' && v.region !== regionFilter) return false;
      return true;
    });
  }, [searchTerm, typeFilter, statusFilter, regionFilter]);

  const stats = useMemo(() => ({
    totalVolunteers: volunteers.length,
    activeVolunteers: volunteers.filter(v => v.status === 'active').length,
    totalHours: volunteers.reduce((sum, v) => sum + v.totalHours, 0),
    totalVisits: volunteers.reduce((sum, v) => sum + v.totalVisits, 0),
    seniorCount: volunteers.filter(v => v.type === 'senior').length,
    employeeCount: volunteers.filter(v => v.type === 'employee').length,
  }), []);

  // 최근 활동 (더미)
  const recentActivities = activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // 우수 봉사자 (시간 기준)
  const topVolunteers = [...volunteers]
    .sort((a, b) => b.totalHours - a.totalHours)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">봉사활동 관리</h1>
          <p className="text-muted-foreground">시니어봉사단과 임직원봉사단의 활동을 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/volunteer/schedule">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              일정 관리
            </Button>
          </Link>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            봉사자 등록
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
                <p className="text-sm text-muted-foreground">전체 봉사자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.activeVolunteers}</div>
                <p className="text-sm text-green-600/80">활동중 봉사자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.totalHours.toLocaleString()}</div>
                <p className="text-sm text-purple-600/80">누적 봉사시간</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.totalVisits.toLocaleString()}</div>
                <p className="text-sm text-orange-600/80">누적 방문횟수</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">월별 활동 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats}>
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
                  <Bar dataKey="visits" fill="#3b82f6" name="방문 횟수" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="hours" fill="#a855f7" name="봉사 시간" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">봉사단 구성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-6">
              {typeDistribution.map((item) => (
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

      {/* Tabs */}
      <Tabs defaultValue="volunteers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="volunteers">봉사자 목록</TabsTrigger>
          <TabsTrigger value="activities">최근 활동</TabsTrigger>
          <TabsTrigger value="top">우수 봉사자</TabsTrigger>
        </TabsList>

        <TabsContent value="volunteers" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="봉사자명, ID로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="봉사단 유형" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 유형</SelectItem>
                      <SelectItem value="senior">시니어봉사단</SelectItem>
                      <SelectItem value="employee">임직원봉사단</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="상태" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 상태</SelectItem>
                      <SelectItem value="active">활동중</SelectItem>
                      <SelectItem value="inactive">비활동</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="지역" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 지역</SelectItem>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volunteer Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>봉사자</TableHead>
                    <TableHead>봉사단</TableHead>
                    <TableHead>소속</TableHead>
                    <TableHead>지역</TableHead>
                    <TableHead>봉사시간</TableHead>
                    <TableHead>방문횟수</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">상세</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVolunteers.slice(0, 15).map((volunteer) => (
                    <TableRow key={volunteer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {volunteer.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{volunteer.name}</p>
                            <p className="text-xs text-muted-foreground">{volunteer.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeColors[volunteer.type]}>
                          {typeLabels[volunteer.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{volunteer.affiliation}</TableCell>
                      <TableCell className="text-sm">{volunteer.region}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{volunteer.totalHours}시간</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{volunteer.totalVisits}회</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[volunteer.status]}>
                          {volunteer.status === 'active' ? '활동중' : '비활동'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>최근 봉사활동 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const volunteer = volunteers.find(v => v.id === activity.volunteerId);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {volunteer?.name.slice(0, 2) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{volunteer?.name || '알 수 없음'}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.householdId} 방문 • {activity.activityType === 'visit' ? '정기 방문' :
                            activity.activityType === 'check' ? '안부 확인' :
                            activity.activityType === 'support' ? '지원 연계' : '기타'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{activity.duration}시간</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                우수 봉사자 (봉사시간 기준)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topVolunteers.map((volunteer, index) => (
                  <div
                    key={volunteer.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{volunteer.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={typeColors[volunteer.type]} variant="outline">
                            {typeLabels[volunteer.type]}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{volunteer.region}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-lg font-bold">{volunteer.totalHours}시간</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{volunteer.totalVisits}회 방문</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
