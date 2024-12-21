import thumbnail from "../assets/images/feed_thumbnail.jpg";
import likeIcon from "../assets/like_icon.svg";
import likeFillIcon from "../assets/icons/like_fill_icon.svg";
import chatIcon from "../assets/chat_icon_black.svg";
import UserProfile from "./UserProfile";
import { useNavigate } from "react-router";
import { useAuth } from "../stores/authStore";
import { useDarkModeStore } from "../stores/darkModeStore";
import darkChatIcon from "../assets/chat_icon.svg";
import moment from "moment";

export default function Review({
  image,
  title,
  likes,
  comments,
  createdAt,
  author,
  fullName,
  userImg, // 마이페이지, 로그인 한 유저의 사진
  _id: post_id,
}: PostType & MyInfo) {
  const navigate = useNavigate();
  const myInfo = useAuth((state) => state.user);

  // 날짜 형식
  const update = moment(createdAt); // moment로 변환
  const date = update.format("YYYY.MM.DD"); // 원하는 형식으로 포맷팅

  function isValidJson(data: string) {
    try {
      JSON.parse(data);
      return true; // 유효한 JSON
    } catch (e) {
      return false; // 잘못된 JSON
    }
  }

  let postTitle = "";
  let postContent = "";
  if (isValidJson(title)) {
    const parsedData = JSON.parse(title);
    postTitle = parsedData.HTitle;
    postContent = parsedData.desc;
  } else {
    // title이 JSON이 아닌 경우
    postTitle = title;
    postContent = title;
  }
  const userid = author?._id;
  const handleClick = (
    userid: string | undefined,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation(); // 이벤트 전파 중지
    navigate(`/user/${userid}`);
  };

  const myLike = likes.some((like) => like.user === myInfo?._id);

  const isDark = useDarkModeStore((state) => state.isDark);

  return (
    <div
      className="w-full h-[360px] flex items-center px-8 gap-16 cursor-pointer rounded-xl border border-lightGreyDark/50 dark:bg-darkGreyDark dark:text-[#fff] border-2 border-red-500"
      onClick={() => navigate(`/gymreview/${post_id}`)}
    >
      {/* 썸네일(왼쪽) */}
      <div
        className="w-[380px] h-[300px] bg-cover bg-center
        rounded-2xl shadow-lg border-2 border-green-500"
        style={{ backgroundImage: `url(${image || thumbnail})` }}
      />
      {/* 게시물 정보(오른쪽) */}
      <div className="flex flex-col justify-between border-2 border-red-500">
        {/* 글 작성자 정보 */}
        <div className="flex justify-start gap-[13px] mt-[30px]">
          {/* 유저 프로필 이미지 */}
          <div onClick={(e) => handleClick(userid, e)}>
            <UserProfile
              BackWidth="w-[40px]"
              BackHeight="h-[40px]"
              userImg={userImg ? userImg : author?.image}
            />
          </div>
          {/* 유저 정보 */}
          <div className="flex flex-col">
            <div className="text-base font-medium">
              {author ? author.fullName : fullName}
            </div>
            <div className="text-sm font-light">{date}</div>
          </div>
        </div>

        {/* 게시물 내용 */}
        <div className="">
          <h3 className="mb-[30px] text-[24px] ml-11">{postTitle}</h3>
          <p className="text-[16px]  w-[400px] h-[120px] line-clamp-5 ml-11">
            {postContent}
          </p>
        </div>

        {/* 아이콘 */}
        <div className="flex flex-row gap-[18px] justify-end mb-[30px]">
          <div className="flex flex-row gap-1">
            <img src={myLike ? likeFillIcon : likeIcon} alt="좋아요 아이콘" />
            <span>{likes.length}</span>
          </div>
          <div className="flex flex-row gap-1">
            <img src={!isDark ? chatIcon : darkChatIcon} alt="채팅 아이콘" />
            <span>{comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
