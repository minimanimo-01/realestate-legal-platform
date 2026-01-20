import { useState, useEffect } from 'react';
import { Home, Gift, Heart, FileCheck, Plus, Trash2, Save, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface RegistrationDocument {
  id: string;
  registrationType: string;
  partyType: string | null;
  documents: string[];
  notice: string;
  updatedAt: string;
}

export function RegistrationDocumentsManager() {
  const [documents, setDocuments] = useState<RegistrationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('sale');
  const [activeParty, setActiveParty] = useState<string>('seller');
  const [inheritanceSubTab, setInheritanceSubTab] = useState<string>('heir');
  const [newDocument, setNewDocument] = useState('');

  // Load documents from database
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210/registration-documents`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('등기 서류 목록을 불러오는데 실패했습니다');
      }

      const data = await response.json();
      
      console.log('📦 DB에서 불러온 데이터:', data);
      
      if (data.success && data.documents) {
        console.log('✅ 문서 목록:', data.documents);
        console.log('📋 상속 문서:', data.documents.filter((d: any) => d.registrationType === 'inheritance'));
        setDocuments(data.documents);
      } else {
        // Set default data if no data exists
        console.log('⚠️ DB에 데이터 없음 - 기본값 설정');
        setDocuments([
          {
            id: 'sale_seller',
            registrationType: 'sale',
            partyType: 'seller',
            documents: [
              '등기권리증 (또는 등기필증)',
              '인감증명서 (부동산 처분용, 발급 3개월 이내)',
              '주민등록초본 (발급 3개월 이내)',
              '인감도장',
              '신분증 (주민등록증 또는 운전면허증)',
            ],
            notice: '',
            updatedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: 'sale_buyer',
            registrationType: 'sale',
            partyType: 'buyer',
            documents: [
              '주민등록초본 (발급 3개월 이내)',
              '도장 (인감도장 또는 서명)',
              '신분증 (주민등록증 또는 운전면허증)',
              '매매계약서 원본',
            ],
            notice: '',
            updatedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: 'gift_donor',
            registrationType: 'gift',
            partyType: 'donor',
            documents: [
              '등기권리증 (또는 등기필증)',
              '인감증명서 (부동산 처분용, 발급 3개월 이내)',
              '주민등록초본 (발급 3개월 이내)',
              '인감도장',
              '신분증',
            ],
            notice: '',
            updatedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: 'gift_receiver',
            registrationType: 'gift',
            partyType: 'receiver',
            documents: [
              '주민등록초본 (발급 3개월 이내)',
              '가족관계증명서 (증여자와의 관계 확인용)',
              '도장',
              '신분증',
              '증여계약서',
            ],
            notice: '',
            updatedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: 'inheritance_heir',
            registrationType: 'inheritance',
            partyType: 'heir',
            documents: [
              '피상속인 제적등본 (사망 확인용)',
              '상속인 전원의 가족관계증명서',
              '상속인 전원의 주민등록초본',
              '상속인 전원의 인감증명서 및 인감도장',
              '유산분할협의서 (상속인이 여럿인 경우)',
              '등기권리증',
            ],
            notice: '',
            updatedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: 'inheritance_deceased',
            registrationType: 'inheritance',
            partyType: 'deceased',
            documents: [],
            notice: '',
            updatedAt: new Date().toISOString().split('T')[0],
          },
        ]);
      }
    } catch (error) {
      console.error('등기 서류 목록 불러오기 오류:', error);
      toast.error('등기 서류 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const saveDocument = async (doc: RegistrationDocument) => {
    try {
      setSaving(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210/registration-documents/${doc.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documents: doc.documents,
            notice: doc.notice,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('등기 서류 목록 저장에 실패했습니다');
      }

      const data = await response.json();
      
      if (data.success) {
        // Update local state with server response
        setDocuments(prev => 
          prev.map(d => d.id === doc.id ? data.document : d)
        );
        toast.success('등기 서류 목록이 저장되었습니다');
      } else {
        throw new Error(data.error || '저장 실패');
      }
    } catch (error) {
      console.error('등기 서류 목록 저장 오류:', error);
      toast.error('등기 서류 목록 저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const addDocument = () => {
    if (!newDocument.trim()) {
      toast.error('서류명을 입력해주세요');
      return;
    }

    const currentId = getCurrentDocumentId();
    
    setDocuments(prev => prev.map(doc => {
      if (doc.id === currentId) {
        return {
          ...doc,
          documents: [...doc.documents, newDocument.trim()],
        };
      }
      return doc;
    }));
    
    setNewDocument('');
    toast.success('서류가 추가되었습니다');
  };

  const deleteDocument = (index: number) => {
    const currentId = getCurrentDocumentId();
    
    setDocuments(prev => prev.map(doc => {
      if (doc.id === currentId) {
        return {
          ...doc,
          documents: doc.documents.filter((_, i) => i !== index),
        };
      }
      return doc;
    }));
    
    toast.success('서류가 삭제되었습니다');
  };

  const updateDocumentItem = (index: number, value: string) => {
    const currentId = getCurrentDocumentId();
    
    setDocuments(prev => prev.map(doc => {
      if (doc.id === currentId) {
        return {
          ...doc,
          documents: doc.documents.map((item, i) => i === index ? value : item),
        };
      }
      return doc;
    }));
  };

  const updateNotice = (value: string) => {
    const currentId = getCurrentDocumentId();
    
    setDocuments(prev => prev.map(doc => {
      if (doc.id === currentId) {
        return {
          ...doc,
          notice: value,
        };
      }
      return doc;
    }));
  };

  const getCurrentDocumentId = () => {
    if (activeTab === 'inheritance') {
      return `inheritance_${inheritanceSubTab}`;
    }
    return `${activeTab}_${activeParty}`;
  };

  const getCurrentDocument = () => {
    const currentId = getCurrentDocumentId();
    console.log('🔍 찾는 문서 ID:', currentId);
    console.log('📚 전체 문서 목록:', documents);
    const found = documents.find(d => d.id === currentId);
    console.log('✨ 찾은 문서:', found);
    
    return found || {
      id: currentId,
      registrationType: activeTab,
      partyType: activeTab === 'inheritance' ? inheritanceSubTab : activeParty,
      documents: [],
      notice: '',
      updatedAt: new Date().toISOString().split('T')[0],
    };
  };

  const saveCurrentTab = () => {
    const current = getCurrentDocument();
    saveDocument(current);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-slate-600">
            등기 서류 목록을 불러오는 중...
          </div>
        </CardContent>
      </Card>
    );
  }

  const tabConfig: Record<string, {
    label: string;
    icon: any;
    color: string;
    parties?: Array<{ value: string; label: string; }>;
  }> = {
    sale: {
      label: '매매',
      icon: Home,
      color: 'blue',
      parties: [
        { value: 'seller', label: '매도인' },
        { value: 'buyer', label: '매수인' },
      ],
    },
    gift: {
      label: '증여',
      icon: Gift,
      color: 'indigo',
      parties: [
        { value: 'donor', label: '증여자' },
        { value: 'receiver', label: '수증자' },
      ],
    },
    inheritance: {
      label: '상속',
      icon: Heart,
      color: 'amber',
    },
  };

  const currentDoc = getCurrentDocument();
  const config = tabConfig[activeTab];
  const Icon = config?.icon || FileCheck;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="size-6 text-blue-600" />
            등기 필요 서류 관리
          </CardTitle>
          <CardDescription className="text-slate-700">
            매매/증여/상속별 등기 필요 서류 목록과 안내사항을 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="mb-1">
                <strong>안내:</strong> 여기서 설정한 등기 서류 목록과 안내사항이 매수인 대시보드의 "등기 필요 서류 안내" 페이지에 표시됩니다.
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
          <Tabs value={activeTab} onValueChange={(v) => {
            setActiveTab(v);
            if (v === 'sale') setActiveParty('seller');
            else if (v === 'gift') setActiveParty('donor');
          }}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              {Object.keys(tabConfig).map((key) => {
                const cfg = tabConfig[key];
                const TabIcon = cfg.icon;
                return (
                  <TabsTrigger key={key} value={key} className="gap-2">
                    <TabIcon className="size-4" />
                    {cfg.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="space-y-4">
              {/* Party Selection for Sale and Gift */}
              {config.parties && (
                <div className="flex gap-2">
                  {config.parties.map((party) => (
                    <Button
                      key={party.value}
                      variant={activeParty === party.value ? 'default' : 'outline'}
                      onClick={() => setActiveParty(party.value)}
                      className={activeParty === party.value ? 'bg-[#1A2B4B]' : ''}
                    >
                      {party.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Sub-tab Selection for Inheritance */}
              {activeTab === 'inheritance' && (
                <div className="flex gap-2">
                  <Button
                    variant={inheritanceSubTab === 'heir' ? 'default' : 'outline'}
                    onClick={() => setInheritanceSubTab('heir')}
                    className={inheritanceSubTab === 'heir' ? 'bg-[#1A2B4B]' : ''}
                  >
                    상속인
                  </Button>
                  <Button
                    variant={inheritanceSubTab === 'deceased' ? 'default' : 'outline'}
                    onClick={() => setInheritanceSubTab('deceased')}
                    className={inheritanceSubTab === 'deceased' ? 'bg-[#1A2B4B]' : ''}
                  >
                    망자
                  </Button>
                </div>
              )}

              {/* Current Status */}
              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                <h4 className="flex items-center gap-2 mb-2 text-blue-900">
                  <Icon className="size-5" />
                  {config.label} 
                  {config.parties ? `- ${config.parties.find(p => p.value === activeParty)?.label}` : ''} 
                  {activeTab === 'inheritance' ? `- ${inheritanceSubTab === 'heir' ? '상속인' : '망자'}` : ''}
                  {' '}필요 서류
                </h4>
                <p className="text-sm text-blue-800">
                  현재 {currentDoc.documents.length}개의 서류가 등록되어 있습니다
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
                    placeholder="새 서류명 입력 (예: 등기권리증)"
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
                {currentDoc.documents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    등록된 서류가 없습니다. 서류를 추가해주세요.
                  </div>
                ) : (
                  currentDoc.documents.map((doc, index) => (
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
                        onChange={(e) => updateDocumentItem(index, e.target.value)}
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
                  placeholder="예: 모든 서류는 발급일로부터 3개월 이내의 것만 유효합니다."
                  value={currentDoc.notice}
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
          onClick={loadDocuments}
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
