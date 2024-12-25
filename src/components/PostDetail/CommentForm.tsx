import likeIcon from "../../assets/like_icon.svg";
import likeFill from "../../assets/icons/like_fill_icon.svg";
import chatIcon from "../../assets/chat_icon_black.svg";
import darkCommentIcon from "../../assets/darkicons/darkChatIcon.svg";
import ButtonComponent from "../ButtonComponent";
import { useAuth } from "../../stores/authStore";
import { useDarkModeStore } from "../../stores/darkModeStore";

interface CommentFormProps {
  // likes: LikeType[];
  // comments: CommentType[];
  postId: string | undefined;
  postAuthorId: string | undefined;
  handleCommentSubmit: (comment: string) => Promise<void>;
  newComment: string;
  commentList: Comment[];
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  commentinputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  handleLike: (postId: string, postAuthorId: string) => Promise<void>;
  likeList: LikeType[];
  isLiked: boolean | undefined;
}

export default function CommentForm({
  // likes,
  // comments,
  postId,
  postAuthorId,
  handleCommentSubmit,
  newComment,
  commentList,
  setNewComment,
  commentinputRef,
  handleLike,
  likeList,
  isLiked,
}: CommentFormProps) {
  const isDark = useDarkModeStore((state) => state.isDark);

  //로그인 상태
  const loginId = useAuth((state) => state.isLoggedIn);

  const commentHandler = () => {
    // 로그인 안했을 때
    if (!loginId) return alert("로그인 후 이용하실 수 있습니다");

    // 공백만 적었을 때
    if (!newComment.trim()) {
      alert("내용을 입력해주세요");
      // 다시 초기화 해주기
      setNewComment("");
      return;
    }

    handleCommentSubmit(newComment.trim());
  };

  return (
    <div className="">
      {/* 좋아요 이모티콘 댓글 이모티콘 area */}
      <div className="flex gap-4 dark:text-white">
        <div className="flex gap-1">
          <button
            onClick={() => handleLike(postId as string, postAuthorId as string)}
          >
            {isLiked ? (
              <img className="w-6" src={likeFill} alt="likeFill" />
            ) : (
              <img className="w-6" src={likeIcon} alt="likeIcon" />
            )}
          </button>
          {likeList.length}
        </div>
        <div className="flex gap-1">
          <button>
            <img src={!isDark ? chatIcon : darkCommentIcon} alt="chatIcon" />
          </button>
          {commentList.length}
        </div>
      </div>

      {/* 댓글작성 */}
      <div>
        <textarea
          ref={commentinputRef}
          className="mt-3 mb-1 h-[100px] px-4 py-3 text-sm border-2 
          rounded-[6px] w-full resize-none focus:outline-none
          dark:bg-[#2c2c2c] dark:border-[#717171] dark:text-white"
          placeholder={
            loginId ? "댓글을 작성해 주세요" : "로그인 후 이용해 주세요"
          }
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={300} // 최대 글자 수 제한
          // disabled={!loginId} // 로그인 상태가 아닐시 비활성화
        ></textarea>
        <div className="flex justify-between">
          <div className="flex gap-8">
            <p className="text-sm dark:text-white">{newComment.length}/300</p>
            {newComment.length >= 300 && (
              <div className="text-red-500 text-[14px]">
                300자 이상 입력하실 수 없습니다
              </div>
            )}
          </div>

          <ButtonComponent
            onClick={commentHandler} // 로그인 상태에 따라 동작
            bgcolor={!isDark ? "bg-[#265CAC]" : "bg-mainDark"}
            disabledBgColor={!isDark ? "bg-[#4772b2a5]" : "bg-[#81b4dda5] "}
            textcolor={!isDark ? "text-[white]" : "text-black"}
            disabled={!newComment}
          >
            {"댓글 작성"}
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
}
