import { api } from "../api/axios";

// User 타입
interface User {
  role: string;
  emailVerified: boolean;
  banned: boolean;
  isOnline: boolean;
  posts: string[];
  likes: string[];
  comments: string[];
  followers: string[];
  following: string[];
  notifications: string[];
  messages: string[];
  _id: string;
  fullName: string;
  image?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  username: string;
}

// Comment 타입
interface Comment {
  _id: string;
  comment: string; // 댓글 내용
  author: User; // 작성자 정보 (User 타입)
  post: string; // 댓글이 속한 게시글 ID
  createdAt: string; // 댓글 생성 날짜
  updatedAt: string; // 댓글 수정 날짜
  __v: number; // MongoDB 버전 키
}

// Channel 타입
interface Channel {
  authRequired: boolean; // 인증 필요 여부
  posts: string[]; // 채널에 속한 게시글 ID 배열
  _id: string; // 채널 ID
  name: string; // 채널 이름
  description: string; // 채널 설명
  createdAt: string; // 채널 생성 날짜
  updatedAt: string; // 채널 수정 날짜
  __v: number; // MongoDB 버전 키
}

// Post 타입
interface Post {
  likes: string[]; // 게시글 좋아요 ID 배열
  comments: Comment[]; // 게시글 댓글 배열 (Comment 타입)
  _id: string; // 게시글 ID
  title: string; // 게시글 제목
  channel: Channel; // 게시글이 속한 채널 정보
  author: User; // 게시글 작성자 정보 (User 타입)
  createdAt: string; // 게시글 생성 날짜
  updatedAt: string; // 게시글 수정 날짜
  __v: number; // MongoDB 버전 키
}
