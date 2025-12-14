# 🔐 Vercel 환경변수 설정 가이드

Vercel에 Supabase 환경변수를 설정하는 방법을 안내합니다.

---

## 📋 설정해야 할 환경변수

Vercel Dashboard에서 다음 **2개**의 환경변수를 설정하세요:

| Key (이름) | Value (값) |
|------------|-----------|
| `VITE_SUPABASE_PROJECT_ID` | `czrylhekwmkdlobeuxuh` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cnlsaGVrd21rZGxvYmV1eHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwOTA2NjYsImV4cCI6MjA4MDY2NjY2Nn0.cAciCMZ_xgpaDOsufLB8osENR2ArRz6_qPUomN7GNDU` |

---

## 🎯 단계별 설정 방법

### Step 1: Vercel 프로젝트 페이지 이동

1. https://vercel.com/dashboard 접속
2. 배포한 프로젝트(`realestate-legal-platform`) 클릭

### Step 2: Settings 메뉴로 이동

1. 상단 메뉴에서 **"Settings"** 클릭
2. 왼쪽 사이드바에서 **"Environment Variables"** 클릭

### Step 3: 환경변수 추가

#### 첫 번째 환경변수

```
Key:   VITE_SUPABASE_PROJECT_ID
Value: czrylhekwmkdlobeuxuh
```

1. "Key" 입력란에 `VITE_SUPABASE_PROJECT_ID` 입력
2. "Value" 입력란에 `czrylhekwmkdlobeuxuh` 입력
3. Environment 선택:
   - ✅ Production (체크)
   - ✅ Preview (체크)
   - ✅ Development (체크)
4. **"Save"** 버튼 클릭

#### 두 번째 환경변수

```
Key:   VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cnlsaGVrd21rZGxvYmV1eHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwOTA2NjYsImV4cCI6MjA4MDY2NjY2Nn0.cAciCMZ_xgpaDOsufLB8osENR2ArRz6_qPUomN7GNDU
```

1. "Key" 입력란에 `VITE_SUPABASE_ANON_KEY` 입력
2. "Value" 입력란에 위의 긴 JWT 토큰 복사 & 붙여넣기
3. Environment 선택:
   - ✅ Production (체크)
   - ✅ Preview (체크)
   - ✅ Development (체크)
4. **"Save"** 버튼 클릭

### Step 4: 재배포

환경변수를 추가한 후 **반드시 재배포**해야 합니다!

1. 상단 메뉴에서 **"Deployments"** 클릭
2. 가장 최근 배포의 **"..."** 메뉴 클릭
3. **"Redeploy"** 선택
4. **"Redeploy"** 버튼 클릭하여 확인

---

## 📸 스크린샷 가이드

### 환경변수 추가 화면

```
┌─────────────────────────────────────────────────────┐
│  Environment Variables                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Key                                                │
│  ┌─────────────────────────────────────────────┐   │
│  │ VITE_SUPABASE_PROJECT_ID                    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Value                                              │
│  ┌─────────────────────────────────────────────┐   │
│  │ czrylhekwmkdlobeuxuh                        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Environments                                       │
│  ☑ Production  ☑ Preview  ☑ Development           │
│                                                     │
│  [ Save ]                                           │
└─────────────────────────────────────────────────────┘
```

---

## ✅ 설정 확인

환경변수가 올바르게 설정되었는지 확인:

1. Vercel Dashboard → Settings → Environment Variables
2. 다음 2개의 환경변수가 표시되어야 함:
   - ✅ `VITE_SUPABASE_PROJECT_ID`
   - ✅ `VITE_SUPABASE_ANON_KEY`

---

## 🔍 복사하기 쉽게 정리

### 환경변수 1

**Key:**
```
VITE_SUPABASE_PROJECT_ID
```

**Value:**
```
czrylhekwmkdlobeuxuh
```

---

### 환경변수 2

**Key:**
```
VITE_SUPABASE_ANON_KEY
```

**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cnlsaGVrd21rZGxvYmV1eHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwOTA2NjYsImV4cCI6MjA4MDY2NjY2Nn0.cAciCMZ_xgpaDOsufLB8osENR2ArRz6_qPUomN7GNDU
```

---

## 🚨 주의사항

### ⚠️ 오타 주의
- Key 이름은 **대소문자 구분**됩니다
- 앞뒤 공백이 없는지 확인하세요
- 특히 `VITE_` 접두사를 빼먹지 마세요

### 🔄 재배포 필수
- 환경변수를 추가/수정한 후에는 **반드시 재배포**해야 적용됩니다
- Deployments → Redeploy 클릭

### 🔐 보안
- 이 값들은 **Public Anon Key**로 공개되어도 안전합니다
- Supabase의 Row Level Security로 보호됩니다
- 절대 **Service Role Key**는 추가하지 마세요!

---

## 🆘 문제 해결

### "Failed to load Supabase" 오류

**원인:** 환경변수가 설정되지 않았거나 잘못됨

**해결:**
1. 환경변수가 정확히 입력되었는지 확인
2. Key 이름 확인 (대소문자 구분)
3. Value가 완전히 복사되었는지 확인
4. 재배포 했는지 확인

### 환경변수가 적용되지 않음

**해결:**
1. Vercel Dashboard → Deployments
2. 가장 최근 배포 → "..." → Redeploy
3. 2-3분 대기 후 다시 확인

### 배포는 성공했지만 페이지가 작동하지 않음

**확인사항:**
1. 브라우저 개발자 도구(F12) → Console 탭 확인
2. Network 탭에서 Supabase API 호출 확인
3. Supabase 프로젝트가 활성화되어 있는지 확인

---

## 📞 추가 도움

더 자세한 Vercel 배포 가이드는 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)를 참고하세요.

질문이 있으시면:
- GitHub Issues에 질문 남기기
- 법무사 사무실: 031-365-3410

---

**완료되었나요?** 🎉

다음 단계: 배포된 사이트에 접속하여 정상 작동하는지 확인하세요!
```
https://your-project.vercel.app
```
