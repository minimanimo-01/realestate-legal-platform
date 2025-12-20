# ✅ GitHub 업로드 체크리스트

프로젝트를 GitHub에 업로드하기 전 확인해야 할 사항들입니다.

---

## 📋 업로드 전 필수 확인사항

### 1️⃣ 환경변수 보안 확인

- [ ] `.gitignore` 파일이 존재하는가?
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] `.env.example` 파일이 생성되어 있는가?
- [ ] `.env.example`에 실제 키값이 없는가?
- [ ] 코드 내에 하드코딩된 API 키가 없는가?

### 2️⃣ 파일 구조 확인

- [ ] `README.md` 파일이 존재하는가?
- [ ] `LICENSE` 파일이 존재하는가?
- [ ] `package.json`이 올바르게 설정되어 있는가?
- [ ] 불필요한 파일들이 제외되었는가? (node_modules, .cache 등)

### 3️⃣ 빌드 테스트

```bash
# 로컬에서 빌드 테스트
npm install
npm run build
```

- [ ] 빌드가 성공하는가?
- [ ] 타입 에러가 없는가?
- [ ] 경고 메시지가 없는가?

### 4️⃣ 문서화 확인

- [ ] README.md에 프로젝트 설명이 있는가?
- [ ] 설치 방법이 명시되어 있는가?
- [ ] 환경변수 설정 방법이 설명되어 있는가?
- [ ] 배포 가이드가 작성되어 있는가?

---

## 🚀 GitHub 업로드 단계

### Step 1: Git 초기화

```bash
git init
git branch -M main
```

- [ ] Git이 초기화되었는가?
- [ ] 기본 브랜치가 `main`인가?

### Step 2: 첫 커밋

```bash
git add .
git commit -m "feat: initial commit - real estate legal platform"
```

- [ ] 모든 파일이 추가되었는가?
- [ ] 커밋 메시지가 명확한가?

### Step 3: GitHub 레포지토리 생성

- [ ] GitHub에서 새 레포지토리를 생성했는가?
- [ ] Repository name: `realestate-legal-platform`
- [ ] README, .gitignore, license를 추가하지 않았는가?

### Step 4: 원격 저장소 연결

```bash
git remote add origin https://github.com/YOUR_USERNAME/realestate-legal-platform.git
git push -u origin main
```

- [ ] 원격 저장소가 올바르게 연결되었는가?
- [ ] 푸시가 성공했는가?

---

## 🔐 보안 체크리스트

### 민감한 정보 확인

- [ ] Supabase URL이 코드에 하드코딩되지 않았는가?
- [ ] Supabase Anon Key가 환경변수로 관리되는가?
- [ ] Service Role Key가 절대 클라이언트에 노출되지 않는가?
- [ ] 관리자 패스워드가 코드에 없는가?

### .gitignore 확인

```
✅ node_modules/
✅ .env
✅ .env.local
✅ .env.*.local
✅ dist/
✅ build/
✅ .vercel/
✅ .DS_Store
```

---

## 📦 배포 준비 체크리스트

### Vercel 배포 전

- [ ] `vercel.json` 파일이 존재하는가?
- [ ] 환경변수 목록을 확인했는가?
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
- [ ] 빌드 명령어가 올바른가? (`npm run build`)

### Supabase 설정 확인

- [ ] Supabase 프로젝트가 생성되어 있는가?
- [ ] `entry_password` 테이블이 생성되어 있는가?
- [ ] Storage 버킷이 설정되어 있는가?
- [ ] Edge Function이 배포되어 있는가?

---

## 🧪 테스트 체크리스트

### 기능 테스트

- [ ] 홈 페이지가 정상 작동하는가?
- [ ] 패스워드 인증이 작동하는가?
- [ ] 부동산 사장님 페이지가 로드되는가?
- [ ] 매수인 페이지가 로드되는가?
- [ ] 관리자 페이지가 로드되는가?

### 반응형 테스트

- [ ] 모바일에서 정상 작동하는가?
- [ ] 태블릿에서 정상 작동하는가?
- [ ] 데스크톱에서 정상 작동하는가?

### 브라우저 호환성

- [ ] Chrome에서 테스트했는가?
- [ ] Safari에서 테스트했는가?
- [ ] Firefox에서 테스트했는가?
- [ ] Edge에서 테스트했는가?

---

## 📝 최종 확인

### 코드 품질

- [ ] TypeScript 에러가 없는가?
- [ ] Console에 에러가 없는가?
- [ ] 사용하지 않는 import가 제거되었는가?
- [ ] 주석이 적절히 작성되어 있는가?

### 문서

- [ ] README.md가 최신 상태인가?
- [ ] DEPLOYMENT_GUIDE.md가 작성되어 있는가?
- [ ] CONTRIBUTING.md가 작성되어 있는가?
- [ ] 라이선스가 명시되어 있는가?

### Git

- [ ] 커밋 메시지가 명확한가?
- [ ] 불필요한 파일이 포함되지 않았는가?
- [ ] .gitignore가 올바르게 설정되어 있는가?

---

## 🎉 완료!

모든 항목을 확인하셨다면 GitHub에 업로드할 준비가 완료되었습니다!

다음 단계:
1. [GITHUB_SETUP.md](./GITHUB_SETUP.md) - GitHub 업로드 가이드
2. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Vercel 배포 가이드

---

**문제가 발생했나요?**
- GitHub Issues에 질문을 남겨주세요
- 또는 법무사 사무실(031-365-3410)로 문의하세요
