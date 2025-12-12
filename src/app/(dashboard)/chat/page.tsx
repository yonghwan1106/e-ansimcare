'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatSkeleton } from '@/components/ui/loading-skeletons';
import { toast } from 'sonner';
import {
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  FileText,
  Heart,
  Phone,
  Clock,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Zap,
  Home,
  Flame,
  Snowflake,
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  options?: { label: string; value: string; icon?: React.ElementType }[];
  feedback?: 'positive' | 'negative' | null;
}

const quickActions = [
  { label: '복지사업 안내', value: 'welfare_info', icon: Heart },
  { label: '에너지바우처 신청', value: 'voucher_apply', icon: Zap },
  { label: '난방비 지원', value: 'heating_support', icon: Flame },
  { label: '냉방비 지원', value: 'cooling_support', icon: Snowflake },
  { label: '주거개선 지원', value: 'housing_support', icon: Home },
  { label: '상담원 연결', value: 'connect_agent', icon: Phone },
];

const botResponses: Record<string, { content: string; options?: { label: string; value: string }[] }> = {
  welfare_info: {
    content: `안녕하세요! E-안심케어 복지서비스 안내입니다. 😊

현재 이용 가능한 복지사업을 안내해 드릴게요:

🔥 **난방 지원**
- 연탄 나눔: 저소득 가구 대상 연탄 지원
- 난방유 지원: 유류비 지원 (최대 50만원)

❄️ **냉방 지원**
- 혹서기 냉방비: 여름철 전기요금 지원
- 선풍기/에어컨 지원

🏠 **주거개선**
- E-안심하우스: 노후주택 전기설비 무료 교체
- 단열 개선 지원

💳 **에너지바우처**
- 정부 에너지바우처 대상자 확인 및 신청 지원

어떤 사업에 대해 자세히 알고 싶으신가요?`,
    options: [
      { label: '에너지바우처 자격 확인', value: 'voucher_check' },
      { label: '난방비 지원 신청', value: 'heating_apply' },
      { label: '주거개선 신청', value: 'housing_apply' },
    ],
  },
  voucher_apply: {
    content: `에너지바우처 신청 안내입니다. 📋

**에너지바우처란?**
저소득층의 난방비 부담을 줄이기 위해 정부가 지원하는 바우처입니다.

**지원 대상**
- 기초생활수급자 (생계·의료·주거·교육급여 수급자)
- 차상위계층
- 위 대상 중 노인, 영유아, 장애인, 임산부 등이 포함된 가구

**지원 금액** (2024년 기준)
- 1인 가구: 122,200원
- 2인 가구: 152,000원
- 3인 이상: 185,500원

**신청 방법**
1. 주민센터 방문 신청
2. 복지로(bokjiro.go.kr) 온라인 신청
3. E-안심케어 앱을 통한 대리 신청

자격 확인을 도와드릴까요?`,
    options: [
      { label: '자격 확인하기', value: 'voucher_check' },
      { label: '신청 대행 요청', value: 'request_help' },
      { label: '다른 복지사업 보기', value: 'welfare_info' },
    ],
  },
  heating_support: {
    content: `난방비 지원 안내입니다. 🔥

**1. 연탄 나눔 사업**
- 대상: 저소득 독거노인, 기초생활수급자
- 내용: 연탄 1,000장 이내 무료 지원
- 신청: 주민센터 또는 한수원 고객센터

**2. 난방유 지원**
- 대상: 기초생활수급자, 차상위계층
- 지원금: 가구당 최대 50만원
- 기간: 매년 11월~익년 3월

**3. 도시가스 절감 요금 할인**
- 대상: 기초생활수급자, 차상위계층
- 혜택: 최대 36,000원/월 할인

신청을 도와드릴까요?`,
    options: [
      { label: '연탄 나눔 신청', value: 'coal_apply' },
      { label: '난방유 지원 신청', value: 'heating_oil_apply' },
      { label: '가스요금 할인 신청', value: 'gas_discount' },
    ],
  },
  cooling_support: {
    content: `냉방비 지원 안내입니다. ❄️

**1. 혹서기 냉방비 지원**
- 대상: 기초생활수급자, 차상위계층
- 지원금: 가구당 최대 20만원
- 기간: 매년 7월~8월

**2. 에어컨 지원**
- 대상: 취약계층 중 에어컨 미보유 가구
- 내용: 에어컨 설치 및 전기요금 지원

**3. 무더위쉼터 안내**
- 전국 무더위쉼터 위치 안내
- 가까운 쉼터 찾기 서비스

도움이 필요하신 사항을 선택해주세요.`,
    options: [
      { label: '냉방비 지원 신청', value: 'cooling_apply' },
      { label: '에어컨 지원 신청', value: 'ac_apply' },
      { label: '무더위쉼터 찾기', value: 'shelter_find' },
    ],
  },
  housing_support: {
    content: `주거개선 지원 안내입니다. 🏠

**E-안심하우스 사업**
한수원에서 운영하는 무료 주거개선 사업입니다.

**지원 내용**
- 노후 전기배선 교체
- LED 조명 설치
- 누전차단기 설치
- 전기화재 예방 점검

**지원 대상**
- 기초생활수급자
- 차상위계층
- 독거노인 가구
- 장애인 가구

**신청 방법**
1. 한수원 고객센터 (1588-0000)
2. E-안심케어 앱
3. 주민센터 연계

신청을 도와드릴까요?`,
    options: [
      { label: 'E-안심하우스 신청', value: 'house_apply' },
      { label: '시공 사례 보기', value: 'house_cases' },
      { label: '다른 지원 보기', value: 'welfare_info' },
    ],
  },
  connect_agent: {
    content: `상담원 연결을 원하시는군요. 📞

**상담 가능 시간**
- 평일: 09:00 ~ 18:00
- 토요일: 09:00 ~ 13:00
- 일요일/공휴일: 휴무

**연락처**
- 한수원 고객센터: 1588-0000
- 긴급 복지 상담: 129
- 에너지바우처 문의: 1600-3190

지금 바로 상담원 연결을 요청하시겠습니까?

(근무시간 외에는 콜백 예약이 가능합니다)`,
    options: [
      { label: '지금 연결하기', value: 'call_now' },
      { label: '콜백 예약하기', value: 'callback' },
      { label: '문자 상담하기', value: 'sms_consult' },
    ],
  },
  voucher_check: {
    content: `에너지바우처 자격 확인을 도와드릴게요. ✅

다음 조건에 해당하시면 신청 가능합니다:

**필수 조건**
☑️ 기초생활수급자 또는 차상위계층

**추가 조건 (1개 이상 해당)**
☑️ 만 65세 이상 노인
☑️ 만 6세 미만 영유아
☑️ 장애인 등록자
☑️ 임산부
☑️ 희귀/중증 질환자

**확인 방법**
1. 주민센터 방문 확인
2. 복지로(bokjiro.go.kr)에서 자격 조회
3. 건강보험공단 자격 확인서 발급

위 조건에 해당하시나요? 해당하신다면 바로 신청 도움을 드릴 수 있어요!`,
    options: [
      { label: '네, 해당됩니다', value: 'request_help' },
      { label: '잘 모르겠어요', value: 'connect_agent' },
      { label: '다른 복지 보기', value: 'welfare_info' },
    ],
  },
  request_help: {
    content: `신청 대행 서비스를 안내해 드릴게요. 🤝

E-안심케어에서는 복지서비스 신청이 어려운 분들을 위해 **대리 신청 서비스**를 운영하고 있습니다.

**서비스 내용**
- 복지서비스 자격 확인
- 필요 서류 안내 및 수합 지원
- 대리 신청서 작성 및 제출
- 진행 상황 안내

**신청 방법**
1. 아래 '대행 신청하기' 버튼 클릭
2. 기본 정보 입력 (성함, 연락처, 주소)
3. 담당자가 24시간 내 연락드림

**준비물**
- 신분증 사본
- 수급자 증명서 또는 차상위 확인서
- 주민등록등본

신청을 진행하시겠어요?`,
    options: [
      { label: '대행 신청하기', value: 'apply_agent' },
      { label: '상담원 연결', value: 'connect_agent' },
      { label: '처음으로', value: 'welfare_info' },
    ],
  },
  apply_agent: {
    content: `신청 대행 요청이 접수되었습니다! 🎉

**접수 번호**: EA-2024-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}

담당자가 영업일 기준 1일 이내에 연락드릴 예정입니다.

**진행 절차**
1️⃣ 담당자 배정 (1일 내)
2️⃣ 유선 상담 및 자격 확인
3️⃣ 서류 안내 및 수합
4️⃣ 대리 신청 진행
5️⃣ 결과 안내

기다려주셔서 감사합니다. 😊
다른 도움이 필요하시면 말씀해주세요!`,
    options: [
      { label: '다른 복지 보기', value: 'welfare_info' },
      { label: '상담원 연결', value: 'connect_agent' },
    ],
  },
  call_now: {
    content: `상담원 연결을 시도합니다... 📞

**한수원 고객센터: 1588-0000**

현재 상담 대기 인원: 약 2명
예상 대기 시간: 약 3분

☎️ 전화 연결 중...

(데모 버전에서는 실제 연결되지 않습니다)

상담이 필요하시면 위 번호로 직접 전화해주세요!`,
    options: [
      { label: '콜백 예약하기', value: 'callback' },
      { label: '다른 문의하기', value: 'welfare_info' },
    ],
  },
  callback: {
    content: `콜백 예약을 도와드릴게요. ⏰

원하시는 연락 시간대를 선택해주세요:

**오늘 가능 시간**
- 오전 (09:00 ~ 12:00)
- 오후 (14:00 ~ 18:00)

**내일 가능 시간**
- 오전 (09:00 ~ 12:00)
- 오후 (14:00 ~ 18:00)

연락처를 남겨주시면 선택하신 시간대에 상담원이 먼저 연락드립니다.

(데모 버전입니다)`,
    options: [
      { label: '오늘 오전', value: 'callback_confirm' },
      { label: '오늘 오후', value: 'callback_confirm' },
      { label: '내일 오전', value: 'callback_confirm' },
    ],
  },
  callback_confirm: {
    content: `콜백 예약이 완료되었습니다! ✅

선택하신 시간대에 상담원이 연락드릴 예정입니다.

**예약 정보**
- 예약 번호: CB-${Date.now().toString().slice(-6)}
- 연락 예정: 선택하신 시간대

더 도움이 필요하신 사항이 있으신가요?`,
    options: [
      { label: '복지사업 안내', value: 'welfare_info' },
      { label: '대화 종료', value: 'goodbye' },
    ],
  },
  goodbye: {
    content: `이용해 주셔서 감사합니다! 👋

E-안심케어는 에너지 취약계층의 따뜻한 겨울, 시원한 여름을 위해 항상 함께합니다.

**긴급 연락처**
- 한수원: 1588-0000
- 긴급복지: 129
- 에너지바우처: 1600-3190

언제든 다시 찾아주세요! 😊`,
    options: [
      { label: '새로운 상담 시작', value: 'welfare_info' },
    ],
  },
  emergency: {
    content: `긴급 지원이 필요하시군요! 🚨

**즉시 연락 가능한 긴급 연락처:**

📞 **긴급복지지원 콜센터**: 129
- 24시간 운영
- 위기 상황 상담 및 지원 연계

📞 **한수원 긴급 지원**: 1588-0000
- 긴급 에너지 지원 신청
- 단전 가구 긴급 지원

📞 **전기 안전 긴급 신고**: 1588-7500
- 전기 화재 위험
- 감전 사고

지금 어떤 상황이신가요?`,
    options: [
      { label: '전기/가스 단절됨', value: 'utility_cut' },
      { label: '난방 불가 상황', value: 'no_heating' },
      { label: '상담원 연결', value: 'connect_agent' },
    ],
  },
  utility_cut: {
    content: `전기/가스 단절 상황이시군요. 😥

**즉시 도움받을 수 있는 방법:**

1️⃣ **긴급복지지원** (129)
- 위기 상황 긴급 생계지원
- 의료/주거지원 연계

2️⃣ **한전 긴급 복전 신청** (123)
- 단전 가구 긴급 복전
- 요금 분할 납부 상담

3️⃣ **가스공사 긴급 지원** (1544-0999)
- 가스 요금 분할 납부
- 긴급 복구 지원

한수원 봉사단을 통한 긴급 방문 지원도 가능합니다.
담당자에게 바로 연결해드릴까요?`,
    options: [
      { label: '긴급 방문 요청', value: 'apply_agent' },
      { label: '상담원 연결', value: 'connect_agent' },
    ],
  },
  no_heating: {
    content: `난방이 안 되는 상황이시군요. 🥶

**긴급 난방 지원 방법:**

1️⃣ **긴급 연탄 지원**
- 한수원 시니어봉사단 긴급 배송
- 당일 지원 가능 (재고 상황에 따라)

2️⃣ **긴급 난방유 지원**
- 긴급복지지원제도 활용
- 최대 50만원 지원

3️⃣ **무더위쉼터 / 한파쉼터 이용**
- 가까운 쉼터 안내
- 임시 거처 지원

지금 바로 긴급 지원을 신청하시겠어요?`,
    options: [
      { label: '긴급 지원 신청', value: 'apply_agent' },
      { label: '쉼터 찾기', value: 'shelter_find' },
      { label: '상담원 연결', value: 'connect_agent' },
    ],
  },
  shelter_find: {
    content: `가까운 쉼터를 찾아드릴게요. 🏠

**전국 한파/무더위 쉼터 찾기**

현재 위치 기반으로 가까운 쉼터를 안내해 드릴 수 있어요.

**쉼터 종류**
- 한파쉼터: 동절기 (11월~3월)
- 무더위쉼터: 하절기 (6월~9월)

**이용 방법**
- 운영시간 내 자유롭게 이용
- 신분증 지참 권장
- 음식물 반입 불가 (일부 시설)

👉 행정안전부 재난안전포털(safekorea.go.kr)에서 가까운 쉼터 위치를 확인하실 수 있어요.

(데모 버전입니다)`,
    options: [
      { label: '다른 지원 보기', value: 'welfare_info' },
      { label: '상담원 연결', value: 'connect_agent' },
    ],
  },
  default: {
    content: `말씀해주신 내용을 이해했어요. 🤔

관련 정보를 찾아보겠습니다.
아래 메뉴에서 원하시는 서비스를 선택하시면 더 정확한 안내를 받으실 수 있어요:`,
    options: [
      { label: '복지사업 안내', value: 'welfare_info' },
      { label: '에너지바우처', value: 'voucher_apply' },
      { label: '긴급 지원', value: 'emergency' },
      { label: '상담원 연결', value: 'connect_agent' },
    ],
  },
};

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `안녕하세요! 👋 E-안심케어 AI 상담 도우미입니다.

에너지 복지서비스 관련 궁금하신 점을 물어봐 주세요.
24시간 언제든 도움을 드릴게요!

아래 버튼을 누르거나 직접 질문을 입력해주세요.`,
      timestamp: new Date(),
      options: quickActions.slice(0, 4).map(a => ({ label: a.label, value: a.value })),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 스크롤을 아래로
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (key: string) => {
    setIsTyping(true);

    setTimeout(() => {
      const response = botResponses[key] || botResponses.default;
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'bot',
          content: response.content,
          timestamp: new Date(),
          options: response.options,
          feedback: null,
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // 사용자 메시지 추가
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        content: inputValue,
        timestamp: new Date(),
      },
    ]);

    const query = inputValue.toLowerCase();
    setInputValue('');

    // 향상된 키워드 매칭
    let responseKey = 'default';

    // 긴급 상황 우선 처리
    if (query.includes('긴급') || query.includes('급해') || query.includes('위험') || query.includes('죽') || query.includes('살려')) {
      responseKey = 'emergency';
    } else if (query.includes('단전') || query.includes('전기 끊') || query.includes('가스 끊') || query.includes('단가스')) {
      responseKey = 'utility_cut';
    } else if (query.includes('춥') || query.includes('얼') || query.includes('난방 안') || query.includes('보일러 고장')) {
      responseKey = 'no_heating';
    } else if (query.includes('쉼터') || query.includes('대피')) {
      responseKey = 'shelter_find';
    }
    // 에너지바우처 관련
    else if (query.includes('에너지바우처') || query.includes('바우처')) {
      responseKey = 'voucher_apply';
    } else if (query.includes('자격') || query.includes('조건') || query.includes('대상자')) {
      responseKey = 'voucher_check';
    }
    // 난방 지원
    else if (query.includes('난방') || query.includes('연탄') || query.includes('난방유') || query.includes('가스비') || query.includes('보일러')) {
      responseKey = 'heating_support';
    }
    // 냉방 지원
    else if (query.includes('냉방') || query.includes('에어컨') || query.includes('선풍기') || query.includes('더워') || query.includes('무더위')) {
      responseKey = 'cooling_support';
    }
    // 주거개선
    else if (query.includes('주거') || query.includes('집') || query.includes('안심하우스') || query.includes('전기 공사') || query.includes('누전')) {
      responseKey = 'housing_support';
    }
    // 상담원 연결
    else if (query.includes('상담') || query.includes('전화') || query.includes('연결') || query.includes('사람')) {
      responseKey = 'connect_agent';
    }
    // 신청 관련
    else if (query.includes('신청') || query.includes('접수') || query.includes('등록')) {
      responseKey = 'request_help';
    }
    // 인사 처리
    else if (query.includes('안녕') || query.includes('하이') || query.includes('반가')) {
      responseKey = 'welfare_info';
    }
    // 감사 처리
    else if (query.includes('감사') || query.includes('고마') || query.includes('잘 됐')) {
      responseKey = 'goodbye';
    }
    // 복지 일반
    else if (query.includes('복지') || query.includes('지원') || query.includes('도움') || query.includes('혜택')) {
      responseKey = 'welfare_info';
    }

    addBotMessage(responseKey);
  };

  const handleOptionClick = (value: string) => {
    // 선택한 옵션을 사용자 메시지로 표시
    const option = quickActions.find(a => a.value === value) ||
      Object.values(botResponses).flatMap(r => r.options || []).find(o => o.value === value);

    if (option) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'user',
          content: option.label,
          timestamp: new Date(),
        },
      ]);
    }

    addBotMessage(value);
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );

    if (feedback === 'positive') {
      toast.success('피드백 감사합니다!', {
        description: '더 나은 서비스를 위해 노력하겠습니다.',
      });
    } else {
      toast.info('피드백을 보내주셔서 감사합니다', {
        description: '개선에 참고하겠습니다.',
      });
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: `안녕하세요! 👋 E-안심케어 AI 상담 도우미입니다.

에너지 복지서비스 관련 궁금하신 점을 물어봐 주세요.
24시간 언제든 도움을 드릴게요!

아래 버튼을 누르거나 직접 질문을 입력해주세요.`,
        timestamp: new Date(),
        options: quickActions.slice(0, 4).map(a => ({ label: a.label, value: a.value })),
      },
    ]);
    toast.info('대화가 초기화되었습니다');
  };

  if (isLoading) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Chat Area */}
      <Card className="flex flex-1 flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-green-500">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">E-안심케어 AI 상담</CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="flex h-2 w-2 rounded-full bg-green-500" />
                  24시간 상담 가능
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={message.type === 'bot' ? 'bg-primary/10' : 'bg-muted'}>
                      {message.type === 'bot' ? (
                        <Bot className="h-4 w-4 text-primary" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex max-w-[80%] flex-col gap-2 ${message.type === 'user' ? 'items-end' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === 'bot'
                          ? 'bg-muted rounded-tl-none'
                          : 'bg-primary text-primary-foreground rounded-tr-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>

                    {message.options && (
                      <div className="flex flex-wrap gap-2">
                        {message.options.map((option) => (
                          <Button
                            key={option.value}
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleOptionClick(option.value)}
                          >
                            {option.label}
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        ))}
                      </div>
                    )}

                    {message.type === 'bot' && message.id !== '1' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">도움이 되셨나요?</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 ${message.feedback === 'positive' ? 'text-green-600' : ''}`}
                          onClick={() => handleFeedback(message.id, 'positive')}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 ${message.feedback === 'negative' ? 'text-red-600' : ''}`}
                          onClick={() => handleFeedback(message.id, 'negative')}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl rounded-tl-none bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input */}
        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              ref={inputRef}
              placeholder="궁금한 점을 입력해주세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!inputValue.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Sidebar */}
      <div className="hidden w-80 space-y-4 lg:block">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              빠른 메뉴
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.value}
                variant="outline"
                className="justify-start gap-2"
                onClick={() => handleOptionClick(action.value)}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              자주 묻는 질문
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto py-2 px-3"
              onClick={() => {
                setInputValue('에너지바우처 자격 조건이 뭐예요?');
                inputRef.current?.focus();
              }}
            >
              <span className="text-sm">에너지바우처 자격 조건이 뭐예요?</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto py-2 px-3"
              onClick={() => {
                setInputValue('난방비 지원 신청 방법을 알려주세요');
                inputRef.current?.focus();
              }}
            >
              <span className="text-sm">난방비 지원 신청 방법을 알려주세요</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left h-auto py-2 px-3"
              onClick={() => {
                setInputValue('E-안심하우스가 뭐예요?');
                inputRef.current?.focus();
              }}
            >
              <span className="text-sm">E-안심하우스가 뭐예요?</span>
            </Button>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Phone className="h-4 w-4" />
              상담 연락처
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">한수원 고객센터</span>
              <span className="font-medium">1588-0000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">에너지바우처</span>
              <span className="font-medium">1600-3190</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">긴급복지</span>
              <span className="font-medium">129</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              평일 09:00 ~ 18:00
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
