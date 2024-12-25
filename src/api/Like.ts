import { api } from "../api/axios";
import { createNotification } from "../utils/api/createNotification";

export const addPostLike = async (postId: string, postAuthorId: string) => {
  try {
    const { data } = await api.post("/likes/create", { postId });

    if (data.user != postAuthorId) {
      await createNotification("LIKE", data.user, postAuthorId, postId);
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const removePostLike = async (likeId: string | undefined) => {
  try {
    const { data } = await api.delete("/likes/delete", {
      data: { id: likeId },
    });

    return data;
  } catch (err) {
    console.log(err);
  }
};
