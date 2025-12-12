'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { WelfareProgramsSkeleton } from '@/components/ui/loading-skeletons';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Heart,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building2,
  Flame,
  Snowflake,
  Sun,
  Zap,
  Home,
} from 'lucide-react';
import { welfarePrograms } from '@/data/mock-data';

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

export default function WelfarePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const providers = useMemo(() => {
    const uniqueProviders = [...new Set(welfarePrograms.map(p => p.provider))];
    return uniqueProviders.sort();
  }, []);

  const filteredPrograms = useMemo(() => {
    return welfarePrograms.filter((program) => {
      if (searchTerm &&
          !program.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !program.description.includes(searchTerm)) {
        return false;
      }
      if (categoryFilter !== 'all' && program.category !== categoryFilter) return false;
      if (providerFilter !== 'all' && program.provider !== providerFilter) return false;
      if (statusFilter !== 'all' && program.status !== statusFilter) return false;
      return true;
    });
  }, [searchTerm, categoryFilter, providerFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: welfarePrograms.length,
    active: welfarePrograms.filter(p => p.status === 'active').length,
    totalBudget: welfarePrograms.reduce((sum, p) => sum + p.budget, 0),
    totalBeneficiaries: welfarePrograms.reduce((sum, p) => sum + p.currentBeneficiaries, 0),
  }), []);

  if (isLoading) {
    return <WelfareProgramsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">복지서비스 연계</h1>
          <p className="text-muted-foreground">에너지 취약계층을 위한 복지사업을 관리하고 연계합니다.</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success('신규 연계 신청이 접수되었습니다', { description: '담당자가 검토 후 연락드리겠습니다.' })}>
          <Heart className="h-4 w-4" />
          신규 연계 신청
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-sm text-muted-foreground">전체 사업</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <p className="text-sm text-green-600/80">진행중 사업</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-2">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {(stats.totalBudget / 100000000).toFixed(1)}억
                </div>
                <p className="text-sm text-purple-600/80">총 예산</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-2">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.totalBeneficiaries.toLocaleString()}
                </div>
                <p className="text-sm text-orange-600/80">총 수혜자</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="사업명, 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="분야" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 분야</SelectItem>
                  <SelectItem value="heating">난방지원</SelectItem>
                  <SelectItem value="cooling">냉방지원</SelectItem>
                  <SelectItem value="housing">주거개선</SelectItem>
                  <SelectItem value="voucher">에너지바우처</SelectItem>
                  <SelectItem value="emergency">긴급지원</SelectItem>
                </SelectContent>
              </Select>

              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="제공기관" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 기관</SelectItem>
                  {providers.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="active">진행중</SelectItem>
                  <SelectItem value="upcoming">예정</SelectItem>
                  <SelectItem value="ended">종료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPrograms.map((program) => {
          const Icon = categoryIcons[program.category] || Heart;
          const progress = (program.currentBeneficiaries / program.maxBeneficiaries) * 100;

          return (
            <Card key={program.id} className="group transition-all hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-2 ${categoryColors[program.category]?.split(' ')[0]} border`}>
                    <Icon className={`h-5 w-5 ${categoryColors[program.category]?.split(' ')[1]}`} />
                  </div>
                  <Badge className={statusColors[program.status]}>
                    {statusLabels[program.status]}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-lg leading-tight">
                  {program.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {program.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className={categoryColors[program.category]}>
                    {categoryLabels[program.category]}
                  </Badge>
                  <Badge variant="outline">
                    {program.provider}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">수혜자 현황</span>
                    <span className="font-medium">
                      {program.currentBeneficiaries.toLocaleString()} / {program.maxBeneficiaries.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(program.startDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                      {' ~ '}
                      {new Date(program.endDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <span className="font-semibold text-primary">
                    {(program.supportAmount / 10000).toLocaleString()}만원
                  </span>
                </div>

                <Link href={`/welfare/${program.id}`}>
                  <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
                    상세보기
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPrograms.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">검색 결과가 없습니다</p>
            <p className="text-sm text-muted-foreground">다른 검색어나 필터를 시도해보세요.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
