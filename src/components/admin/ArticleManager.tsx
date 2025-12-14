import { useState } from 'react';
import { Plus, Edit, Trash2, Pin, PinOff, FileText, Upload, X, Tag, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { SimpleRichTextEditor } from './SimpleRichTextEditor';
import { BankRateManager } from './BankRateManager';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import type { Article, Document, BankRate } from '../../App';

interface ArticleManagerProps {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  documents: Document[];
  setDocuments: (documents: Document[]) => void;
  bankRates: {
    tier1: BankRate[];
    tier2: BankRate[];
  };
  setBankRates: (rates: any) => void;
}

export function ArticleManager({
  articles,
  setArticles,
  documents,
  setDocuments,
  bankRates,
  setBankRates,
}: ArticleManagerProps) {
  const [activeTab, setActiveTab] = useState('articles');
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isBankRateDialogOpen, setIsBankRateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);
  
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: '',
    summary: '',
    content: '',
    effectiveDate: '',
    targetAudience: '',
  });

  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [documentForm, setDocumentForm] = useState({
    name: '',
    description: '',
    fileType: 'hwp' as 'hwp' | 'pdf' | 'xlsx',
    tips: '',
    tags: [] as string[],
    fileUrl: '',
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [tagInput, setTagInput] = useState('');

  const [editingBankRate, setEditingBankRate] = useState<BankRate & { tier: 'tier1' | 'tier2' } | null>(null);
  const [bankRateForm, setBankRateForm] = useState({
    bankName: '',
    minRate: 0,
    maxRate: 0,
    lastMonthMin: 0,
    lastMonthMax: 0,
  });

  // API helper functions
  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210`;
  const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
  };

  // Article handlers
  const handleOpenArticleDialog = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setArticleForm({
        title: article.title,
        summary: article.summary,
        content: article.content,
        effectiveDate: article.effectiveDate || '',
        targetAudience: article.targetAudience || '',
      });
    } else {
      setEditingArticle(null);
      setArticleForm({
        title: '',
        summary: '',
        content: '',
        effectiveDate: '',
        targetAudience: '',
      });
    }
    setIsArticleDialogOpen(true);
  };

  const handleSaveArticle = async () => {
    try {
      if (editingArticle) {
        // Update existing article
        const response = await fetch(`${API_BASE}/articles/${editingArticle.id}`, {
          method: 'PUT',
          headers: API_HEADERS,
          body: JSON.stringify({
            title: articleForm.title,
            summary: articleForm.summary,
            content: articleForm.content,
            effectiveDate: articleForm.effectiveDate || null,
            targetAudience: articleForm.targetAudience || null,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setArticles(articles.map(a => 
            a.id === editingArticle.id ? result.article : a
          ));
        } else {
          console.error('Failed to update article:', result.error);
          alert('글 수정에 실패했습니다: ' + result.error);
          return;
        }
      } else {
        // Create new article
        const response = await fetch(`${API_BASE}/articles`, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify({
            title: articleForm.title,
            summary: articleForm.summary,
            content: articleForm.content,
            category: 'law',
            effectiveDate: articleForm.effectiveDate || null,
            targetAudience: articleForm.targetAudience || null,
            isPinned: false,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setArticles([result.article, ...articles]);
        } else {
          console.error('Failed to create article:', result.error);
          alert('글 작성에 실패했습니다: ' + result.error);
          return;
        }
      }
      
      setIsArticleDialogOpen(false);
    } catch (error) {
      console.error('Error saving article:', error);
      alert('글 저장 중 오류가 발생했습니다.');
    }
  };

  const handleToggleArticlePin = async (id: string) => {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    try {
      const response = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'PUT',
        headers: API_HEADERS,
        body: JSON.stringify({ isPinned: !article.isPinned }),
      });

      const result = await response.json();

      if (result.success) {
        setArticles(articles.map(a => 
          a.id === id ? result.article : a
        ));
      } else {
        console.error('Failed to toggle pin:', result.error);
        alert('고정 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error toggling article pin:', error);
      alert('고정 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'DELETE',
        headers: API_HEADERS,
      });

      const result = await response.json();

      if (result.success) {
        setArticles(articles.filter(a => a.id !== id));
      } else {
        console.error('Failed to delete article:', result.error);
        alert('글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('글 삭제 중 오류가 발생했습니다.');
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Document handlers
  const handleOpenDocumentDialog = (document?: Document) => {
    if (document) {
      setEditingDocument(document);
      setDocumentForm({
        name: document.name,
        description: document.description,
        fileType: document.fileType,
        tips: document.tips || '',
        tags: document.tags || [],
        fileUrl: document.fileUrl,
      });
      setUploadedFileName(''); // Reset uploaded file name
    } else {
      setEditingDocument(null);
      setDocumentForm({
        name: '',
        description: '',
        fileType: 'hwp',
        tips: '',
        tags: [],
        fileUrl: '',
      });
      setUploadedFileName(''); // Reset uploaded file name
    }
    setIsDocumentDialogOpen(true);
  };

  const handleSaveDocument = async () => {
    try {
      if (editingDocument) {
        // Update existing document
        const response = await fetch(`${API_BASE}/documents/${editingDocument.id}`, {
          method: 'PUT',
          headers: API_HEADERS,
          body: JSON.stringify({
            name: documentForm.name,
            description: documentForm.description,
            fileUrl: documentForm.fileUrl,
            fileType: documentForm.fileType,
            tips: documentForm.tips || null,
            tags: documentForm.tags,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setDocuments(documents.map(d => 
            d.id === editingDocument.id ? result.document : d
          ));
        } else {
          console.error('Failed to update document:', result.error);
          alert('서류 수정에 실패했습니다: ' + result.error);
          return;
        }
      } else {
        // Create new document
        const response = await fetch(`${API_BASE}/documents`, {
          method: 'POST',
          headers: API_HEADERS,
          body: JSON.stringify({
            name: documentForm.name,
            description: documentForm.description,
            fileUrl: documentForm.fileUrl || '#',
            fileType: documentForm.fileType,
            tips: documentForm.tips || null,
            tags: documentForm.tags,
            isPinned: false,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setDocuments([result.document, ...documents]);
        } else {
          console.error('Failed to create document:', result.error);
          alert('서류 추가에 실패했습니다: ' + result.error);
          return;
        }
      }
      
      setIsDocumentDialogOpen(false);
      setUploadedFileName(''); // Reset uploaded file name
    } catch (error) {
      console.error('Error saving document:', error);
      alert('서류 저장 중 오류가 발생했습니다.');
    }
  };

  const handleToggleDocumentPin = async (id: string) => {
    const document = documents.find(d => d.id === id);
    if (!document) return;

    try {
      const response = await fetch(`${API_BASE}/documents/${id}`, {
        method: 'PUT',
        headers: API_HEADERS,
        body: JSON.stringify({ isPinned: !document.isPinned }),
      });

      const result = await response.json();

      if (result.success) {
        setDocuments(documents.map(d => 
          d.id === id ? result.document : d
        ));
      } else {
        console.error('Failed to toggle pin:', result.error);
        alert('고정 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error toggling document pin:', error);
      alert('고정 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/documents/${id}`, {
        method: 'DELETE',
        headers: API_HEADERS,
      });

      const result = await response.json();

      if (result.success) {
        setDocuments(documents.filter(d => d.id !== id));
      } else {
        console.error('Failed to delete document:', result.error);
        alert('서류 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('서류 삭제 중 오류가 발생했습니다.');
    }
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // File upload handler
  const handleFileUpload = async (file: File) => {
    // Validate file size (50MB limit)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    
    if (file.size > MAX_FILE_SIZE) {
      alert(`파일 크기가 너무 큽니다. 최대 50MB까지 업로드 가능합니다.\n현재 파일 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    // Extract file extension and determine fileType
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let detectedFileType: 'hwp' | 'pdf' | 'xlsx' = 'pdf'; // default to pdf
    
    if (fileExtension === 'hwp') {
      detectedFileType = 'hwp';
    } else if (fileExtension === 'pdf') {
      detectedFileType = 'pdf';
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      detectedFileType = 'xlsx';
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
      // Map DOCX to PDF or HWP based on preference (using pdf here)
      detectedFileType = 'pdf';
    }

    setUploadingFile(true);
    setUploadedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Update document form with the uploaded file URL and detected fileType
        setDocumentForm({
          ...documentForm,
          fileUrl: result.fileUrl,
          fileType: detectedFileType,
        });
      } else {
        alert('파일 업로드에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploadingFile(false);
    }
  };

  // Tag handlers
  const handleAddTag = () => {
    if (tagInput.trim() && !documentForm.tags.includes(tagInput.trim())) {
      setDocumentForm({ ...documentForm, tags: [...documentForm.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setDocumentForm({ ...documentForm, tags: documentForm.tags.filter(t => t !== tag) });
  };

  const openDeleteDialog = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'article') {
        handleDeleteArticle(itemToDelete.id);
      } else if (itemToDelete.type === 'document') {
        handleDeleteDocument(itemToDelete.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">법률/제도 안내</TabsTrigger>
          <TabsTrigger value="documents">신청 서류</TabsTrigger>
          <TabsTrigger value="rates">금리 관리</TabsTrigger>
        </TabsList>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-slate-900">법률 및 제도 안내 관리</h3>
              <p className="text-sm text-slate-600">총 {articles.length}건</p>
            </div>
            <Button onClick={() => handleOpenArticleDialog()}>
              <Plus className="size-4 mr-2" />
              새 글 작성
            </Button>
          </div>

          <div className="space-y-3">
            {articles.map((article) => (
              <Card key={article.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {article.isPinned && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <Pin className="size-3 mr-1" />
                            고정
                          </Badge>
                        )}
                        <span className="text-sm text-slate-500">
                          {article.updatedAt}
                        </span>
                      </div>
                      <h4 className="text-slate-900 mb-1">{article.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-2">{article.summary}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleArticlePin(article.id)}
                      >
                        {article.isPinned ? (
                          <PinOff className="size-4" />
                        ) : (
                          <Pin className="size-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenArticleDialog(article)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog('article', article.id)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {articles.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-slate-500">
                  작성된 글이 없습니다. 새 글을 작성해주세요.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-slate-900">신청 서류 관리</h3>
              <p className="text-sm text-slate-600">총 {documents.length}개</p>
            </div>
            <Button onClick={() => handleOpenDocumentDialog()}>
              <Plus className="size-4 mr-2" />
              새 서류 추가
            </Button>
          </div>

          <div className="space-y-3">
            {documents.map((document) => (
              <Card key={document.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {document.isPinned && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <Pin className="size-3 mr-1" />
                            고정
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {document.fileType.toUpperCase()}
                        </Badge>
                        {document.tags && document.tags.length > 0 && document.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-700">
                            <Tag className="size-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        <span className="text-sm text-slate-500">
                          {document.updatedAt}
                        </span>
                      </div>
                      <h4 className="text-slate-900 mb-1">{document.name}</h4>
                      <p className="text-sm text-slate-600">{document.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleDocumentPin(document.id)}
                      >
                        {document.isPinned ? (
                          <PinOff className="size-4" />
                        ) : (
                          <Pin className="size-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDocumentDialog(document)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog('document', document.id)}
                      >
                        <Trash2 className="size-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {documents.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-slate-500">
                  등록된 서류가 없습니다. 새 서류를 추가해주세요.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Bank Rates Tab */}
        <TabsContent value="rates" className="space-y-4">
          <BankRateManager
            bankRates={bankRates}
            setBankRates={setBankRates}
          />
        </TabsContent>
      </Tabs>

      {/* Article Dialog */}
      <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? '글 수정' : '새 글 작성'}
            </DialogTitle>
            <DialogDescription>
              법률 및 제도 안내 내용을 작성하세요
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={articleForm.title}
                onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                placeholder="예: 2025년 취득세율 변경 안내"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">요약 *</Label>
              <Input
                id="summary"
                value={articleForm.summary}
                onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                placeholder="예: 조정대상지역 취득세율 완화 조치"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">상세 내용 *</Label>
              <SimpleRichTextEditor
                value={articleForm.content}
                onChange={(value) => setArticleForm({ ...articleForm, content: value })}
                placeholder="마크다운 형식으로 작성 가능합니다.&#10;&#10;## 제목&#10;- 목록 항목"
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="effectiveDate">시행일</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={articleForm.effectiveDate}
                  onChange={(e) => setArticleForm({ ...articleForm, effectiveDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">대상</Label>
                <Input
                  id="targetAudience"
                  value={articleForm.targetAudience}
                  onChange={(e) => setArticleForm({ ...articleForm, targetAudience: e.target.value })}
                  placeholder="예: 조정대상지역 주택 취득자"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArticleDialogOpen(false)}>
              취소
            </Button>
            <Button 
              onClick={handleSaveArticle}
              disabled={!articleForm.title || !articleForm.summary || !articleForm.content}
            >
              {editingArticle ? '수정' : '작성'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Dialog */}
      <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDocument ? '서류 수정' : '새 서류 추가'}
            </DialogTitle>
            <DialogDescription>
              신청 서류 정보를 입력하세요
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="docName">서류명 *</Label>
              <Input
                id="docName"
                value={documentForm.name}
                onChange={(e) => setDocumentForm({ ...documentForm, name: e.target.value })}
                placeholder="예: 부동산 매매계약서"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="docDescription">설명 *</Label>
              <Input
                id="docDescription"
                value={documentForm.description}
                onChange={(e) => setDocumentForm({ ...documentForm, description: e.target.value })}
                placeholder="예: 표준 부동산 매매계약서 양식"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUpload">파일 업로드</Label>
              <div className="space-y-2">
                <Input
                  id="fileUpload"
                  type="file"
                  accept=".hwp,.pdf,.xlsx,.xls,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                />
                <div className="flex items-center gap-2">
                  {uploadingFile && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Upload className="size-3 mr-1 animate-pulse" />
                      업로드 중...
                    </Badge>
                  )}
                  {uploadedFileName && !uploadingFile && (
                    <>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <FileText className="size-3 mr-1" />
                        {uploadedFileName}
                      </Badge>
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                        형식: {documentForm.fileType.toUpperCase()}
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  지원 형식: HWP, PDF, XLSX, DOCX (최대 50MB)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="docTips">작성 팁</Label>
              <Textarea
                id="docTips"
                value={documentForm.tips}
                onChange={(e) => setDocumentForm({ ...documentForm, tips: e.target.value })}
                placeholder="작성 시 주의사항이나 팁을 입력하세요"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">태그</Label>
              <div className="flex items-center">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="태그를 입력하세요"
                  className="w-full p-2 border rounded-md"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddTag}
                >
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {documentForm.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentDialogOpen(false)}>
              취소
            </Button>
            <Button 
              onClick={handleSaveDocument}
              disabled={!documentForm.name || !documentForm.description}
            >
              {editingDocument ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}