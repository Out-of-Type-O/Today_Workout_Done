import UserProfile from "../UserProfile";
import trashIcon from "../../assets/trash.svg";
import { Comment } from "../../utils/getPostDetail";
import { useAuth } from "../../stores/authStore";
import { useNavigate } from "react-router";
import ConfirmModal from "../modal/ConfirmModal";
import { useState } from "react";
import moment from "moment";

export default function CommentBox({
  comment,
  handleDelete,
}: {
  comment: Comment;
  handleDelete: (commentId: string) => Promise<void>;
}) {
  // 사용자 정보 가져오기
  const loginId = useAuth((state) => state.user);
  const navigate = useNavigate();

  //날짜 포맷
  const update = moment(comment.createdAt); // moment로 변환
  const formattedDate = update.format("YYYY.MM.DD"); // 원하는 형식으로 포맷팅

  // 모달창 제어
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (userid: string) => {
    navigate(`/user/${userid}`);
  };

  return (
    <div className="flex flex-col py-5 border-b border-gray-200 dark:border-[#717171]">
      <div className="flex justify-between ">
        <div className="flex gap-[12px] w-fit items-center">
          <div onClick={() => handleClick(comment.author._id)}>
            <UserProfile
              BackWidth="w-[36px]"
              BackHeight="h-[36px]"
              userImg={comment.author.image}
            />
          </div>
          <div>
            <p className="text-[13px] mb-[4px] font-bold dark:text-white">
              {comment.author.fullName}
            </p>
            <p className="text-xs font-light dark:text-greyDark">
              {formattedDate}
            </p>
          </div>
        </div>
        {loginId?._id === comment.author._id && (
          <button onClick={() => setIsModalOpen(true)} className="w-8 mr-2">
            <img src={trashIcon} alt="trashIcon" />
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
