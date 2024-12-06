import { useState } from "react";
import ChannelList from "../ChannelList";
import UserListModal from "../userlistModal/UserListModal";
import UserProfile from "../UserProfile";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleBackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const channel = [
    {
      id: 1,
      title: "오운완 인증",
      src: "dumbbell_icon",
      alt: "오운완 아이콘",
      route: "/",
    },
    {
      id: 2,
      title: "프로틴 추천",
      src: "protein_icon",
      alt: "프로틴 아이콘",
      route: "protein",
    },
    {
      id: 3,
      title: "루틴 공유",
      src: "routine_icon",
      alt: "루틴 아이콘",
      route: "routine",
    },
    {
      id: 4,
      title: "헬스장 후기",
      src: "gym_icon",
      alt: "헬스장 아이콘",
      route: "gymreview",
    },
  ];

  return (
    <div
      className={`flex flex-col items-center w-[350px] 
      py-5 gap-8 text-[#1D1D1D] bg-[#FEFEFE] border-r
      border-gray-200/50 relative ${isOpen ? "before:modal-back" : ""}`}
      onClick={(e) => handleBackClick(e)}
    >
      <button className="self-end w-10 mr-2">
        <img src="/src/assets/double-left.svg" alt="" />
      </button>
      {/* 로고 */}
      <a className="w-20 h-[53px]" href="/">
        <img src="/src/assets/loge.svg" alt="loge" />
      </a>
      {/* 멘트 */}
      <div className="flex flex-col items-center gap-[14px] pb-[23px] w-full">
        <div className="flex flex-col items-center text-xl font-bold text-center">
          <div>
            어서오세요{" "}
            <span className="text-[#265CAC] text-[26px] font-extrabold">
              수영
            </span>
            님
          </div>
          <div>오늘도 운동 완료하셨나요?</div>
        </div>
        {/* 유저 프로필 */}
        <UserProfile
          edit
          BackWidth="w-[122px]"
          BackHeight="h-[122px]"
          IconWidth="w-[84px]"
          IconHeight="h-[84px]"
        />
      </div>

      <div className="flex flex-col justify-between w-full h-full">
        {/* 채널목록 */}
        <div className="w-full">
          <ul className="flex flex-col w-full gap-1 px-1">
            {channel.map((item) => {
              return (
                <ChannelList
                  src={item.src}
                  alt={item.alt}
                  route={item.route}
                  key={item.id}
                >
                  {item.title}
                </ChannelList>
              );
            })}
          </ul>
        </div>
        {/* 유저목록 버튼 */}
        <button
          className="self-center w-[243px] h-[50px] bg-[#3B6CB4] rounded-[20px] text-xl text-white font-bold relative"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          유저 목록
        </button>
        {isOpen && <UserListModal handleBackClick={handleBackClick} />}
      </div>
    </div>
  );
}
