import { useState, useEffect } from 'react';
import { Phone, FileText, CheckCircle2, AlertCircle, Briefcase, User, Laptop, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface DocumentRequirement {
  id: string;
  jobType: string;
  documents: string[];
  notice: string;
  updatedAt: string;
}

export function LoanInquiry() {
  const [selectedJobType, setSelectedJobType] = useState<'employee' | 'business' | 'freelancer'>('employee');
  const [loading, setLoading] = useState(true);
  const [requirements, setRequirements] = useState<DocumentRequirement[]>([
    {
      id: 'employee',
      jobType: 'employee',
      documents: [
        '재직증명서',
        '소득금액증명원 (최근 1년)',
        '원천징수영수증',
        '주민등록등본',
        '건강보험자격득실확인서',
      ],
      notice: '',
      updatedAt: new Date().toISOString().split('T')[0],
    },
    {
      id: 'business',
      jobType: 'business',
      documents: [
        '사업자등록증',
        '소득금액증명원 (최근 2년)',
        '부가가치세 과세표준증명원',
        '주민등록등본',
        '재무제표 (법인의 경우)',
      ],
      notice: '',
      updatedAt: new Date().toISOString().split('T')[0],
    },
    {
      id: 'freelancer',
      jobType: 'freelancer',
      documents: [
        '소득금액증명원 (최근 2년)',
        '프리랜서 계약서',
        '거래내역서 (통장 사본)',
        '주민등록등본',
        '건강보험자격득실확인서',
      ],
      notice: '',
      updatedAt: new Date().toISOString().split('T')[0],
    },
    {
      id: 'reference',
      jobType: 'reference',
      documents: [
        '등기부등본',
        '건축물대장',
        '매매계약서',
        '신분증 사본',
      ],
      notice: '',
      updatedAt: new Date().toISOString().split('T')[0],
    },
  ]);

  // Load requirements from database
  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210/loan-document-requirements`,
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
        
        if (data.success && data.requirements && data.requirements.length > 0) {
          setRequirements(data.requirements);
        }
      }
    } catch (error) {
      console.error('서류 목록 불러오기 오류:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const getRequirement = (jobType: string) => {
    return requirements.find(r => r.jobType === jobType) || {
      id: jobType,
      jobType,
      documents: [],
      notice: '',
      updatedAt: new Date().toISOString().split('T')[0],
    };
  };

  const employeeReq = getRequirement('employee');
  const businessReq = getRequirement('business');
  const freelancerReq = getRequirement('freelancer');
  const referenceReq = getRequirement('reference');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mt-4 mb-2 text-slate-900">대출 문의 서비스</h2>
        <p className="text-slate-600">
          1금융권 및 2금융권 대출 상담을 연결해드립니다
        </p>
      </div>

      {/* Service Overview */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="size-6 text-blue-600" />
            대출 상담 연계 서비스
          </CardTitle>
          <CardDescription className="text-slate-700">
            1, 2금융권을 모두 검토하여 최적의 대출 조건을 안내해드립니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <span className="text-blue-600">1</span>
              </div>
              <h4 className="text-slate-900 mb-2">서류 준비</h4>
              <p className="text-sm text-slate-600">
                직업 유형에 맞는 서류를 준비합니다
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <span className="text-blue-600">2</span>
              </div>
              <h4 className="text-slate-900 mb-2">FAX 제출</h4>
              <p className="text-sm text-slate-600">
                준비된 서류를 FAX로 전송합니다
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <span className="text-blue-600">3</span>
              </div>
              <h4 className="text-slate-900 mb-2">결과 안내</h4>
              <p className="text-sm text-slate-600">
                1~4영업일 내 대출 가능 여부를 안내받습니다
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="mb-1">
                  <strong>처리 기간:</strong> FAX 제출 후 최소 1영업일 ~ 최대 4영업일 이내 확인됩니다.
                </p>
                <p>
                  신속한 처리를 위해 필요 서류를 모두 준비하여 제출해주세요.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Requirements by Job Type */}
      <Card>
        <CardHeader>
          <CardTitle>직업 유형별 제출 서류</CardTitle>
          <CardDescription>
            본인의 직업 유형을 선택하여 필요 서류를 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedJobType} onValueChange={(v) => setSelectedJobType(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="employee" className="gap-2">
                <Briefcase className="size-4" />
                <span className="hidden sm:inline">직장인</span>
                <span className="sm:hidden">직장</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="gap-2">
                <User className="size-4" />
                <span className="hidden sm:inline">개인사업자</span>
                <span className="sm:hidden">사업자</span>
              </TabsTrigger>
              <TabsTrigger value="freelancer" className="gap-2">
                <Laptop className="size-4" />
                <span className="hidden sm:inline">프리랜서</span>
                <span className="sm:hidden">프리</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="employee" className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-blue-900 mb-3 flex items-center gap-2">
                  <Briefcase className="size-5" />
                  직장인 필요 서류
                </h4>
                <ul className="space-y-2">
                  {employeeReq.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{doc}</span>
                    </li>
                  ))}
                </ul>
                
                {employeeReq.notice && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="flex items-start gap-2 text-sm text-blue-800">
                      <Info className="size-4 flex-shrink-0 mt-0.5" />
                      <p className="whitespace-pre-wrap">{employeeReq.notice}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="text-indigo-900 mb-3 flex items-center gap-2">
                  <User className="size-5" />
                  개인사업자 필요 서류
                </h4>
                <ul className="space-y-2">
                  {businessReq.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{doc}</span>
                    </li>
                  ))}
                </ul>
                
                {businessReq.notice && (
                  <div className="mt-4 pt-4 border-t border-indigo-200">
                    <div className="flex items-start gap-2 text-sm text-indigo-800">
                      <Info className="size-4 flex-shrink-0 mt-0.5" />
                      <p className="whitespace-pre-wrap">{businessReq.notice}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="freelancer" className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="text-emerald-900 mb-3 flex items-center gap-2">
                  <Laptop className="size-5" />
                  프리랜서 필요 서류
                </h4>
                <ul className="space-y-2">
                  {freelancerReq.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{doc}</span>
                    </li>
                  ))}
                </ul>
                
                {freelancerReq.notice && (
                  <div className="mt-4 pt-4 border-t border-emerald-200">
                    <div className="flex items-start gap-2 text-sm text-emerald-800">
                      <Info className="size-4 flex-shrink-0 mt-0.5" />
                      <p className="whitespace-pre-wrap">{freelancerReq.notice}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reference Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            대출 금융사 확정 시 참고 서류
          </CardTitle>
          <CardDescription>
            대출이 승인된 후 금융사가 확정되면 추가로 필요한 서류입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {referenceReq.documents.map((doc, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                <CheckCircle2 className="size-5 text-slate-600 flex-shrink-0" />
                <span className="text-slate-700">{doc}</span>
              </div>
            ))}
          </div>
          
          {referenceReq.notice && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start gap-2 text-sm text-slate-700">
                <Info className="size-4 flex-shrink-0 mt-0.5 text-slate-600" />
                <p className="whitespace-pre-wrap">{referenceReq.notice}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-slate-900 mb-2">대출 상담 문의</h3>
              <p className="text-slate-600">
                서류 준비가 완료되셨나요? FAX로 서류 전송 후 확인 연락 부탁드립니다.
              </p>
            </div>
          

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-900">
                💡 <strong>FAX 번호:</strong> 031-365-3411
              </p>
              <p className="text-sm text-blue-800 mt-2">
                대출 상담 관련 궁금한 점은 편하게 문의주세요.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
