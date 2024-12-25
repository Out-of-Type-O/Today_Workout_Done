import { twMerge } from "tailwind-merge";
import defaultUser from "../assets/defaultUser.svg";
import profileEdit from "../assets/profile-edit.svg";
import home from "../assets/icons/home_icon.svg";
import { useRef } from "react";
import { useLoadingStore } from "../stores/loadingStore";
import { useAuth } from "../stores/authStore";
import { useDarkModeStore } from "../stores/darkModeStore";
import darkProfileEdit from "../assets/darkicons/darkProfileEdit.svg";
import { updateUserImg } from "../api/User";

export default function UserProfile({
  edit,
  BackWidth,
  BackHeight,
  onClick,
  update,
  userImg,
  myProfile,
  disableNavigate,
}: userProfileType) {
  const imgRef = useRef<HTMLInputElement>(null);
  // console.log("2차확인", disableNavigate);
  // 로딩중
  const startLoading = useLoadingStore((state) => state.startLoading);
  const stopLoading = useLoadingStore((state) => state.stopLoading);

  // 내 정보
  const setMyInfo = useAuth((state) => state.setUser);

  const handleImgUpdate = async () => {
    if (!imgRef.current || !imgRef.current.files) return;

    const formData = new FormData();

    formData.append("isCover", "false");
    formData.append("image", imgRef.current.files[0]);
    try {
      startLoading();
      const response = await updateUserImg(formData);
      if (response) {
        setMyInfo({ ...response.data });
      }
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };
  const isDark = useDarkModeStore((state) => state.isDark);
  return (
    <div
      className={twMerge(
        "relative flex justify-center items-center shadow-profile-inner rounded-[50%]",
        BackWidth,
        BackHeight,
        !disableNavigate && "cursor-pointer" // 이동가능할 때만 cursor point 바꾸기
      )}
    >
      <img
        className={twMerge("w-full h-full rounded-[50%]")}
        src={userImg ? userImg : defaultUser}
        alt="userProfile"
        onClick={onClick}
      />

      {/* edit 기능 있는 유저 프로필 */}
      {edit && (
        <img
          className="absolute right-[-5px] bottom-[-5px] w-10"
          src={!isDark ? profileEdit : darkProfileEdit}
          alt="profile-edit"
          onClick={onClick}
        />
      )}

      {/* 로그인 유저 마이페이지 아이콘 표시 */}
      {myProfile && (
        <img
          className="absolute right-[-5px] bottom-[-5px] w-10"
          src={home}
          alt="profile-edit"
          onClick={onClick}
        />
      )}

      {/* 업데이트 기능이 있는 유저 */}
      {update ? (
        <div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="editProfileImg"
            ref={imgRef}
            onChange={handleImgUpdate}
          />
          <label htmlFor="editProfileImg">
            <img
              className="absolute right-[-5px] bottom-[-5px] w-10 cursor-pointer"
              src={!isDark ? profileEdit : darkProfileEdit}
              alt="profile-edit"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
