// 공통 타입
interface BaseUserType {
  role: string;
  emailVerified: boolean;
  banned: boolean;
  isOnline: boolean;
  posts: string[];
  likes: string[];
  comments: string[];
  notifications: string[];
  messages: string[];
  _id: string;
  fullName: string;
  email: string;
  createdAt: Date | string; // 더 넓은 타입으로 설정
  updatedAt: Date | string; // 더 넓은 타입으로 설정
  __v: number;
  image?: string;
  imagePublicId?: string;
  coverImage?: string;
  coverImagePublicId?: string;
}

// /users/get-users으로 불러온 user 타입
interface UserListType extends BaseUserType {
  followers: string[];
  following: string[];
}

// /search/users/{searchQuery}로 불러온 user 타입
interface SearchUserType extends BaseUserType {
  followers: [];
  following: [];
}

interface User extends BaseUserType {
  followers: string[];
  following: string[];
  username: string; // 추가된 필드
}
