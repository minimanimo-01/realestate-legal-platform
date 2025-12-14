import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Home } from './components/Home';
import { RealEstateAgentDashboard } from './components/RealEstateAgentDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Toaster } from 'sonner';

export type UserType = 'home' | 'agent' | 'buyer' | 'admin';

export interface Article {
  id: string;
  category: 'law' | 'document';
  title: string;
  summary: string;
  content: string;
  effectiveDate?: string;
  targetAudience?: string;
  isPinned: boolean;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  fileType: 'hwp' | 'pdf' | 'xlsx';
  tips?: string;
  tags?: string[];
  isPinned: boolean;
  updatedAt: string;
}

export interface BankRate {
  id: string;
  bankName: string;
  minRate: number;
  maxRate: number;
  lastMonthMin?: number;
  lastMonthMax?: number;
  updatedAt: string;
}

// Initial mock data
const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    category: 'law',
    title: '2025년 취득세율 변경 안내',
    summary: '조정대상지역 취득세율 완화 조치',
    content: `## 개요
2025년 1월 1일부터 조정대상지역 내 주택 구입 시 취득세율이 일시적으로 완화됩니다.

## 핵심 내용
- 1주택자: 1~3% (기존 유지)
- 2주택자: 1~3% → 8% (완화)
- 3주택 이상: 12% (기존 유지)

## 시행일
2025년 1월 1일부터 2025년 12월 31일까지

## 대상
조정대상지역 내 주택 취득자

## 유의사항
임시 조치이므로 2026년 1월 1일부터는 기존 세율로 환원될 예정입니다.`,
    effectiveDate: '2025-01-01',
    targetAudience: '조정대상지역 주택 취득자',
    isPinned: true,
    updatedAt: '2025-11-20',
  },
  {
    id: '2',
    category: 'law',
    title: '생애최초 주택구입자 취득세 감면',
    summary: '생애최초 주택구입 시 취득세 최대 200만원 감면',
    content: `## 개요
생애최초로 주택을 구입하는 경우 취득세 감면 혜택을 받을 수 있습니다.

## 핵심 내용
- 주택가격 12억원 이하: 취득세 100% 감면 (최대 200만원)
- 주택가격 12억원 초과: 감면 불가

## 시행일
2024년 1월 1일부터 계속 시행

## 대상
- 생애최초 주택 구입자
- 부부합산 소득 7천만원 이하 (1주택)
- 소득 요건 없음 (무주택 세대주)

## 신청방법
주택 취득 후 60일 이내 관할 시·군·구청에 감면 신청`,
    effectiveDate: '2024-01-01',
    targetAudience: '생애최초 주택구입자',
    isPinned: true,
    updatedAt: '2025-11-15',
  },
  {
    id: '3',
    category: 'law',
    title: '전자계약 의무화 시행',
    summary: '부동산 거래 시 전자계약서 작성 의무화',
    content: `## 개요
2025년부터 일정 금액 이상의 부동산 거래 시 전자계약서 작성이 의무화됩니다.

## 핵심 내용
- 거래금액 1억원 이상: 전자계약 의무
- 전자계약플랫폼 이용 필수
- 종이계약서와 전자계약서 동시 작성 가능

## 시행일
2025년 3월 1일부터

## 대상
거래금액 1억원 이상 부동산 거래

## 유의사항
미이행 시 과태료 부과 가능성 있음`,
    effectiveDate: '2025-03-01',
    targetAudience: '1억원 이상 거래 당사자',
    isPinned: false,
    updatedAt: '2025-11-18',
  },
];

const INITIAL_DOCUMENTS: Document[] = [
  {
    id: '1',
    name: '부동산 매매계약서',
    description: '표준 부동산 매매계약서 양식',
    fileUrl: '#',
    fileType: 'hwp',
    tips: '계약 전 반드시 등기부등본 확인 필수. 특약사항은 구체적으로 작성하세요.',
    isPinned: true,
    updatedAt: '2025-11-20',
  },
  {
    id: '2',
    name: '취득세 감면 신청서',
    description: '생애최초 주택구입 취득세 감면 신청 양식',
    fileUrl: '#',
    fileType: 'hwp',
    tips: '주택 취득일로부터 60일 이내 신청. 소득증빙 서류 함께 제출 필요.',
    isPinned: true,
    updatedAt: '2025-11-15',
  },
  {
    id: '3',
    name: '등기신청서',
    description: '소유권이전등기 신청서 양식',
    fileUrl: '#',
    fileType: 'hwp',
    tips: '잔금일 이후 신청 가능. 매도인 인감증명서 필수.',
    isPinned: false,
    updatedAt: '2025-11-10',
  },
  {
    id: '4',
    name: '위임장',
    description: '등기 업무 위임장',
    fileUrl: '#',
    fileType: 'hwp',
    tips: '본인 직접 날인 필수. 대리인 신분증 지참.',
    isPinned: false,
    updatedAt: '2025-11-10',
  },
];

