import type {
  Household,
  WelfareProgram,
  Volunteer,
  VisitActivity,
  Alert,
  DashboardStats,
  MonthlyTrend,
  RegionStats,
} from '@/types';

// 지역 데이터
const regions = [
  { sido: '서울특별시', sigungu: '강남구', dong: '역삼동', lat: 37.5000, lng: 127.0364 },
  { sido: '서울특별시', sigungu: '강북구', dong: '수유동', lat: 37.6396, lng: 127.0257 },
  { sido: '서울특별시', sigungu: '노원구', dong: '상계동', lat: 37.6542, lng: 127.0568 },
  { sido: '부산광역시', sigungu: '북구', dong: '금곡동', lat: 35.1975, lng: 128.9900 },
  { sido: '부산광역시', sigungu: '사하구', dong: '다대동', lat: 35.0469, lng: 128.9664 },
  { sido: '부산광역시', sigungu: '해운대구', dong: '반여동', lat: 35.1798, lng: 129.1295 },
  { sido: '대구광역시', sigungu: '북구', dong: '침산동', lat: 35.8858, lng: 128.5829 },
  { sido: '대구광역시', sigungu: '서구', dong: '내당동', lat: 35.8686, lng: 128.5564 },
  { sido: '인천광역시', sigungu: '남동구', dong: '구월동', lat: 37.4503, lng: 126.7310 },
  { sido: '인천광역시', sigungu: '부평구', dong: '부평동', lat: 37.5074, lng: 126.7219 },
  { sido: '광주광역시', sigungu: '북구', dong: '오치동', lat: 35.1742, lng: 126.9122 },
  { sido: '광주광역시', sigungu: '광산구', dong: '수완동', lat: 35.1908, lng: 126.8172 },
  { sido: '대전광역시', sigungu: '유성구', dong: '봉명동', lat: 36.3620, lng: 127.3459 },
  { sido: '대전광역시', sigungu: '서구', dong: '둔산동', lat: 36.3515, lng: 127.3835 },
  { sido: '울산광역시', sigungu: '남구', dong: '달동', lat: 35.5384, lng: 129.3114 },
  { sido: '울산광역시', sigungu: '울주군', dong: '온산읍', lat: 35.4227, lng: 129.3488 },
  { sido: '경기도', sigungu: '수원시', dong: '영통동', lat: 37.2636, lng: 127.0286 },
  { sido: '경기도', sigungu: '성남시', dong: '분당동', lat: 37.3827, lng: 127.1195 },
  { sido: '경기도', sigungu: '고양시', dong: '일산동', lat: 37.6580, lng: 126.7734 },
  { sido: '경기도', sigungu: '용인시', dong: '기흥동', lat: 37.2747, lng: 127.1150 },
  { sido: '강원도', sigungu: '춘천시', dong: '효자동', lat: 37.8813, lng: 127.7298 },
  { sido: '강원도', sigungu: '원주시', dong: '무실동', lat: 37.3422, lng: 127.9200 },
  { sido: '충청북도', sigungu: '청주시', dong: '복대동', lat: 36.6358, lng: 127.4913 },
  { sido: '충청북도', sigungu: '충주시', dong: '연수동', lat: 36.9910, lng: 127.9259 },
  { sido: '충청남도', sigungu: '천안시', dong: '두정동', lat: 36.8324, lng: 127.1480 },
  { sido: '충청남도', sigungu: '아산시', dong: '배방읍', lat: 36.7806, lng: 127.0065 },
  { sido: '전라북도', sigungu: '전주시', dong: '효자동', lat: 35.7990, lng: 127.1081 },
  { sido: '전라북도', sigungu: '익산시', dong: '영등동', lat: 35.9583, lng: 126.9576 },
  { sido: '전라남도', sigungu: '여수시', dong: '여서동', lat: 34.7604, lng: 127.6622 },
  { sido: '전라남도', sigungu: '순천시', dong: '조례동', lat: 34.9506, lng: 127.4872 },
  { sido: '경상북도', sigungu: '경주시', dong: '황성동', lat: 35.8562, lng: 129.2246 },
  { sido: '경상북도', sigungu: '포항시', dong: '양덕동', lat: 36.0322, lng: 129.3650 },
  { sido: '경상남도', sigungu: '창원시', dong: '중앙동', lat: 35.2270, lng: 128.6811 },
  { sido: '경상남도', sigungu: '김해시', dong: '내외동', lat: 35.2342, lng: 128.8811 },
  { sido: '제주도', sigungu: '제주시', dong: '노형동', lat: 33.4890, lng: 126.4983 },
  { sido: '제주도', sigungu: '서귀포시', dong: '중문동', lat: 33.2541, lng: 126.4122 },
];

