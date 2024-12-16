import thumbnail from "../assets/images/feed_thumbnail.jpg";
import likeIcon from "../assets/like_icon.svg";
import likeFill from "../assets/icons/like_fill_icon.svg";
import chatIcon from "../assets/chat_icon.svg";
import UserProfile from "./UserProfile";
import { useNavigate } from "react-router";
import { channelMapping } from "../constants/channel";
import { api } from "../api/axios";
import { useEffect, useState } from "react";

interface Channel {
  _id: string;
}

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
}: PostType & MyInfo) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const navigate = useNavigate();
  const update = new Date(createdAt);
  const date = update
    .toLocaleDateString("ko-KR")
    .slice(0, -1)
    .replace(/\s/g, "");

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

  useEffect(() => {
    const getPostData = async () => {
      try {
        const { data } = await api.get(`/posts/${post_id}`);
        setChannel(data.channel);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    getPostData();
  }, [post_id]);

  const postChannelName = channel
    ? Object.keys(channelMapping).find(
        (key) => channelMapping[key] === channel._id
      )
    : null;

  // 본인 좋아요 확인
  const checkIsLiked = likes.some((like) => like.user === author?._id);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 썸네일 */}
      <div
        className="group relative w-[250px] h-[250px] bg-cover bg-center rounded-2xl shadow-lg cursor-pointer"
        style={{ backgroundImage: `url(${image || thumbnail})` }}
        onClick={() =>
          postChannelName
            ? navigate(`/${postChannelName}/${post_id}`)
            : console.error("Invalid postChannelName")
        }
      >
        {/* Hover */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-opacity duration-300 bg-black bg-opacity-50 rounded-2xl opacity-0 group-hover:opacity-100">
          <h3 className="w-[80%] text-[22px] font-bold truncate">
            {postTitle}
          </h3>
          {/* 아이콘 */}
          <div className="absolute bottom-6 right-6 flex gap-[18px] text-lg font-normal ">
            <div className="flex gap-1">
              <img
                className="w-[26px]"
                src={checkIsLiked ? likeFill : likeIcon}
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
          />
          <div className="text-base font-medium">
            {author ? author.fullName : fullName}
          </div>
        </div>
        <div className="text-sm font-light">{date}</div>
      </div>
    </div>
  );
}
