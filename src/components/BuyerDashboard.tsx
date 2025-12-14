import { useState } from 'react';
import { Users, FileCheck, Calculator, Phone, LogOut, Receipt } from 'lucide-react';
import { PasswordAuth } from './PasswordAuth';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RegistrationDocuments } from './buyer/RegistrationDocuments';
import { TaxCalculator } from './buyer/TaxCalculator';
import { LoanInquiry } from './buyer/LoanInquiry';
import { BalanceForm } from './buyer/BalanceForm';

interface BuyerDashboardProps {
  isAuthenticated: boolean;
  onAuthenticate: () => void;
  onBack: () => void;
}

export function BuyerDashboard({
  isAuthenticated,
  onAuthenticate,
  onBack,
}: BuyerDashboardProps) {
  const [activeTab, setActiveTab] = useState('documents');

  if (!isAuthenticated) {
    return (
      <PasswordAuth
        onAuthenticate={onAuthenticate}
        onBack={onBack}
        title="매수인 로그인"
        description="주택 구입자를 위한 등기 및 세금 정보를 확인하려면 패스워드를 입력하세요"
        storageKey="buyer-auth"
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
              <div className="size-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                <Users className="size-6 text-[#2563EB]" />
              </div>
              <div>
                <h1 className="text-[#1A2B4B]">매수/매도인 전용</h1>
                <p className="text-sm text-[#64748B]">주택 구입 가이드</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
            >
              <LogOut className="size-4 mr-2" />
              홈으로
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto bg-white gap-2 p-2">
            <TabsTrigger value="documents" className="gap-2 bg-gray-50 border border-gray-200 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:border-[#2563EB]">
              <FileCheck className="size-4" />
              <span className="hidden sm:inline">등기 서류</span>
              <span className="sm:hidden">서류</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="gap-2 bg-gray-50 border border-gray-200 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:border-[#2563EB]">
              <Calculator className="size-4" />
              <span className="hidden sm:inline">비용 계산</span>
              <span className="sm:hidden">계산</span>
            </TabsTrigger>
            <TabsTrigger value="loan" className="gap-2 bg-gray-50 border border-gray-200 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:border-[#2563EB]">
              <Phone className="size-4" />
              <span className="hidden sm:inline">대출 문의</span>
              <span className="sm:hidden">대출</span>
            </TabsTrigger>
            <TabsTrigger value="balance" className="gap-2 bg-gray-50 border border-gray-200 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:border-[#2563EB]">
              <Receipt className="size-4" />
              <span className="hidden sm:inline">잔금 안내</span>
              <span className="sm:hidden">잔금</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <RegistrationDocuments />
          </TabsContent>

          <TabsContent value="calculator" className="space-y-4">
            <TaxCalculator />
          </TabsContent>

          <TabsContent value="loan" className="space-y-4">
            <LoanInquiry />
          </TabsContent>

          <TabsContent value="balance" className="space-y-4">
            <BalanceForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}