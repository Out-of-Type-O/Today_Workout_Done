import { api } from "../api/axios";
import { createNotification } from "../utils/api/createNotification";

export const follow = async (userId: string, myId: string) => {
  try {
    const { data } = await api.post("/follow/create", { userId });

    await createNotification("FOLLOW", myId, userId, null);

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const unfollow = async (id: string | undefined) => {
  try {
    const { data } = await api.delete(`/follow/delete`, {
      data: { id },
    });

    return data;
  } catch (err) {
    console.log(err);
  }
};
