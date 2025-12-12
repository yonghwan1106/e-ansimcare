'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Search,
  Heart,
  Users,
  MessageSquare,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Shield,
  TrendingUp,
  Clock,
  AlertTriangle,
  Brain,
  FileCheck,
  Home,
  Phone,
  ChevronRight,
  Play,
  Sparkles,
  Target,
  Award,
  Building2,
  Flame,
  Snowflake,
  Quote,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: Brain,
    title: 'AI 자동 발굴',
    description: '전력 사용 패턴, 체납 이력 등 6개 지표를 AI가 분석하여 위험 가구를 선제적으로 발굴합니다.',
    color: 'from-blue-500 to-blue-600',
    stats: '92% 정확도',
  },
  {
    icon: Heart,
    title: '맞춤형 복지 연계',
    description: '가구 특성에 맞는 복지사업을 AI가 자동 추천하고, 원스톱으로 신청을 지원합니다.',
    color: 'from-pink-500 to-rose-600',
    stats: '89% 매칭률',
  },
  {
    icon: Users,
    title: '봉사활동 관리',
    description: '시니어봉사단과 임직원봉사단의 방문 일정을 체계적으로 관리하고 기록합니다.',
    color: 'from-purple-500 to-purple-600',
    stats: '200+ 봉사자',
  },
  {
    icon: MessageSquare,
    title: 'AI 챗봇 상담',
    description: '24시간 AI 챗봇이 복지서비스를 안내하고 신청을 도와드립니다.',
    color: 'from-green-500 to-emerald-600',
    stats: '24시간 운영',
  },
  {
    icon: BarChart3,
    title: '데이터 분석',
    description: '실시간 대시보드와 리포트로 사업 효과를 측정하고 의사결정을 지원합니다.',
    color: 'from-orange-500 to-amber-600',
    stats: '실시간 모니터링',
  },
  {
    icon: Shield,
    title: '통합 관리',
    description: '발굴부터 지원까지 전 과정을 하나의 플랫폼에서 통합 관리합니다.',
    color: 'from-cyan-500 to-teal-600',
    stats: '원스톱 서비스',
  },
];

const stats = [
  { label: 'AI 발굴 가구', value: 523, suffix: '+', icon: Search, color: 'text-blue-600' },
  { label: '지원 완료', value: 312, suffix: '건', icon: CheckCircle2, color: 'text-green-600' },
  { label: '등록 봉사자', value: 200, suffix: '+', icon: Users, color: 'text-purple-600' },
  { label: '월 평균 방문', value: 150, suffix: '회', icon: Clock, color: 'text-orange-600' },
];

const processSteps = [
  {
    step: 1,
    title: 'AI 위험 감지',
    description: '전력사용량 급감, 요금 체납 등 이상 징후를 AI가 자동 탐지',
    icon: AlertTriangle,
    color: 'bg-red-500',
  },
  {
    step: 2,
    title: '위험도 분석',
    description: '6개 위험 지표를 종합 분석하여 위험 등급 산정',
    icon: Brain,
    color: 'bg-orange-500',
  },
  {
    step: 3,
    title: '복지 매칭',
    description: '가구 특성에 맞는 최적의 복지사업 AI 추천',
    icon: Target,
    color: 'bg-blue-500',
  },
  {
    step: 4,
    title: '현장 방문',
    description: '봉사단이 직접 방문하여 안부 확인 및 지원 연계',
    icon: Home,
    color: 'bg-purple-500',
  },
  {
    step: 5,
    title: '지원 완료',
    description: '복지서비스 연계 완료 및 지속적 모니터링',
    icon: CheckCircle2,
    color: 'bg-green-500',
  },
];

const welfarePrograms = [
  { name: '연탄 나눔', icon: Flame, count: 245, color: 'bg-orange-100 text-orange-600' },
  { name: '난방유 지원', icon: Home, count: 156, color: 'bg-red-100 text-red-600' },
  { name: '냉방비 지원', icon: Snowflake, count: 134, color: 'bg-blue-100 text-blue-600' },
  { name: 'E-안심하우스', icon: Shield, count: 89, color: 'bg-green-100 text-green-600' },
];

