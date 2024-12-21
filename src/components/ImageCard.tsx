import thumbnail from "../assets/images/feed_thumbnail.jpg";
import likeIcon from "../assets/like_icon.svg";
import likeFill from "../assets/icons/like_fill_icon.svg";
import chatIcon from "../assets/chat_icon.svg";
import UserProfile from "./UserProfile";
import { useLocation, useNavigate } from "react-router";
import { channelMapping } from "../constants/channel";
import { useAuth } from "../stores/authStore";
import moment from "moment";

export default function ImageCard({
  image,
  title,
  likes,
  comments,
  createdAt,
  author,
  fullName,
  userImg, // 마이페이지, 로그인 한 유저의 사진
  _id: post_id,
  channel,
  myLike, // 마이페이지, 내가 좋아요한 게시글ID
  disableNavigate = false,
}: PostType & MyInfo & { disableNavigate?: boolean }) {
  const { pathname } = useLocation();
  console.log(disableNavigate, "확인");

  const isLogin = useAuth((state) => state.isLoggedIn);
  const myInfo = useAuth((state) => state.user);
  const navigate = useNavigate();

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
  if (isValidJson(title)) {
    const parsedData = JSON.parse(title);
    postTitle = parsedData.HTitle;
  } else {
    // title이 JSON이 아닌 경우
    postTitle = title;
  }

  const userid = author?._id;
  const handleClick = () => {
    if (disableNavigate) return;
    if (userid === myInfo?._id) {
      navigate("/myprofile");
    } else {
      navigate(`/user/${userid}`);
    }
  };

  const channelName = Object.keys(channelMapping).find((key) => {
    if (typeof channel === "string") {
      return channelMapping[key] === channel;
    } else {
      return channelMapping[key] === channel?._id;
    }
  });

  // 본인 좋아요 확인
  const checkIsLiked = likes.some((like) => like.user === myInfo?._id);

  const checkMyLike = myLike?.some((id) => id === post_id);
  return (
    <div className="flex flex-col items-center gap-3">
      {/* 썸네일 */}
      <div
        className="group relative w-full min-w-[250px] h-[250px] bg-cover bg-center rounded-2xl shadow-lg cursor-pointer"
        style={{ backgroundImage: `url(${image || thumbnail})` }}
        onClick={() => {
          if (pathname === "/myprofile") {
            navigate(`/myprofile/posts/${post_id}`);
          } else {
            navigate(`/${channelName}/${post_id}`);
          }
        }}
      >
        {/* Hover */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 rounded-2xl group-hover:opacity-100">
          <h3 className="w-[80%] text-[22px] font-bold truncate">
            {postTitle}
          </h3>
          {/* 아이콘 */}
          <div className="absolute bottom-6 right-6 flex gap-[18px] text-lg font-normal ">
            <div className="flex gap-1">
              <img
                className="w-[26px]"
                src={
                  isLogin
                    ? checkIsLiked || checkMyLike
                      ? likeFill
                      : likeIcon
                    : likeIcon
                }
                alt="좋아요 아이콘"
              />
              <span>{likes.length}</span>
            </div>
            <div className="flex gap-1">
              <img src={chatIcon} alt="채팅 아이콘" />
              <span>{comments.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 글 작성자 정보 */}
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-center gap-[10px]">
          <UserProfile
            BackWidth="w-[30px]"
            BackHeight="h-[30px]"
            userImg={userImg ? userImg : author?.image}
            onClick={handleClick}
            disableNavigate={disableNavigate} // 마우스 커서 변경여부
          />
          <div className="text-base font-medium dark:text-[#fff]">
            {author ? author.fullName : fullName}
          </div>
        </div>
        <div className="text-sm font-light dark:text-[#fff]">{date}</div>
      </div>
    </div>
  );
}
