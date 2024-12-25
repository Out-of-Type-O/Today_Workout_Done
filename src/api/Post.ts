import { api } from "../api/axios";
import { channelMapping } from "../constants/channel";

// 채널에 속한 게시물 목록을 가져옵니다.
export const getChannelPost = async (
  channelID: string,
  offset: number,
  limit: number
) => {
  try {
    const { data } = await api.get(
      `/posts/channel/${channelMapping[channelID]}?offset=${offset}&limit=${limit}`
    );
    return data;
  } catch (error) {
    console.error("데이터를 불러오는 도중 에러가 발생하였습니다.", error);
  }
};

// 특정포스트 상세보기
export const getPostDetail = async (postId: string) => {
  const { data } = await api.get(`/posts/${postId}`);

  return data;
};

// 게시물을 생성합니다.
export const createPost = async (formData: FormData) => {
  try {
    const response = await api.post("/posts/create", formData);

    return response;
  } catch (error) {
    console.log(error);
  }
};

// 내가 작성한 게시물을 삭제합니다.
export const deletePost = async (postId: string) => {
  try {
    await api.delete("/posts/delete", {
      data: { id: postId },
    });
  } catch (error) {
    console.error("글 삭제 도중 오류가 발생했습니다.", error);
  }
};

// 내가 작성한 게시물을 수정합니다.
export const updatePost = async (formData: FormData) => {
  try {
    const response = await api.put("/posts/update", formData);

    return response;
  } catch (error) {
    console.log(error);
  }
};
