import { useState, useRef } from 'react';
import { Receipt, Download, Printer, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Separator } from '../zui/separator';
import html2canvas from 'html2canvas';

export function BalanceForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    // 매수인 정보
    buyerName: '',
    buyerLoanBank: '',
    buyerLoanAmount: '',
    
    // 매도인 정보
    sellerName: '',
    repaymentBank: '',
    repaymentBranch: '',
    repaymentTel: '',
    repaymentFax: '',
    propertyDate: '',
    propertyUnit: '',
    repaymentTotal: '',
    repaymentAccount: '',
    repaymentAccountHolder: '',
    
    // 잔금 내역
    balanceAmount: '',
    
    // 최종 정산
    finalAccount: '',
    finalAccountHolder: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCurrency = (value: string) => {
    if (!value) return '';
    const number = parseInt(value.replace(/,/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('ko-KR');
  };

  const handleCurrencyInput = (field: string, value: string) => {
    const numbersOnly = value.replace(/[^\d]/g, '');
    handleInputChange(field, numbersOnly);
  };

  // 매수인 최종 송금액 = 잔금액 - 매수인 대출금
  const calculateBuyerFinalAmount = () => {
    const balance = parseInt(formData.balanceAmount || '0');
    const loan = parseInt(formData.buyerLoanAmount || '0');
    return balance - loan;
  };

  // 남는 금액 = 대출금 - 상환금
  const calculateRemainingAmount = () => {
    const loan = parseInt(formData.buyerLoanAmount || '0');
    const repayment = parseInt(formData.repaymentTotal || '0');
    return loan - repayment;
  };

  const handleDownloadImage = async () => {
    if (!formRef.current) return;

    try {
      // 저장 전 placeholder 숨기기
      const inputs = formRef.current.querySelectorAll('input');
      const originalPlaceholders: string[] = [];
      
      inputs.forEach((input, index) => {
        originalPlaceholders[index] = input.placeholder;
        input.placeholder = '';
      });

      // html2canvas를 사용하여 PNG 이미지로 변환
      const canvas = await html2canvas(formRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 고해상도로 저장
        useCORS: true,
        logging: false,
        windowWidth: formRef.current.scrollWidth,
        windowHeight: formRef.current.scrollHeight,
      });
      
      // placeholder 복원
      inputs.forEach((input, index) => {
        input.placeholder = originalPlaceholders[index];
      });
      
      // PNG 형식으로 다운로드
      const link = document.createElement('a');
      const dateStr = new Date().toLocaleDateString('ko-KR').replace(/\./g, '').replace(/\s/g, '');
      link.download = `상환_및_잔금_지급_내역_${dateStr}.png`;
      link.href = canvas.toDataURL('image/png', 1.0); // PNG 형식, 최고 품질
      link.click();
    } catch (error) {
      console.error('이미지 저장 오류:', error);
      
      // 오류 발생 시에도 placeholder 복원
      const inputs = formRef.current?.querySelectorAll('input');
      if (inputs) {
        inputs.forEach((input) => {
          if (!input.placeholder) {
            // placeholder가 비어있다면 원래 값으로 복원
            const id = input.id;
            if (id === 'balanceAmount' || id === 'buyerLoanAmount' || id === 'repaymentTotal') {
              input.placeholder = '_______________';
            } else {
              input.placeholder = '[ ]';
            }
          }
        });
      }
      
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handlePrint = () => {
    // 인쇄 시 placeholder 숨기기
    const inputs = formRef.current?.querySelectorAll('input');
    const originalPlaceholders: string[] = [];
    
    if (inputs) {
      inputs.forEach((input, index) => {
        originalPlaceholders[index] = input.placeholder;
        input.placeholder = '';
      });
    }

    window.print();

    // 인쇄 후 placeholder 복원
    if (inputs) {
      inputs.forEach((input, index) => {
        input.placeholder = originalPlaceholders[index];
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print">
        <h2 className="mt-4 mb-2 text-slate-900">상환 및 잔금 지급 내역서</h2>
        <p className="text-slate-600">
          잔금일에 상환 및 잔금 지급 내역서로 투명한 정산을 하실 수 있습니다. 
        </p>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200 no-print">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="mb-2">
                <strong>정산서 작성 안내</strong>
              </p>
              <p className="text-blue-800">
                복잡한 잔금 계산과 상환 절차를 고객님께서 직접 확인하실 필요 없습니다. 잔금일에 [상환 및 잔금 지급 내역서]를 작성하여 자금 흐름을 명확히 정리해 드립니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Card */}
      <Card className="border-2">
        <CardHeader className="no-print">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="size-5" />
            상환 및 잔금 지급 내역서
          </CardTitle>
          <CardDescription>
            모든 항목을 꼼꼼히 확인하여, 전문 정산서를 작성 후 전달드립니다
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div ref={formRef} className="space-y-4 p-2 sm:p-6 bg-white print-content" style={{
            backgroundColor: '#ffffff',
            color: '#0f172a'
          }}>
            {/* Header for printable version */}
            <div className="text-center border-b-2 pb-3" style={{ borderColor: '#1e293b' }}>
              <h3 className="mb-1 text-[20px]" style={{ color: '#0f172a' }}>상환 및 잔금 지급 내역</h3>
              <p className="text-xs" style={{ color: '#64748b' }}>다온 법무사 사무소</p>
            </div>

            {/* 잔금 내역 정리 */}
            <div className="space-y-2">
              <h4 className="text-sm border-b pb-1" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
                {'<잔금내역 정리>'}
              </h4>
              
              <div className="p-3 rounded border-2" style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div className="space-y-1">
                    <Label htmlFor="balanceAmount" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>잔금액</Label>
                    <Input
                      id="balanceAmount"
                      type="text"
                      value={formatCurrency(formData.balanceAmount)}
                      onChange={(e) => handleCurrencyInput('balanceAmount', e.target.value)}
                      placeholder="_______________"
                      className="text-center border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="buyerLoanAmount" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>매수인 대출금</Label>
                    <Input
                      id="buyerLoanAmount"
                      type="text"
                      value={formatCurrency(formData.buyerLoanAmount)}
                      onChange={(e) => handleCurrencyInput('buyerLoanAmount', e.target.value)}
                      placeholder="_______________"
                      className="text-center border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>

                  <div className="p-2 rounded border-2" style={{ backgroundColor: '#dbeafe', borderColor: '#60a5fa' }}>
                    <div className="text-center">
                      <Label className="text-xs" style={{ color: '#1e3a8a' }}>매수인 최종 송금액</Label>
                      <div className="text-sm" style={{ color: '#1e3a8a', lineHeight: '1.5' }}>
                        {formatCurrency(calculateBuyerFinalAmount().toString())}원
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 매수인 정보 박스 */}
            <div className="space-y-2">
              <h4 className="text-sm border-b pb-1" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
                매수인 정보
              </h4>
              
              <div className="border-2 p-3 rounded" style={{ borderColor: '#94a3b8', backgroundColor: '#f8fafc' }}>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="buyerName" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>매수인 성함</Label>
                    <Input
                      id="buyerName"
                      type="text"
                      value={formData.buyerName}
                      onChange={(e) => handleInputChange('buyerName', e.target.value)}
                      placeholder="[ ]"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="buyerLoanBank" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>대출은행</Label>
                    <Input
                      id="buyerLoanBank"
                      type="text"
                      value={formData.buyerLoanBank}
                      onChange={(e) => handleInputChange('buyerLoanBank', e.target.value)}
                      placeholder="[ ]"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="displayBuyerLoanAmount" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>대출금액</Label>
                    <Input
                      id="displayBuyerLoanAmount"
                      type="text"
                      value={formatCurrency(formData.buyerLoanAmount)}
                      readOnly
                      placeholder="_______________"
                      className="border-2 bg-white text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        backgroundColor: '#ffffff', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 매도인 및 상환 박스 */}
            <div className="space-y-2">
              <h4 className="text-sm border-b pb-1" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
                매도인 및 상환 정보
              </h4>
              
              <div className="border-2 p-3 rounded" style={{ borderColor: '#94a3b8', backgroundColor: '#f8fafc' }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="sellerName" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>매도인명</Label>
                    <Input
                      id="sellerName"
                      type="text"
                      value={formData.sellerName}
                      onChange={(e) => handleInputChange('sellerName', e.target.value)}
                      placeholder="[ ]"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="repaymentBank" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>상환은행</Label>
                    <Input
                      id="repaymentBank"
                      type="text"
                      value={formData.repaymentBank}
                      onChange={(e) => handleInputChange('repaymentBank', e.target.value)}
                      placeholder="[ ]"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="repaymentBranch" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>지점</Label>
                    <Input
                      id="repaymentBranch"
                      type="text"
                      value={formData.repaymentBranch}
                      onChange={(e) => handleInputChange('repaymentBranch', e.target.value)}
                      placeholder="[ ]"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>연락처</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        id="repaymentTel"
                        type="text"
                        value={formData.repaymentTel}
                        onChange={(e) => handleInputChange('repaymentTel', e.target.value)}
                        placeholder="Tel: [ ]"
                        className="border-2 text-sm"
                        style={{ 
                          borderColor: '#cbd5e1', 
                          height: '40px',
                          padding: '0 12px',
                          lineHeight: '40px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          verticalAlign: 'middle'
                        }}
                      />
                      <Input
                        id="repaymentFax"
                        type="text"
                        value={formData.repaymentFax}
                        onChange={(e) => handleInputChange('repaymentFax', e.target.value)}
                        placeholder="Fax: [ ]"
                        className="border-2 text-sm"
                        style={{ 
                          borderColor: '#cbd5e1', 
                          height: '40px',
                          padding: '0 12px',
                          lineHeight: '40px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          verticalAlign: 'middle'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="propertyDate" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>기준일</Label>
                    <Input
                      id="propertyDate"
                      type="text"
                      value={formData.propertyDate}
                      onChange={(e) => handleInputChange('propertyDate', e.target.value)}
                      placeholder="[ ]"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="propertyUnit" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>호수</Label>
                    <Input
                      id="propertyUnit"
                      type="text"
                      value={formData.propertyUnit}
                      onChange={(e) => handleInputChange('propertyUnit', e.target.value)}
                      placeholder="[ ]"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="repaymentTotal" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>상환 총액</Label>
                    <Input
                      id="repaymentTotal"
                      type="text"
                      value={formatCurrency(formData.repaymentTotal)}
                      onChange={(e) => handleCurrencyInput('repaymentTotal', e.target.value)}
                      placeholder="_______________"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="repaymentAccount" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>상환 계좌번호</Label>
                    <Input
                      id="repaymentAccount"
                      type="text"
                      value={formData.repaymentAccount}
                      onChange={(e) => handleInputChange('repaymentAccount', e.target.value)}
                      placeholder="[ ]"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="repaymentAccountHolder" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem' }}>예금주</Label>
                    <Input
                      id="repaymentAccountHolder"
                      type="text"
                      value={formData.repaymentAccountHolder}
                      onChange={(e) => handleInputChange('repaymentAccountHolder', e.target.value)}
                      placeholder="[ ]"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#cbd5e1', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 최종 정산 섹션 */}
            <div className="space-y-2">
              <h4 className="text-sm border-b pb-1" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
                최종 정산
              </h4>
              
              <div className="p-3 rounded border-2" style={{ backgroundColor: '#ecfdf5', borderColor: '#86efac' }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div className="text-center">
                    <Label className="text-xs" style={{ color: '#475569' }}>대출금</Label>
                    <div className="text-sm" style={{ color: '#064e3b' }}>
                      {formatCurrency(formData.buyerLoanAmount)}원
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Label className="text-xs" style={{ color: '#475569' }}>상환금</Label>
                    <div className="text-sm" style={{ color: '#064e3b' }}>
                      {formatCurrency(formData.repaymentTotal)}원
                    </div>
                  </div>
                  
                  <div className="p-2 rounded border-2" style={{ backgroundColor: '#bbf7d0', borderColor: '#4ade80' }}>
                    <div className="text-center">
                      <Label className="text-xs" style={{ color: '#064e3b' }}>남는 금액</Label>
                      <div className="text-sm" style={{ color: '#064e3b' }}>
                        {formatCurrency(calculateRemainingAmount().toString())}원
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded border-2 mt-2" style={{ backgroundColor: '#eff6ff', borderColor: '#60a5fa' }}>
                <h5 className="mb-2 text-center text-sm" style={{ color: '#1e3a8a' }}>매도인 최종 입금 정보</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="finalAccount" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem', color: '#1e3a8a' }}>최종 입금 계좌번호</Label>
                    <Input
                      id="finalAccount"
                      type="text"
                      value={formData.finalAccount}
                      onChange={(e) => handleInputChange('finalAccount', e.target.value)}
                      placeholder="[ ]"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#60a5fa', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="finalAccountHolder" className="text-xs" style={{ display: 'block', marginBottom: '0.25rem', color: '#1e3a8a' }}>예금주</Label>
                    <Input
                      id="finalAccountHolder"
                      type="text"
                      value={formData.finalAccountHolder}
                      onChange={(e) => handleInputChange('finalAccountHolder', e.target.value)}
                      placeholder="[ ]"
                      className="border-2 text-sm"
                      style={{ 
                        borderColor: '#60a5fa', 
                        height: '40px',
                        padding: '0 12px',
                        lineHeight: '40px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        verticalAlign: 'middle'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer for printable version */}
            <div className="text-center text-xs pt-3 border-t" style={{ color: '#64748b', borderColor: '#cbd5e1' }}>
              <p>다온 법무사 사무소 | 문의: 031-365-3410</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 no-print">
            <Button
              onClick={handleDownloadImage}
              className="flex-1 gap-2"
              variant="outline"
            >
              <Download className="size-4" />
              이미지로 저장
            </Button>
            
            <Button
              onClick={handlePrint}
              className="flex-1 gap-2"
            >
              <Printer className="size-4" />
              인쇄하기
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-4 no-print">
            ※ 작성한 정산서는 이미지로 저장하거나 인쇄할 수 있습니다
          </p>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-emerald-50 border-emerald-200 no-print">
        <CardContent className="pt-6">
          <h4 className="text-emerald-900 mb-3">작성 가이드</h4>
          <ul className="space-y-2 text-sm text-emerald-800">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">•</span>
              <span>모든 금액 필드는 숫자만 입력하면 자동으로 원화 형식으로 표시됩니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">•</span>
              <span>잔금내역 정리: 잔금액에서 매수인 대출금을 뺀 금액이 매수인 최종 송금액입니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">•</span>
              <span>최종 정산: 대출금에서 상환금을 뺀 금액이 남는 금액으로 매도인에게 송금됩니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-0.5">•</span>
              <span>모든 항목을 정확히 입력 후 이미지로 저장하거나 인쇄하여 사용하세요</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style>{`
        @media print {
          /* 인쇄 시 페이지 전체에서 print-content만 표시 */
          body * {
            visibility: hidden;
          }
          
          .print-content, .print-content * {
            visibility: visible;
          }
          
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px !important;
            margin: 0 !important;
          }
          
          /* no-print 클래스가 있는 요소 숨기기 */
          .no-print {
            display: none !important;
          }
          
          /* 페이지 설정 */
          @page {
            size: A4;
            margin: 15mm;
          }
          
          /* 인쇄용 추가 스타일 */
          .print-content input {
            border: 1px solid #cbd5e1 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .print-content div[style*="backgroundColor"] {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
