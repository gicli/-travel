
# ✈️ 쉽네 Travel - AI 감성 여행 큐레이터

"쉽네 Travel"은 Google Gemini AI를 활용하여 전 세계 어디든 당신만을 위한 맞춤형 여행 가이드를 생성해주는 웹 앱입니다.

## ✨ 주요 기능
- **AI 맞춤형 큐레이팅**: 도시 이름만 입력하면 명소, 맛집, 숙소 정보를 즉시 생성합니다.
- **감성 이미지 생성**: Gemini 2.5 Flash Image 모델을 사용하여 현지의 분위기를 담은 이미지를 생성합니다.
- **스마트 지도 연결**: 모든 추천 장소는 구글 지도로 바로 연결됩니다.
- **와이프를 위한 공유 기능**: 생성된 가이드를 링크 하나로 소중한 사람에게 공유하세요.

## 🛠 기술 스택
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React
- **AI**: @google/genai (Gemini 3 Flash & Gemini 2.5 Flash Image)
- **Deployment**: Vercel

## 🚀 로컬 실행 방법
1. 저장소 클론: `git clone <your-repo-url>`
2. 패키지 설치: `npm install`
3. API 키 설정: `.env` 파일 생성 후 `API_KEY=your_gemini_api_key` 입력
4. 실행: `npm run dev`

## 🌍 Vercel 배포 시 주의사항
Vercel 대시보드 설정에서 **Environment Variables**에 `API_KEY`를 반드시 등록해야 정상 작동합니다.
