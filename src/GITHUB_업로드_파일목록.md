# 📦 GitHub 업로드 파일 가이드

## ✅ 반드시 올려야 할 파일

### 📁 루트 디렉토리 파일

```
✅ .gitignore              # Git 제외 파일 목록
✅ .env.example            # 환경변수 템플릿
✅ LICENSE                 # 라이선스 파일
✅ README.md               # 프로젝트 소개
✅ package.json            # 패키지 정보
✅ tsconfig.json           # TypeScript 설정
✅ vite.config.ts          # Vite 설정
✅ vercel.json             # Vercel 배포 설정
✅ index.html              # HTML 템플릿
✅ App.tsx                 # 메인 앱
✅ main.tsx                # 엔트리 포인트
```

### 📚 문서 파일 (선택사항이지만 추천)

```
✅ QUICKSTART.md                    # 빠른 시작 가이드
✅ GITHUB_SETUP.md                  # GitHub 설정 가이드
✅ DEPLOYMENT_GUIDE.md              # 배포 가이드
✅ VERCEL_ENV_SETUP.md              # Vercel 환경변수 가이드
✅ VERCEL_환경변수_간단정리.md       # 간단 환경변수 가이드
✅ CHECKLIST.md                     # 체크리스트
✅ CONTRIBUTING.md                  # 기여 가이드
✅ GITHUB_EXPORT_SUMMARY.md         # 내보내기 요약
✅ Attributions.md                  # 라이선스 정보
```

### 📁 폴더 전체 (모든 하위 파일 포함)

```
✅ components/             # 모든 React 컴포넌트
✅ styles/                 # CSS 파일
✅ utils/                  # 유틸리티 함수
✅ supabase/               # Supabase 설정
✅ .github/workflows/      # GitHub Actions CI/CD
```

---

## ❌ 절대 올리면 안 되는 파일

```
❌ .env                    # 실제 환경변수 (보안 위험!)
❌ .env.local              # 로컬 환경변수
❌ node_modules/           # 패키지 폴더 (용량 큼)
❌ dist/                   # 빌드 결과물
❌ build/                  # 빌드 결과물
❌ .vercel/                # Vercel 캐시
❌ .DS_Store               # Mac OS 파일
```

> 💡 `.gitignore` 파일이 이미 이 파일들을 자동으로 제외합니다!

---

## ⚠️ 불필요한 파일 (삭제해도 됨)

```
⚠️ LICENSE/Code-component-72-322.tsx    # 잘못 생성된 파일
⚠️ LICENSE/Code-component-72-342.tsx    # 잘못 생성된 파일
⚠️ LICENSE/Code-component-75-373.tsx    # 잘못 생성된 파일
⚠️ LICENSE/Code-component-75-380.tsx    # 잘못 생성된 파일
⚠️ workflows/ci.yml                      # 잘못된 위치 (이미 .github/workflows/에 있음)
⚠️ guidelines/Guidelines.md              # 내부 가이드라인 (선택)
```

---

## 🎯 간단 요약

### **GitHub에 올릴 때 필수 파일:**

1. **소스 코드 파일**
   - 모든 `.tsx`, `.ts` 파일
   - `index.html`
   - `package.json`
   - 설정 파일들 (`vite.config.ts`, `tsconfig.json` 등)

2. **폴더**
   - `components/` (전체)
   - `styles/` (전체)
   - `utils/` (전체)
   - `supabase/` (전체)
   - `.github/` (전체)

3. **문서**
   - `README.md` (필수!)
   - 기타 `.md` 문서들 (추천)

4. **설정 파일**
   - `.gitignore` (필수!)
   - `.env.example` (필수!)
   - `LICENSE` (추천)

---

## 🚀 실제로 해야 할 작업

### 방법 1: 모든 파일 자동 업로드 (추천)

```bash
# 프로젝트 폴더에서 터미널 실행

# Git 초기화
git init
git branch -M main

# 모든 파일 추가 (.gitignore가 자동으로 불필요한 파일 제외)
git add .

# 커밋
git commit -m "feat: initial commit - real estate legal platform"

# GitHub 원격 저장소 연결
git remote add origin https://github.com/YOUR_USERNAME/realestate-legal-platform.git

# 업로드
git push -u origin main
```

**이 방법을 사용하면:**
- ✅ `.gitignore`가 자동으로 불필요한 파일 제외
- ✅ 필요한 파일만 업로드됨
- ✅ 간단하고 실수 없음

---

### 방법 2: 수동으로 파일 선택 (비추천)

수동으로 선택하려면 위의 "반드시 올려야 할 파일" 목록을 참고하세요.
하지만 **방법 1**을 사용하는 것이 훨씬 간단합니다!

---

## 📋 최종 체크리스트

업로드 전 확인사항:

- [ ] `.gitignore` 파일이 있는가?
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] `.env.example` 파일에 실제 키 값이 없는가?
- [ ] `package.json` 파일이 있는가?
- [ ] `README.md` 파일이 있는가?

---

## 🎉 결론

**가장 간단한 방법:**

```bash
git init
git branch -M main
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/YOUR_USERNAME/realestate-legal-platform.git
git push -u origin main
```

**이 명령어만 실행하면:**
- ✅ 필요한 파일만 자동으로 업로드됨
- ✅ `.gitignore`가 불필요한 파일 제외
- ✅ 보안 문제 없음

---

**준비되셨나요?** 위의 명령어를 복사해서 터미널에 붙여넣기만 하면 됩니다! 🚀
