// 글 상세
export interface BlogDetail {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  author: string;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  author: string;
  content: string;
  imageUrl?: string;
}

// 배너
export interface BannerPost {
  id: string;
  title: string;
  category: string;
  imageUrl?: string;
}

// 댓글
export interface Comment {
  id: number;
  postId: number;
  content: string;
  createdAt: string;
}

// 토큰 디코딩
export interface DecodedToken {
  name: string;
  exp: number;
}

// 로그인
export interface LoginForm {
  username: string;
  password: string;
}

// 회원가입
export interface SignUpForm {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}
