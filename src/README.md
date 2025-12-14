# 🏢 법무사 협력 부동산/매수인 지원 플랫폼

법무사 사무실과 협력하는 부동산 중개업소 및 주택 구입자를 위한 전문 정보 제공 플랫폼입니다.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?logo=supabase)

## 🚀 빠른 시작

**⚡ 처음이신가요?** [START_HERE.md](./START_HERE.md) - 3분 완성 가이드

**상세 가이드:**
- 📦 [어떤 파일을 업로드해야 하나요?](./업로드할_파일_체크리스트.txt)
- 🔐 [Vercel 환경변수 설정](./VERCEL_환경변수_간단정리.md)
- 📖 [GitHub 업로드](./GITHUB_SETUP.md)
- 🚀 [Vercel 배포](./DEPLOYMENT_GUIDE.md)
- ✅ [업로드 체크리스트](./CHECKLIST.md)
- 🤝 [기여 가이드](./CONTRIBUTING.md)

---

## ✨ 주요 기능

### 🏠 **부동산 사장님 전용 (Agent Portal)**

- **법률 및 제도 안내**
  - 정부 규제 및 부동산 법률 변경사항
  - 검색 기능
  - 중요 공지 고정 기능

- **신청 서류 다운로드**
  - 각종 서식 파일 관리
  - 파일 타입별 분류 (HWP, PDF, XLSX, DOCX)
  - 작성 팁 제공
  - 모바일 다운로드 지원

- **은행별 금리 비교표**
  - 1금융권/2금융권 구분
  - 최저/최고 금리 비교
  - 전월 대비 금리 변동 표시
  - 정기 업데이트

### 💰 **매수인 전용 (Buyer Portal)**

- **취득세 계산기**
  - 금액대별 자동 세율 적용
  - 6억 초과 시 안내 메시지
  - 5천만원 ~ 10억원 범위 슬라이더
  - 세부 항목별 계산

- **중도금/잔금 일정 계산**
  - 계약일 기준 자동 계산
  - 중도금 횟수 선택 (1~3회)
  - 일정표 다운로드

- **등기 신청 서류 안내**
  - 필수/선택 서류 구분
  - 각 서류별 발급처 안내
  - 체크리스트 기능

- **대출 상담 신청**
  - 온라인 신청 폼
  - 법무사 사무실 직접 연계

### 🔐 **관리자 페이지 (Admin Dashboard)**

- **패스워드 관리**
  - 카테고리별 패스워드 생성/삭제
  - 만료일 설정
  - 패스워드 이름 지정
  - 관리자 패스워드 별도 관리

- **법률/제도 안내 작성**
  - 리치 텍스트 에디터
  - 고정 공지 설정
  - 카테고리별 분류

- **신청 서류 관리**
  - 파일 업로드 (Supabase Storage)
  - 서류 정보 입력
  - 고정 서류 설정

- **금리 정보 관리**
  - 1금융권/2금융권 금리 입력
  - 전월 대비 변동률 자동 계산

---

## 🛠 기술 스택

### Frontend
- **React 18.3** - UI 프레임워크
- **TypeScript 5.3** - 타입 안정성
- **Tailwind CSS 4.0** - 스타일링
- **React Router 6** - 라우팅
- **Lucide React** - 아이콘
- **Shadcn/ui** - UI 컴포넌트

### Backend
- **Supabase** - BaaS (Backend as a Service)
  - PostgreSQL 데이터베이스
  - Storage (파일 저장)
  - Edge Functions (서버리스 API)
  - Row Level Security

### Build & Deploy
- **Vite** - 빌드 도구
- **Vercel** - 배포 플랫폼
- **GitHub** - 버전 관리

---

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Git

### 로컬 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lawon-platform.git
   cd lawon-platform
   ```

2. **패키지 설치**
   ```bash
   npm install
   ```

3. **환경변수 설정**
   ```bash
   # .env.local 파일 생성
   cp .env.example .env.local
   
   # .env.local 파일 편집하여 Supabase 정보 입력
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **브라우저에서 확인**
   ```
   http://localhost:3000
   ```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 📦 배포 가이드

상세한 배포 가이드는 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)를 참고하세요.

### 빠른 배포 (Vercel)

1. **GitHub에 푸시**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Vercel에서 Import**
   - https://vercel.com 접속
   - "Import Project" 클릭
   - GitHub 저장소 선택
   - 환경변수 설정
   - Deploy 클릭

