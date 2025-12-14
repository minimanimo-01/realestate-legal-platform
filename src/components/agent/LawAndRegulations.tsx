import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Pin, Calendar } from 'lucide-react';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import type { Article } from '../../App';

interface LawAndRegulationsProps {
  articles: Article[];
}

export function LawAndRegulations({ articles }: LawAndRegulationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    
    const query = searchQuery.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query)
    );
  }, [articles, searchQuery]);

  const sortedArticles = useMemo(() => {
    return [...filteredArticles].sort((a, b) => {
      // Pinned articles first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then by update date
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [filteredArticles]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div>
        <h2 className="mb-2 text-[#1A2B4B]">법률 및 제도 안내</h2>
        <p className="text-[#64748B]">
          정부 규제 및 부동산 법률 변경사항을 확인하세요
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-[#94A3B8]" />
        <Input
          type="text"
          placeholder="제목 또는 내용으로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-[#E2E8F0]"
        />
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {sortedArticles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-[#64748B]">
              검색 결과가 없습니다.
            </CardContent>
          </Card>
        ) : (
          sortedArticles.map((article) => {
            const isExpanded = expandedIds.has(article.id);
            
            return (
              <Card 
                key={article.id}
                className={`cursor-pointer transition-all hover:shadow-md break-words ${
                  article.isPinned ? 'border-[#C7D2FE] bg-[#EEF2FF]' : ''
                }`}
                onClick={() => toggleExpand(article.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {article.isPinned && (
                          <Badge variant="secondary" className="bg-[#4F46E5] text-white">
                            <Pin className="size-3 mr-1" />
                            고정
                          </Badge>
                        )}
                        <span className="text-sm text-[#64748B] flex items-center gap-1">
                          <Calendar className="size-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">{formatDate(article.updatedAt)}</span>
                        </span>
                      </div>
                      <CardTitle className="text-[#1A2B4B] mb-2 break-words">{article.title}</CardTitle>
                      {!isExpanded && (
                        <p className="text-sm text-[#64748B] mt-2 break-words">{article.summary}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="size-5 text-[#94A3B8]" />
                      ) : (
                        <ChevronDown className="size-5 text-[#94A3B8]" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="border-t pt-4">
                      <div 
                        className="prose prose-sm max-w-none text-[#475569] break-words"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                        style={{
                          fontSize: '14px',
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word',
                        }}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>
      
      {/* Info Box */}
      <Card className="bg-[#EEF2FF] border-[#C7D2FE]">
        <CardContent className="pt-6">
          <p className="text-sm text-[#4F46E5] break-words">
            💡 <strong>업데이트 안내:</strong> 법률 및 제도 변경사항은 수시로 업데이트됩니다.
            중요한 변경사항은 상단에 고정됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}