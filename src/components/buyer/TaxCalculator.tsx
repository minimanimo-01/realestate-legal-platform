import { useState, useEffect } from 'react';
import { Calculator, Info, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface TaxInfo {
  id: string;
  type: string;
  title: string;
  description: string;
  displayOrder: number;
  updatedAt: string;
}

export function TaxCalculator() {
  const [propertyValue, setPropertyValue] = useState(400000000); // 4억원 기본값
  const [loading, setLoading] = useState(true);
  const [taxRates, setTaxRates] = useState<TaxInfo[]>([]);
  const [taxReductions, setTaxReductions] = useState<TaxInfo[]>([]);

  // Load tax info from database
  useEffect(() => {
    loadTaxInfo();
  }, []);

  const loadTaxInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210/tax-info`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.taxInfo) {
          const rates = data.taxInfo.filter((item: TaxInfo) => item.type === 'rate');
          const reductions = data.taxInfo.filter((item: TaxInfo) => item.type === 'reduction');
          
          setTaxRates(rates);
          setTaxReductions(reductions);
        }
      }
    } catch (error) {
      console.error('취득세 정보 불러오기 오류:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  // Default values if DB is empty
  const defaultRates = [
    { title: '6억원 이하', description: '1~3%' },
    { title: '6억원 초과 ~ 9억원 이하', description: '1~3%' },
    { title: '9억원 초과', description: '3%' },
  ];

  const defaultReductions = [
    { title: '생애최초 주택 구입', description: '취득세 최대 200만원 감면 (12억원 이하, 85㎡ 이하)' },
    { title: '다자녀 가구', description: '자녀 2명 이상 가구 취득세 50% 감면' },
    { title: '신혼부부', description: '일정 요건 충족 시 취득세 감면 가능' },
    { title: '1주택자', description: '조정대상지역 외 1주택 보유 시 기본세율 적용' },
  ];

  const displayRates = taxRates.length > 0 ? taxRates : defaultRates;
  const displayReductions = taxReductions.length > 0 ? taxReductions : defaultReductions;

  // 매매가액 범위 설정 (5천만원 ~ 10억)
  const minValue = 50000000; // 5천만원
  const maxValue = 1000000000; // 10억
  
  const formatCurrency = (value: number) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억원`;
    }
    return `${(value / 10000).toFixed(0)}만원`;
  };

  // 새로운 등기비용 계산 (주어진 데이터 기반)
  const calculateTotalCost = (value: number) => {
    // 데이터 포인트 정의
    const dataPoints = [
      { price: 50000000, cost: 1300000 },    // 5천만원
      { price: 60000000, cost: 1440000 },    // 6천만원
      { price: 70000000, cost: 1580000 },    // 7천만원
      { price: 80000000, cost: 1720000 },    // 8천만원
      { price: 90000000, cost: 1880000 },    // 9천만원
      { price: 100000000, cost: 2100000 },   // 1억원
      { price: 150000000, cost: 2900000 },   // 1억5천만원
      { price: 200000000, cost: 3600000 },   // 2억원
      { price: 250000000, cost: 4300000 },   // 2억5천만원
      { price: 300000000, cost: 5100000 },   // 3억원
      { price: 350000000, cost: 5800000 },   // 3억5천만원
      { price: 400000000, cost: 6500000 },   // 4억원
      { price: 450000000, cost: 7200000 },   // 4억5천만원
      { price: 500000000, cost: 7800000 },   // 5억원
      { price: 550000000, cost: 8600000 },   // 5억5천만원
      { price: 600000000, cost: 9600000 },   // 6억원
    ];

    // 정확히 일치하는 값이 있으면 반환
    const exactMatch = dataPoints.find(point => point.price === value);
    if (exactMatch) {
      return exactMatch.cost;
    }

    // 선형 보간법으로 계산
    for (let i = 0; i < dataPoints.length - 1; i++) {
      const lower = dataPoints[i];
      const upper = dataPoints[i + 1];
      
      if (value >= lower.price && value <= upper.price) {
        const ratio = (value - lower.price) / (upper.price - lower.price);
        const interpolatedCost = lower.cost + (upper.cost - lower.cost) * ratio;
        return Math.round(interpolatedCost);
      }
    }

    // 범위를 벗어난 경우
    if (value < dataPoints[0].price) {
      return dataPoints[0].cost;
    }
    return dataPoints[dataPoints.length - 1].cost;
  };

  const totalCost = calculateTotalCost(propertyValue);
  const isOver6억 = propertyValue > 600000000;

  const handleSliderChange = (values: number[]) => {
    setPropertyValue(values[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mt-4 mb-2 text-slate-900">취득세 / 등기비용 계산기</h2>
        <p className="text-slate-600">
          매매가액을 선택하면 대략적인 비용을 확인할 수 있습니다
        </p>
      </div>

      {/* Calculator Card */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50/50">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-blue-600" />
            비용 계산
          </CardTitle>
          <CardDescription>
            슬라이더를 움직여 매매가액을 선택하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Price Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>매매가액</Label>
              <div className="text-blue-600 px-4 py-2 bg-blue-50 rounded-lg">
                {formatCurrency(propertyValue)}
              </div>
            </div>
            
            <Slider
              value={[propertyValue]}
              onValueChange={handleSliderChange}
              min={minValue}
              max={maxValue}
              step={10000000}
              className="py-4"
            />
            
            <div className="flex justify-between text-xs text-slate-500">
              <span>5천만원</span>
              <span>10억원</span>
            </div>
          </div>

          <Separator />

          {/* Results */}
          <div className="space-y-4">
            {propertyValue <= 600000000 ? (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <span className="text-blue-900">총 예상 등기비용</span>
                <span className="text-blue-900">{formatCurrency(totalCost)}</span>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-900">
                    <p className="font-semibold mb-1">총 예상 등기비용</p>
                    <p>
                      매매가액 6억 초과 시 취득세율 변동으로 등기비용이 달라질 수 있습니다. 법무사 사무실로 문의주세요. 상세히 안내 드리겠습니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="mb-1">
                  ※ 위 금액은 <strong>대략적인 참고 값</strong>이며, 실제 금액과 다를 수 있습니다.
                </p>
                <p>
                  ※ 법무사 수수료, 인지대 등 추가 비용이 발생할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Rate Info */}
      <Card>
        <CardHeader>
          <CardTitle>취득세율 안내</CardTitle>
          <CardDescription>
            주택 가격 및 보유 주택 수에 따라 세율이 달라집니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayRates.map((rate, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-700">{rate.title}</span>
                <span className="text-slate-900">{rate.description}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            ※ 조정대상지역, 보유 주택 수 등에 따라 중과세율(8~12%)이 적용될 수 있습니다.
          </p>
        </CardContent>
      </Card>

      {/* Tax Reductions */}
      <Card>
        <CardHeader>
          <CardTitle>취득세 감면 사항</CardTitle>
          <CardDescription>
            해당 사항이 있으면 취득세를 감면받을 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {displayReductions.map((reduction, idx) => (
              <div key={idx} className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <h4 className="text-emerald-900 mb-2">{reduction.title}</h4>
                <p className="text-sm text-emerald-800">{reduction.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact CTA */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-slate-900">
              정확한 비용과 감면 여부가 궁금하신가요?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="gap-2" onClick={() => window.location.href = 'tel:010-9209-7693'}>
                <Phone className="size-4" />
                전화 문의하기
              </Button>
              <Button variant="outline" className="gap-2 bg-white" onClick={() => window.location.href = 'sms:010-9209-7693'}>
                <MessageSquare className="size-4" />
                문자 문의하기
              </Button>
            </div>
            <p className="text-sm text-slate-600">
              법무사 사무실: 031-365-3410 (평일 9:00~18:00)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
