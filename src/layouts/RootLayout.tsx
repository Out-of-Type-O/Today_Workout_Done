import { Outlet } from "react-router";
import Header from "../components/rootlayout/Header";
import Sidebar from "../components/rootlayout/Sidebar";
import { usesidebarToggleStore } from "../stores/sideberToggleStore";
import { twMerge } from "tailwind-merge";
import scrollUp from "../assets/scrollUp.svg";
import darkScrollUp from "../assets/darkicons/darkScrollBtn.svg";
import { useState } from "react";
import { useDarkModeStore } from "../stores/darkModeStore";

export default function RootLayout() {
  console.log("렌더링");
  const isDark = useDarkModeStore((state) => state.isDark); // 다크모드
  const isToggle = usesidebarToggleStore((state) => state.isToggle); // 사이드 바
  const [isModalOpen, setIsModalOpen] = useState(false); // 유저 목록 모달창

  // 스크롤 맨위로
  const scrollToTop = () => {
    // if (scrollContainerRef.current) {
    //   scrollContainerRef.current.scrollTo({
    //     top: 0,
    //     behavior: "smooth",
    //   });
    // }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={twMerge(
        "flex flex-col font-pretendard w-full min-h-screen h-screen"
        // isLoading && "overflow-hidden"
      )}
      // ref={scrollContainerRef}
    >
      {/* 헤더 사이드바 */}
      <Header logo sidebar />
      <Sidebar setIsModalOpen={setIsModalOpen} />

      {/* 메인 */}
      <div
        className={twMerge(
          "flex-1 pt-[70px] transition-[padding] dark:bg-lightBlackDark",
          isToggle ? "pl-[300px]" : "pl-20" // 사이드 바에 따라 padding 값 결정
        )}
      >
        <Outlet />
      </div>

      {/* 위로 가기 버튼 */}
      <div
        className={`fixed right-[25px] bottom-[10px] z-50 w-[40px] ${
          isModalOpen && "hidden"
        }`}
      >
        <button onClick={scrollToTop}>
          <img
            src={!isDark ? scrollUp : darkScrollUp}
            alt="위로 이동"
            className="object-fill rounded-full shadow-xl"
          />
        </button>
      </div>
    </div>
  );
}
