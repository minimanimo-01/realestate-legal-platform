import { useState, useEffect } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PasswordAuthProps {
  onAuthenticate: () => void;
  onBack: () => void;
  title: string;
  description: string;
  storageKey: string;
}

export function PasswordAuth({ 
  onAuthenticate, 
  onBack, 
  title, 
  description,
  storageKey 
}: PasswordAuthProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (session storage)
    const authData = sessionStorage.getItem(storageKey);
    if (authData) {
      const { timestamp } = JSON.parse(authData);
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      
      // Check if authentication is still valid (within 24 hours)
      if (now - timestamp < oneDay) {
        onAuthenticate();
        return;
      } else {
        // Clear expired session
        sessionStorage.removeItem(storageKey);
      }
    }
  }, [storageKey, onAuthenticate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-0fddf210`;
      
      // Admin authentication - check against Supabase admin password
      if (storageKey === 'admin-auth') {
        console.log('Admin login attempt, calling API...');
        const response = await fetch(`${API_URL}/admin-password/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ password }),
        });

        console.log('Admin verify response status:', response.status);
        const data = await response.json();
        console.log('Admin verify response data:', data);
        
        if (data.success && data.valid) {
          console.log('Admin password validated successfully');
          sessionStorage.setItem(storageKey, JSON.stringify({
            timestamp: new Date().getTime(),
          }));
          onAuthenticate();
        } else {
          console.log('Admin password validation failed:', data);
          setError(data.message || '패스워드가 올바르지 않습니다. 다시 시도해주세요.');
          setPassword('');
        }
        setIsLoading(false);
        return;
      }

      // Agent and Buyer authentication - check against Supabase
      const response = await fetch(`${API_URL}/passwords`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        const passwords = data.passwords || [];
        const category = storageKey === 'agent-auth' ? 'agent' : 'buyer';
        const validPasswords = passwords
          .filter((p: any) => p.category === category)
          .filter((p: any) => {
            // Check if password is expired
            if (p.expiresAt) {
              const today = new Date().toISOString().split('T')[0];
              return p.expiresAt >= today;
            }
            return true; // No expiry date means always valid
          })
          .map((p: any) => p.password);

        if (validPasswords.includes(password)) {
          sessionStorage.setItem(storageKey, JSON.stringify({
            timestamp: new Date().getTime(),
          }));
          onAuthenticate();
        } else {
          setError('패스워드가 올바르지 않거나 만료되었습니다. 다시 시도해주세요.');
          setPassword('');
        }
      } else {
        setError('패스워드 확인 중 오류가 발생했습니다.');
        console.error('Failed to fetch passwords:', data.error);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('패스워드 확인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-[#1A2B4B] hover:text-[#4F46E5] hover:bg-white"
        >
          <ArrowLeft className="size-4 mr-2" />
          돌아가기
        </Button>

        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="size-16 rounded-full bg-[#EEF2FF] flex items-center justify-center">
                <Lock className="size-8 text-[#4F46E5]" />
              </div>
            </div>
            <CardTitle className="text-[#1A2B4B]">{title}</CardTitle>
            <CardDescription className="text-[#64748B]">{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm mb-2 text-[#475569]">
                  패스워드
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="패스워드를 입력하세요"
                  className={error ? 'border-red-500' : 'border-[#E2E8F0]'}
                  disabled={isLoading}
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-600 mt-2">{error}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white"
                disabled={isLoading || !password}
              >
                {isLoading ? '확인 중...' : '접속하기'}
              </Button>

              <div className="text-center text-sm text-[#64748B] mt-4">
                <p>패스워드를 잊으셨나요?</p>
                <p className="mt-1">법무사 사무실로 문의해주세요.</p>
                <p className="mt-2 text-[#1A2B4B]">Tel: 031-365-3410</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-[#EEF2FF] rounded-lg border border-[#C7D2FE]">
          <p className="text-sm text-[#4F46E5] text-center">
            <Lock className="size-4 inline mr-1" />
            보안을 위해 인증된 사용자만 접근할 수 있습니다.
          </p>
          <p className="text-xs text-[#6366F1] text-center mt-2">
            인증은 24시간 동안 유지됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}