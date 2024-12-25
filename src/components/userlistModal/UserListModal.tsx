import UserBox from "./UserBox";
import closeIcon from "../../assets/close.svg";
import darkCloseIcon from "../../assets/darkicons/darkClose.svg";
import searchIcon from "../../assets/searchIcon.svg";
import darkSearchIcon from "../../assets/darkicons/darkSearchIcon.svg";
import { useEffect, useState } from "react";
import UserNone from "./UserNone";
import { usesidebarToggleStore } from "../../stores/sideberToggleStore";
import Lottie from "react-lottie-player";
import lottieJson from "../../assets/lottie/loading-b.json";
import { twMerge } from "tailwind-merge";
import { useDarkModeStore } from "../../stores/darkModeStore";
import { getUsers } from "../../api/User";
import { searchUserFn } from "../../api/Search";

interface UserListModalType {
  handleBackClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserListModal({
  handleBackClick,
  setIsOpen,
}: UserListModalType) {
  // 다크모드
  const isDark = useDarkModeStore((state) => state.isDark);

  // 토글 상태
  const isToggle = usesidebarToggleStore((state) => state.isToggle);

  // 상태
  const [status, setStatus] = useState<
    "idle" | "loading" | "searching" | "nouser"
  >("idle");

  // 유저목록
  const [userList, setUserList] = useState<UserListType[]>();

  const [userListError, setUserListError] = useState(false);

  // 검색 유저
  const [searchUser, setSearchUser] = useState("");

  // 검색한 유저 저장
  const [getUser, setGetUser] = useState<SearchUserType[]>();

  // 초기 렌더링 유저목록 불러오기
  useEffect(() => {
    const setUser = async () => {
      setStatus("loading");
      try {
        const userListData = await getUsers();
        setUserList(userListData);
      } catch (error) {
        console.log(error);
        setUserListError(true);
      } finally {
        setStatus("idle");
      }
    };
    setUser();
  }, []);

  // 검색 디바운스 처리
  useEffect(() => {
    if (!searchUser) {
      setStatus("idle");
      setGetUser(undefined);
      return;
    }
    const searchDebounce = setTimeout(async () => {
      setStatus("searching");
      if (searchUser.length > 0) {
        try {
          setStatus("loading");
          const users = await searchUserFn(searchUser);
          setGetUser(users);
        } catch (error) {
          console.error(error);
        } finally {
          setStatus("searching");
        }
      }
    }, 1200);

    return () => {
      clearTimeout(searchDebounce);
    };
  }, [searchUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchUser(e.target.value);
  };

  return (
    <>
      <div
        className={`w-[380px] h-[600px]
      bg-white rounded-[25px] absolute bottom-[3px] ${
        isToggle ? `left-[290px]` : "left-[90px]"
      }
      before:modal-before  scrollbar-none flex flex-col justify-start items-center
      gap-10 py-8 z-30 dark:bg-[#252525] dark:before:darkModal-before`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="w-[30px] h-[30px] absolute top-3 right-3 cursor-pointer hover:bg-[rgba(0,0,0,0.1)] dark:hover:bg-[rgba(0,0,0,0.6)] rounded-[50%]
          flex items-center justify-center
        "
          onClick={(e) => {
            handleBackClick(e);
          }}
        >
          {!isDark ? (
            <img src={closeIcon} alt="닫기 버튼" />
          ) : (
            <img src={darkCloseIcon} alt="다크모드 닫기 버튼" />
          )}
        </div>
        <div className="relative flex items-center justify-center mt-4">
          <input
            className="px-5 py-2 w-[320px] rounded-[25px] border border-[rgb(208, 208, 208)]
            outline-none dark:bg-[#373737] dark:border-[#fff] dark:text-[#fff] dark:placeholder:text-[#bdbdbd]
          "
            type="text"
            placeholder="찾으시는 유저를 검색하세요"
            value={searchUser}
            onChange={handleChange}
          />
          <img
            src={!isDark ? searchIcon : darkSearchIcon}
            alt="검색 아이콘"
            className="absolute right-4"
          />
        </div>
        <div className="relative flex flex-col items-center justify-start w-full h-full gap-4 overflow-scroll scrollbar-none ">
          {/* 로딩중 */}
          {status === "loading" && (
            <div
              className={twMerge(
                "absolute z-20 flex justify-center items-center w-full h-full bg-white/80 dark:bg-lightBlackDark/50"
              )}
            >
              <Lottie
                className="w-[130px] h-[130px]"
                loop
                animationData={lottieJson}
                play
              />
            </div>
          )}

          {status === "searching" &&
            (getUser?.length ? (
              getUser.map((user) => (
                <UserBox
                  key={user._id}
                  fullname={user.fullName}
                  followers={user.followers}
                  following={user.following}
                  image={user.image ? user.image : null}
                  userid={user._id}
                  setIsOpen={setIsOpen}
                />
              ))
            ) : (
              <UserNone />
            ))}

          {status === "idle" &&
            (userList?.length ? (
              userList.map(
                (user) =>
                  user.role !== "SuperAdmin" && (
                    <UserBox
                      key={user._id}
                      fullname={user.fullName}
                      followers={user.followers}
                      following={user.following}
                      isOnline={user.isOnline}
                      image={user.image ? user.image : null}
                      userid={user._id}
                      setIsOpen={setIsOpen}
                    />
                  )
              )
            ) : (
              <div
                className={twMerge(
                  "absolute z-20 flex justify-center items-center w-full h-full bg-white/80 dark:bg-lightBlackDark/50"
                )}
              >
                <Lottie
                  className="w-[130px] h-[130px]"
                  loop
                  animationData={lottieJson}
                  play
                />
              </div>
            ))}

          {/* 초기 렌더링 오류 */}
          {userListError && (
            <div className="text-red-600 text-[20px] font-bold">
              오류가 발생했습니다
            </div>
          )}
        </div>
      </div>
    </>
  );
}
