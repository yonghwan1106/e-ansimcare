'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { volunteers, households, activities } from '@/data/mock-data';

// 더미 일정 데이터 생성
const generateSchedule = () => {
  const schedules = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // 이번 달의 일정들
  for (let i = 0; i < 30; i++) {
    const dayOffset = Math.floor(Math.random() * 28) + 1;
    const volunteer = volunteers[Math.floor(Math.random() * volunteers.length)];
    const household = households[Math.floor(Math.random() * households.length)];
    const hour = Math.floor(Math.random() * 6) + 9; // 9시 ~ 15시

    schedules.push({
      id: `SCH-${i.toString().padStart(4, '0')}`,
      date: new Date(year, month, dayOffset),
      time: `${hour.toString().padStart(2, '0')}:00`,
      volunteerId: volunteer.id,
      volunteerName: volunteer.name,
      volunteerType: volunteer.type,
      householdId: household.id,
      householdRegion: `${household.region.sigungu} ${household.region.dong}`,
      status: Math.random() > 0.3 ? 'scheduled' : Math.random() > 0.5 ? 'completed' : 'cancelled',
      duration: Math.floor(Math.random() * 3) + 1,
    });
  }

  return schedules;
};

const schedules = generateSchedule();

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  scheduled: '예정',
  completed: '완료',
  cancelled: '취소',
};

export default function SchedulePage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 달력 데이터 생성
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    // 이전 달 padding
    for (let i = 0; i < startPadding; i++) {
      const prevMonthDay = new Date(year, month, -startPadding + i + 1);
      days.push({ date: prevMonthDay, isCurrentMonth: false });
    }

    // 현재 달
    for (let i = 1; i <= totalDays; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // 다음 달 padding (6주 채우기)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  // 특정 날짜의 일정
  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(s =>
      s.date.getFullYear() === date.getFullYear() &&
      s.date.getMonth() === date.getMonth() &&
      s.date.getDate() === date.getDate()
    );
  };

  const selectedDateSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const isToday = (date: Date) =>
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  // 이번 주 일정
  const thisWeekSchedules = useMemo(() => {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return schedules.filter(s =>
      s.date >= startOfWeek && s.date < endOfWeek && s.status === 'scheduled'
    ).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">방문 일정 관리</h1>
          <p className="text-muted-foreground">봉사자 방문 일정을 관리하고 조회합니다.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              일정 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 방문 일정 추가</DialogTitle>
              <DialogDescription>
                봉사자 방문 일정을 등록합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>봉사자</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="봉사자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {volunteers.slice(0, 10).map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} ({v.type === 'senior' ? '시니어' : '임직원'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>방문 가구</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="가구 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {households.slice(0, 10).map((h) => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.id} - {h.region.sigungu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>날짜</Label>
                  <Input type="date" />
                </div>
                <div className="grid gap-2">
                  <Label>시간</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>예상 소요시간</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="시간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1시간</SelectItem>
                    <SelectItem value="2">2시간</SelectItem>
                    <SelectItem value="3">3시간</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">일정 추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{thisWeekSchedules.length}</p>
                <p className="text-sm text-muted-foreground">이번 주 예정</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {schedules.filter(s => s.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">이번 달 완료</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(schedules.map(s => s.volunteerId)).size}
                </p>
                <p className="text-sm text-muted-foreground">활동 봉사자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(schedules.map(s => s.householdId)).size}
                </p>
                <p className="text-sm text-muted-foreground">방문 가구</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {year}년 {month + 1}월
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                const daySchedules = getSchedulesForDate(day.date);
                const hasSchedules = daySchedules.length > 0;
                const isSelected = selectedDate &&
                  day.date.getFullYear() === selectedDate.getFullYear() &&
                  day.date.getMonth() === selectedDate.getMonth() &&
                  day.date.getDate() === selectedDate.getDate();

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day.date)}
                    className={`relative min-h-[80px] rounded-lg border p-2 text-left transition-colors ${
                      !day.isCurrentMonth
                        ? 'bg-muted/30 text-muted-foreground'
                        : isSelected
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    } ${isToday(day.date) ? 'ring-2 ring-primary' : ''}`}
                  >
                    <span className={`text-sm ${isToday(day.date) ? 'font-bold text-primary' : ''}`}>
                      {day.date.getDate()}
                    </span>
                    {hasSchedules && day.isCurrentMonth && (
                      <div className="mt-1 space-y-1">
                        {daySchedules.slice(0, 2).map((schedule) => (
                          <div
                            key={schedule.id}
                            className={`truncate rounded px-1 py-0.5 text-xs ${statusColors[schedule.status]}`}
                          >
                            {schedule.time} {schedule.volunteerName}
                          </div>
                        ))}
                        {daySchedules.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{daySchedules.length - 2}건 더
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details / Upcoming */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? (
                <>
                  {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 일정
                </>
              ) : (
                '이번 주 예정'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              selectedDateSchedules.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="rounded-lg border p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{schedule.time}</span>
                        </div>
                        <Badge className={statusColors[schedule.status]}>
                          {statusLabels[schedule.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {schedule.volunteerName.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{schedule.volunteerName}</span>
                        <Badge variant="outline" className="text-xs">
                          {schedule.volunteerType === 'senior' ? '시니어' : '임직원'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{schedule.householdId} - {schedule.householdRegion}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        예상 소요시간: {schedule.duration}시간
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">예정된 일정이 없습니다</p>
                </div>
              )
            ) : (
              <div className="space-y-3">
                {thisWeekSchedules.slice(0, 5).map((schedule) => (
                  <div
                    key={schedule.id}
                    className="rounded-lg border p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {schedule.date.getMonth() + 1}/{schedule.date.getDate()} {schedule.time}
                      </span>
                      <Badge className={statusColors[schedule.status]}>
                        {statusLabels[schedule.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {schedule.volunteerName.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{schedule.volunteerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{schedule.householdId}</span>
                    </div>
                  </div>
                ))}
                {thisWeekSchedules.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-muted-foreground">이번 주 예정된 일정이 없습니다</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
