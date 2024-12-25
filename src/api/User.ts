import { api } from "./axios";

// 사용자 목록을 가져옵니다.
export const getUsers = async () => {
  try {
    const { data } = await api.get("/users/get-users");
    const userListData: UserListType[] = data;

    return userListData;
  } catch (err) {
    console.log(err);
  }
};

// 사용자 프로필 사진 혹은 커버 사진을 변경합니다
export const updateUserImg = async (formData: FormData) => {
  try {
    const response = await api.post("/users/upload-photo", formData);

    return response;
  } catch (err) {
    console.log(err);
  }
};

// 사용자 정보를 변경합니다.
export const updateNameFn = async (fullName: string) => {
  try {
    const response = await api.put("/settings/update-user", {
      fullName,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
