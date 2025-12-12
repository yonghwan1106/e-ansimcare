'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HouseholdListSkeleton } from '@/components/ui/loading-skeletons';
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
  Search,
  Filter,
  AlertTriangle,
  ArrowUpDown,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { households } from '@/data/mock-data';

const ITEMS_PER_PAGE = 15;

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

const statusColors = {
  detected: 'bg-red-100 text-red-700',
  investigating: 'bg-blue-100 text-blue-700',
  connected: 'bg-purple-100 text-purple-700',
  supported: 'bg-green-100 text-green-700',
  monitoring: 'bg-gray-100 text-gray-700',
};

export default function DetectionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'riskScore' | 'detectedAt'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(households.map(h => h.region.sido))];
    return uniqueRegions.sort();
  }, []);

  const filteredHouseholds = useMemo(() => {
    return households
      .filter((h) => {
        if (searchTerm && !h.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !h.region.sigungu.includes(searchTerm) &&
            !h.region.dong.includes(searchTerm)) {
          return false;
        }
        if (riskFilter !== 'all' && h.riskLevel !== riskFilter) return false;
        if (statusFilter !== 'all' && h.status !== statusFilter) return false;
        if (regionFilter !== 'all' && h.region.sido !== regionFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const aVal = sortField === 'riskScore' ? a.riskScore : new Date(a.detectedAt).getTime();
        const bVal = sortField === 'riskScore' ? b.riskScore : new Date(b.detectedAt).getTime();
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
  }, [searchTerm, riskFilter, statusFilter, regionFilter, sortField, sortOrder]);

  const paginatedHouseholds = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHouseholds.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHouseholds, currentPage]);

  const totalPages = Math.ceil(filteredHouseholds.length / ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: filteredHouseholds.length,
    critical: filteredHouseholds.filter(h => h.riskLevel === 'critical').length,
    high: filteredHouseholds.filter(h => h.riskLevel === 'high').length,
    unconfirmed: filteredHouseholds.filter(h => h.status === 'detected').length,
  }), [filteredHouseholds]);

  const handleSort = (field: 'riskScore' | 'detectedAt') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return <HouseholdListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">AI 위험 발굴</h1>
        <p className="text-muted-foreground">AI가 분석한 에너지 취약 위험 가구 목록입니다.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">검색 결과</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <p className="text-sm text-red-600/80">긴급 가구</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
            <p className="text-sm text-orange-600/80">고위험 가구</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.unconfirmed}</div>
            <p className="text-sm text-blue-600/80">미확인 가구</p>
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
                placeholder="가구 ID, 지역으로 검색..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={riskFilter} onValueChange={(v) => { setRiskFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="위험등급" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 등급</SelectItem>
                  <SelectItem value="critical">긴급</SelectItem>
                  <SelectItem value="high">고위험</SelectItem>
                  <SelectItem value="medium">중위험</SelectItem>
                  <SelectItem value="low">관심</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="detected">미확인</SelectItem>
                  <SelectItem value="investigating">확인중</SelectItem>
                  <SelectItem value="connected">연계중</SelectItem>
                  <SelectItem value="supported">지원완료</SelectItem>
                  <SelectItem value="monitoring">모니터링</SelectItem>
                </SelectContent>
              </Select>

              <Select value={regionFilter} onValueChange={(v) => { setRegionFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="지역" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 지역</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region.replace(/특별시|광역시/g, '')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">가구 ID</TableHead>
                <TableHead>지역</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 -ml-3"
                    onClick={() => handleSort('riskScore')}
                  >
                    위험도
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>위험등급</TableHead>
                <TableHead>가구 특성</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 -ml-3"
                    onClick={() => handleSort('detectedAt')}
                  >
                    발굴일
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">상세</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHouseholds.map((household) => (
                <TableRow key={household.id}>
                  <TableCell className="font-medium">{household.id}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{household.region.sigungu}</p>
                      <p className="text-muted-foreground">{household.region.dong}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            household.riskScore >= 80 ? 'bg-red-500' :
                            household.riskScore >= 60 ? 'bg-orange-500' :
                            household.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${household.riskScore}%` }}
                        />
                      </div>
                      <span className="font-semibold">{household.riskScore}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={riskLevelColors[household.riskLevel]}>
                      {riskLevelLabels[household.riskLevel]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {household.characteristics.slice(0, 2).map((char) => (
                        <Badge key={char} variant="outline" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                      {household.characteristics.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{household.characteristics.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(household.detectedAt).toLocaleDateString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[household.status]}>
                      {statusLabels[household.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/detection/${household.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총 {filteredHouseholds.length}건 중 {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredHouseholds.length)}건 표시
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
