import { useState } from 'react';
import { Edit, TrendingUp, TrendingDown, Minus, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import type { BankRate } from '../../App';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface BankRateManagerProps {
  bankRates: {
    tier1: BankRate[];
    tier2: BankRate[];
  };
  setBankRates: (rates: any) => void;
}

export function BankRateManager({ bankRates, setBankRates }: BankRateManagerProps) {
  const [activeTab, setActiveTab] = useState('tier1');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingRate, setEditingRate] = useState<BankRate & { tier: 'tier1' | 'tier2' } | null>(null);
  const [rateForm, setRateForm] = useState({
    bankName: '',
    minRate: '',
    maxRate: '',
    lastMonthMin: '',
    lastMonthMax: '',
  });

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210`;
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
  };

  const handleOpenAddDialog = (tier: 'tier1' | 'tier2') => {
    setIsAddMode(true);
    setEditingRate({ 
      id: '', 
      bankName: '', 
      minRate: 0, 
      maxRate: 0, 
      updatedAt: '',
      tier 
    });
    setRateForm({
      bankName: '',
      minRate: '',
      maxRate: '',
      lastMonthMin: '',
      lastMonthMax: '',
    });
    setIsDialogOpen(true);
  };

  const handleOpenDialog = (rate: BankRate, tier: 'tier1' | 'tier2') => {
    setIsAddMode(false);
    setEditingRate({ ...rate, tier });
    setRateForm({
      bankName: rate.bankName,
      minRate: rate.minRate.toString(),
      maxRate: rate.maxRate.toString(),
      lastMonthMin: rate.lastMonthMin?.toString() || '',
      lastMonthMax: rate.lastMonthMax?.toString() || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingRate) return;

    setIsSaving(true);

    try {
      if (isAddMode) {
        // Add new bank rate to DB
        const response = await fetch(`${API_BASE}/bank-rates`, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify({
            bankName: rateForm.bankName,
            tier: editingRate.tier,
            minRate: parseFloat(rateForm.minRate),
            maxRate: parseFloat(rateForm.maxRate),
            lastMonthMin: rateForm.lastMonthMin ? parseFloat(rateForm.lastMonthMin) : undefined,
            lastMonthMax: rateForm.lastMonthMax ? parseFloat(rateForm.lastMonthMax) : undefined,
          }),
        });

        const result = await response.json();

        if (result.success) {
          const newRate: BankRate = result.bankRate;
          
          if (editingRate.tier === 'tier1') {
            setBankRates({
              ...bankRates,
              tier1: [...bankRates.tier1, newRate],
            });
          } else {
            setBankRates({
              ...bankRates,
              tier2: [...bankRates.tier2, newRate],
            });
          }
          toast.success('새 은행이 성공적으로 추가되었습니다');
        } else {
          console.error('Failed to add bank rate:', result.error);
          toast.error('은행 추가에 실패했습니다');
        }
      } else {
        // Update existing rate in DB
        const response = await fetch(`${API_BASE}/bank-rates/${editingRate.id}`, {
          method: 'PUT',
          headers: API_HEADERS,
          body: JSON.stringify({
            bankName: rateForm.bankName,
            minRate: parseFloat(rateForm.minRate),
            maxRate: parseFloat(rateForm.maxRate),
            lastMonthMin: rateForm.lastMonthMin ? parseFloat(rateForm.lastMonthMin) : undefined,
            lastMonthMax: rateForm.lastMonthMax ? parseFloat(rateForm.lastMonthMax) : undefined,
          }),
        });

        const result = await response.json();

        if (result.success) {
          const updatedRate: BankRate = result.bankRate;
          
          if (editingRate.tier === 'tier1') {
            setBankRates({
              ...bankRates,
              tier1: bankRates.tier1.map(r => r.id === editingRate.id ? updatedRate : r),
            });
          } else {
            setBankRates({
              ...bankRates,
              tier2: bankRates.tier2.map(r => r.id === editingRate.id ? updatedRate : r),
            });
          }
          toast.success('금리 정보가 성공적으로 수정되었습니다');
        } else {
          console.error('Failed to update bank rate:', result.error);
          toast.error('금리 정보 수정에 실패했습니다');
        }
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving bank rate:', error);
      toast.error('저장 중 오류가 발생했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, tier: 'tier1' | 'tier2', bankName: string) => {
    if (!confirm(`정말 "${bankName}"을(를) 삭제하시겠습니까?`)) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`${API_BASE}/bank-rates/${id}`, {
        method: 'DELETE',
        headers: API_HEADERS,
      });

      const result = await response.json();

      if (result.success) {
        if (tier === 'tier1') {
          setBankRates({
            ...bankRates,
            tier1: bankRates.tier1.filter(r => r.id !== id),
          });
        } else {
          setBankRates({
            ...bankRates,
            tier2: bankRates.tier2.filter(r => r.id !== id),
          });
        }
        toast.success('은행이 성공적으로 삭제되었습니다');
      } else {
        console.error('Failed to delete bank rate:', result.error);
        toast.error('은행 삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('Error deleting bank rate:', error);
      toast.error('삭제 중 오류가 발생했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  const getRateChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = current - previous;
    return change;
  };

  const RateChangeIndicator = ({ current, previous }: { current: number; previous?: number }) => {
    const change = getRateChange(current, previous);
    
    if (change === null || change === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-slate-500">
          <Minus className="size-3" />
          <span className="text-xs">변동없음</span>
        </span>
      );
    }
    
    if (change > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-red-600">
          <TrendingUp className="size-3" />
          <span className="text-xs">+{change.toFixed(2)}%</span>
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 text-blue-600">
        <TrendingDown className="size-3" />
        <span className="text-xs">{change.toFixed(2)}%</span>
      </span>
    );
  };

  const RateTable = ({ rates, tier }: { rates: BankRate[]; tier: 'tier1' | 'tier2' }) => (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="w-[150px]">은행</TableHead>
            <TableHead className="text-center">최저 금리</TableHead>
            <TableHead className="text-center">최고 금리</TableHead>
            <TableHead className="text-center">전월 대비 (최저)</TableHead>
            <TableHead className="text-center">전월 대비 (최고)</TableHead>
            <TableHead className="text-center w-[100px]">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rates.map((rate) => (
            <TableRow key={rate.id}>
              <TableCell>{rate.bankName}</TableCell>
              <TableCell className="text-center">{rate.minRate}%</TableCell>
              <TableCell className="text-center">{rate.maxRate}%</TableCell>
              <TableCell className="text-center">
                <RateChangeIndicator current={rate.minRate} previous={rate.lastMonthMin} />
              </TableCell>
              <TableCell className="text-center">
                <RateChangeIndicator current={rate.maxRate} previous={rate.lastMonthMax} />
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(rate, tier)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(rate.id, tier, rate.bankName)}
                    disabled={isSaving}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-slate-900">금리 비교표 관리</h3>
        <p className="text-sm text-slate-600">
          은행별 금리 정보를 수정하고 전월 대비 변동을 관리하세요
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <div className="text-sm text-amber-900">
              <p className="mb-2">
                <strong>💡 전월 대비 금리 변동 계산 방법:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-amber-800">
                <li>현재 금리와 전월 금리를 입력하면 자동으로 변동폭을 계산합니다</li>
                <li>
                  <TrendingUp className="size-3 inline mx-1 text-red-600" />
                  빨간색 상승 화살표: 금리 인상
                </li>
                <li>
                  <TrendingDown className="size-3 inline mx-1 text-blue-600" />
                  파란색 하락 화살표: 금리 인하
                </li>
                <li>
                  <Minus className="size-3 inline mx-1 text-slate-600" />
                  회색 가로선: 변동 없음
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid bg-white">
          <TabsTrigger value="tier1" className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
            1금융권 ({bankRates.tier1.length}개)
          </TabsTrigger>
          <TabsTrigger value="tier2" className="data-[state=active]:bg-[#4F46E5] data-[state=active]:text-white">
            2금융권 ({bankRates.tier2.length}개)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tier1" className="space-y-4">
          <div className="flex justify-end mb-3">
            <Button 
              onClick={() => handleOpenAddDialog('tier1')}
              className="bg-[#4F46E5] hover:bg-[#4338CA]"
            >
              <Plus className="size-4 mr-2" />
              새 은행 추가
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <RateTable rates={bankRates.tier1} tier="tier1" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tier2" className="space-y-4">
          <div className="flex justify-end mb-3">
            <Button 
              onClick={() => handleOpenAddDialog('tier2')}
              className="bg-[#4F46E5] hover:bg-[#4338CA]"
            >
              <Plus className="size-4 mr-2" />
              새 은행 추가
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <RateTable rates={bankRates.tier2} tier="tier2" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isAddMode ? '새 은행 추가' : '금리 정보 수정'}
            </DialogTitle>
            <DialogDescription>
              {isAddMode 
                ? `${editingRate?.tier === 'tier1' ? '1금융권' : '2금융권'}에 새로운 은행을 추가합니다`
                : `${editingRate?.bankName}의 금리 정보를 수정하세요`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">은행명</Label>
              <Input
                id="bankName"
                value={rateForm.bankName}
                onChange={(e) => setRateForm({ ...rateForm, bankName: e.target.value })}
                placeholder="예: 우리은행"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minRate">현재 최저 금리 (%)</Label>
                <Input
                  id="minRate"
                  type="number"
                  step="0.01"
                  value={rateForm.minRate}
                  onChange={(e) => setRateForm({ ...rateForm, minRate: e.target.value })}
                  placeholder="예: 3.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRate">현재 최고 금리 (%)</Label>
                <Input
                  id="maxRate"
                  type="number"
                  step="0.01"
                  value={rateForm.maxRate}
                  onChange={(e) => setRateForm({ ...rateForm, maxRate: e.target.value })}
                  placeholder="예: 5.2"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm text-slate-700 mb-3">전월 금리 (선택사항)</h4>
              <p className="text-xs text-slate-500 mb-3">
                전월 금리를 입력하면 전월 대비 변동을 자동으로 계산합니다
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastMonthMin">전월 최저 금리 (%)</Label>
                  <Input
                    id="lastMonthMin"
                    type="number"
                    step="0.01"
                    value={rateForm.lastMonthMin}
                    onChange={(e) => setRateForm({ ...rateForm, lastMonthMin: e.target.value })}
                    placeholder="예: 3.6"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastMonthMax">전월 최고 금리 (%)</Label>
                  <Input
                    id="lastMonthMax"
                    type="number"
                    step="0.01"
                    value={rateForm.lastMonthMax}
                    onChange={(e) => setRateForm({ ...rateForm, lastMonthMax: e.target.value })}
                    placeholder="예: 5.3"
                  />
                </div>
              </div>
            </div>

            {/* Preview of changes */}
            {rateForm.minRate && rateForm.lastMonthMin && (
              <div className="bg-slate-50 border rounded-lg p-4">
                <h4 className="text-sm text-slate-700 mb-2">변동 미리보기</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 mb-1">최저 금리 변동:</p>
                    <RateChangeIndicator 
                      current={parseFloat(rateForm.minRate)} 
                      previous={parseFloat(rateForm.lastMonthMin)} 
                    />
                  </div>
                  {rateForm.maxRate && rateForm.lastMonthMax && (
                    <div>
                      <p className="text-slate-600 mb-1">최고 금리 변동:</p>
                      <RateChangeIndicator 
                        current={parseFloat(rateForm.maxRate)} 
                        previous={parseFloat(rateForm.lastMonthMax)} 
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              취소
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!rateForm.bankName || !rateForm.minRate || !rateForm.maxRate}
              className="bg-[#4F46E5] hover:bg-[#4338CA]"
            >
              {isAddMode ? '추가' : '수정'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
