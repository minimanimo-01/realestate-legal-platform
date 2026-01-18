import { useState } from 'react';
import { Shield, FileText, Key, LogOut, BarChart3, Users2, ClipboardList, FileCheck, Calculator } from 'lucide-react';
import { PasswordAuth } from './PasswordAuth';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArticleManager } from './admin/ArticleManager';
import { PasswordManager } from './admin/PasswordManager';
import { DocumentRequirementsManager } from './admin/DocumentRequirementsManager';
import { RegistrationDocumentsManager } from './admin/RegistrationDocumentsManager';
import { TaxInfoManager } from './admin/TaxInfoManager';
import type { Article, BankRate } from '../App';

interface AdminDashboardProps {
  isAuthenticated: boolean;
  onAuthenticate: () => void;
  onBack: () => void;
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  documents: any[];
  setDocuments: (documents: any[]) => void;
  bankRates: {
    tier1: BankRate[];
    tier2: BankRate[];
  };
  setBankRates: (rates: any) => void;
}

export function AdminDashboard({
  isAuthenticated,
  onAuthenticate,
  onBack,
  articles,
  setArticles,
  documents,
  setDocuments,
  bankRates,
  setBankRates,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [customerContentTab, setCustomerContentTab] = useState('loan-docs');

  if (!isAuthenticated) {
    return (
      <PasswordAuth
        onAuthenticate={onAuthenticate}
        onBack={onBack}
        title="관리자 로그인"
        description="관리자 전용 페이지입니다. 패스워드를 입력하세요"
        storageKey="admin-auth"
      />
    );
  }

  const stats = {
    totalArticles: articles.length,
    pinnedArticles: articles.filter(a => a.isPinned).length,
    totalDocuments: documents.length,
    pinnedDocuments: documents.filter(d => d.isPinned).length,
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                <Shield className="size-6 text-[#1A2B4B]" />
              </div>
              <div>
                <h1 className="text-[#1A2B4B]">관리자 페이지</h1>
                <p className="text-sm text-[#64748B]">콘텐츠 및 설정 관리</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onBack}
              className="border-[#1A2B4B] text-[#1A2B4B] hover:bg-[#1A2B4B] hover:text-white"
            >
              <LogOut className="size-4 mr-2" />
              홈으로
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Main Tabs */}
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto lg:inline-grid bg-white">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-[#1A2B4B] data-[state=active]:text-white">
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">개요</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2 data-[state=active]:bg-[#1A2B4B] data-[state=active]:text-white">
              <FileText className="size-4" />
              <span className="hidden sm:inline">부동산 콘텐츠 관리</span>
              <span className="sm:hidden">콘텐츠</span>
            </TabsTrigger>
            <TabsTrigger value="customer-content" className="gap-2 data-[state=active]:bg-[#1A2B4B] data-[state=active]:text-white">
              <Users2 className="size-4" />
              <span className="hidden sm:inline">고객 콘텐츠 관리</span>
              <span className="sm:hidden">고객</span>
            </TabsTrigger>
            <TabsTrigger value="passwords" className="gap-2 data-[state=active]:bg-[#1A2B4B] data-[state=active]:text-white">
              <Key className="size-4" />
              <span className="hidden sm:inline">패스워드</span>
              <span className="sm:hidden">PW</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardDescription className="text-[#64748B]">총 법률/제도 안내</CardDescription>
                  <CardTitle className="text-[#1A2B4B]">{stats.totalArticles}건</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#64748B]">
                    고정: {stats.pinnedArticles}건
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardDescription className="text-[#64748B]">총 신청 서류</CardDescription>
                  <CardTitle className="text-[#1A2B4B]">{stats.totalDocuments}개</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#64748B]">
                    고정: {stats.pinnedDocuments}개
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardDescription className="text-[#64748B]">1금융권 은행</CardDescription>
                  <CardTitle className="text-[#1A2B4B]">{bankRates.tier1.length}개</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#64748B]">
                    금리 정보 관리
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardDescription className="text-[#64748B]">2금융권 기관</CardDescription>
                  <CardTitle className="text-[#1A2B4B]">{bankRates.tier2.length}개</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[#64748B]">
                    금리 정보 관리
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1A2B4B]">빠른 작업</CardTitle>
                <CardDescription className="text-[#64748B]">
                  자주 사용하는 관리 기능
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 border-[#E2E8F0] hover:bg-[#F7F8FA]"
                  onClick={() => setActiveTab('content')}
                >
                  <div className="flex items-start gap-3 text-left">
                    <FileText className="size-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="mb-1 text-[#1A2B4B]">법률/제도 안내 작성</div>
                      <div className="text-xs text-[#64748B]">
                        새로운 법률 및 제도 안내 추가
                      </div>
                    </div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 border-[#E2E8F0] hover:bg-[#F7F8FA]"
                  onClick={() => {
                    setActiveTab('customer-content');
                    setCustomerContentTab('loan-docs');
                  }}
                >
                  <div className="flex items-start gap-3 text-left">
                    <Users2 className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="mb-1 text-[#1A2B4B]">고객 콘텐츠 관리</div>
                      <div className="text-xs text-[#64748B]">
                        대출·등기 서류 및 비용 계산
                      </div>
                    </div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 border-[#E2E8F0] hover:bg-[#F7F8FA]"
                  onClick={() => setActiveTab('passwords')}
                >
                  <div className="flex items-start gap-3 text-left">
                    <Key className="size-5 text-[#1A2B4B] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="mb-1 text-[#1A2B4B]">패스워드 관리</div>
                      <div className="text-xs text-[#64748B]">
                        접근 권한 패스워드 설정
                      </div>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1A2B4B]">최근 업데이트</CardTitle>
                <CardDescription className="text-[#64748B]">
                  최근 수정된 콘텐츠
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {articles.slice(0, 5).map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1A2B4B] truncate">{article.title}</p>
                        <p className="text-xs text-[#64748B]">{article.updatedAt}</p>
                      </div>
                      {article.isPinned && (
                        <span className="text-xs text-[#4F46E5] ml-2">고정됨</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-4">
            <ArticleManager 
              articles={articles}
              setArticles={setArticles}
              documents={documents}
              setDocuments={setDocuments}
              bankRates={bankRates}
              setBankRates={setBankRates}
            />
          </TabsContent>

          {/* Customer Content Management Tab */}
          <TabsContent value="customer-content" className="space-y-4">

            {/* Sub Tabs for Customer Content */}
            <Tabs value={customerContentTab} onValueChange={setCustomerContentTab}>
              <TabsList className="grid w-full grid-cols-3 bg-white">
                <TabsTrigger value="loan-docs" className="gap-2 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white">
                  <ClipboardList className="size-4" />
                  <span className="hidden sm:inline">대출 서류</span>
                  <span className="sm:hidden">대출</span>
                </TabsTrigger>
                <TabsTrigger value="registration-docs" className="gap-2 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white">
                  <FileCheck className="size-4" />
                  <span className="hidden sm:inline">등기 서류</span>
                  <span className="sm:hidden">등기</span>
                </TabsTrigger>
                <TabsTrigger value="tax-info" className="gap-2 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white">
                  <Calculator className="size-4" />
                  <span className="hidden sm:inline">비용 계산</span>
                  <span className="sm:hidden">비용</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="loan-docs" className="space-y-4 mt-4">
                <DocumentRequirementsManager />
              </TabsContent>

              <TabsContent value="registration-docs" className="space-y-4 mt-4">
                <RegistrationDocumentsManager />
              </TabsContent>

              <TabsContent value="tax-info" className="space-y-4 mt-4">
                <TaxInfoManager />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Passwords Tab */}
          <TabsContent value="passwords" className="space-y-4">
            <PasswordManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
