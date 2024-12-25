import { useNavigate } from "react-router";
import notifyIcon from "../../assets/notifyIcon.svg";
import { twMerge } from "tailwind-merge";
import logoImg from "../../assets/loge.svg";
import UserProfile from "../UserProfile";
import ButtonComponent from "../ButtonComponent";
import { useAuth } from "../../stores/authStore";
import { useState } from "react";
import Notification from "../notification/Notification";
import { useToken } from "../../stores/tokenStore";
import ModeChange from "../button/ModeChange";
import bars from "../../assets/icons/bars.svg";
import close from "../../assets/icons/close-icon.svg";
import { useDarkModeStore } from "../../stores/darkModeStore";
import darkNotifyIcon from "../../assets/darkicons/darkNotifyIcon.svg";
import darkMainLogo from "../../assets/darkicons/darkMainLogo.svg";

// 사이드바 접힐때 로고 보이도록 처리하자
export default function Header({
  logo,
  sidebar,
}: {
  logo?: boolean;
  sidebar?: boolean;
}) {
  // 헤더 반응형 토글
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  // 토큰 설정
  const setToken = useToken((state) => state.setToken);

  // 로그인상태, 로그인, 로그아웃, 유저정보저장
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  // const login = useAuth((state) => state.login);
  const logout = useAuth((state) => state.logout);
  const setUser = useAuth((state) => state.setUser);
  const userInfo = useAuth((state) => state.user);
  const notificationArray = userInfo?.notifications;

  const logoutHandler = () => {
    // 로그아웃 / 토큰 삭제 / 유저정보 삭제
    logout();
    setToken(null);
    setUser(null);
    // 로컬스토리지 삭제
    useToken.persist.clearStorage();
  };

  // Todo : 알림창 폼 보여줄지 분기처리
  const [showNoti, setShowNoti] = useState(false);

  // 아래 주석 없어도 작동 가능
  // // 모두읽음 누르면 값 처리해서 뱃지 없애기
  // const [isNoti, setIsNoti] = useState(true);

  // const setIsNotiHandler = () => {
  //   setIsNoti(false);
  // };

  const showNotiHandler = () => {
    setShowNoti(!showNoti);
  };

  // 다크모드
  const isDark = useDarkModeStore((state) => state.isDark);

  return (
    <header
      className={twMerge(
        "h-[70px] w-full flex items-center justify-end dark:bg-lightBlackDark fixed left-0 top-0 z-10 bg-white",
        logo ? "justify-between" : "justify-end",
        sidebar ? "pl-[100px] pr-[36px]" : "px-[36px]",
        isActive && "on"
      )}
    >
      <div
        onClick={() => setIsActive(!isActive)}
        className="block lg:hidden bars"
      >
        <img src={isActive ? close : bars} alt="bars" />
      </div>
      {/* 로고 */}
      <div
        className={twMerge(
          "cursor-pointer lg:block hidden logo",
          !logo && "hidden",
          !isActive && "hidden"
        )}
      >
        <img
          src={!isDark ? logoImg : darkMainLogo}
          alt="logo"
          onClick={() => navigate("/")}
        />
      </div>

      {isLoggedIn ? (
        // 로그인 상태 분기
        <div className="flex gap-[10px] items-center header-inner">
          {/* 모드변경 버튼 */}
          <div className="hidden lg:block modeChange">
            <ModeChange />
          </div>
          <div className="hidden gap-2 lg:flex buttonComponent">
            <ButtonComponent
              bgcolor="bg-[#265CAC] hover:bg-[#1e4d8a] dark:bg-mainDark dark:hover:bg-mainTextDark"
              textcolor="text-[white] dark:text-blackDark"
              border="border-0"
              onClick={logoutHandler}
            >
              {"로그아웃"}
            </ButtonComponent>
            <ButtonComponent
              bgcolor="bg-white hover:bg-skyDark dark:bg-lightBlackDark dark:hover:bg-darkGreyDark"
              textcolor="text-[#265CAC] dark:text-mainDark"
              border="border-[2px] border-[#265CAC] dark:border-mainDark"
              onClick={() => navigate("/posting")}
            >
              {"새글등록"}
            </ButtonComponent>
          </div>
          {/* 알림 */}
          <div className="w-[48px] h-[48px] flex justify-center items-center mx-[10px] relative notification">
            <img
              src={!isDark ? notifyIcon : darkNotifyIcon}
              alt="알림 아이콘"
              className="cursor-pointer"
              // 알림창 띄워주는 변수
              onClick={() => {
                showNotiHandler();
              }}
            />
            {/* 알림이 있다면 뱃지색 처리 */}
            {userInfo?.notifications?.length != 0 && (
              <div className="w-[10px] h-[10px] rounded-[50%] bg-red-500 absolute bottom-[28px] right-[11px]"></div>
            )}
            {/* 알림창 보여줘야한다면 처리 */}
            {showNoti && (
              <Notification
                closeNoti={showNotiHandler}
                // isNoti={setIsNotiHandler} // 필요없음
                notificationArray={notificationArray}
              />
            )}
          </div>
          <UserProfile
            BackWidth="w-[48px]"
            BackHeight="h-[48px]"
            onClick={() => navigate("/myprofile")}
            userImg={userInfo?.image}
          />
        </div>
      ) : (
        // 비로그인 상태 분기
        <div
          className={twMerge(
            "flex gap-[10px] items-center",
            !isActive && "max-[440px]:hidden"
          )}
        >
          {/* 모드변경 버튼 */}
          <div className="flex justify-center">
            <ModeChange />
          </div>

          <ButtonComponent
            bgcolor="bg-[#265CAC] hover:bg-[#1e4d8a] dark:bg-mainDark dark:hover:bg-mainTextDark"
            textcolor="text-white dark:text-blackDark"
            border="border-0"
            onClick={() => navigate("/login")}
          >
            {"로그인"}
          </ButtonComponent>

          <ButtonComponent
            bgcolor="bg-white hover:bg-skyDark dark:bg-lightBlackDark dark:hover:bg-darkGreyDark"
            textcolor="text-[#265CAC] dark:text-mainDark"
            border="border-[2px] border-[#265CAC] dark:border-mainDark"
            onClick={() => navigate("/signup")}
          >
            {"가입하기"}
          </ButtonComponent>
        </div>
      )}
    </header>
  );
}
