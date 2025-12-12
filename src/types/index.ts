// 지역 정보
export interface Region {
  sido: string;
  sigungu: string;
  dong: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// 위험 요인
export interface RiskFactors {
  powerUsageAnomaly: number;
  paymentDelay: number;
  disconnectionHistory: number;
  welfareChange: number;
  householdRisk: number;
  seasonalRisk: number;
}

// 지원 기록
export interface SupportRecord {
  id: string;
  programId: string;
  programName: string;
  status: 'applied' | 'reviewing' | 'approved' | 'delivered' | 'completed' | 'rejected';
  appliedAt: string;
  completedAt?: string;
  supportAmount: string;
  notes: string;
}

// 상담 기록
export interface Consultation {
  id: string;
  consultantId: string;
  consultantName: string;
  date: string;
  type: 'phone' | 'visit' | 'online';
  summary: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

// 가구
export interface Household {
  id: string;
  region: Region;
  riskScore: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  riskFactors: RiskFactors;
  characteristics: string[];
  householdSize: number;
  housingType: string;
  heatingType: string;
  monthlyPowerUsage: { month: string; usage: number }[];
  averageUsage: number;
  status: 'detected' | 'investigating' | 'connected' | 'supported' | 'monitoring';
  detectedAt: string;
  lastUpdated: string;
  assignedTo: string;
  assignedPowerPlant: string;
  supportHistory: SupportRecord[];
  consultations: Consultation[];
}

// 복지 사업
export interface WelfareProgram {
  id: string;
  name: string;
  category: 'khnp' | 'government' | 'local';
  description: string;
  detailedDescription: string;
  eligibility: {
    incomeLevel: string[];
    householdType: string[];
    housingType: string[];
    heatingType: string[];
    region: string[];
  };
  supportContent: string;
  supportAmount: string;
  applicationPeriod: {
    start: string;
    end: string;
  };
  applicationMethod: string;
  requiredDocuments: string[];
  isActive: boolean;
  remainingBudget: number;
}

// 봉사자
export interface Volunteer {
  id: string;
  name: string;
  type: 'senior' | 'employee';
  powerPlant: string;
  region: string[];
  contact: string;
  stats: {
    totalVisits: number;
    totalHours: number;
    thisMonthVisits: number;
    thisMonthHours: number;
  };
  isActive: boolean;
}

// 방문 활동
export interface VisitActivity {
  id: string;
  volunteerId: string;
  volunteerName: string;
  householdId: string;
  householdAddress: string;
  scheduledDate: string;
  actualDate?: string;
  visitType: 'welfare_check' | 'delivery' | 'inspection' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  checklist: {
    safetyCheck: boolean;
    itemDelivery: boolean;
    environmentCheck: boolean;
    consultation: boolean;
  };
  healthStatus?: 'good' | 'caution' | 'danger';
  notes: string;
  duration?: number;
  followUpRequired: boolean;
  followUpNotes?: string;
}

// 알림
export interface Alert {
  id: string;
  type: 'ai_detection' | 'urgent' | 'volunteer' | 'welfare' | 'system';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  householdId?: string;
  programId?: string;
  volunteerId?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

// 챗봇 메시지
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  quickReplies?: string[];
}

// 통계 데이터
export interface DashboardStats {
  totalHouseholds: number;
  newThisMonth: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  supported: number;
  inProgress: number;
  totalVolunteers: number;
  activeVolunteers: number;
  thisMonthVisits: number;
  thisMonthHours: number;
}

// 월별 추이 데이터
export interface MonthlyTrend {
  month: string;
  detected: number;
  supported: number;
  visits: number;
}

// 지역별 현황
export interface RegionStats {
  sido: string;
  total: number;
  highRisk: number;
  supported: number;
  coordinates: { lat: number; lng: number };
}
