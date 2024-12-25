import UserProfile from "../UserProfile";
import trashIcon from "../../assets/trash.svg";
import darkTrashIcon from "../../assets/darkicons/darkTrashIcon.svg";
import { useAuth } from "../../stores/authStore";
import { useNavigate } from "react-router";
import ConfirmModal from "../modal/ConfirmModal";
import { useState } from "react";
import moment from "moment";
import { useDarkModeStore } from "../../stores/darkModeStore";

export default function CommentBox({
  comment,
  handleDelete,
}: {
  comment: Comment;
  handleDelete: (commentId: string) => Promise<void>;
}) {
  const isDark = useDarkModeStore((state) => state.isDark);
  console.log("코멘트", comment);
  // 사용자 정보 가져오기
  const loginId = useAuth((state) => state.user);
  const navigate = useNavigate();

  //날짜 포맷
  const update = moment(comment.createdAt); // moment로 변환
  const formattedDate = update.format("YYYY.MM.DD"); // 원하는 형식으로 포맷팅
  // 시간 포맷팅
  const formattedTime = update.format("HH:mm");

  // 모달창 제어
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 작성자와 로그인한 사람이 같으면 myprofile로 이동
  // 그렇지않으면 유저 페이지로이동
  const handleClick = () => {
    if (comment.author._id === loginId?._id) {
      navigate("/myprofile");
    } else {
      navigate(`/user/${comment.author._id}`);
    }
  };

  return (
    <div className="flex flex-col py-5 border-b border-gray-200 dark:border-[#717171]">
      <div className="flex justify-between ">
        <div className="flex gap-[12px] w-fit items-center">
          <UserProfile
            BackWidth="w-[36px]"
            BackHeight="h-[36px]"
            userImg={comment.author.image}
            onClick={handleClick}
          />

          <div>
            <p className="text-[13px] mb-[4px] font-bold dark:text-white">
              {comment.author.fullName}
            </p>
            <div className="flex gap-1 text-xs font-light dark:text-greyDark">
              <p>{formattedDate}</p>
              <p>{formattedTime}</p>
            </div>
          </div>
        </div>
        {loginId?._id === comment.author._id && (
          <button onClick={() => setIsModalOpen(true)} className="w-8 mr-2">
            <img src={!isDark ? trashIcon : darkTrashIcon} alt="trashIcon" />
          </button>
        )}
      </div>
      <div className="mt-3 text-[14px] dark:text-white">{comment.comment}</div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => handleDelete(comment._id)}
        message={"이 댓글을 정말 삭제하시겠습니까?"}
      />
    </div>
  );
}