3. **환경변수 설정** (Vercel Dashboard)
   ```
   VITE_SUPABASE_PROJECT_ID=your-project-id
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 📁 프로젝트 구조

```
lawon-platform/
├── components/              # React 컴포넌트
│   ├── admin/              # 관리자 페이지 컴포넌트
│   ├── agent/              # 부동산 사장님 페이지 컴포넌트
│   ├── buyer/              # 매수인 페이지 컴포넌트
│   ├── ui/                 # UI 공통 컴포넌트 (Shadcn)
│   ├── AdminDashboard.tsx
│   ├── BuyerDashboard.tsx
│   ├── Home.tsx
│   ├── PasswordAuth.tsx
│   └── RealEstateAgentDashboard.tsx
├── supabase/
│   └── functions/
│       └── server/         # Supabase Edge Functions
│           ├── index.tsx   # API 라우트
│           └── kv_store.tsx # Key-Value Store 유틸리티
├── styles/
│   └── globals.css         # 전역 스타일
├── utils/
│   └── supabase/
│       └── info.tsx        # Supabase 설정
├── App.tsx                 # 메인 앱 컴포넌트
├── main.tsx                # 엔트리 포인트
├── index.html              # HTML 템플릿
├── package.json            # 패키지 정보
├── vite.config.ts          # Vite 설정
├── tsconfig.json           # TypeScript 설정
├── vercel.json             # Vercel 배포 설정
└── README.md               # 프로젝트 문서
```

---

## 🔐 환경변수

프로젝트에 필요한 환경변수:

| 변수명 | 설명 | 필수 여부 |
|--------|------|----------|
| `VITE_SUPABASE_PROJECT_ID` | Supabase 프로젝트 ID | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase Public Anon Key | ✅ |
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ |
| `VITE_SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | ✅ |

**주의:** Service Role Key는 절대 클라이언트에 노출되지 않도록 주의하세요!

---

## 🎨 디자인 시스템

### 컬러 팔레트

```css
--navy-blue: #1A2B4B     /* 기본 텍스트, 헤더 */
--indigo: #4F46E5        /* 주요 액션, 버튼 */
--blue: #2563EB          /* 링크, 강조 */
--slate-gray: #64748B    /* 보조 텍스트 */
--light-gray: #F7F8FA    /* 배경 */
```

### 타이포그래피

- 기본 폰트: 시스템 폰트 스택
- 한글: Pretendard, Apple SD Gothic Neo
- 영문: Inter, -apple-system, sans-serif

---

## 🔒 보안

### 패스워드 정책

- **관리자**: 8자 이상 (영문+숫자 조합)
- **부동산/매수인**: 4자 이상

### 세션 관리

- 세션 유지 시간: 24시간
- SessionStorage 사용
- 브라우저 탭 닫으면 세션 삭제

### 데이터 보호

- Supabase Row Level Security 활용
- 민감한 데이터는 Service Role Key로만 접근
- HTTPS 강제 적용 (Vercel 자동 설정)

---

## 📝 라이선스

MIT License

Copyright (c) 2024 LawOn Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📞 문의

법무사 사무실: **031-365-3410**

---

## 🎉 감사의 말

이 프로젝트는 부동산 중개업소와 주택 구입자를 위한 전문 정보 제공을 목표로 제작되었습니다.

**Built with ❤️ using React + TypeScript + Tailwind CSS + Supabase**

---

## 🆘 문제가 생기면?

### "Repository not found" 오류
→ [오류해결_Repository_not_found.md](./오류해결_Repository_not_found.md) 또는 [❌_오류_즉시해결.txt](./❌_오류_즉시해결.txt)

### "403 Forbidden" 오류
→ [❌_403오류_해결.txt](./❌_403오류_해결.txt) 또는 [Token_생성_단계별_가이드.md](./Token_생성_단계별_가이드.md)

### "rejected - fetch first" 오류
→ [❌_rejected_오류_해결.txt](./❌_rejected_오류_해결.txt) 또는 [⚡_지금_바로_실행.txt](./⚡_지금_바로_실행.txt)

### Vercel 배포 오류 (No Output Directory)
→ [⚡_Vercel_즉시해결.txt](./⚡_Vercel_즉시해결.txt) 또는 [❌_Vercel_배포_오류_해결.md](./❌_Vercel_배포_오류_해결.md)

### 터미널 실행 방법 모름
→ [터미널_실행_초간단_가이드.txt](./터미널_실행_초간단_가이드.txt)

### GitHub Desktop 사용
→ https://desktop.github.com 다운로드 (가장 쉬움!)

---