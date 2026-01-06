import { useState, useMemo } from 'react';
import { Download, Search, FileText, Pin, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { Document } from '../../App';

interface DocumentDownloadsProps {
  documents: Document[];
}

export function DocumentDownloads({ documents }: DocumentDownloadsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showInAppBrowserWarning, setShowInAppBrowserWarning] = useState(false);

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    
    const query = searchQuery.toLowerCase();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  const sortedDocuments = useMemo(() => {
    return [...filteredDocuments].sort((a, b) => {
      // Pinned documents first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [filteredDocuments]);

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'HWP':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'PDF':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'XLSX':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'DOCX':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Detect in-app browser (KakaoTalk, Naver, Facebook, Instagram, Line)
  const isInAppBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    return (
      ua.includes('kakaotalk') ||
      ua.includes('naver') ||
      ua.includes('fban') ||
      ua.includes('fbav') ||
      ua.includes('instagram') ||
      ua.includes('line')
    );
  };

  const handleDownload = async (doc: Document) => {
    // Check if running in in-app browser
    if (isInAppBrowser()) {
      setShowInAppBrowserWarning(true);
      return;
    }

    console.log('다운로드 시작:', doc.name);
    setDownloadingId(doc.id);

    try {
      // Check if fileUrl exists
      if (!doc.fileUrl || doc.fileUrl === '#') {
        console.log('파일 URL 없음:', doc.name);
        setDownloadingId(null);
        toast.error(`"${doc.name}" 파일이 아직 업로드되지 않았습니다.`, {
          duration: 4000,
        });
        return;
      }

      console.log('파일 다운로드 요청 중...', doc.fileUrl);
      
      // Detect iOS device
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Set download filename
      const extension = doc.fileType.toLowerCase();
      const filename = `${doc.name}.${extension}`;
      
      // Use server proxy download endpoint with Authorization header
      const proxyUrl = `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210/download-proxy?url=${encodeURIComponent(doc.fileUrl)}&filename=${encodeURIComponent(filename)}`;
      
      console.log('서버 프록시를 통한 다운로드 시작');
      
      // Fetch file from server
      const response = await fetch(proxyUrl, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      
      if (!response.ok) {
        throw new Error('다운로드 실패');
      }

      // Stream response to blob
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      
      // iOS Safari: Use _blank to trigger download in new tab (more reliable)
      if (isIOS) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      
      document.body.appendChild(a);
      a.click();
      
      // iOS needs longer timeout before cleanup
      const cleanupDelay = isIOS ? 1000 : 100;
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      }, cleanupDelay);
      
      // Show success message
      if (isIOS) {
        toast.success('파일을 새 탭에서 엽니다', {
          description: 'Safari의 공유 버튼으로 저장하거나 공유하세요.',
          duration: 6000,
        });
      } else if (isMobile) {
        toast.success('다운로드를 시작합니다.', {
          description: '다운로드 폴더를 확인하세요.',
          duration: 5000,
        });
      } else {
        toast.success('다운로드 완료!', {
          description: `"${doc.name}" 파일이 저장되었습니다.`,
          duration: 3000,
        });
      }
      
      console.log('다운로드 완료:', doc.name);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('다운로드 중 오류가 발생했습니다.', {
        description: '파일을 다시 시도하거나 관리자에게 문의해주세요.',
        duration: 4000,
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div>
        <h2 className="mb-2 text-[#1A2B4B]">등기 관련 서식 다운로드</h2>
        <p className="text-[#64748B]">
          필요한 서식을 다운로드하여 활용하세요
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#94A3B8]" />
        <Input
          type="text"
          placeholder="서식명으로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-[#E2E8F0]"
        />
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {sortedDocuments.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="py-12 text-center text-[#64748B]">
              검색 결과가 없습니다.
            </CardContent>
          </Card>
        ) : (
          sortedDocuments.map((doc) => (
            <Card 
              key={doc.id}
              className={`hover:shadow-md transition-all break-words ${
                doc.isPinned ? 'border-[#C7D2FE] bg-[#EEF2FF]' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {doc.isPinned && (
                      <Badge variant="secondary" className="bg-[#4F46E5] text-white">
                        <Pin className="size-3 mr-1" />
                        고정
                      </Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={getFileTypeColor(doc.fileType)}
                    >
                      {doc.fileType}
                    </Badge>
                  </div>
                  <FileText className="size-5 text-[#94A3B8] flex-shrink-0" />
                </div>
                <CardTitle className="text-[#1A2B4B] break-words">{doc.name}</CardTitle>
                <CardDescription className="text-[#64748B] break-words">{doc.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {doc.tips && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="size-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm text-amber-900">
                          <strong>작성 팁:</strong>
                        </p>
                        <p className="text-sm text-amber-800 mt-1 break-words">{doc.tips}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full bg-[#4F46E5] hover:bg-[#4338CA]"
                  onClick={() => handleDownload(doc)}
                  disabled={downloadingId === doc.id}
                >
                  {downloadingId === doc.id ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="size-4 mr-2" />
                  )}
                  다운로드
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Info Boxes */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-[#EEF2FF] border-[#C7D2FE]">
          <CardContent className="pt-6">
            <p className="text-sm text-[#4F46E5] break-words">
              💡 <strong>모바일에서도 다운로드 가능:</strong> 스마트폰에서 파일 다운로드하여 
              카카오톡, 이메일 등으로 전송할 수 있습니다.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#DBEAFE] border-[#93C5FD]">
          <CardContent className="pt-6">
            <p className="text-sm text-[#1E40AF] break-words">
              📱 <strong>서식 문의:</strong> 작성 방법이 궁금하시면 담당자에게 연락주세요.
              Tel: 010-9209-7693
            </p>
          </CardContent>
        </Card>
      </div>

      {/* In-App Browser Warning Dialog */}
      <Dialog open={showInAppBrowserWarning} onOpenChange={setShowInAppBrowserWarning}>
        <DialogContent className="sm:max-w-[425px] px-6 py-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-[#1A2B4B] pr-8 leading-relaxed">
              📱 카카오톡에서는 파일 다운로드가 제한됩니다
            </DialogTitle>
            <DialogDescription className="text-[#64748B] pt-2 leading-relaxed">
              우측 하단 버튼을 눌러 '외부 브라우저'에서 열어서 다운로드 해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-6">
            <Button 
              onClick={() => setShowInAppBrowserWarning(false)}
              className="bg-[#4F46E5] hover:bg-[#4338CA]"
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
