import PostInfo from "../components/PostDetail/PostInfo";
import leftIcon from "../assets/icons/double-left_blue.svg";
import rightIcon from "../assets/icons/double-right_blue.svg";
import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../stores/authStore";
import CommentSec from "../components/PostDetail/CommentSec";
import { useNavigate, useParams } from "react-router";
import { useLoadingStore } from "../stores/loadingStore";
import Loading from "../components/Loading";

// 아직 comments 타입을 정확히 지정하지않았다.
interface PostInfo {
  fullName: string;
  userID: string;
  createdAt: string;
  title: string;
  image: string;
  desc: string;
  likes: LikeType[];
  channelId: string;
  postID: string;
  userImg: string;
  posts: string[];
  channelName: string;
}

interface ChannelInfo {
  _id: string;
  name: string;
}

export default function PostDetail() {
  // 로딩
  const startLoading = useLoadingStore((state) => state.startLoading);
  const stopLoading = useLoadingStore((state) => state.stopLoading);

  const { post_id } = useParams();
  const loginId = useAuth((state) => state.user);
  const [data, setData] = useState<PostInfo | null>(null);
  const [channelData, setChannelData] = useState<ChannelInfo | null>(null);
  const [prevPost, setPrevPost] = useState<string | null>(null);
  const [nextPost, setNextPost] = useState<string | null>(null);
  const navigate = useNavigate();
  // 편집모드
  const [edit, setEdit] = useState(false);

  const getPostData = async () => {
    try {
      startLoading();
      // 여기에 포스트 id 값 넣기
      const { data } = await api.get(`/posts/${post_id}`);
      // console.log(data);

      const {
        author: { fullName, _id: userID, image: userImg },
        channel: { _id: channelId, posts, name: channelName },
        // comments,
        title,
        createdAt,
        image,
        likes,
        _id: postID,
      } = data;

      // 채널 데이터를 가져오고 채널의 포스트 배열을 추출
      const { data: channelData } = await api.get(
        `/posts/channel/${channelId}`
      );
      // console.log(channelData);
      setChannelData(channelData);

      // title이 JSON 형식이 아닐 경우를 처리
      let HTitle = "";
      let desc = "";

      if (title && title.startsWith("{") && title.endsWith("}")) {
        try {
          const parsedTitle = JSON.parse(title);

          HTitle = parsedTitle.HTitle || "";
          desc = parsedTitle.desc || "";
        } catch (error) {
          console.error("title JSON 파싱 중 오류 발생:", error);
        }
      } else {
        // JSON 형식이 아니면 그대로 title 사용
        HTitle = title;
        // desc는 비워두거나 기본값 설정
        desc = "";
      }

      setData({
        fullName,
        userID,
        // comments,
        title: HTitle,
        desc,
        createdAt,
        image,
        likes,
        channelId,
        postID,
        userImg,
        posts: posts || [],
        channelName,
      });

      getPrePostData(channelData, postID);
    } catch (error) {
      console.error("Error fetching post data: ", error);
    } finally {
      stopLoading();
    }
  };

  const getPrePostData = (
    channelData: ChannelInfo[],
    currentPostID: string
  ) => {
    const currentIndex = channelData.findIndex(
      (post) => post._id === currentPostID
    );
    // console.log(currentIndex);

    if (currentIndex === -1) {
      console.error("Post not found in the posts array");
      return;
    }

    const prevPostID =
      currentIndex > 0 ? channelData[currentIndex - 1]._id : null;
    const nextPostID =
      currentIndex < channelData.length - 1
        ? channelData[currentIndex + 1]._id
        : null;
    // console.log(`이전 페이지 ID : ${prevPostID}`);
    // console.log(`다음 페이지 ID : ${nextPostID}`);
    setPrevPost(prevPostID);
    setNextPost(nextPostID);
  };

  const resetState = () => {
    setData(null);
    setPrevPost(null);
    setNextPost(null);
  };

  useEffect(() => {
    resetState();
    getPostData();
  }, [post_id]);

  if (!data)
    return (
      <div className="relative flex flex-col">
        <Loading />
      </div>
    );

  return (
    <div className="flex justify-center w-full h-full">
      <div className="w-[766px] py-12 h-fit">
        {/* 포스트 정보  */}
        <PostInfo
          title={data.title}
          desc={data.desc}
          createdAt={data.createdAt}
          image={data.image}
          fullName={data.fullName}
          owner={data.userID === loginId?._id}
          channelId={data.channelId}
          postID={data.postID}
          edit={edit}
          setEdit={setEdit}
          userImg={data.userImg}
        />
        {/* 편집모드 일때는 댓글 렌더링 X */}
        {!edit && (
          <>
            <div className="flex justify-between">
              {/* 이전 페이지 버튼튼 */}
              <div
                className={`w-[150px] h-[45px] hover:bg-[#265CAC]/5 border-[0.5px] flex items-center justify-center gap-4 rounded-[10px] ${
                  prevPost ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
                onClick={() =>
                  prevPost &&
                  navigate(
                    data?.channelName === "WorkoutDone"
                      ? `/records/${prevPost}`
                      : `/${data.channelName.toLowerCase()}/${prevPost}`
                  )
                }
              >
                <img src={leftIcon} alt="leftIcon" className="w-[16px]" />
                <span>이전 포스트</span>
              </div>

              {/* 다음 페이지 버튼 */}
              <div
                className={`w-[150px] h-[45px] hover:bg-[#265CAC]/5 border-[0.5px] flex items-center gap-4 justify-center rounded-[10px] ${
                  nextPost ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
                onClick={() =>
                  nextPost &&
                  navigate(
                    data?.channelName === "WorkoutDone"
                      ? `/records/${nextPost}`
                      : `/${data.channelName.toLowerCase()}/${nextPost}`
                  )
                }
              >
                <span>다음 포스트</span>
                <img src={rightIcon} alt="leftIcon" className="w-[16px]" />
              </div>
            </div>

            {/* 댓글 섹션 */}
            <CommentSec
              likes={data.likes}
              // comments={data.comments}
              //포스트 아이디
              postId={post_id}
            />
          </>
        )}
      </div>
    </div>
  );
}
