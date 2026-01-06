import { useState } from 'react';
import { Building2, FileText, TrendingDown, LogOut } from 'lucide-react';
import { PasswordAuth } from './PasswordAuth';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LawAndRegulations } from './agent/LawAndRegulations';
import { DocumentDownloads } from './agent/DocumentDownloads';
import { BankRateComparison } from './agent/BankRateComparison';
import type { Article, BankRate } from '../App';

interface RealEstateAgentDashboardProps {
  isAuthenticated: boolean;
  onAuthenticate: () => void;
  onBack: () => void;
  articles: Article[];
  documents: any[];
  bankRates: {
    tier1: BankRate[];
    tier2: BankRate[];
  };
}

export function RealEstateAgentDashboard({
  isAuthenticated,
  onAuthenticate,
  onBack,
  articles,
  documents,
  bankRates,
}: RealEstateAgentDashboardProps) {
  const [activeTab, setActiveTab] = useState('law');

  if (!isAuthenticated) {
    return (
      <PasswordAuth
        onAuthenticate={onAuthenticate}
        onBack={onBack}
        title="부동산 사장님 로그인"
        description="제휴 중개업소 전용 정보를 확인하려면 패스워드를 입력하세요"
        storageKey="agent-auth"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
                <Building2 className="size-6 text-[#4F46E5]" />
              </div>
              <div>
                <h1 className="text-[#1A2B4B]">부동산 사장님 전용</h1>
                <p className="text-sm text-[#64748B]">전문 업무 지원 시스템</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="border-[#4F46E5] text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white"
            >
              <LogOut className="size-4 mr-2" />
              홈으로
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-full overflow-x-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid bg-white">
            <TabsTrigger value="law" className="gap-2 data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
              <FileText className="size-4" />
              <span className="hidden sm:inline">법률 및 제도</span>
              <span className="sm:hidden">법률</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2 data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
              <FileText className="size-4" />
              <span className="hidden sm:inline">등기 관련 서식</span>
              <span className="sm:hidden">서류</span>
            </TabsTrigger>
            <TabsTrigger value="rates" className="gap-2 data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
              <TrendingDown className="size-4" />
              <span className="hidden sm:inline">금리 비교</span>
              <span className="sm:hidden">금리</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="law" className="space-y-4">
            <LawAndRegulations articles={articles.filter(a => a.category === 'law')} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <DocumentDownloads documents={documents} />
          </TabsContent>

          <TabsContent value="rates" className="space-y-4">
            <BankRateComparison bankRates={bankRates} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