const INITIAL_BANK_RATES = {
  tier1: [
    {
      id: '1',
      bankName: '우리은행',
      minRate: 3.5,
      maxRate: 5.2,
      lastMonthMin: 3.6,
      lastMonthMax: 5.3,
      updatedAt: '2025-11-20',
    },
    {
      id: '2',
      bankName: '신한은행',
      minRate: 3.4,
      maxRate: 5.1,
      lastMonthMin: 3.5,
      lastMonthMax: 5.2,
      updatedAt: '2025-11-20',
    },
    {
      id: '3',
      bankName: 'KB국민은행',
      minRate: 3.6,
      maxRate: 5.3,
      lastMonthMin: 3.7,
      lastMonthMax: 5.4,
      updatedAt: '2025-11-20',
    },
    {
      id: '4',
      bankName: 'NH농협은행',
      minRate: 3.5,
      maxRate: 5.2,
      lastMonthMin: 3.6,
      lastMonthMax: 5.3,
      updatedAt: '2025-11-20',
    },
  ],
  tier2: [
    {
      id: '5',
      bankName: '새마을금고',
      minRate: 4.2,
      maxRate: 6.5,
      lastMonthMin: 4.3,
      lastMonthMax: 6.6,
      updatedAt: '2025-11-20',
    },
    {
      id: '6',
      bankName: '신협',
      minRate: 4.3,
      maxRate: 6.7,
      lastMonthMin: 4.4,
      lastMonthMax: 6.8,
      updatedAt: '2025-11-20',
    },
    {
      id: '7',
      bankName: '수협은행',
      minRate: 4.1,
      maxRate: 6.4,
      lastMonthMin: 4.2,
      lastMonthMax: 6.5,
      updatedAt: '2025-11-20',
    },
  ],
};

// AppContent component with routing logic
function AppContent() {
  const navigate = useNavigate();
  const [isAgentAuthenticated, setIsAgentAuthenticated] = useState(false);
  const [isBuyerAuthenticated, setIsBuyerAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Data states
  const [articles, setArticles] = useState<Article[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [bankRates, setBankRates] = useState(INITIAL_BANK_RATES);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210`;
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
  };

  // Load data from DB on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      
      try {
        // Load articles
        const articlesResponse = await fetch(`${API_BASE}/articles`, {
          headers: API_HEADERS,
        });
        const articlesResult = await articlesResponse.json();
        
        if (articlesResult.success) {
          setArticles(articlesResult.articles);
        } else {
          console.error('Failed to load articles:', articlesResult.error);
          setArticles(INITIAL_ARTICLES);
        }

        // Load documents
        const documentsResponse = await fetch(`${API_BASE}/documents`, {
          headers: API_HEADERS,
        });
        const documentsResult = await documentsResponse.json();
        
        if (documentsResult.success) {
          setDocuments(documentsResult.documents);
        } else {
          console.error('Failed to load documents:', documentsResult.error);
          setDocuments(INITIAL_DOCUMENTS);
        }

        // Load bank rates
        const bankRatesResponse = await fetch(`${API_BASE}/bank-rates`, {
          headers: API_HEADERS,
        });
        const bankRatesResult = await bankRatesResponse.json();
        
        if (bankRatesResult.success) {
          setBankRates(bankRatesResult.bankRates);
        } else {
          console.error('Failed to load bank rates:', bankRatesResult.error);
          setBankRates(INITIAL_BANK_RATES);
        }
      } catch (error) {
        console.error('Error loading data from DB:', error);
        setArticles(INITIAL_ARTICLES);
        setDocuments(INITIAL_DOCUMENTS);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleSelectCategory = (category: UserType) => {
    if (category === 'agent') {
      navigate('/agent');
    } else if (category === 'buyer') {
      navigate('/buyer');
    } else if (category === 'admin') {
      navigate('/admin');
    }
  };

  const handleBack = () => {
    setIsAgentAuthenticated(false);
    setIsBuyerAuthenticated(false);
    setIsAdminAuthenticated(false);
    
    // Clear session storage when going back to home
    sessionStorage.removeItem('agent-auth');
    sessionStorage.removeItem('buyer-auth');
    sessionStorage.removeItem('admin-auth');
    
    navigate('/');
  };

  return (
    <>
      <Toaster 
        position="top-center" 
        richColors 
        closeButton
        toastOptions={{
          duration: 3000,
          style: {
            background: 'white',
            color: '#1A2B4B',
            border: '1px solid #E2E8F0',
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<Home onSelectCategory={handleSelectCategory} />} />
        <Route 
          path="/agent" 
          element={
            <RealEstateAgentDashboard
              isAuthenticated={isAgentAuthenticated}
              onAuthenticate={() => setIsAgentAuthenticated(true)}
              onBack={handleBack}
              articles={articles}
              documents={documents}
              bankRates={bankRates}
            />
          } 
        />
        <Route 
          path="/buyer" 
          element={
            <BuyerDashboard
              isAuthenticated={isBuyerAuthenticated}
              onAuthenticate={() => setIsBuyerAuthenticated(true)}
              onBack={handleBack}
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminDashboard
              isAuthenticated={isAdminAuthenticated}
              onAuthenticate={() => setIsAdminAuthenticated(true)}
              onBack={handleBack}
              articles={articles}
              setArticles={setArticles}
              documents={documents}
              setDocuments={setDocuments}
              bankRates={bankRates}
              setBankRates={setBankRates}
            />
          } 
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}