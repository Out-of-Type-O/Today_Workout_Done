import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ImageCard from "../ImageCard";
import { getChannelPost } from "../../api/Post";

// 무한스크롤에서 몇개씩 보여줄지 선택
const limit = 12;
const offset = 0;
export default function PostList() {
  const [posts, setPosts] = useState<PostType[]>([]); // 포스트 정보 저장

  // URL을 통해서 channel ID 가져오기
  const location = useLocation();
  const channelID = location.pathname.split("/")[1];

  const getData = async () => {
    try {
      const data = await getChannelPost(channelID, offset, limit);
      setPosts(data);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="flex flex-col items-center mt-8">
      <div className="grid gap-8 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2">
        {posts?.map((post) => (
          <ImageCard key={post._id} {...post} />
        ))}
      </div>

      {/* 무한스크롤 적용 */}
      {/* <div ref={observerRef}>
        {hasNextPage && loading && <InfinityLoading />}
      </div> */}
    </div>
  );
}
