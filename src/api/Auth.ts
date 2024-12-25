import { api } from "./axios";

// 사용자 인증 확인
export const getAuthUser = async () => {
  try {
    const { data } = await api.get("/auth-user");
    return data;
  } catch (error) {
    throw new Error(`정보 불러오기 실패! ${error}`);
  }
};

// 회원가입
export const postSignUp = async (
  fullName: string,
  email: string,
  password: string
) => {
  try {
    await api.post("/signup", {
      fullName,
      email,
      password,
    });
  } catch (error) {
    throw new Error(`회원가입 실패! ${error}`);
  }
};

// 로그인
export const postLogin = async (email: string, password: string) => {
  const { status, data } = await api.post("/login", {
    email,
    password,
  });
  return { status, data };
};
