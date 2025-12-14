import { useState } from 'react';
import { TrendingDown, TrendingUp, Minus, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import type { BankRate } from '../../App';

interface BankRateComparisonProps {
  bankRates: {
    tier1: BankRate[];
    tier2: BankRate[];
  };
}

export function BankRateComparison({ bankRates }: BankRateComparisonProps) {
  const [activeTab, setActiveTab] = useState('tier1');

  // Get the most recent update date from all bank rates
  const getLatestUpdateDate = () => {
    const allRates = [...bankRates.tier1, ...bankRates.tier2];
    if (allRates.length === 0) return '업데이트 정보 없음';
    
    const latestDate = allRates.reduce((latest, rate) => {
      if (!rate.updatedAt) return latest;
      return rate.updatedAt > latest ? rate.updatedAt : latest;
    }, allRates[0]?.updatedAt || '');
    
    if (!latestDate) return '업데이트 정보 없음';
    
    // Format date as YYYY년 MM월 DD일
    const [year, month, day] = latestDate.split('-');
    return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
  };

  const getRateChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = current - previous;
    return change;
  };

  const RateChangeIndicator = ({ current, previous }: { current: number; previous?: number }) => {
    const change = getRateChange(current, previous);
    
    if (change === null || change === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-slate-500">
          <Minus className="size-3" />
        </span>
      );
    }
    
    if (change > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-red-600">
          <TrendingUp className="size-3" />
          <span className="text-xs">+{change.toFixed(2)}%</span>
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 text-blue-600">
        <TrendingDown className="size-3" />
        <span className="text-xs">{change.toFixed(2)}%</span>
      </span>
    );
  };

  const RateTable = ({ rates }: { rates: BankRate[] }) => (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="min-w-[100px]">은행</TableHead>
            <TableHead className="text-center min-w-[80px]">최저 금리</TableHead>
            <TableHead className="text-center min-w-[80px]">최고 금리</TableHead>
            <TableHead className="text-center hidden md:table-cell min-w-[120px]">전월 대비</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rates.map((rate) => (
            <TableRow key={rate.id}>
              <TableCell className="whitespace-nowrap">{rate.bankName}</TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="whitespace-nowrap">{rate.minRate}%</span>
                  <div className="md:hidden">
                    <RateChangeIndicator 
                      current={rate.minRate} 
                      previous={rate.lastMonthMin} 
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="whitespace-nowrap">{rate.maxRate}%</span>
                  <div className="md:hidden">
                    <RateChangeIndicator 
                      current={rate.maxRate} 
                      previous={rate.lastMonthMax} 
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                <div className="flex items-center justify-center gap-3">
                  <RateChangeIndicator 
                    current={rate.minRate} 
                    previous={rate.lastMonthMin} 
                  />
                  <span className="text-slate-300">|</span>
                  <RateChangeIndicator 
                    current={rate.maxRate} 
                    previous={rate.lastMonthMax} 
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2 text-[#1A2B4B]">은행별 금리 비교표</h2>
        <p className="text-[#64748B]">
          주요 담보대출 금리 정보를 매 월 업데이트합니다. 
        </p>
      </div>

      {/* Update Info */}
      <Card className="bg-[#F1F5F9] border-[#E2E8F0]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm text-[#475569]">
            <Calendar className="size-4" />
            <span>최근 업데이트: {getLatestUpdateDate()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid bg-white">
          <TabsTrigger value="tier1" className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">1금융권</TabsTrigger>
          <TabsTrigger value="tier2" className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">2금융권</TabsTrigger>
        </TabsList>

        <TabsContent value="tier1" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1A2B4B]">1금융권 은행</CardTitle>
              <CardDescription className="text-[#64748B]">
                시중 은행의 주택담보대출 금리
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RateTable rates={bankRates.tier1} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tier2" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1A2B4B]">2금융권</CardTitle>
              <CardDescription className="text-[#64748B]">
                상호금융 및 지역금고의 주택담보대출 금리
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RateTable rates={bankRates.tier2} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-[#EEF2FF] border-[#C7D2FE]">
          <CardContent className="pt-6">
            <p className="text-sm text-[#4F46E5]">
              💡 <strong>참고사항:</strong> 실제 적용 금리는 개인 신용도, 담보 비율(LTV), 
              대출 기간 등에 따라 달라질 수 있습니다.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-900">
              📊 <strong>금리 변동:</strong> 
              <TrendingUp className="size-3 inline mx-1 text-red-600" />
              상승,
              <TrendingDown className="size-3 inline mx-1 text-[#2563EB]" />
              하락,
              <Minus className="size-3 inline mx-1 text-[#64748B]" />
              변동 없음을 의미합니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="border-[#E2E8F0]">
        <CardContent className="pt-6">
          <p className="text-xs text-[#64748B]">
            ※ 본 금리표는 참고용이며, 정확한 금리는 각 금융기관에 직접 문의하시기 바랍니다.<br />
            ※ 금리는 시장 상황에 따라 수시로 변동될 수 있습니다.<br />
            ※ 대출 상담이 필요하신 경우 법무사 사무실로 연락주시면 금융기관 연계를 도와드립니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}