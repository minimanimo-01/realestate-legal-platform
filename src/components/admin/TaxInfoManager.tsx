import { useState, useEffect } from 'react';
import { Calculator, Percent, Gift, Plus, Trash2, Save, AlertCircle, Edit2, GripVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface TaxInfo {
  id: string;
  type: string; // 'rate' or 'reduction'
  title: string;
  description: string;
  displayOrder: number;
  updatedAt: string;
}

export function TaxInfoManager() {
  const [taxInfo, setTaxInfo] = useState<TaxInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('rate');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

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

      if (!response.ok) {
        throw new Error('취득세 정보를 불러오는데 실패했습니다');
      }

      const data = await response.json();
      
      if (data.success && data.taxInfo) {
        setTaxInfo(data.taxInfo);
      } else {
        // Set default data if no data exists
        setTaxInfo([
          {
            id: 'rate_1',
            type: 'rate',
            title: '6억원 이하',
            description: '1~3%',
            displayOrder: 0,
            updatedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: 'rate_2',
            type: 'rate',
            title: '6억원 초과 ~ 9억원 이하',
            description: '1~3%',
            displayOrder: 1,
            updatedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: 'rate_3',
            type: 'rate',
            title: '9억원 초과',
            description: '3%',
            displayOrder: 2,
            updatedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: 'reduction_1',
            type: 'reduction',
            title: '생애최초 주택 구입',
            description: '취득세 최대 200만원 감면 (12억원 이하, 85㎡ 이하)',
            displayOrder: 0,
            updatedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: 'reduction_2',
            type: 'reduction',
            title: '다자녀 가구',
            description: '자녀 2명 이상 가구 취득세 50% 감면',
            displayOrder: 1,
            updatedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: 'reduction_3',
            type: 'reduction',
            title: '신혼부부',
            description: '일정 요건 충족 시 취득세 감면 가능',
            displayOrder: 2,
            updatedAt: new Date().toISOString().split('T')[0],
          },
          {
            id: 'reduction_4',
            type: 'reduction',
            title: '1주택자',
            description: '조정대상지역 외 1주택 보유 시 기본세율 적용',
            displayOrder: 3,
            updatedAt: new Date().toISOString().split('T')[0],
          },
        ]);
      }
    } catch (error) {
      console.error('취득세 정보 불러오기 오류:', error);
      toast.error('취득세 정보를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const createTaxInfo = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210/tax-info`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: activeTab,
            title: newTitle.trim(),
            description: newDescription.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('항목 추가에 실패했습니다');
      }

      const data = await response.json();
      
      if (data.success) {
        setTaxInfo(prev => [...prev, data.taxInfo]);
        setNewTitle('');
        setNewDescription('');
        toast.success('항목이 추가되었습니다');
      } else {
        throw new Error(data.error || '추가 실패');
      }
    } catch (error) {
      console.error('항목 추가 오류:', error);
      toast.error('항목 추가에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const updateTaxInfo = async (item: TaxInfo) => {
    try {
      setSaving(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210/tax-info/${item.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: item.title,
            description: item.description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('항목 수정에 실패했습니다');
      }

      const data = await response.json();
      
      if (data.success) {
        setTaxInfo(prev => 
          prev.map(info => info.id === item.id ? data.taxInfo : info)
        );
        setEditingId(null);
        toast.success('항목이 수정되었습니다');
      } else {
        throw new Error(data.error || '수정 실패');
      }
    } catch (error) {
      console.error('항목 수정 오류:', error);
      toast.error('항목 수정에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const deleteTaxInfo = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210/tax-info/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('항목 삭제에 실패했습니다');
      }

      const data = await response.json();
      
      if (data.success) {
        setTaxInfo(prev => prev.filter(info => info.id !== id));
        toast.success('항목이 삭제되었습니다');
      } else {
        throw new Error(data.error || '삭제 실패');
      }
    } catch (error) {
      console.error('항목 삭제 오류:', error);
      toast.error('항목 삭제에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  const updateItemField = (id: string, field: 'title' | 'description', value: string) => {
    setTaxInfo(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const getCurrentItems = () => {
    return taxInfo.filter(item => item.type === activeTab).sort((a, b) => a.displayOrder - b.displayOrder);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-slate-600">
            취득세 정보를 불러오는 중...
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentItems = getCurrentItems();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-6 text-blue-600" />
            취득세 정보 관리
          </CardTitle>
          <CardDescription className="text-slate-700">
            취득세율 안내와 감면 사항을 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="mb-1">
                <strong>안내:</strong> 여기서 설정한 취득세 정보가 매수인 대시보드의 "비용 계산" 페이지에 표시됩니다.
              </p>
              <p>
                항목을 추가/수정/삭제한 후 반드시 저장해주세요.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="rate" className="gap-2">
                <Percent className="size-4" />
                취득세율 안내
              </TabsTrigger>
              <TabsTrigger value="reduction" className="gap-2">
                <Gift className="size-4" />
                취득세 감면 사항
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {/* Current Status */}
              <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
                <h4 className="text-blue-900 mb-2">
                  {activeTab === 'rate' ? '취득세율 안내' : '취득세 감면 사항'}
                </h4>
                <p className="text-sm text-blue-800">
                  현재 {currentItems.length}개의 항목이 등록되어 있습니다
                </p>
              </div>

              {/* Add New Item */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg border">
                <h4 className="font-semibold text-slate-900">새 항목 추가</h4>
                <div className="space-y-2">
                  <Label htmlFor="new-title">제목</Label>
                  <Input
                    id="new-title"
                    type="text"
                    placeholder={activeTab === 'rate' ? '예: 6억원 이하' : '예: 생애최초 주택 구입'}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-description">내용</Label>
                  <Textarea
                    id="new-description"
                    placeholder={activeTab === 'rate' ? '예: 1~3%' : '예: 취득세 최대 200만원 감면 (12억원 이하, 85㎡ 이하)'}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                  />
                </div>
                <Button onClick={createTaxInfo} disabled={saving} className="w-full">
                  <Plus className="size-4 mr-2" />
                  항목 추가
                </Button>
              </div>

              {/* Item List */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">등록된 항목</h4>
                {currentItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    등록된 항목이 없습니다. 항목을 추가해주세요.
                  </div>
                ) : (
                  currentItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white border rounded-lg hover:border-blue-300 transition-colors"
                    >
                      {editingId === item.id ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>제목</Label>
                            <Input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateItemField(item.id, 'title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>내용</Label>
                            <Textarea
                              value={item.description}
                              onChange={(e) => updateItemField(item.id, 'description', e.target.value)}
                              rows={2}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => updateTaxInfo(item)}
                              disabled={saving}
                              size="sm"
                              className="flex-1"
                            >
                              <Save className="size-4 mr-2" />
                              저장
                            </Button>
                            <Button
                              onClick={() => setEditingId(null)}
                              disabled={saving}
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <GripVertical className="size-5 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-slate-900 mb-1">{item.title}</h5>
                            <p className="text-sm text-slate-600">{item.description}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              onClick={() => setEditingId(item.id)}
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit2 className="size-4" />
                            </Button>
                            <Button
                              onClick={() => deleteTaxInfo(item.id)}
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={loadTaxInfo}
          disabled={saving}
        >
          새로고침
        </Button>
      </div>
    </div>
  );
}
