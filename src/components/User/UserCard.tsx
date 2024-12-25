import { useRef, useState } from "react";
import FollowButton from "../FollowButton";
import UserProfile from "../UserProfile";
import { Following, useAuth } from "../../stores/authStore";
import { updateNameFn } from "../../api/User";

interface UserCardType {
  uname: string;
  followers?: string[];
  following?: Following[];
  BackWidth: string;
  BackHeight: string;
  IconWidth: string;
  IconHeight: string;
  isFollowBtn?: boolean;
  edit?: boolean;
  update?: boolean;
  userImg?: string;
}

export default function UserCard({
  uname,
  followers,
  following,
  BackWidth,
  BackHeight,
  isFollowBtn,
  edit,
  update,
  userImg,
}: UserCardType) {
  const [disabled, setDisabled] = useState(true);
  const [updateName, setUpdateName] = useState(uname);

  const myInfo = useAuth((state) => state.user);
  const setMyInfo = useAuth((state) => state.setUser);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOutFocus = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisabled(true);
    if (updateName === uname) return;
    try {
      const response = await updateNameFn(e.target.value);
      if (response) {
        setMyInfo({ ...myInfo, fullName: response.data.fullName });
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (updateName === uname) return;

    if (e.key === "Enter") {
      setDisabled(true);
      try {
        const response = await updateNameFn(updateName);

        inputRef.current?.blur();
        if (response) {
          setMyInfo({ ...myInfo, fullName: response.data.fullName });
        }
      } catch (error) {
        console.log(error);
      } finally {
      }
    }
  };

  return (
    <div className="w-[350px] flex items-center gap-[30px] text-base">
      <UserProfile
        BackWidth={BackWidth}
        BackHeight={BackHeight}
        edit={edit}
        update={update}
        userImg={userImg}
      />
      <div className="flex flex-col gap-1">
        <div className="flex">
          {/* <p className="hidden text-lg">{uname}</p> */}
          {isFollowBtn && (
            <FollowButton
              width="w-[128px]"
              height="h-[52px]"
              rounded="rounded-[15px]"
            />
          )}
          {update && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="updateName"
                className="text-lg font-bold w-[180px] py-[5px] disabled:bg-white dark:bg-lightBlackDark  outline-none focus:border 
                focus: border-[#bcbcbc] rounded-[5px] px-[3px] dark:text-mainTextDark"
                maxLength={8}
                value={updateName}
                ref={inputRef}
                onChange={(e) => setUpdateName(e.target.value)}
                onBlur={handleOutFocus}
                onKeyDown={handleKeyDown}
                disabled={disabled}
              />
              <label
                htmlFor="updateName"
                className=" text-[15px] leading-[15px] text-[#265CAC] dark:text-skyDark underline
                cursor-pointer"
                onClick={() => setDisabled(false)}
              >
                수정
              </label>
            </div>
          )}
        </div>
        <div className="flex text-[15px] gap-[10px] ml-1 dark:text-white">
          <p>팔로워: {followers && followers.length}</p>
          <p>팔로우: {following && following.length}</p>
        </div>
      </div>
    </div>
  );
}
