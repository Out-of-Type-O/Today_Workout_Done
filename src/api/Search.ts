import { api } from "./axios";

export const searchUserFn = async (searchparams: string) => {
  try {
    const { data }: { data: SearchUserType[] } = await api(
      `/search/users/${searchparams}`
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};