const characteristics = ['독거노인', '장애인', '기초수급', '차상위', '한부모', '조손가정', '다문화', '소년소녀가장'];
const housingTypes = ['단독주택', '다세대', '연립', '아파트', '옥탑방', '지하', '쪽방'];
const heatingTypes = ['도시가스', '기름보일러', '연탄', '전기', '심야전기'];
const powerPlants = ['고리원전', '한빛원전', '한울원전', '월성원전', '새울원전', '신고리원전'];

// 가구 데이터 생성 (500+)
function generateHouseholds(): Household[] {
  const households: Household[] = [];

  for (let i = 1; i <= 523; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const riskScore = Math.floor(Math.random() * 100);
    const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';

    const statuses: Household['status'][] = ['detected', 'investigating', 'connected', 'supported', 'monitoring'];
    const statusWeights = [0.15, 0.20, 0.15, 0.35, 0.15];
    let statusRand = Math.random();
    let statusIndex = 0;
    for (let j = 0; j < statusWeights.length; j++) {
      statusRand -= statusWeights[j];
      if (statusRand <= 0) {
        statusIndex = j;
        break;
      }
    }

    // 12개월 전력 사용량 생성
    const baseUsage = 150 + Math.random() * 200;
    const monthlyPowerUsage = [];
    for (let m = 11; m >= 0; m--) {
      const date = new Date();
      date.setMonth(date.getMonth() - m);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      // 위험 가구는 사용량 감소 추세
      const trend = riskScore > 60 ? -0.05 * (11 - m) : 0;
      const seasonal = Math.sin((date.getMonth() - 6) * Math.PI / 6) * 30; // 겨울/여름 변동
      const usage = Math.max(50, baseUsage * (1 + trend) + seasonal + (Math.random() - 0.5) * 40);
      monthlyPowerUsage.push({ month, usage: Math.round(usage) });
    }

    const numCharacteristics = 1 + Math.floor(Math.random() * 3);
    const selectedCharacteristics = [];
    const availableChars = [...characteristics];
    for (let c = 0; c < numCharacteristics; c++) {
      const idx = Math.floor(Math.random() * availableChars.length);
      selectedCharacteristics.push(availableChars.splice(idx, 1)[0]);
    }

    const detectedDate = new Date();
    detectedDate.setDate(detectedDate.getDate() - Math.floor(Math.random() * 180));

    const supportHistory = [];
    if (statuses[statusIndex] === 'supported' || statuses[statusIndex] === 'monitoring') {
      const numSupports = 1 + Math.floor(Math.random() * 3);
      for (let s = 0; s < numSupports; s++) {
        const supportDate = new Date(detectedDate);
        supportDate.setDate(supportDate.getDate() + Math.floor(Math.random() * 60));
        supportHistory.push({
          id: `SR-${i}-${s}`,
          programId: ['K001', 'K002', 'K003', 'K004', 'K005', 'G001', 'G002'][Math.floor(Math.random() * 7)],
          programName: ['연탄 나눔', '난방유 나눔', 'E-안심하우스', '냉방비 지원', '방한용품 지원', '에너지바우처', '긴급복지지원'][Math.floor(Math.random() * 7)],
          status: 'completed' as const,
          appliedAt: supportDate.toISOString().split('T')[0],
          completedAt: new Date(supportDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          supportAmount: ['연탄 1,500장', '난방유 300L', '창호 교체', '50,000원', '난방용품 세트', '295,200원', '생계비 지원'][Math.floor(Math.random() * 7)],
          notes: '정상 지원 완료',
        });
      }
    }

    households.push({
      id: `HH-${String(i).padStart(4, '0')}`,
      region: {
        sido: region.sido,
        sigungu: region.sigungu,
        dong: region.dong,
        coordinates: { lat: region.lat + (Math.random() - 0.5) * 0.02, lng: region.lng + (Math.random() - 0.5) * 0.02 },
      },
      riskScore,
      riskLevel,
      riskFactors: {
        powerUsageAnomaly: Math.floor(Math.random() * 100),
        paymentDelay: Math.floor(Math.random() * 100),
        disconnectionHistory: Math.floor(Math.random() * 100),
        welfareChange: Math.floor(Math.random() * 100),
        householdRisk: Math.floor(Math.random() * 100),
        seasonalRisk: Math.floor(Math.random() * 100),
      },
      characteristics: selectedCharacteristics,
      householdSize: 1 + Math.floor(Math.random() * 4),
      housingType: housingTypes[Math.floor(Math.random() * housingTypes.length)],
      heatingType: heatingTypes[Math.floor(Math.random() * heatingTypes.length)],
      monthlyPowerUsage,
      averageUsage: Math.round(monthlyPowerUsage.reduce((sum, m) => sum + m.usage, 0) / 12),
      status: statuses[statusIndex],
      detectedAt: detectedDate.toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      assignedTo: `USR-${String(1 + Math.floor(Math.random() * 50)).padStart(3, '0')}`,
      assignedPowerPlant: powerPlants[Math.floor(Math.random() * powerPlants.length)],
      supportHistory,
      consultations: [],
    });
  }

  return households;
}

// 복지 사업 데이터
export const welfarePrograms: WelfareProgram[] = [
  {
    id: 'K001',
    name: '연탄 나눔',
    category: 'khnp',
    description: '저소득 가구에 연탄을 지원하여 겨울철 난방비 부담을 경감합니다.',
    detailedDescription: '한수원이 밥상공동체 연탄은행과 함께 2019년부터 매년 진행하는 대표적인 에너지 복지사업입니다. 연탄 보일러를 사용하는 저소득 가구를 대상으로 가구당 최대 3,000장의 연탄을 무료로 지원합니다.',
    eligibility: {
      incomeLevel: ['기초수급', '차상위'],
      householdType: ['독거노인', '장애인', '한부모', '조손가정'],
      housingType: ['단독주택', '다세대', '연립'],
      heatingType: ['연탄'],
      region: ['전국'],
    },
    supportContent: '연탄 최대 3,000장',
    supportAmount: '약 60만원 상당',
    applicationPeriod: { start: '10-01', end: '03-31' },
    applicationMethod: '담당자 신청',
    requiredDocuments: ['수급자증명서', '주민등록등본'],
    isActive: true,
    remainingBudget: 65,
  },
  {
    id: 'K002',
    name: '난방유 나눔',
    category: 'khnp',
    description: '농어촌 지역 저소득 가구에 난방유를 지원합니다.',
    detailedDescription: '도시가스가 공급되지 않는 농어촌 지역의 기름보일러 사용 가구를 대상으로 난방유를 지원합니다. 2025년 계획 기준 전국 520가구에 총 10,000L를 지원 예정입니다.',
    eligibility: {
      incomeLevel: ['기초수급', '차상위'],
      householdType: ['독거노인', '장애인', '한부모'],
      housingType: ['단독주택'],
      heatingType: ['기름보일러'],
      region: ['농어촌'],
    },
    supportContent: '난방유 최대 500L',
    supportAmount: '약 80만원 상당',
    applicationPeriod: { start: '11-01', end: '02-28' },
    applicationMethod: '담당자 신청',
    requiredDocuments: ['수급자증명서', '주민등록등본', '난방유 사용 증빙'],
    isActive: true,
    remainingBudget: 72,
  },
  {
    id: 'K003',
    name: 'E-안심하우스',
    category: 'khnp',
    description: '노후 주택의 에너지 효율을 개선하는 주거 환경 개선 사업입니다.',
    detailedDescription: '쪽방촌 등 에너지 취약계층의 주거 에너지 효율을 개선하는 사업입니다. 창호 교체, 단열재 설치, 보일러 수리 등을 지원하여 난방비 절감과 쾌적한 주거환경을 제공합니다.',
    eligibility: {
      incomeLevel: ['기초수급', '차상위'],
      householdType: ['독거노인', '장애인', '한부모', '조손가정'],
      housingType: ['단독주택', '다세대', '연립', '쪽방'],
      heatingType: ['도시가스', '기름보일러', '연탄', '전기'],
      region: ['전국'],
    },
    supportContent: '창호 교체, 단열재 설치, 보일러 수리',
    supportAmount: '최대 200만원',
    applicationPeriod: { start: '01-01', end: '12-31' },
    applicationMethod: '현장 심사',
    requiredDocuments: ['수급자증명서', '주민등록등본', '주택 노후화 사진'],
    isActive: true,
    remainingBudget: 45,
  },
  {
    id: 'K004',
    name: '냉방비 지원',
    category: 'khnp',
    description: '혹서기 취약가구의 전기요금을 지원합니다.',
    detailedDescription: '여름철 폭염으로 인한 건강 위험을 예방하기 위해 에너지 취약가구의 냉방비를 지원합니다. 에어컨, 선풍기 등 냉방기기 사용에 따른 전기요금 부담을 경감합니다.',
    eligibility: {
      incomeLevel: ['기초수급', '차상위'],
      householdType: ['독거노인', '장애인', '영유아가구'],
      housingType: ['단독주택', '다세대', '연립', '아파트'],
      heatingType: ['전기'],
      region: ['전국'],
    },
    supportContent: '전기요금 지원',
    supportAmount: '최대 10만원',
    applicationPeriod: { start: '06-01', end: '08-31' },
    applicationMethod: '담당자 신청',
    requiredDocuments: ['수급자증명서', '전기요금 고지서'],
    isActive: false,
    remainingBudget: 0,
  },
  {
    id: 'K005',
    name: '방한용품 지원',
    category: 'khnp',
    description: '혹한기 취약가구에 난방용품 세트를 지원합니다.',
    detailedDescription: '겨울철 혹한으로부터 취약계층을 보호하기 위해 전기장판, 핫팩, 담요 등 방한용품 세트를 지원합니다. 약 100만원 상당의 물품을 지원합니다.',
    eligibility: {
      incomeLevel: ['기초수급', '차상위'],
      householdType: ['독거노인', '장애인', '한부모'],
      housingType: ['단독주택', '다세대', '연립', '쪽방'],
      heatingType: ['도시가스', '기름보일러', '연탄', '전기'],
      region: ['전국'],
    },
    supportContent: '전기장판, 핫팩, 담요 등 방한용품 세트',
    supportAmount: '약 100만원 상당',
    applicationPeriod: { start: '11-01', end: '01-31' },
    applicationMethod: '담당자 신청',
    requiredDocuments: ['수급자증명서', '주민등록등본'],
    isActive: true,
    remainingBudget: 58,
  },
  {
    id: 'G001',
    name: '에너지바우처',
    category: 'government',
    description: '저소득층의 전기, 가스, 난방 비용을 지원하는 정부 사업입니다.',
    detailedDescription: '산업통상자원부에서 시행하는 에너지 복지사업으로, 에너지 취약계층에게 전기, 도시가스, 지역난방, 등유, LPG, 연탄 구입비를 지원합니다. 2024년 기준 1인 가구 295,200원부터 4인 이상 가구 701,300원까지 지원됩니다.',
    eligibility: {
      incomeLevel: ['기초수급'],
      householdType: ['독거노인', '장애인', '영유아가구', '임산부', '한부모'],
      housingType: ['전체'],
      heatingType: ['전체'],
      region: ['전국'],
    },
    supportContent: '에너지 비용 바우처',
    supportAmount: '295,200원 ~ 701,300원',
    applicationPeriod: { start: '01-01', end: '12-31' },
    applicationMethod: '복지로 연계 신청',
    requiredDocuments: ['수급자증명서', '주민등록등본', '가구원특성 증빙'],
    isActive: true,
    remainingBudget: 100,
  },
  {
    id: 'G002',
    name: '긴급복지지원',
    category: 'government',
    description: '위기상황에 처한 저소득층에게 생계비, 의료비 등을 긴급 지원합니다.',
    detailedDescription: '갑작스러운 실직, 질병, 화재 등으로 위기상황에 처한 저소득층에게 생계비, 의료비, 주거비 등을 신속하게 지원하는 제도입니다. 신청 후 72시간 이내 지원 여부가 결정됩니다.',
    eligibility: {
      incomeLevel: ['기초수급', '차상위', '위기가구'],
      householdType: ['전체'],
      housingType: ['전체'],
      heatingType: ['전체'],
      region: ['전국'],
    },
    supportContent: '생계비, 의료비, 주거비 등',
    supportAmount: '생계비 최대 162만원',
    applicationPeriod: { start: '01-01', end: '12-31' },
    applicationMethod: '주민센터 연계',
    requiredDocuments: ['위기상황 증빙', '소득재산 증빙'],
    isActive: true,
    remainingBudget: 100,
  },
  {
    id: 'G003',
    name: '기초생활보장',
    category: 'government',
    description: '생활이 어려운 국민에게 생계, 의료, 주거, 교육 급여를 지원합니다.',
    detailedDescription: '국민기초생활보장제도에 따라 소득인정액이 기준 중위소득 일정 비율 이하인 가구에 생계급여, 의료급여, 주거급여, 교육급여를 지원합니다.',
    eligibility: {
      incomeLevel: ['기초수급 대상'],
      householdType: ['전체'],
      housingType: ['전체'],
      heatingType: ['전체'],
      region: ['전국'],
    },
    supportContent: '생계/의료/주거/교육 급여',
    supportAmount: '가구별 상이',
    applicationPeriod: { start: '01-01', end: '12-31' },
    applicationMethod: '주민센터 신청',
    requiredDocuments: ['소득재산 증빙', '가족관계증명서'],
    isActive: true,
    remainingBudget: 100,
  },
  {
    id: 'L001',
    name: '서울시 에너지취약계층 지원',
    category: 'local',
    description: '서울시 거주 에너지 취약계층에게 난방비를 추가 지원합니다.',
    detailedDescription: '서울시에서 자체적으로 운영하는 에너지 복지사업으로, 국가 에너지바우처 외에 추가로 난방비를 지원합니다.',
    eligibility: {
      incomeLevel: ['기초수급', '차상위'],
      householdType: ['독거노인', '장애인'],
      housingType: ['전체'],
      heatingType: ['전체'],
      region: ['서울특별시'],
    },
    supportContent: '난방비 추가 지원',
    supportAmount: '최대 20만원',
    applicationPeriod: { start: '11-01', end: '03-31' },
    applicationMethod: '동주민센터 신청',
    requiredDocuments: ['수급자증명서', '주민등록등본'],
    isActive: true,
    remainingBudget: 40,
  },
  {
    id: 'L002',
    name: '경북 사랑의 연탄나눔',
    category: 'local',
    description: '경상북도 저소득층에게 연탄을 지원합니다.',
    detailedDescription: '경상북도와 지역 기업이 함께하는 연탄 나눔 사업으로, 농촌 지역 독거노인 가구 등에 연탄을 지원합니다.',
    eligibility: {
      incomeLevel: ['기초수급', '차상위'],
      householdType: ['독거노인'],
      housingType: ['단독주택'],
      heatingType: ['연탄'],
      region: ['경상북도'],
    },
    supportContent: '연탄 지원',
    supportAmount: '연탄 2,000장',
    applicationPeriod: { start: '10-01', end: '02-28' },
    applicationMethod: '읍면동사무소 신청',
    requiredDocuments: ['수급자증명서', '주민등록등본'],
    isActive: true,
    remainingBudget: 55,
  },
];

// 봉사자 데이터 생성 (200+)
function generateVolunteers(): Volunteer[] {
  const volunteers: Volunteer[] = [];
  const names = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
  const firstNames = ['민수', '영희', '철수', '영호', '수진', '미영', '성호', '지연', '현우', '서연', '동훈', '유진', '재민', '소영', '준혁'];

  // 시니어봉사단 150명
  for (let i = 1; i <= 150; i++) {
    const name = names[Math.floor(Math.random() * names.length)] + firstNames[Math.floor(Math.random() * firstNames.length)];
    const regionList = regions.filter(() => Math.random() > 0.7).slice(0, 3);

    volunteers.push({
      id: `VOL-S-${String(i).padStart(3, '0')}`,
      name,
      type: 'senior',
      powerPlant: powerPlants[Math.floor(Math.random() * powerPlants.length)],
      region: regionList.map(r => r.sigungu),
      contact: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      stats: {
        totalVisits: 20 + Math.floor(Math.random() * 100),
        totalHours: 40 + Math.floor(Math.random() * 200),
        thisMonthVisits: Math.floor(Math.random() * 15),
        thisMonthHours: Math.floor(Math.random() * 30),
      },
      isActive: Math.random() > 0.1,
    });
  }

  // 임직원봉사단 50명
  for (let i = 1; i <= 50; i++) {
    const name = names[Math.floor(Math.random() * names.length)] + firstNames[Math.floor(Math.random() * firstNames.length)];
    const regionList = regions.filter(() => Math.random() > 0.7).slice(0, 2);

    volunteers.push({
      id: `VOL-E-${String(i).padStart(3, '0')}`,
      name,
      type: 'employee',
      powerPlant: powerPlants[Math.floor(Math.random() * powerPlants.length)],
      region: regionList.map(r => r.sigungu),
      contact: `010-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      stats: {
        totalVisits: 10 + Math.floor(Math.random() * 50),
        totalHours: 20 + Math.floor(Math.random() * 100),
        thisMonthVisits: Math.floor(Math.random() * 8),
        thisMonthHours: Math.floor(Math.random() * 16),
      },
      isActive: Math.random() > 0.05,
    });
  }

  return volunteers;
}

// 방문 활동 데이터 생성 (1000+)
function generateActivities(households: Household[], volunteers: Volunteer[]): VisitActivity[] {
  const activities: VisitActivity[] = [];
  const visitTypes: VisitActivity['visitType'][] = ['welfare_check', 'delivery', 'inspection', 'emergency'];
  const statuses: VisitActivity['status'][] = ['scheduled', 'completed', 'cancelled', 'rescheduled'];

  for (let i = 1; i <= 1050; i++) {
    const household = households[Math.floor(Math.random() * households.length)];
    const volunteer = volunteers[Math.floor(Math.random() * volunteers.length)];
    const visitDate = new Date();
    visitDate.setDate(visitDate.getDate() - Math.floor(Math.random() * 365));

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isCompleted = status === 'completed';

    activities.push({
      id: `ACT-${String(i).padStart(5, '0')}`,
      volunteerId: volunteer.id,
      volunteerName: volunteer.name,
      householdId: household.id,
      householdAddress: `${household.region.sido} ${household.region.sigungu} ${household.region.dong}`,
      scheduledDate: visitDate.toISOString().split('T')[0],
      actualDate: isCompleted ? visitDate.toISOString().split('T')[0] : undefined,
      visitType: visitTypes[Math.floor(Math.random() * visitTypes.length)],
      status,
      checklist: {
        safetyCheck: isCompleted ? Math.random() > 0.1 : false,
        itemDelivery: isCompleted ? Math.random() > 0.3 : false,
        environmentCheck: isCompleted ? Math.random() > 0.2 : false,
        consultation: isCompleted ? Math.random() > 0.4 : false,
      },
      healthStatus: isCompleted ? (['good', 'caution', 'danger'] as const)[Math.floor(Math.random() * 3)] : undefined,
      notes: isCompleted ? '방문 완료. 특이사항 없음.' : '',
      duration: isCompleted ? 30 + Math.floor(Math.random() * 60) : undefined,
      followUpRequired: isCompleted ? Math.random() > 0.7 : false,
      followUpNotes: isCompleted && Math.random() > 0.7 ? '다음 달 재방문 필요' : undefined,
    });
  }

  return activities;
}

// 알림 데이터 생성
function generateAlerts(households: Household[]): Alert[] {
  const alerts: Alert[] = [];
  const alertTemplates = [
    { type: 'ai_detection' as const, priority: 'high' as const, title: '고위험 가구 발굴', message: '에서 고위험 가구가 새로 발굴되었습니다.' },
    { type: 'ai_detection' as const, priority: 'medium' as const, title: '중위험 가구 발굴', message: '에서 중위험 가구가 발굴되었습니다.' },
    { type: 'urgent' as const, priority: 'critical' as const, title: '긴급 지원 필요', message: ' 가구에서 긴급 지원 요청이 접수되었습니다.' },
    { type: 'volunteer' as const, priority: 'medium' as const, title: '방문 일정 알림', message: '의 방문 예정일입니다.' },
    { type: 'welfare' as const, priority: 'low' as const, title: '복지 연계 완료', message: ' 가구의 복지 서비스 연계가 완료되었습니다.' },
    { type: 'system' as const, priority: 'low' as const, title: '시스템 알림', message: '주간 리포트가 생성되었습니다.' },
  ];

  for (let i = 1; i <= 100; i++) {
    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const household = households[Math.floor(Math.random() * households.length)];
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));

    alerts.push({
      id: `ALT-${String(i).padStart(4, '0')}`,
      type: template.type,
      priority: template.priority,
      title: template.title,
      message: `${household.region.sigungu} ${household.region.dong}${template.message}`,
      householdId: household.id,
      isRead: Math.random() > 0.3,
      createdAt: createdDate.toISOString(),
      readAt: Math.random() > 0.3 ? new Date().toISOString() : undefined,
    });
  }

  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// 데이터 생성 및 내보내기
export const households = generateHouseholds();
export const volunteers = generateVolunteers();
export const activities = generateActivities(households, volunteers);
export const alerts = generateAlerts(households);

// 대시보드 통계
export const dashboardStats: DashboardStats = {
  totalHouseholds: households.length,
  newThisMonth: households.filter(h => {
    const detected = new Date(h.detectedAt);
    const now = new Date();
    return detected.getMonth() === now.getMonth() && detected.getFullYear() === now.getFullYear();
  }).length,
  highRisk: households.filter(h => h.riskLevel === 'critical' || h.riskLevel === 'high').length,
  mediumRisk: households.filter(h => h.riskLevel === 'medium').length,
  lowRisk: households.filter(h => h.riskLevel === 'low').length,
  supported: households.filter(h => h.status === 'supported' || h.status === 'monitoring').length,
  inProgress: households.filter(h => h.status === 'investigating' || h.status === 'connected').length,
  totalVolunteers: volunteers.length,
  activeVolunteers: volunteers.filter(v => v.isActive).length,
  thisMonthVisits: activities.filter(a => {
    const date = new Date(a.scheduledDate);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && a.status === 'completed';
  }).length,
  thisMonthHours: Math.round(activities.filter(a => {
    const date = new Date(a.scheduledDate);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && a.status === 'completed';
  }).reduce((sum, a) => sum + (a.duration || 0), 0) / 60),
};

// 월별 추이 데이터
export const monthlyTrends: MonthlyTrend[] = Array.from({ length: 12 }, (_, i) => {
  const date = new Date();
  date.setMonth(date.getMonth() - (11 - i));
  const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

  return {
    month,
    detected: 30 + Math.floor(Math.random() * 30),
    supported: 25 + Math.floor(Math.random() * 25),
    visits: 60 + Math.floor(Math.random() * 50),
  };
});

// 지역별 현황
export const regionStats: RegionStats[] = [
  { sido: '서울특별시', total: 78, highRisk: 23, supported: 45, coordinates: { lat: 37.5665, lng: 126.9780 } },
  { sido: '부산광역시', total: 65, highRisk: 19, supported: 38, coordinates: { lat: 35.1796, lng: 129.0756 } },
  { sido: '대구광역시', total: 42, highRisk: 12, supported: 28, coordinates: { lat: 35.8714, lng: 128.6014 } },
  { sido: '인천광역시', total: 38, highRisk: 11, supported: 25, coordinates: { lat: 37.4563, lng: 126.7052 } },
  { sido: '광주광역시', total: 28, highRisk: 8, supported: 18, coordinates: { lat: 35.1595, lng: 126.8526 } },
  { sido: '대전광역시', total: 25, highRisk: 7, supported: 16, coordinates: { lat: 36.3504, lng: 127.3845 } },
  { sido: '울산광역시', total: 22, highRisk: 6, supported: 14, coordinates: { lat: 35.5384, lng: 129.3114 } },
  { sido: '경기도', total: 95, highRisk: 28, supported: 58, coordinates: { lat: 37.4138, lng: 127.5183 } },
  { sido: '강원도', total: 32, highRisk: 9, supported: 20, coordinates: { lat: 37.8228, lng: 128.1555 } },
  { sido: '충청북도', total: 28, highRisk: 8, supported: 18, coordinates: { lat: 36.6357, lng: 127.4912 } },
  { sido: '충청남도', total: 30, highRisk: 9, supported: 19, coordinates: { lat: 36.5184, lng: 126.8000 } },
  { sido: '전라북도', total: 35, highRisk: 10, supported: 22, coordinates: { lat: 35.7175, lng: 127.1530 } },
  { sido: '전라남도', total: 38, highRisk: 11, supported: 24, coordinates: { lat: 34.8679, lng: 126.9910 } },
  { sido: '경상북도', total: 45, highRisk: 13, supported: 28, coordinates: { lat: 36.0190, lng: 128.3930 } },
  { sido: '경상남도', total: 42, highRisk: 12, supported: 26, coordinates: { lat: 35.4606, lng: 128.2132 } },
  { sido: '제주도', total: 15, highRisk: 4, supported: 10, coordinates: { lat: 33.4890, lng: 126.4983 } },
];
