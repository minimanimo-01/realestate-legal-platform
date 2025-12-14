# 🚀 여기서 시작하세요!

## 💡 GitHub 업로드는 간단합니다!

**고민하지 마세요!** 아래 명령어만 실행하면 필요한 파일이 자동으로 업로드됩니다.

---

## ⚡ 3분 완성 가이드

### 1단계: GitHub 레포지토리 생성 (1분)

1. https://github.com/new 접속
2. 입력:
   - **Repository name**: `realestate-legal-platform`
   - **Visibility**: Private (또는 Public)
3. ✅ **Create repository** 클릭

---

### 2단계: 코드 업로드 (1분)

**프로젝트 폴더에서 터미널(명령 프롬프트)을 열고:**

> 💡 **터미널 실행 방법 모르시나요?** 
> - Windows: [터미널_실행_초간단_가이드.txt](./터미널_실행_초간단_가이드.txt) (30초 완성!)
> - 상세 가이드: [터미널_실행방법.md](./터미널_실행방법.md)
> 
> **가장 쉬운 방법 (Windows):**
> 1. 프로젝트 폴더 열기
> 2. 폴더 위쪽 주소창 클릭
> 3. `cmd` 입력하고 Enter ✨

**Git 명령어 실행:**

```bash
git init
git branch -M main
git add .
git commit -m "feat: initial commit - real estate legal platform"
git remote add origin https://github.com/YOUR_USERNAME/realestate-legal-platform.git
git push -u origin main
```

> ⚠️ `YOUR_USERNAME`을 본인의 GitHub 유저명으로 변경하세요!

**인증:**
- Username: GitHub 유저명
- Password: Personal Access Token ([만들기](https://github.com/settings/tokens))

---

### 3단계: Vercel 배포 (1분)

1. https://vercel.com 접속 → GitHub 로그인
2. **"Add New"** → **"Project"** → `realestate-legal-platform` 선택
3. **환경변수 2개 추가:**

```
Key: VITE_SUPABASE_PROJECT_ID
Value: czrylhekwmkdlobeuxuh
```

```
Key: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cnlsaGVrd21rZGxvYmV1eHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwOTA2NjYsImV4cCI6MjA4MDY2NjY2Nn0.cAciCMZ_xgpaDOsufLB8osENR2ArRz6_qPUomN7GNDU
```

4. **"Deploy"** 클릭

---

## ❓ 어떤 파일을 올려야 하나요?

### ✅ 답: 모든 파일을 자동으로!

`git add .` 명령어가 자동으로 필요한 파일만 선택합니다.

**업로드되는 파일:**
- ✅ 모든 소스 코드 (.tsx, .ts 파일)
- ✅ components/, styles/, utils/ 폴더
- ✅ package.json, README.md 등 설정 파일
- ✅ .env.example (환경변수 템플릿)

**자동으로 제외되는 파일:**
- ❌ .env (실제 환경변수 - 보안!)
- ❌ node_modules/ (용량 큼)
- ❌ dist/, build/ (빌드 결과물)

> 💡 `.gitignore` 파일이 자동으로 불필요한 파일을 제외합니다!

---

## 📚 더 자세한 설명이 필요하면?

| 파일 | 설명 |
|------|------|
| **업로드할_파일_체크리스트.txt** | 📋 업로드 파일 목록 (한눈에 보기) |
| **GITHUB_업로드_파일목록.md** | 📦 상세한 파일 설명 |
| **VERCEL_환경변수_간단정리.md** | 🔐 환경변수 복사용 |
| **QUICKSTART.md** | ⚡ 5분 빠른 시작 가이드 |
| **GITHUB_SETUP.md** | 📖 자세한 GitHub 가이드 |

---

## 🆘 문제가 생기면?

### "Permission denied" 오류
→ Personal Access Token 재발급: https://github.com/settings/tokens

### "Git이 설치되지 않음" 오류
→ Git 다운로드: https://git-scm.com/downloads

### Vercel 빌드 실패
→ 환경변수 2개가 모두 입력되었는지 확인

---

## 🎉 준비 완료!

위의 3단계만 따라하면 **3분 안에** 배포 완료됩니다!

**시작하세요!** 🚀

---

_질문이 있으시면 GitHub Issues에 남겨주세요._