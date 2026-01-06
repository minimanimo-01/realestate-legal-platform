import { Building2, Users, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { UserType } from '../App';

interface HomeProps {
  onSelectCategory: (category: UserType) => void;
}

export function Home({ onSelectCategory }: HomeProps) {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="size-10 flex items-center justify-center">
              <ImageWithFallback
                src="/logo.png"
                alt="다온 법무사사무소"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-[#1A2B4B] text-lg">다온 법무사사무소</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section - Single Column Layout */}
        <div className="mb-8">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 p-6 flex items-center min-h-[140px]">
            <div className="flex items-center gap-6 w-full">
              <div className="size-20 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <ImageWithFallback
                  src="/logo.png"
                  alt="다온 법무사사무소"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-[#1A2B4B] mb-2">김민식 과장</h2>
                <p className="text-[#1A2B4B]/70 text-sm leading-relaxed">
                  복잡한 법률 서류와 등기 절차, 이제 전문가에게 맡기세요.
                  <br />
                  최신 법률을 완벽히 이해하는 사무장이 가장 빠르고 정확한 솔루션을 제시합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#1A2B4B]">이용하실 서비스를 선택해주세요</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Real Estate Agent Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-white group min-h-[320px] flex flex-col"
            >
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="size-16 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
                    <Building2 className="size-8 text-[#4F46E5]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#1A2B4B] mb-1">부동산 사장님</h4>
                    <p className="text-xs text-[#64748B]">중개업소 전용 서비스</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-[#475569]">
                    <div className="size-1.5 rounded-full bg-[#4F46E5]"></div>
                    <span>최신 법률 및 제도 안내</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#475569]">
                    <div className="size-1.5 rounded-full bg-[#4F46E5]"></div>
                    <span>각종 신청서 및 서류 다운로드</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#475569]">
                    <div className="size-1.5 rounded-full bg-[#4F46E5]"></div>
                    <span>은행별 금리 비교표</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-6"
                  onClick={() => onSelectCategory('agent')}
                >
                  접속하기
                </Button>
              </CardContent>
            </Card>

            {/* Buyer Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-white group min-h-[320px] flex flex-col"
            >
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="size-16 rounded-xl bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                    <Users className="size-8 text-[#2563EB]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#1A2B4B] mb-1">매수인/매도인</h4>
                    <p className="text-xs text-[#64748B]">일반 고객 전용 서비스</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-[#475569]">
                    <div className="size-1.5 rounded-full bg-[#2563EB]"></div>
                    <span>등기 필요 서류 안내</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#475569]">
                    <div className="size-1.5 rounded-full bg-[#2563EB]"></div>
                    <span>취득세 및 등기비용 계산</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#475569]">
                    <div className="size-1.5 rounded-full bg-[#2563EB]"></div>
                    <span>대출 상담 서비스</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-6"
                  onClick={() => onSelectCategory('buyer')}
                >
                  접속하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Office Information */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#1A2B4B]">사무소 안내</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Office Card */}
            <Card className="border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-lg flex items-center justify-center">
                    <ImageWithFallback
                      src="/logo.png"
                      alt="로고"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-[#1A2B4B] text-xs">다온 법무사사무소</h4>
                    <p className="text-[12px] text-[#64748B]">법무사 손일환·오광현</p>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 text-xs">
                  <span className="text-[#4F46E5] text-[10px]">📍</span>
                  <p className="text-[#94A3B8] text-[12px] leading-relaxed">
                    경기도 안산시 단원구 광덕2로 186-5, 401호 (고잔동, 성진빌딩)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Manager Contact Card */}
            <Card className="border-0 bg-white">
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-xs text-[#4F46E5] mb-1">담당자</p>
                  <h4 className="text-[#1A2B4B] text-sm">김민식 과장</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#64748B] w-12">휴대폰</p>
                    <p className="text-[#1A2B4B] text-sm">010-9209-7693</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#64748B] w-12">전화</p>
                    <p className="text-[#1A2B4B] text-sm">031-365-3410</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#64748B] w-12">팩스</p>
                    <p className="text-[#1A2B4B] text-sm">0303-3130-9709</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#64748B] w-12">이메일</p>
                    <p className="text-[#1A2B4B] text-xs"> zzarkwhr@naver.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#F1F5F9] border-t mt-8">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="text-center text-[#64748B]">
            <p className="text-[10px] md:text-xs mb-0.5 md:mb-1">다온 법무사사무소 | 법무사 손일환 · 오광현 | 담당: 김민식 과장</p>
            <p className="text-[10px] md:text-xs mb-0.5 md:mb-1">경기도 안산시 단원구 광덕2로 186-5, 401호 (고잔동, 성진빌딩) | Tel: 031-365-3410 | Fax: 031-365-3411</p>
            <p className="text-[#94A3B8] text-[10px] md:text-xs mt-2 md:mt-3">© 2025 다온 법무사사무소. All rights reserved.</p>
          </div>
          
          {/* Admin Button */}
          <div className="mt-3 md:mt-6 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectCategory('admin')}
              className="border-[#1A2B4B] text-[#1A2B4B] hover:bg-[#1A2B4B] hover:text-white text-xs h-8 md:h-9"
            >
              <ShieldCheck className="size-3 md:size-4 mr-1.5 md:mr-2" />
              관리자
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
