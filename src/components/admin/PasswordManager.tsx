import { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Eye, EyeOff, Loader2, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
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

interface PasswordEntry {
  id: string;
  category: 'agent' | 'buyer';
  password: string;
  name?: string; // Optional name for password
  createdAt: string;
  expiresAt?: string; // Optional expiration date
}

export function PasswordManager() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Admin password states
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordSet, setAdminPasswordSet] = useState(false);
  const [adminPasswordCreatedAt, setAdminPasswordCreatedAt] = useState('');
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  
  const [newPassword, setNewPassword] = useState({
    category: 'agent' as 'agent' | 'buyer',
    password: '',
    name: '', // Optional name for password
    expiresAt: '', // Optional expiration date
  });

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210`;

  // Load passwords from Supabase on mount
  useEffect(() => {
    loadPasswords();
    loadAdminPassword();
  }, []);

  const loadPasswords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/passwords`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setPasswords(data.passwords || []);
      } else {
        console.error('Failed to load passwords:', data.error);
      }
    } catch (error) {
      console.error('Error loading passwords:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminPassword = async () => {
    try {
      const response = await fetch(`${API_URL}/admin-password`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      if (data.success && data.password) {
        setAdminPassword(data.password);
        setAdminPasswordSet(true);
        setAdminPasswordCreatedAt(data.createdAt || '');
      } else {
        setAdminPasswordSet(false);
      }
    } catch (error) {
      console.error('Error loading admin password:', error);
    }
  };

  const handleSaveAdminPassword = async () => {
    if (newAdminPassword !== confirmAdminPassword) {
      alert('패스워드가 일치하지 않습니다.');
      return;
    }

    if (newAdminPassword.length < 8) {
      alert('패스워드는 8자 이상이어야 합니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/admin-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ password: newAdminPassword }),
      });

      const data = await response.json();
      if (data.success) {
        setAdminPassword(newAdminPassword);
        setAdminPasswordSet(true);
        setIsAdminDialogOpen(false);
        setNewAdminPassword('');
        setConfirmAdminPassword('');
        await loadAdminPassword(); // Reload to get createdAt
        alert(adminPasswordSet ? '관리자 패스워드가 변경되었습니다.' : '관리자 패스워드가 설정되었습니다.');
      } else {
        console.error('Failed to save admin password:', data.error);
        alert('패스워드 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving admin password:', error);
      alert('패스워드 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDialog = () => {
    setNewPassword({
      category: 'agent',
      password: '',
      name: '', // Optional name for password
      expiresAt: '',
    });
    setIsDialogOpen(true);
  };

  const handleAddPassword = async () => {
    try {
      setIsSubmitting(true);
      const newEntry: PasswordEntry = {
        id: Date.now().toString(),
        category: newPassword.category,
        password: newPassword.password,
        name: newPassword.name, // Optional name for password
        createdAt: new Date().toISOString().split('T')[0],
      };

      // Only add expiresAt if it's set
      if (newPassword.expiresAt) {
        newEntry.expiresAt = newPassword.expiresAt;
      }

      const response = await fetch(`${API_URL}/passwords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(newEntry),
      });

      const data = await response.json();
      if (data.success) {
        setPasswords([...passwords, data.password]);
        setIsDialogOpen(false);
        setNewPassword({ category: 'agent', password: '', name: '', expiresAt: '' });
      } else {
        console.error('Failed to add password:', data.error);
        alert('패스워드 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error adding password:', error);
      alert('패스워드 추가 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePassword = async (id: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/passwords/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setPasswords(passwords.filter(p => p.id !== id));
        setDeleteDialogOpen(false);
        setPasswordToDelete(null);
      } else {
        console.error('Failed to delete password:', data.error);
        alert('패스워드 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting password:', error);
      alert('패스워드 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setPasswordToDelete(id);
    setDeleteDialogOpen(true);
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getCategoryLabel = (category: 'agent' | 'buyer') => {
    return category === 'agent' ? '부동산 사장님' : '매수인';
  };

  const getCategoryColor = (category: 'agent' | 'buyer') => {
    return category === 'agent' 
      ? 'bg-blue-100 text-blue-700 border-blue-200'
      : 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  const isPasswordExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    const today = new Date().toISOString().split('T')[0];
    return expiresAt < today;
  };

  const getExpirationStatus = (expiresAt?: string) => {
    if (!expiresAt) {
      return { text: '만료 없음', color: 'text-slate-500', badgeColor: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
    
    const today = new Date();
    const expDate = new Date(expiresAt);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: '만료됨', color: 'text-red-600', badgeColor: 'bg-red-100 text-red-700 border-red-200' };
    } else if (diffDays <= 7) {
      return { text: `${diffDays}일 후 만료`, color: 'text-orange-600', badgeColor: 'bg-orange-100 text-orange-700 border-orange-200' };
    } else {
      return { text: `${expiresAt}까지`, color: 'text-green-600', badgeColor: 'bg-green-100 text-green-700 border-green-200' };
    }
  };

  // Format date to yyyy-mm-dd hh:mm
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-[#4F46E5]" />
        <span className="ml-3 text-slate-600">패스워드 정보를 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-slate-900">패스워드 관리</h3>
          <p className="text-sm text-slate-600">
            카테고리별 접근 패스워드를 관리하세요
          </p>
        </div>
        <Button onClick={handleOpenDialog} disabled={isSubmitting}>
          <Plus className="size-4 mr-2" />
          패스워드 추가
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <Key className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="mb-2">
                <strong>보안 안내</strong>
              </p>
              <ul className="space-y-1 text-amber-800">
                <li>• 각 카테고리별로 여러 개의 패스워드를 설정할 수 있습니다</li>
                <li>• 패스워드는 영문, 숫자 조합으로 8자 이상 권장합니다</li>
                <li>• 정기적으로 패스워드를 변경하는 것이 좋습니다</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Passwords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Key className="size-4 text-blue-600" />
            </div>
            부동산 사장님 패스워드
          </CardTitle>
          <CardDescription>
            제휴 중개업소 전용 패스워드 목록
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {passwords.filter(p => p.category === 'agent').map((entry) => {
              const expStatus = getExpirationStatus(entry.expiresAt);
              const isExpired = isPasswordExpired(entry.expiresAt);
              
              return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isExpired ? 'bg-red-50 border-red-200' : 'bg-slate-50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className={getCategoryColor(entry.category)}>
                      {getCategoryLabel(entry.category)}
                    </Badge>
                    {entry.name && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                        {entry.name}
                      </Badge>
                    )}
                    <Badge variant="outline" className={expStatus.badgeColor}>
                      <Calendar className="size-3 mr-1" />
                      {expStatus.text}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      생성일: {formatDateTime(entry.createdAt)}
                    </span>
                    {isExpired && (
                      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                        <AlertCircle className="size-3 mr-1" />
                        사용불가
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-3 py-1 rounded border">
                      {showPasswords[entry.id] ? entry.password : '••••••••'}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility(entry.id)}
                    >
                      {showPasswords[entry.id] ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDeleteDialog(entry.id)}
                >
                  <Trash2 className="size-4 text-red-600" />
                </Button>
              </div>
              );
            })}
            
            {passwords.filter(p => p.category === 'agent').length === 0 && (
              <p className="text-center text-slate-500 py-8">
                등록된 패스워드가 없습니다
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Buyer Passwords */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <Key className="size-4 text-emerald-600" />
            </div>
            매수인 패스워드
          </CardTitle>
          <CardDescription>
            주택 구입자 전용 패스워드 목록
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {passwords.filter(p => p.category === 'buyer').map((entry) => {
              const expStatus = getExpirationStatus(entry.expiresAt);
              const isExpired = isPasswordExpired(entry.expiresAt);
              
              return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isExpired ? 'bg-red-50 border-red-200' : 'bg-slate-50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className={getCategoryColor(entry.category)}>
                      {getCategoryLabel(entry.category)}
                    </Badge>
                    {entry.name && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                        {entry.name}
                      </Badge>
                    )}
                    <Badge variant="outline" className={expStatus.badgeColor}>
                      <Calendar className="size-3 mr-1" />
                      {expStatus.text}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      생성일: {formatDateTime(entry.createdAt)}
                    </span>
                    {isExpired && (
                      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                        <AlertCircle className="size-3 mr-1" />
                        사용불가
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-3 py-1 rounded border">
                      {showPasswords[entry.id] ? entry.password : '••••••••'}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility(entry.id)}
                    >
                      {showPasswords[entry.id] ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDeleteDialog(entry.id)}
                >
                  <Trash2 className="size-4 text-red-600" />
                </Button>
              </div>
              );
            })}
            
            {passwords.filter(p => p.category === 'buyer').length === 0 && (
              <p className="text-center text-slate-500 py-8">
                등록된 패스워드가 없습니다
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Password Management */}
      <Card className="border-[#4F46E5]">
        <CardHeader className="bg-gradient-to-r from-[#4F46E5]/5 to-[#2563EB]/5">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-[#4F46E5] flex items-center justify-center">
                <Key className="size-4 text-white" />
              </div>
              관리자 패스워드
            </div>
            <Button 
              onClick={() => setIsAdminDialogOpen(true)}
              variant="outline"
              size="sm"
            >
              {adminPasswordSet ? '변경' : '설정'}
            </Button>
          </CardTitle>
          <CardDescription>
            관리자 페이지 접근을 위한 패스워드 (1개만 설정 가능)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {adminPasswordSet ? (
            <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-[#4F46E5]/10 text-[#4F46E5] border-[#4F46E5]/20">
                    관리자
                  </Badge>
                  {adminPasswordCreatedAt && (
                    <span className="text-xs text-slate-500">
                      설정일: {formatDateTime(adminPasswordCreatedAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-white px-3 py-1 rounded border">
                    {showAdminPassword ? adminPassword : '••••••••'}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                  >
                    {showAdminPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500">
              <p className="mb-2">관리자 패스워드가 설정되지 않았습니다</p>
              <p className="text-sm">위 버튼을 눌러 패스워드를 설정하세요</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Password Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 패스워드 추가</DialogTitle>
            <DialogDescription>
              새로운 접근 패스워드를 생성합니다
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <select
                id="category"
                value={newPassword.category}
                onChange={(e) => setNewPassword({ ...newPassword, category: e.target.value as any })}
                className="w-full p-2 border rounded-md"
              >
                <option value="agent">부동산 사장님</option>
                <option value="buyer">매수인</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">패스워드 *</Label>
              <Input
                id="password"
                type="text"
                value={newPassword.password}
                onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                placeholder="영문 또는 숫자 입력"
              />
              <p className="text-xs text-slate-500">
                영문 또는 숫자로 4자 이상 입력하세요
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">패스워드 이름 (선택사항)</Label>
              <Input
                id="name"
                type="text"
                value={newPassword.name}
                onChange={(e) => setNewPassword({ ...newPassword, name: e.target.value })}
                placeholder="패스워드 이름 입력"
              />
              <p className="text-xs text-slate-500">
                패스워드를 쉽게 찾을 수 있도록 이름을 입력하세요
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="flex items-center gap-2">
                <Calendar className="size-4 text-black" />
                만료일 (선택사항)
              </Label>
              <Input
                id="expiresAt"
                type="date"
                value={newPassword.expiresAt}
                onChange={(e) => setNewPassword({ ...newPassword, expiresAt: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-slate-500">
                설정하지 않으면 영구적으로 유효합니다
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              onClick={handleAddPassword}
              disabled={!newPassword.password || newPassword.password.length < 4 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  추가 중...
                </>
              ) : (
                '추가'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>패스워드 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 패스워드를 삭제하시겠습니까? 삭제 후에는 해당 패스워드로 접근할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>취소</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => passwordToDelete && handleDeletePassword(passwordToDelete)}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  삭제 중...
                </>
              ) : (
                '삭제'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Admin Password Dialog */}
      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>관리자 패스워드 {adminPasswordSet ? '변경' : '설정'}</DialogTitle>
            <DialogDescription>
              관리자 페이지 접근을 위한 패스워드를 {adminPasswordSet ? '변경' : '설정'}합니다
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newAdminPassword">새 패스워드 *</Label>
              <Input
                id="newAdminPassword"
                type="password"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                placeholder="영문, 숫자 조합 8자 이상"
              />
              <p className="text-xs text-slate-500">
                영문, 숫자를 조합하여 8자 이상 입력하세요
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmAdminPassword">패스워드 확인 *</Label>
              <Input
                id="confirmAdminPassword"
                type="password"
                value={confirmAdminPassword}
                onChange={(e) => setConfirmAdminPassword(e.target.value)}
                placeholder="패스워드 확인"
              />
              <p className="text-xs text-slate-500">
                입력한 패스워드와 동일하게 입력하세요
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAdminDialogOpen(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button 
              onClick={handleSaveAdminPassword}
              disabled={!newAdminPassword || newAdminPassword.length < 8 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {adminPasswordSet ? '변경 중...' : '설정 중...'}
                </>
              ) : (
                adminPasswordSet ? '변경' : '설정'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}