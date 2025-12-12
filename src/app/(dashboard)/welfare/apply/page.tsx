'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Heart,
  User,
  Loader2,
} from 'lucide-react';
import { households, welfarePrograms } from '@/data/mock-data';

const steps = [
  { id: 1, title: '가구 선택', description: '연계할 가구를 선택합니다' },
  { id: 2, title: '사업 선택', description: '연계할 복지사업을 선택합니다' },
  { id: 3, title: '정보 확인', description: '신청 정보를 확인합니다' },
  { id: 4, title: '신청 완료', description: '신청이 완료되었습니다' },
];

function WelfareApplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProgram = searchParams.get('program');
  const preselectedHousehold = searchParams.get('household');

  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHousehold, setSelectedHousehold] = useState<string | null>(preselectedHousehold);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(
    preselectedProgram ? [preselectedProgram] : []
  );
  const [agreedTerms, setAgreedTerms] = useState(false);

  const filteredHouseholds = useMemo(() => {
    if (!searchTerm) return households.slice(0, 20);
    return households.filter(h =>
      h.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.region.sigungu.includes(searchTerm) ||
      h.region.dong.includes(searchTerm)
    ).slice(0, 20);
  }, [searchTerm]);

  const activePrograms = useMemo(() => {
    return welfarePrograms.filter(p => p.status === 'active');
  }, []);

  const selectedHouseholdData = households.find(h => h.id === selectedHousehold);
  const selectedProgramsData = welfarePrograms.filter(p => selectedPrograms.includes(p.id));

  const handleProgramToggle = (programId: string) => {
    setSelectedPrograms(prev =>
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedHousehold;
      case 2: return selectedPrograms.length > 0;
      case 3: return agreedTerms;
      default: return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // 실제로는 API 호출
    setCurrentStep(4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">복지서비스 연계 신청</h1>
          <p className="text-muted-foreground">에너지 취약가구에 맞춤형 복지사업을 연계합니다.</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                      currentStep > step.id
                        ? 'border-green-500 bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground hidden md:block">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-16 md:w-24 lg:w-32 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>연계 가구 선택</CardTitle>
            <CardDescription>복지서비스를 연계할 가구를 선택해주세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="가구 ID 또는 지역으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid gap-3 max-h-[400px] overflow-y-auto">
              {filteredHouseholds.map((household) => (
                <div
                  key={household.id}
                  onClick={() => setSelectedHousehold(household.id)}
                  className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-colors ${
                    selectedHousehold === household.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      household.riskLevel === 'critical' ? 'bg-red-100' :
                      household.riskLevel === 'high' ? 'bg-orange-100' :
                      household.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        household.riskLevel === 'critical' ? 'text-red-600' :
                        household.riskLevel === 'high' ? 'text-orange-600' :
                        household.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{household.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {household.region.sigungu} {household.region.dong}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold">{household.riskScore}점</p>
                      <div className="flex gap-1">
                        {household.characteristics.slice(0, 2).map((char) => (
                          <Badge key={char} variant="outline" className="text-xs">
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {selectedHousehold === household.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>복지사업 선택</CardTitle>
            <CardDescription>연계할 복지사업을 선택해주세요. 복수 선택이 가능합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedHouseholdData && (
              <div className="rounded-lg bg-muted/50 p-4 mb-4">
                <p className="text-sm text-muted-foreground">선택된 가구</p>
                <p className="font-medium">{selectedHouseholdData.id} - {selectedHouseholdData.region.sigungu} {selectedHouseholdData.region.dong}</p>
                <div className="flex gap-1 mt-1">
                  {selectedHouseholdData.characteristics.map((char) => (
                    <Badge key={char} variant="secondary" className="text-xs">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              {activePrograms.map((program) => {
                const isSelected = selectedPrograms.includes(program.id);
                // AI 추천 점수 (실제로는 계산 로직)
                const matchScore = Math.floor(Math.random() * 30) + 70;

                return (
                  <div
                    key={program.id}
                    onClick={() => handleProgramToggle(program.id)}
                    className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{program.name}</p>
                          {matchScore >= 85 && (
                            <Badge className="bg-green-100 text-green-700 text-xs">AI 추천</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {program.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{program.provider}</Badge>
                          <span className="text-sm font-medium text-primary">
                            {(program.supportAmount / 10000).toLocaleString()}만원
                          </span>
                        </div>
                      </div>
                      <Checkbox checked={isSelected} className="mt-1" />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${matchScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        매칭 {matchScore}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>신청 정보 확인</CardTitle>
              <CardDescription>입력하신 정보를 확인해주세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 가구 정보 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  가구 정보
                </h4>
                {selectedHouseholdData && (
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">가구 ID</span>
                      <span className="font-medium">{selectedHouseholdData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">주소</span>
                      <span>{selectedHouseholdData.region.sido} {selectedHouseholdData.region.sigungu} {selectedHouseholdData.region.dong}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">위험도</span>
                      <Badge variant={selectedHouseholdData.riskLevel === 'critical' || selectedHouseholdData.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                        {selectedHouseholdData.riskScore}점
                      </Badge>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-muted-foreground">가구 특성</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {selectedHouseholdData.characteristics.map((char) => (
                          <Badge key={char} variant="outline" className="text-xs">
                            {char}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 선택된 사업 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  선택된 복지사업 ({selectedProgramsData.length}건)
                </h4>
                <div className="space-y-2">
                  {selectedProgramsData.map((program) => (
                    <div key={program.id} className="rounded-lg border p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{program.name}</p>
                          <p className="text-sm text-muted-foreground">{program.provider}</p>
                        </div>
                        <span className="font-semibold text-primary">
                          {(program.supportAmount / 10000).toLocaleString()}만원
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 필요 서류 안내 */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  필요 서류
                </h4>
                <ul className="space-y-2">
                  {[...new Set(selectedProgramsData.flatMap(p => p.requiredDocuments))].map((doc, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>예상 지원 내역</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">총 예상 지원금</p>
                  <p className="text-3xl font-bold text-primary">
                    {(selectedProgramsData.reduce((sum, p) => sum + p.supportAmount, 0) / 10000).toLocaleString()}만원
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {selectedProgramsData.map((program) => (
                  <div key={program.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{program.name}</span>
                    <span>{(program.supportAmount / 10000).toLocaleString()}만원</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={agreedTerms}
                    onCheckedChange={(checked) => setAgreedTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                    개인정보 수집 및 이용에 동의합니다. 수집된 정보는 복지서비스 연계 목적으로만 사용됩니다.
                  </label>
                </div>
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">안내사항</p>
                    <p className="text-yellow-700 mt-1">
                      신청 후 담당자가 확인 후 연락드립니다. 필요 서류는 방문 시 지참해주세요.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 4 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">신청이 완료되었습니다</h2>
            <p className="mt-2 text-muted-foreground text-center">
              복지서비스 연계 신청이 정상적으로 접수되었습니다.<br />
              담당자 확인 후 3일 이내 연락드리겠습니다.
            </p>

            <div className="mt-6 rounded-lg bg-muted/50 p-4 w-full max-w-md">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">접수 번호</span>
                  <span className="font-medium">WF-2025-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">접수 일시</span>
                  <span>{new Date().toLocaleDateString('ko-KR')} {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">신청 사업</span>
                  <span>{selectedProgramsData.length}건</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={() => router.push('/welfare')}>
                복지사업 목록
              </Button>
              <Button onClick={() => router.push('/dashboard')}>
                대시보드로 이동
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {currentStep < 4 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            이전
          </Button>
          {currentStep < 3 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              다음
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed()}>
              신청 완료
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function WelfareApplyPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <WelfareApplyContent />
    </Suspense>
  );
}
