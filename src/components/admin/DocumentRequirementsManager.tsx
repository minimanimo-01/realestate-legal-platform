import { useState, useEffect } from 'react';
import { Briefcase, User, Laptop, FileText, Plus, Trash2, Save, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface DocumentRequirement {
  id: string;
  jobType: string;
  documents: string[];
  notice: string;
  updatedAt: string;
}

export function DocumentRequirementsManager() {
  const [requirements, setRequirements] = useState<DocumentRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('employee');
  const [newDocument, setNewDocument] = useState('');

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

      if (!response.ok) {
        throw new Error('서류 목록을 불러오는데 실패했습니다');
      }

      const data = await response.json();
      
      if (data.success && data.requirements) {
        setRequirements(data.requirements);
      } else {
        // Set default data if no data exists
        setRequirements([
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
      }
    } catch (error) {
      console.error('서류 목록 불러오기 오류:', error);
      toast.error('서류 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const saveRequirement = async (requirement: DocumentRequirement) => {
    try {
      setSaving(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210/loan-document-requirements/${requirement.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documents: requirement.documents,
            notice: requirement.notice,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('서류 목록 저장에 실패했습니다');
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local state with server response
        setRequirements(prev => 
          prev.map(r => r.id === requirement.id ? data.requirement : r)
        );
        toast.success('서류 목록이 저장되었습니다');
      } else {
        throw new Error(data.error || '저장 실패');
      }
    } catch (error) {
      console.error('서류 목록 저장 오류:', error);
      toast.error('서류 목록 저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const addDocument = () => {
    if (!newDocument.trim()) {
      toast.error('서류명을 입력해주세요');
      return;
    }

    setRequirements(prev => prev.map(req => {
      if (req.id === activeTab) {
        return {
          ...req,
          documents: [...req.documents, newDocument.trim()],
        };
      }
      return req;
    }));
    
    setNewDocument('');
    toast.success('서류가 추가되었습니다');
  };

  const deleteDocument = (index: number) => {
    setRequirements(prev => prev.map(req => {
      if (req.id === activeTab) {
        return {
          ...req,
          documents: req.documents.filter((_, i) => i !== index),
        };
      }
      return req;
    }));
    
    toast.success('서류가 삭제되었습니다');
  };

  const updateDocument = (index: number, value: string) => {
    setRequirements(prev => prev.map(req => {
      if (req.id === activeTab) {
        return {
          ...req,
          documents: req.documents.map((doc, i) => i === index ? value : doc),
        };
      }
      return req;
    }));
  };

  const updateNotice = (value: string) => {
    setRequirements(prev => prev.map(req => {
      if (req.id === activeTab) {
        return {
          ...req,
          notice: value,
        };
      }
      return req;
    }));
  };

  const getCurrentRequirement = () => {
    return requirements.find(r => r.id === activeTab) || {
      id: activeTab,
      jobType: activeTab,
      documents: [],
      notice: '',
      updatedAt: new Date().toISOString().split('T')[0],
    };
  };

  const saveCurrentTab = () => {
    const current = getCurrentRequirement();
    saveRequirement(current);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-slate-600">
            서류 목록을 불러오는 중...
          </div>
        </CardContent>
      </Card>
    );
  }

  const tabConfig: Record<string, {
    label: string;
    icon: any;
    color: string;
    description: string;
  }> = {
    employee: {
      label: '직장인',
      icon: Briefcase,
      color: 'blue',
      description: '직장인에게 필요한 제출 서류',
    },
    business: {
      label: '개인사업자',
      icon: User,
      color: 'indigo',
      description: '개인사업자에게 필요한 제출 서류',
    },
    freelancer: {
      label: '프리랜서',
      icon: Laptop,
      color: 'emerald',
      description: '프리랜서에게 필요한 제출 서류',
    },
    reference: {
      label: '참고 서류',
      icon: FileText,
      color: 'slate',
      description: '대출 금융사 확정 시 참고 서류',
    },
  };

  const currentReq = getCurrentRequirement();
  const config = tabConfig[activeTab];
  const Icon = config?.icon || FileText;
  
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    slate: 'bg-slate-50 border-slate-200 text-slate-900',
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-6 text-blue-600" />
            대출 서류 관리
          </CardTitle>
          <CardDescription className="text-slate-700">
            직업 유형별 제출 서류 목록과 안내사항을 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="mb-1">
                <strong>안내:</strong> 여기서 설정한 서류 목록과 안내사항이 매수인 대시보드의 "대출 문의" 페이지에 표시됩니다.
              </p>
              <p>
                서류를 추가/수정/삭제하거나 안내사항을 수정한 후 반드시 <strong>"변경사항 저장"</strong> 버튼을 클릭해주세요.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
              {Object.keys(tabConfig).map((key) => {
                const cfg = tabConfig[key];
                const TabIcon = cfg.icon;
                return (
                  <TabsTrigger key={key} value={key} className="gap-2">
                    <TabIcon className="size-4" />
                    <span className="hidden sm:inline">{cfg.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="space-y-4">
              {/* Tab Description */}
              <div className={`p-4 rounded-lg border ${colorClasses[config?.color || 'slate']}`}>
                <h4 className="flex items-center gap-2 mb-2">
                  <Icon className="size-5" />
                  {config?.description}
                </h4>
                <p className="text-sm opacity-80">
                  현재 {currentReq.documents.length}개의 서류가 등록되어 있습니다
                </p>
              </div>

              {/* Add New Document */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="new-document" className="sr-only">
                    새 서류 추가
                  </Label>
                  <Input
                    id="new-document"
                    type="text"
                    placeholder="새 서류명 입력 (예: 재직증명서)"
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addDocument();
                      }
                    }}
                  />
                </div>
                <Button onClick={addDocument}>
                  <Plus className="size-4 mr-2" />
                  추가
                </Button>
              </div>

              {/* Document List */}
              <div className="space-y-2">
                {currentReq.documents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    등록된 서류가 없습니다. 서류를 추가해주세요.
                  </div>
                ) : (
                  currentReq.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <span className="text-slate-600 font-mono text-sm">
                        {index + 1}.
                      </span>
                      <Input
                        type="text"
                        value={doc}
                        onChange={(e) => updateDocument(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDocument(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {/* Notice Section */}
              <div className="space-y-2 mt-6">
                <div className="flex items-center gap-2">
                  <Info className="size-5 text-blue-600" />
                  <Label htmlFor="notice" className="text-base font-semibold">
                    안내사항
                  </Label>
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  서류 목록 하단에 표시될 안내사항을 입력하세요
                </p>
                <Textarea
                  id="notice"
                  placeholder="예: 서류는 발급일로부터 3개월 이내의 것만 유효합니다."
                  value={currentReq.notice}
                  onChange={(e) => updateNotice(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={loadRequirements}
          disabled={saving}
        >
          새로고침
        </Button>
        <Button
          onClick={saveCurrentTab}
          disabled={saving}
          size="lg"
          className="bg-[#1A2B4B] hover:bg-[#2A3B5B] text-white gap-2"
        >
          <Save className="size-4" />
          {saving ? '저장 중...' : '변경사항 저장'}
        </Button>
      </div>
    </div>
  );
}
