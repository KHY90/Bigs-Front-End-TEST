# 김화연 과제 제출 깃허브 입니다.

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22.13.1-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MobX](https://img.shields.io/badge/MobX-6.13.6-FF9955?style=for-the-badge&logo=mobx&logoColor=white)

## 🗝️ 구현 내용 소개

이 프로젝트는 **VITE + React + TypeScript + MobX**를 활용하여 사용자 인증 및 게시판 기능을 구현한 프론트엔드 애플리케이션입니다.

### ✅ **사용자 기능**
- **회원가입**: 이메일 및 비밀번호를 이용한 사용자 회원가입 기능
- **로그인**: 로그인 후 사용자 정보를 저장하여 인증 유지
- **사용자 정보 표시**: 로그인한 사용자 아이디 및 이름 표시  

### ✅ **게시판 기능**
- **글 작성**: 사용자가 제목, 내용, 카테고리를 입력하여 게시글 작성
- **글 조회**: 전체 게시글 조회 및 페이지네이션 적용
- **글 수정**: 사용자가 작성한 글을 수정 가능
- **글 삭제**: 사용자가 작성한 글을 삭제 가능
- **페이지네이션**: 한 페이지에 일정 개수의 게시글만 표시되도록 구현
- **반응형 디자인**: 모바일, 태블릿, PC에서도 최적화된 UI 제공

### ✅ **추가 구현 기능**
- **스크랩 기능**: 특정 게시글을 스크랩하고 저장할 수 있음 (세션 저장 방식)
- **검색 기능**: 게시글 제목을 기준으로 검색 가능
- **정렬 기능**: 최신순 / 오래된 순으로 게시글 정렬 가능
- **사이드바 및 프로필 페이지**: 프로필, 스크랩 목록, 내가 작성한 글 확인 가능

## 🗝️ 설치 및 실행 방법

이 프로젝트를 로컬 환경에서 실행하는 방법을 안내합니다.

### 1. 프로젝트 클론

먼저 GitHub에서 프로젝트를 클론합니다.

```bash
git clone https://github.com/KHY90/Bigs-Front-End-TEST
```

### 2. 폴더 이동
```bash
cd Bigs-Front-End-TEST
```

### 3. 패키지 설치

```bash
npm install
```

### 4. 서버 실행

```bash
npm run dev
```