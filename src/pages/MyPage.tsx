import { useAuth } from "../stores/authStore";
import { useLoadingStore } from "../stores/loadingStore";
import UserCard from "../components/User/UserCard";
import CheckDone from "../components/checkDone/CheckDone";
import Loading from "../components/Loading";
import CustomCalendar from "../components/MyPage/CustomCalendar";
import MyImageCard from "../components/MyImageCard";
import { useEffect, useState } from "react";
export default function MyPage() {
  const myInfo = useAuth((state) => state.user);

  const isLoading = useLoadingStore((state) => state.isLoading);

  const [myLike, setMyLike] = useState<(string | null)[]>([]);

  useEffect(() => {
    if (myInfo?.likes) {
      const myLike = myInfo?.likes.map((like) =>
        like.post ? like.post : null
      );
      setMyLike(myLike);
    }
  }, []);
  return (
    <>
      {myInfo && (
        <div className="min-h-min h-full relative flex flex-col items-center py-8 dark:bg-lightBlackDark">
          <div className="flex flex-col gap-[40px]">
            <UserCard
              uname={myInfo.fullName!}
              followers={myInfo.followers}
              following={myInfo.following}
              BackWidth="w-[100px]"
              BackHeight="h-[100px]"
              IconWidth="w-[80px]"
              IconHeight="h-[80px]"
              edit={true}
              update={true}
              userImg={myInfo.image}
            />
            <div className="flex flex-col items-center w-full gap-4 xl:flex-row">
              <CustomCalendar />
              <CheckDone bg="bg-[#F7FAFF] dark:bg-darkGreyDark" />
            </div>
            <div>
              <p className=" text-[18px] mb-[20px] font-medium dark:text-white">
                게시물 {myInfo.posts?.length}개
              </p>
              <div className="border-t pt-[10px] px-1 flex justify-center">
                <div className="flex flex-col items-start mt-[20px]">
                  <div className="flex items-center justify-center">
                    <div className="grid gap-8 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2">
                      {myInfo.posts?.map((post) => (
                        <MyImageCard
                          key={post._id}
                          image={post.image}
                          comments={post.comments}
                          createdAt={post.createdAt}
                          likes={post.likes}
                          title={post.title}
                          fullName={myInfo.fullName}
                          userImg={myInfo.image}
                          _id={post._id}
                          myLike={myLike}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isLoading ? <Loading /> : null}
        </div>
      )}
    </>
  );
}
