import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'AI 자동 발굴',
    description: '전력 사용 패턴, 체납 이력 등 6개 지표를 AI가 분석하여 위험 가구를 선제적으로 발굴합니다.',
  },
  {
    icon: Heart,
    title: '맞춤형 복지 연계',
    description: '가구 특성에 맞는 복지사업을 AI가 자동 추천하고, 원스톱으로 신청을 지원합니다.',
  },
  {
    icon: Users,
    title: '봉사활동 관리',
    description: '시니어봉사단과 임직원봉사단의 방문 일정을 체계적으로 관리하고 기록합니다.',
  },
  {
    icon: MessageSquare,
    title: 'AI 챗봇 상담',
    description: '24시간 AI 챗봇이 복지서비스를 안내하고 신청을 도와드립니다.',
  },
  {
    icon: BarChart3,
    title: '데이터 분석',
    description: '실시간 대시보드와 리포트로 사업 효과를 측정하고 의사결정을 지원합니다.',
  },
  {
    icon: Shield,
    title: '통합 관리',
    description: '발굴부터 지원까지 전 과정을 하나의 플랫폼에서 통합 관리합니다.',
  },
];

const stats = [
  { label: '발굴 가구', value: '523+', icon: Search },
  { label: '지원 완료', value: '312', icon: CheckCircle2 },
  { label: '봉사단원', value: '200+', icon: Users },
  { label: '월 방문', value: '150+', icon: Clock },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-green-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">E-안심케어</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              주요기능
            </Link>
            <Link href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              성과
            </Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              소개
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button>플랫폼 바로가기</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-green-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.1),transparent_50%)]" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>한국수력원자력 혁신 아이디어</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">
              <span className="gradient-text">AI가 먼저 찾아가는</span>
              <br />
              에너지 복지 플랫폼
            </h1>

            <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
              에너지 데이터 기반 취약계층 선제적 발굴,
              <br className="hidden sm:block" />
              맞춤형 복지서비스 원스톱 연계로 복지 사각지대 ZERO를 실현합니다.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 gradient-primary border-0">
                  대시보드 시작하기
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  AI 상담 체험
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="border-y bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">핵심 기능</h2>
            <p className="text-muted-foreground">
              AI 기술과 현장 네트워크의 융합으로 에너지 복지의 새로운 패러다임을 제시합니다.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="group relative overflow-hidden transition-all hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold">기존 방식 vs E-안심케어</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-destructive">기존 방식</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive" />
                      신청 기반 수동 발굴
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive" />
                      개별 사업 분산 운영
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive" />
                      사후 대응 중심
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive" />
                      수기 관리로 데이터 부정확
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive" />
                      복잡한 신청 절차
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-primary">E-안심케어</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      AI 기반 선제적 자동 발굴
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      원스톱 통합 플랫폼
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      예측 기반 선제 대응
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      데이터 기반 의사결정
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                      AI 챗봇 간편 신청
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold">기대 효과</h2>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border bg-card p-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <TrendingUp className="h-7 w-7 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">30%</div>
                <div className="text-sm text-muted-foreground">복지 사각지대 발굴률 증가</div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-7 w-7 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">90%</div>
                <div className="text-sm text-muted-foreground">지원 연계 완료율</div>
              </div>

              <div className="rounded-xl border bg-card p-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                  <Clock className="h-7 w-7 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600">7일</div>
                <div className="text-sm text-muted-foreground">평균 지원 소요 시간</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-green-500 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            지금 바로 E-안심케어를 체험해보세요
          </h2>
          <p className="mb-8 text-lg text-white/80">
            AI가 먼저 찾아가는 따뜻한 에너지 복지를 경험하세요.
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="gap-2">
              플랫폼 시작하기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-green-500">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">E-안심케어</span>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>제5회 한국수력원자력 2025 대국민 혁신 아이디어 공모전 출품작</p>
              <p className="mt-1">민생혁신 분야 | 제안자: 김현실</p>
            </div>

            <div className="text-sm text-muted-foreground">
              &copy; 2025 E-안심케어. 한국수력원자력
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
