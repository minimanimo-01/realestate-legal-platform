import { FileCheck, CheckCircle2, Home, Gift, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';

export function RegistrationDocuments() {
  const documentsByType = {
    sale: {
      seller: [
        '등기권리증 (또는 등기필증)',
        '인감증명서 (부동산 처분용, 발급 3개월 이내)',
        '주민등록초본 (발급 3개월 이내)',
        '인감도장',
        '신분증 (주민등록증 또는 운전면허증)',
      ],
      buyer: [
        '주민등록초본 (발급 3개월 이내)',
        '도장 (인감도장 또는 서명)',
        '신분증 (주민등록증 또는 운전면허증)',
        '매매계약서 원본',
      ],
    },
    gift: {
      donor: [
        '등기권리증 (또는 등기필증)',
        '인감증명서 (부동산 처분용, 발급 3개월 이내)',
        '주민등록초본 (발급 3개월 이내)',
        '인감도장',
        '신분증',
      ],
      receiver: [
        '주민등록초본 (발급 3개월 이내)',
        '가족관계증명서 (증여자와의 관계 확인용)',
        '도장',
        '신분증',
        '증여계약서',
      ],
    },
    inheritance: {
      documents: [
        '피상속인 제적등본 (사망 확인용)',
        '상속인 전원의 가족관계증명서',
        '상속인 전원의 주민등록초본',
        '상속인 전원의 인감증명서 및 인감도장',
        '유산분할협의서 (상속인이 여럿인 경우)',
        '등기권리증',
      ],
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mt-4 mb-2 text-[#1A2B4B]">등기 필요 서류 안내</h2>
        <p className="text-[#64748B]">
          등기 유형별 필요한 서류를 확인하세요
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sale">
        <TabsList className="grid w-full grid-cols-3 bg-white">
          <TabsTrigger value="sale" className="gap-2 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white">
            <Home className="size-4" />
            매매
          </TabsTrigger>
          <TabsTrigger value="gift" className="gap-2 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white">
            <Gift className="size-4" />
            증여
          </TabsTrigger>
          <TabsTrigger value="inheritance" className="gap-2 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white">
            <Heart className="size-4" />
            상속
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sale" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Seller Documents */}
            <Card className="border-2 border-rose-200 bg-rose-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1A2B4B]">
                  <div className="size-8 rounded-full bg-rose-100 flex items-center justify-center">
                    <FileCheck className="size-4 text-rose-600" />
                  </div>
                  매도인 준비 서류
                </CardTitle>
                <CardDescription className="text-[#64748B]">
                  집을 파는 사람이 준비해야 할 서류
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {documentsByType.sale.seller.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#475569]">{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Buyer Documents */}
            <Card className="border-2 border-[#93C5FD] bg-[#DBEAFE]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1A2B4B]">
                  <div className="size-8 rounded-full bg-[#BFDBFE] flex items-center justify-center">
                    <FileCheck className="size-4 text-[#2563EB]" />
                  </div>
                  매수인 준비 서류
                </CardTitle>
                <CardDescription className="text-[#64748B]">
                  집을 사는 사람이 준비해야 할 서류
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {documentsByType.sale.buyer.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <span className="text-[#475569]">{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gift" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Donor Documents */}
            <Card className="border-2 border-[#C7D2FE] bg-[#EEF2FF]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1A2B4B]">
                  <div className="size-8 rounded-full bg-[#C7D2FE] flex items-center justify-center">
                    <FileCheck className="size-4 text-[#4F46E5]" />
                  </div>
                  증여자 준비 서류
                </CardTitle>
                <CardDescription className="text-[#64748B]">
                  증여하는 사람이 준비해야 할 서류
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {documentsByType.gift.donor.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                      <span className="text-[#475569]">{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Receiver Documents */}
            <Card className="border-2 border-emerald-200 bg-emerald-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1A2B4B]">
                  <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FileCheck className="size-4 text-emerald-600" />
                  </div>
                  수증자 준비 서류
                </CardTitle>
                <CardDescription className="text-[#64748B]">
                  증여받는 사람이 준비해야 할 서류
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {documentsByType.gift.receiver.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-[#475569]">{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inheritance" className="space-y-4">
          <Card className="border-2 border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1A2B4B]">
                <div className="size-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <FileCheck className="size-4 text-amber-600" />
                </div>
                상속 등기 필요 서류
              </CardTitle>
              <CardDescription className="text-[#64748B]">
                상속 등기 시 준비해야 할 서류
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {documentsByType.inheritance.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[#475569]">{doc}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Important Notes */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-[#DBEAFE] border-[#93C5FD]">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <Badge className="bg-[#2563EB] mt-0.5">필수</Badge>
              <div>
                <p className="text-sm text-[#1E40AF] mb-2">
                  <strong>발급 유효기간 확인</strong>
                </p>
                <p className="text-sm text-[#1E40AF]">
                  주민등록초본 및 인감증명서는 발급일로부터 3개월 이내의 서류만 유효합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <Badge className="bg-emerald-600 mt-0.5">TIP</Badge>
              <div>
                <p className="text-sm text-emerald-900 mb-2">
                  <strong>정확한 서류 확인</strong>
                </p>
                <p className="text-sm text-emerald-800">
                  등기 신청 전 법무사 사무실에 연락하여 서류가 정확한지 확인받으세요.
                  Tel: 031-365-3410
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}