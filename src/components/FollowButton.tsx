import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../stores/authStore";
import { follow, unfollow } from "../api/Follow";

export default function FollowButton({
  width,
  height,
  rounded,
  userid,
  setUserFollowers,
}: {
  width: string;
  height: string;
  rounded: string;
  userid?: string;
  setUserFollowers?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const myInfo = useAuth((state) => state.user);
  const setUser = useAuth((state) => state.setUser);
  const myfollowing = useAuth((state) => state.user?.following);

  const isLogin = useAuth((state) => state.isLoggedIn); // 로그인 상태
  const myId = useAuth((state) => state.user?._id); // 로그인 상태

  const [isFollowing, setIsFollowing] = useState<boolean>(false); //팔로우 상태

  useEffect(() => {
    if (!isLogin) return setIsFollowing(false);

    const isUserFollowing = myfollowing?.some((item) => item.user === userid);
    setIsFollowing(isUserFollowing || false);
  }, [myfollowing, isLogin, userid]);

  // 팔로우
  const handleFollow = async (userId: string) => {
    if (!isLogin) return;

    if (myInfo) {
      try {
        if (!isFollowing && myId) {
          //팔로우
          const data = await follow(userId, myId);

          if (setUserFollowers) {
            setUserFollowers((prev) => prev + 1);
          }
          setUser({
            ...myInfo,
            following: [...(myInfo?.following || []), data],
          });

          setIsFollowing(true);
        } else if (isFollowing) {
          //팔로우 취소
          const targetFollowing = myInfo?.following?.find(
            (item) => item.user === userid
          );
          if (!targetFollowing) return;

          await unfollow(targetFollowing._id);
          if (setUserFollowers) {
            setUserFollowers((prev) => prev - 1);
          }
          // 전역 상태 업데이트
          setUser({
            ...myInfo,
            following:
              myInfo.following?.filter(
                (item) => item._id !== targetFollowing._id
              ) || [],
          });
          setIsFollowing(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <button
      onClick={() => {
        if (userid) {
          handleFollow(userid);
        }
      }}
      className={twMerge(
        "bg-[#265CAC] hover:bg-[#1e4d8a] text-white dark:text-[#000] flex justify-center items-center text-sm cursor-pointer",
        width,
        height,
        rounded,
        isFollowing
          ? "bg-[#646464] dark:bg-[#8e8e8e] hover:bg-[#4b4b4b] dark:hover:bg-[#7e7e7e]"
          : "bg-[#265CAC] dark:bg-[#81B4DD] hover:bg-[#1e4d8a] dark:hover:bg-[#77a5cb]"
      )}
    >
      {isFollowing ? "팔로잉" : "팔로우"}
    </button>
  );
}
