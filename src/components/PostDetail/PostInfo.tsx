import { useRef, useState, useEffect } from "react";
import UserProfile from "../UserProfile";
import { useNavigate } from "react-router";
import { channelMapping } from "../../constants/channel";
import thumbnail from "../../assets/images/feed_thumbnail.jpg";
import { useLoadingStore } from "../../stores/loadingStore";
import ConfirmModal from "../modal/ConfirmModal";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../../stores/authStore";
import { deletePost, updatePost } from "../../api/Post";

interface PostInfoProps {
  title: string;
  desc: string;
  createdAt: string;
  image: string;
  fullName: string;
  channelId: string;
  owner: boolean;
  postID: string;
  edit: boolean;
  userImg: string;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  userId?: string;
}

export default function PostInfo({
  title,
  desc,
  createdAt,
  image,
  fullName,
  channelId,
  owner,
  postID,
  edit,
  userImg,
  setEdit,
  userId,
}: PostInfoProps) {
  const navigate = useNavigate();
  const imgRef = useRef<HTMLInputElement>(null);
  const [titleInput, setTitleInput] = useState(title);
  const [context, setContext] = useState(desc);
  const [img, setImg] = useState(image);
  const [uploadImg, setUploadImg] = useState<File | null>(null);
  const textarea = useRef<HTMLTextAreaElement | null>(null);

  // 내 정보 가져오기
  const myInfo = useAuth((state) => state.user);

  // 모달 관리
  const [isOpen, setIsOpen] = useState(false); // 삭제 모달
  const [saveModal, setSaveModal] = useState(false); // 저장 모달

  // 로딩관리
  const startLoading = useLoadingStore((state) => state.startLoading);
  const stopLoading = useLoadingStore((state) => state.stopLoading);

  // 날짜 형식
  const update = moment(createdAt); // moment로 변환
  const formattedDate = update.format("YYYY.MM.DD"); // 원하는 형식으로 포맷팅
  // 시간 포맷팅
  const formattedTime = update.format("HH:mm");

  // 게시물 수정시 내용textarea 높이 조정 함수
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textarea.current) {
      textarea.current.style.height = "auto"; // 높이 초기화
      textarea.current.style.height = `${textarea.current.scrollHeight}px`; // 내용에 맞게 높이 조정
    }
    setContext(e.target.value);
  };

  // 게시물 정보 업데이트
  const updateHandler = async () => {
    const formData = new FormData();
    formData.append(
      "title",
      JSON.stringify({ HTitle: titleInput, desc: context })
    );
    formData.append("postId", postID);
    formData.append("channelId", channelId);
    if (uploadImg) {
      formData.append("image", uploadImg);
    }

    try {
      startLoading();
      await updatePost(formData);
      // alert("수정되었습니다.");
      setEdit(false);
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  const editButtonHandler = () => {
    setEdit(true);
  };

  // 이미지 미리보기 & 이미지 업로드
  const handleChange = () => {
    if (imgRef.current && imgRef.current.files) {
      const image = imgRef.current.files[0];

      const imgUrl = URL.createObjectURL(image);

      // Image 객체를 사용하여 크기 확인
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => {
        // 이미지가 로드된 후 너비와 높이 확인
        const width = img.width;
        const height = img.height;

        // 최소 이미지 크기 지정
        const minWidth = 400;
        const minHeight = 400;

        if (width < minWidth || height < minHeight) {
          alert(`이미지는 최소 ${minWidth}x${minHeight} 크기여야 합니다.`);
        } else {
          setImg(imgUrl); // 이미지 미리보기 URL 설정
          setUploadImg(image); // 이미지 파일 저장
        }
      };
    }
  };

  // 게시물 삭제 함수
  const deleteHandler = async () => {
    await deletePost(postID);
    setIsOpen(!isOpen);
    alert("삭제되었습니다");
    // 어디로 이동할지는 아직 미정입니다. 일단은 메인으로 이동하게 설정하였습니다.
    navigate(`/${channel}`);
  };

  // 모달 창 떴을 때 스크롤 제한(삭제 모달, 수정 모달)
  useEffect(() => {
    if (isOpen || saveModal) {
      document.body.style.overflow = "hidden"; // 스크롤 금지
    } else {
      document.body.style.overflow = ""; // 원래 상태 복원
    }
    return () => {
      document.body.style.overflow = ""; // 컴포넌트 언마운트 시 복원
    };
  }, [isOpen, saveModal]);

  // 수정 버튼 눌렀을 때 높이 조정
  useEffect(() => {
    if (textarea.current) {
      textarea.current.style.height = "auto"; // 높이 초기화
      textarea.current.style.height = `${textarea.current.scrollHeight}px`; // 내용에 맞게 높이 조정
    }
  }, [edit]);

  // 게시판 이름
  const channel = Object.keys(channelMapping).find(
    (key) => channelMapping[key] === channelId
  );

  const channelName: { [key: string]: string } = {
    records: "오운완 인증",
    protein: "프로틴 추천",
    routine: "루틴 공유",
    gymreview: "헬스장 리뷰",
  };

  // 작성자와 로그인한 사람이 같으면 myprofile로 이동
  // 그렇지않으면 유저 페이지로이동
  const handleClick = () => {
    if (userId === myInfo?._id) {
      navigate("/myprofile");
    } else {
      navigate(`/user/${userId}`);
    }
  };

  return (
    <>
      <div
        className={twMerge(
          "pb-2 text-sm cursor-pointer dark:text-greyDark",
          !edit && "hover:underline"
        )}
        onClick={() => (!edit ? navigate(`/${channel}`) : null)}
      >
        {channel ? channelName[channel] : null}
      </div>
      {edit ? (
        <input
          className="py-1 pl-2 mb-4 text-3xl focus:outline-none focus:ring-2 focus:ring-[#265cac] border w-full border-[#d3d3d3d3] rounded-lg  dark:bg-darkGreyDark dark:text-white"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        />
      ) : (
        <h1 className="py-1 mb-4 text-3xl dark:text-white">{titleInput}</h1>
      )}
      <div className="flex items-center justify-between">
        {/* 왼쪽 프로필 */}
        <div className="flex gap-[10px] items-center">
          <UserProfile
            BackWidth="w-[36px]"
            BackHeight="h-[36px]"
            userImg={userImg}
            onClick={handleClick}
          />

          <div className="dark:text-white">
            <p className="text-[13px] mb-[6px] font-bold">{fullName}</p>
            <div className="flex gap-1 text-[#505050] dark:text-greyDark">
              <p className="text-xs">{formattedDate}</p>
              <p className="text-xs">{formattedTime}</p>
            </div>
          </div>
        </div>
        {/* 오른쪽 수정 및 삭제 */}
        {owner &&
          (edit ? (
            <button
              className="hover:underline dark:text-greyDark"
              onClick={() => {
                titleInput.trim() === "" || context.trim() === ""
                  ? alert("빈 칸 없이 제목과 내용을 입력해주세요.")
                  : setSaveModal(true);
              }}
            >
              저장
            </button>
          ) : (
            <div className="flex gap-2 text-[#505050] dark:text-greyDark">
              <button className="hover:underline" onClick={editButtonHandler}>
                수정
              </button>
              <button
                className="hover:underline"
                onClick={() => setIsOpen(true)}
              >
                삭제
              </button>
            </div>
          ))}
      </div>
      <div className="my-[30px] flex flex-col items-center">
        <div className="">
          {edit ? (
            <>
              <input
                type="file"
                id="uploadImg"
                className="hidden"
                ref={imgRef}
                accept="image/*"
                onChange={handleChange}
              />
              <label htmlFor="uploadImg" className="cursor-pointer">
                <div className="relative group">
                  <img
                    src={img || thumbnail}
                    alt={img ? "업로드된 이미지" : "기본 썸네일"}
                    className=""
                  />
                  <div
                    className="absolute flex flex-col justify-center items-center 
                  inset-0 text-[20px] text-white dark:text-greyDark bg-black bg-opacity-50 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span>
                      수정하려면{" "}
                      <span className="text-[#265CAC] dark:text-mainTextDark font-semibold">
                        이미지
                      </span>
                      를 클릭하고
                    </span>
                    <span>
                      <span className="text-[#265CAC] dark:text-mainTextDark font-semibold">
                        새로운 파일
                      </span>
                      을 선택해주세요.
                    </span>
                  </div>
                </div>
              </label>
            </>
          ) : (
            <img
              src={img || thumbnail}
              alt={img ? "업로드된 이미지" : "기본 썸네일"}
            />
          )}
        </div>
        {edit ? (
          <div className="w-full mt-10 ">
            <textarea
              ref={textarea}
              className=" py-3 pl-2 w-full overflow-hidden resize-none  border border-[#d3d3d3d3] focus:outline-none focus:ring-2  focus:ring-[#265cac] rounded-lg dark:bg-darkGreyDark dark:text-white"
              onChange={(e) => handleInput(e)}
              value={context}
            >
              {context}
            </textarea>
          </div>
        ) : (
          <div className="w-full py-3 mt-10 whitespace-pre-line dark:text-lightGreyDark">
            {context}
          </div>
        )}
      </div>
      {/* 삭제 모달 */}
      <ConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={deleteHandler}
        message={"이 게시글을 정말 삭제하시겠습니까?"}
      />
      {/* 저장 모달 */}
      <ConfirmModal
        isOpen={saveModal}
        onClose={() => setSaveModal(false)}
        onConfirm={updateHandler}
        confirmColor="bg-[#265cac]"
        message={"수정을 완료하고 저장하시겠습니까?"}
      />
    </>
  );
}