const testimonials = [
  {
    quote: "혼자 사시는 어머니가 갑자기 전기를 안 쓰셔서 걱정했는데, E-안심케어에서 먼저 연락이 왔어요. 덕분에 빠르게 도움을 받을 수 있었습니다.",
    name: "김OO (보호자)",
    location: "경북 경주",
    program: "긴급 안부 확인",
  },
  {
    quote: "난방비가 부담되어 겨울에도 보일러를 못 틀었는데, 한수원에서 난방유를 지원해주셔서 따뜻하게 겨울을 보낼 수 있었어요.",
    name: "박OO (수혜자)",
    location: "부산 기장",
    program: "난방유 지원",
  },
  {
    quote: "노후된 전기 배선이 걱정이었는데 E-안심하우스로 무료로 교체받았어요. 이제 안심하고 생활할 수 있습니다.",
    name: "이OO (수혜자)",
    location: "전남 영광",
    program: "E-안심하우스",
  },
];

// 애니메이션 카운터
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0066B3] to-[#00A651] shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">E-안심케어</span>
              <span className="text-[10px] text-muted-foreground -mt-1">한국수력원자력</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              주요기능
            </Link>
            <Link href="#process" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              작동원리
            </Link>
            <Link href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              플랫폼 미리보기
            </Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              수혜 사례
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button className="bg-[#0066B3] hover:bg-[#004d8a]">플랫폼 바로가기</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0066B3]/5 via-background to-[#00A651]/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,102,179,0.1),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(0,166,81,0.1),transparent_40%)]" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-[#0066B3]/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 h-32 w-32 rounded-full bg-[#00A651]/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container relative mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0066B3]/20 bg-[#0066B3]/5 px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 text-[#0066B3]" />
                <span className="font-medium text-[#0066B3]">2025 한국수력원자력 혁신 아이디어 공모전</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-5xl xl:text-6xl">
                <span className="bg-gradient-to-r from-[#0066B3] to-[#00A651] bg-clip-text text-transparent">
                  AI가 먼저 찾아가는
                </span>
                <br />
                에너지 복지 플랫폼
              </h1>

              <p className="mb-8 text-lg text-muted-foreground lg:text-xl max-w-xl">
                에너지 데이터 기반 취약계층 <strong>선제적 발굴</strong>,
                맞춤형 복지서비스 <strong>원스톱 연계</strong>로
                <span className="text-[#0066B3] font-semibold"> 복지 사각지대 ZERO</span>를 실현합니다.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-[#0066B3] to-[#00A651] hover:opacity-90 shadow-lg">
                    <Play className="h-4 w-4" />
                    플랫폼 체험하기
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button size="lg" variant="outline" className="gap-2 border-[#0066B3]/30 hover:bg-[#0066B3]/5">
                    <MessageSquare className="h-4 w-4" />
                    AI 상담 체험
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Badge variant="secondary" className="gap-1 py-1.5">
                  <Building2 className="h-3 w-3" />
                  한국수력원자력
                </Badge>
                <Badge variant="secondary" className="gap-1 py-1.5">
                  <Shield className="h-3 w-3" />
                  AI 기반 자동 발굴
                </Badge>
                <Badge variant="secondary" className="gap-1 py-1.5">
                  <Award className="h-3 w-3" />
                  민생혁신 분야
                </Badge>
              </div>
            </div>

            {/* Right Content - Platform Preview */}
            <div className="relative">
              <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden">
                {/* Mock Dashboard */}
                <div className="bg-gradient-to-r from-[#0066B3] to-[#00A651] p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-white/30" />
                    <div className="h-3 w-3 rounded-full bg-white/30" />
                    <div className="h-3 w-3 rounded-full bg-white/30" />
                    <span className="ml-4 text-white/80 text-sm">E-안심케어 대시보드</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-blue-50 p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">523</div>
                      <div className="text-xs text-muted-foreground">발굴 가구</div>
                    </div>
                    <div className="rounded-lg bg-red-50 p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">45</div>
                      <div className="text-xs text-muted-foreground">긴급 가구</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">89%</div>
                      <div className="text-xs text-muted-foreground">지원 완료</div>
                    </div>
                  </div>

                  {/* Alert Card */}
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-red-100 p-1.5">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-800">AI 긴급 알림</p>
                        <p className="text-xs text-red-600">경북 경주 H-2847 가구 전력 사용량 85% 급감 감지</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">최근 활동</div>
                    {[
                      { action: '복지 연계 완료', id: 'H-1523', time: '방금 전' },
                      { action: '방문 일정 등록', id: 'H-2847', time: '5분 전' },
                      { action: '신규 가구 발굴', id: 'H-3912', time: '12분 전' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                        <span>{item.action} <span className="text-muted-foreground">({item.id})</span></span>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-4 top-1/4 rounded-xl border bg-card p-3 shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">지원 완료</p>
                    <p className="text-[10px] text-muted-foreground">난방유 50만원</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 rounded-xl border bg-card p-3 shadow-lg animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 p-1.5">
                    <Brain className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">AI 분석 중</p>
                    <p className="text-[10px] text-muted-foreground">위험도 92점</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-gradient-to-r from-[#0066B3]/5 to-[#00A651]/5 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
                <div className={`text-4xl font-bold ${stat.color}`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="mb-4 bg-[#0066B3]/10 text-[#0066B3] hover:bg-[#0066B3]/20">작동 원리</Badge>
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">AI가 어떻게 위험 가구를 찾아낼까요?</h2>
            <p className="text-muted-foreground">
              에너지 데이터 분석부터 복지 지원까지, 5단계 자동화 프로세스
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 -translate-y-1/2 hidden lg:block rounded-full" />

            <div className="grid gap-6 md:grid-cols-5">
              {processSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  <Card className="relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className={`absolute top-0 left-0 right-0 h-1 ${step.color}`} />
                    <CardContent className="p-6 pt-8 text-center">
                      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${step.color} text-white shadow-lg`}>
                        <step.icon className="h-7 w-7" />
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">STEP {step.step}</div>
                      <h3 className="mb-2 font-bold">{step.title}</h3>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < processSteps.length - 1 && (
                    <ChevronRight className="absolute top-1/2 -right-3 h-6 w-6 text-muted-foreground -translate-y-1/2 hidden lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="mb-4 bg-[#00A651]/10 text-[#00A651] hover:bg-[#00A651]/20">핵심 기능</Badge>
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">AI 기술과 현장의 만남</h2>
            <p className="text-muted-foreground">
              최첨단 AI 기술과 한수원의 사회공헌 네트워크가 만나 에너지 복지의 새로운 패러다임을 제시합니다.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="group relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-md`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">{feature.stats}</Badge>
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Demo Section */}
      <section id="demo" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="mb-4 bg-[#0066B3]/10 text-[#0066B3] hover:bg-[#0066B3]/20">플랫폼 미리보기</Badge>
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">한눈에 보는 E-안심케어</h2>
            <p className="text-muted-foreground">
              직관적인 대시보드로 복지 사각지대 현황을 실시간으로 모니터링합니다.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left - Welfare Programs */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-[#0066B3] to-[#0066B3]/80 p-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    연계 가능 복지사업
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  {welfarePrograms.map((program) => (
                    <div key={program.name} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 ${program.color}`}>
                          <program.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{program.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{program.count}명</div>
                        <div className="text-xs text-muted-foreground">수혜자</div>
                      </div>
                    </div>
                  ))}
                  <Link href="/welfare">
                    <Button variant="outline" className="w-full mt-2">
                      전체 복지사업 보기
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Right - AI Analysis */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-[#00A651] to-[#00A651]/80 p-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI 위험도 분석 예시
                  </h3>
                </div>
                <div className="p-6">
                  <div className="mb-4 p-4 rounded-lg border-2 border-red-200 bg-red-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">긴급</Badge>
                        <span className="font-semibold">H-2847 가구</span>
                      </div>
                      <div className="text-2xl font-bold text-red-600">92점</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">전력사용량 급감</span>
                        <span className="font-medium text-red-600">85% 감소</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">요금 체납</span>
                        <span className="font-medium text-red-600">3개월</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">가구 유형</span>
                        <span className="font-medium">독거노인</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-800">AI 분석 결과</p>
                        <p className="text-sm text-blue-600 mt-1">
                          "전력사용량이 전년 동기 대비 85% 급감하였고, 3개월간 요금 체납이 지속되고 있습니다.
                          독거노인 가구로서 긴급 안부 확인 및 난방 지원이 필요합니다."
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link href="/detection">
                    <Button className="w-full mt-4 bg-[#00A651] hover:bg-[#008a43]">
                      AI 발굴 현황 보기
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-[#0066B3]/5 to-[#00A651]/5">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge className="mb-4 bg-[#0066B3]/10 text-[#0066B3] hover:bg-[#0066B3]/20">수혜 사례</Badge>
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">실제 수혜자들의 이야기</h2>
            <p className="text-muted-foreground">
              E-안심케어를 통해 따뜻한 겨울을 보낸 분들의 생생한 후기입니다.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Card className="overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <Quote className="h-12 w-12 text-[#0066B3]/20 mb-6" />
                <p className="text-xl md:text-2xl text-foreground mb-8 leading-relaxed">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{testimonials[activeTestimonial].name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[activeTestimonial].location} | {testimonials[activeTestimonial].program}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          i === activeTestimonial ? 'bg-[#0066B3]' : 'bg-[#0066B3]/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold lg:text-4xl">기존 방식 vs E-안심케어</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    기존 방식
                  </h3>
                  <ul className="space-y-3">
                    {[
                      '신청 기반 수동 발굴',
                      '개별 사업 분산 운영',
                      '사후 대응 중심',
                      '수기 관리로 데이터 부정확',
                      '복잡한 신청 절차',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-bold text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    E-안심케어
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'AI 기반 선제적 자동 발굴',
                      '원스톱 통합 플랫폼',
                      '예측 기반 선제 대응',
                      '데이터 기반 의사결정',
                      'AI 챗봇 간편 신청',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Effects Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-[#00A651]/10 text-[#00A651] hover:bg-[#00A651]/20">기대 효과</Badge>
            <h2 className="mb-12 text-3xl font-bold lg:text-4xl">E-안심케어 도입 효과</h2>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-blue-200">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600">+30%</div>
                  <div className="mt-2 font-medium">복지 사각지대 발굴률</div>
                  <p className="mt-2 text-sm text-muted-foreground">AI 기반 선제적 발굴로 기존 대비 30% 더 많은 취약가구 발굴</p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-4xl font-bold text-green-600">90%</div>
                  <div className="mt-2 font-medium">지원 연계 완료율</div>
                  <p className="mt-2 text-sm text-muted-foreground">발굴된 가구 10명 중 9명이 실제 복지 지원 연계 완료</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-4xl font-bold text-orange-600">5일</div>
                  <div className="mt-2 font-medium">평균 지원 소요 시간</div>
                  <p className="mt-2 text-sm text-muted-foreground">발굴부터 지원까지 기존 2주에서 5일로 단축</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0066B3] to-[#00A651]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            지금 바로 E-안심케어를 체험해보세요
          </h2>
          <p className="mb-8 text-lg text-white/80 max-w-2xl mx-auto">
            AI가 먼저 찾아가는 따뜻한 에너지 복지, 한국수력원자력이 함께합니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                <Play className="h-4 w-4" />
                플랫폼 시작하기
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="gap-2 text-white border-white/30 hover:bg-white/10">
                <Phone className="h-4 w-4" />
                AI 상담 체험
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0066B3] to-[#00A651]">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold">E-안심케어</span>
                <span className="text-xs text-muted-foreground ml-2">AI 에너지 복지 플랫폼</span>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p className="font-medium">제5회 한국수력원자력 2025 대국민 혁신 아이디어 공모전</p>
              <p className="mt-1">민생혁신 분야 | 제안자: 김현실</p>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-1">
                <Building2 className="h-3 w-3" />
                한국수력원자력
              </Badge>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-xs text-muted-foreground">
            &copy; 2025 E-안심케어. 본 플랫폼은 공모전 시연용으로 제작되었습니다.
          </div>
        </div>
      </footer>
    </div>
  );
}
