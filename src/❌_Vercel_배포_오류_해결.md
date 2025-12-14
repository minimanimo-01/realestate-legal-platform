# 🆘 Vercel 배포 오류 해결 가이드

## ❌ 발생한 오류

```
Error: No Output Directory named "dist" found after the Build completed.
Configure the Output Directory in your Project Settings.
Alternatively, configure vercel.json#outputDirectory
```

---

## 💡 문제 원인

1. **빌드가 실패했거나**
2. **Vercel 프로젝트 설정이 잘못되었거나**
3. **환경변수가 누락됨**

---

## ✅ 해결 방법 (순서대로 시도)

### 🔧 방법 1: Vercel 프로젝트 설정 수정 (추천!)

#### 1단계: Vercel Dashboard 접속

1. https://vercel.com 로그인
2. 배포한 프로젝트 클릭 (`realestate-legal-platform`)
3. **Settings** 탭 클릭

---

#### 2단계: Build & Development Settings 수정

**General 섹션에서:**

```
Framework Preset: Vite
```

**Build & Development Settings:**

| 항목 | 값 |
|------|-----|
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Development Command** | `npm run dev` |

---

#### 3단계: 환경변수 확인

**Settings → Environment Variables**

다음 환경변수가 **모두** 있는지 확인:

```
Key: VITE_SUPABASE_PROJECT_ID
Value: czrylhekwmkdlobeuxuh

Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cnlsaGVrd21rZGxvYmV1eHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwOTA2NjYsImV4cCI6MjA4MDY2NjY2Nn0.cAciCMZ_xgpaDOsufLB8osENR2ArRz6_qPUomN7GNDU
```

**⚠️ 중요:** 환경변수는 **Production**, **Preview**, **Development** 모두에 체크!

---

#### 4단계: 재배포

1. **Deployments** 탭으로 이동
2. 가장 최근 배포 클릭
3. 우측 상단 **"..."** → **"Redeploy"** 클릭
4. **"Redeploy"** 버튼 클릭

---

### 🔧 방법 2: Root Directory 설정 확인

#### Vercel Dashboard에서:

**Settings → General**

| 항목 | 값 |
|------|-----|
| **Root Directory** | `.` (점 하나) 또는 비워두기 |

**저장 후 재배포**

---

### 🔧 방법 3: Node.js 버전 지정

#### 1단계: package.json에 엔진 추가

package.json 파일 수정이 필요한 경우:

```json
{
  "name": "lawon-platform",
  "version": "1.0.0",
  "engines": {
    "node": ">=18.0.0"
  },
  ...
}
```

#### 2단계: Git 푸시

```bash
git add package.json
git commit -m "Add Node.js engine requirement"
git push origin main
```

자동으로 재배포됩니다.

---

### 🔧 방법 4: vercel.json 수정 (이미 올바름)

현재 vercel.json은 올바르게 설정되어 있습니다:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

### 🔧 방법 5: 빌드 로그 확인

#### Vercel에서 빌드 로그 보기:

1. **Deployments** 탭
2. 실패한 배포 클릭
3. **"Building"** 섹션 펼치기
4. 오류 메시지 확인

**주요 확인 사항:**

- ❌ `Module not found` → 패키지 설치 실패
- ❌ `TypeScript error` → 타입 오류
- ❌ `Environment variable not defined` → 환경변수 누락

---

## 🎯 가장 흔한 원인과 해결

### 1️⃣ 환경변수 누락

**증상:** 빌드 중 환경변수 관련 오류

**해결:**
1. Settings → Environment Variables
2. 위의 환경변수 2개 추가
3. Production, Preview, Development 모두 체크
4. Redeploy

---

### 2️⃣ TypeScript 컴파일 오류

**증상:** 빌드 로그에 타입 오류

**해결 (임시):**

package.json 수정:

```json
"scripts": {
  "build": "vite build"
}
```

TypeScript 검사를 건너뛰기 (권장하지 않음, 임시 해결책)

**해결 (권장):**

로컬에서 타입 오류 수정 후 다시 푸시

```bash
npm run type-check
# 오류 수정
git add .
git commit -m "Fix TypeScript errors"
git push
```

---

### 3️⃣ 패키지 설치 실패

**증상:** `npm install` 실패

**해결:**

Vercel Dashboard → Settings → General

**Install Command:**
```
npm install --legacy-peer-deps
```

---

## 📋 체크리스트

### 배포 전 체크:

- [ ] 환경변수 2개 모두 입력 완료
- [ ] Production, Preview, Development 체크 확인
- [ ] Framework Preset: Vite 설정
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Root Directory: `.` 또는 비워두기

### 재배포:

- [ ] Settings에서 설정 변경
- [ ] Save 클릭
- [ ] Deployments → Redeploy

---

## 🚀 빠른 해결 순서

1. **환경변수 확인** (가장 중요!)
   - Settings → Environment Variables
   - 2개 환경변수 모두 있는지 확인
   - Production/Preview/Development 체크

2. **Framework 설정 확인**
   - Settings → General
   - Framework Preset: Vite

3. **재배포**
   - Deployments → 최근 배포 → Redeploy

---

## ✅ 성공 확인

빌드가 성공하면:

```
✓ Build Completed in XXs
✓ Deployment Ready
```

**브라우저에서 확인:**
```
https://your-project.vercel.app
```

---

## 🆘 그래도 안 되면?

### 스크린샷 공유:

1. Vercel 빌드 로그 전체
2. Settings → Environment Variables 화면
3. Settings → Build & Development Settings 화면

### 로컬에서 빌드 테스트:

```bash
npm run build
```

로컬에서 성공하면 Vercel 설정 문제,
로컬에서도 실패하면 코드 문제입니다.

---

## 💡 추가 팁

### Vercel CLI 사용 (선택사항):

```bash
npm install -g vercel
vercel login
vercel
```

터미널에서 직접 배포할 수 있습니다.

---

**대부분의 경우 환경변수 누락이 원인입니다!**

환경변수 2개를 추가하고 재배포하면 해결됩니다! 🚀
