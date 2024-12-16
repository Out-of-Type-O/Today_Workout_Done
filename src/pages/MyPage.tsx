import UserCard from "../components/User/UserCard";
import { useAuth } from "../stores/authStore";
import ImageCard from "../components/ImageCard";
import CheckDone from "../components/checkDone/CheckDone";
import Loading from "../components/Loading";
import { useLoadingStore } from "../stores/loadingStore";
import CustomCalendar from "../components/MyPage/CustomCalendar";

export default function MyPage() {
  const myInfo = useAuth((state) => state.user);

  const isLoading = useLoadingStore((state) => state.isLoading);
  // console.log(myInfo);

  return (
    <>
      {myInfo && (
        <div className="relative flex flex-col items-center">
          <div className="flex flex-col gap-[40px] pt-10">
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
            <div className="flex xl:flex-row flex-col items-center w-full gap-4">
              <CustomCalendar />
              <CheckDone bg="bg-[#F7FAFF]" />
            </div>
            <div>
              <p className=" text-[18px] mb-[20px] font-medium">
                게시물 {myInfo.posts?.length}개
              </p>
              <div className="border-t pt-[10px] px-1 flex justify-center">
                <div className="flex flex-col items-start mt-[20px]">
                  <div className="flex items-center justify-center">
                    <div className="grid gap-8 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2">
                      {myInfo.posts?.map((post) => (
                        <ImageCard
                          key={post._id}
                          image={post.image}
                          comments={post.comments}
                          createdAt={post.updatedAt}
                          likes={post.likes}
                          title={post.title}
                          fullName={myInfo.fullName}
                          userImg={myInfo.image}
                          _id={post._id}
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
