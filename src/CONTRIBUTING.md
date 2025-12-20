# 기여 가이드

이 프로젝트에 기여해 주셔서 감사합니다! 🎉

## 📋 기여 방법

### 1. 이슈 생성

버그를 발견하거나 새로운 기능을 제안하고 싶다면:

1. [Issues](../../issues) 페이지로 이동
2. 기존 이슈를 검색하여 중복 확인
3. 새로운 이슈 생성

### 2. Pull Request 제출

1. **Fork the repository**
   ```bash
   # GitHub에서 Fork 버튼 클릭
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/realestate-legal-platform.git
   cd realestate-legal-platform
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - 코드 작성
   - 테스트 추가 (필요시)

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - GitHub에서 Pull Request 생성
   - 변경 사항 설명 작성

## 📝 커밋 메시지 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다:

```
<type>: <description>

[optional body]

[optional footer]
```

### Type

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가
- `chore`: 빌드 작업, 패키지 매니저 설정 등

### 예시

```bash
feat: add buyer dashboard tax calculator
fix: resolve mobile responsive issue in balance form
docs: update README with deployment guide
style: format code with prettier
refactor: simplify password validation logic
```

## 🎨 코드 스타일

### TypeScript

- **엄격한 타입 사용**
  ```typescript
  // Good
  interface UserData {
    name: string;
    age: number;
  }
  
  // Bad
  const user: any = { ... };
  ```

- **함수형 컴포넌트 사용**
  ```typescript
  // Good
  export function MyComponent({ prop }: MyComponentProps) {
    return <div>{prop}</div>;
  }
  ```

### Tailwind CSS

- **반응형 디자인 우선**
  ```tsx
  <div className="p-3 sm:p-6 md:p-8">
    {/* Mobile → Tablet → Desktop */}
  </div>
  ```

- **색상 일관성**
  - Primary: `#2563EB` (Blue)
  - Navy: `#1A2B4B`
  - Indigo: `#4F46E5`

## 🧪 테스트

현재 프로젝트에는 자동화된 테스트가 없지만, 다음 사항을 수동으로 확인해주세요:

- [ ] 모든 페이지가 정상 작동하는가?
- [ ] 모바일 반응형이 적용되었는가?
- [ ] 패스워드 인증이 정상 작동하는가?
- [ ] Supabase 연동이 정상인가?

## 📦 로컬 개발 환경

1. **환경변수 설정**
   ```bash
   cp .env.example .env.local
   # .env.local 파일 편집
   ```

2. **개발 서버 실행**
   ```bash
   npm install
   npm run dev
   ```

3. **빌드 테스트**
   ```bash
   npm run build
   npm run preview
   ```

## ❓ 질문이 있으신가요?

- [Issues](../../issues)에 질문을 남겨주세요
- 또는 법무사 사무실(031-365-3410)로 문의하세요

---

**다시 한번 기여해 주셔서 감사합니다!** 🙏
