import { useEffect, useRef, useState } from "react";
// import { api } from "../api/axios";
import SearchBar from "../components/SearchBar";
import Review from "../components/Review";
import { useLocation } from "react-router";
// import { channelMapping } from "../constants/channel";
import { useLoadingStore } from "../stores/loadingStore";
import Loading from "../components/Loading";
import { getChannelPost } from "../utils/api/getChannelPost";
import InfinityLoading from "../components/InfinityLoading";
import { twMerge } from "tailwind-merge";

// 무한스크롤에서 몇개씩 보여줄지 선택
const limit = 12;

export default function ReviewPost() {
  // 로딩 관리
  const startLoading = useLoadingStore((state) => state.startLoading);
  const stopLoading = useLoadingStore((state) => state.stopLoading);
  const isLoading = useLoadingStore((state) => state.isLoading);

  const location = useLocation();
  const channelRoute = location.pathname.split("/")[1];
  // 상태
  const [status, setStatus] = useState<"idle" | "loading" | "searching">(
    "idle"
  );

  const [posts, setPosts] = useState<PostType[]>([]); // 게시글
  const [keyword, setKeyword] = useState(""); // 검색 키워드
  const [searchPosts, setSearchPosts] = useState<PostType[]>([]); // 검색 게시글  저장

  // 무한 스크롤 구현
  const [offset, setOffset] = useState(0); // 시작점
  const [hasNextPage, setHasNextPage] = useState(true);
  const [pageParams, setPageParams] = useState<number[]>([]); // 히스토리 기록
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  const getData = async (offset: number) => {
    if (pageParams.includes(offset)) return; // 중복 방지

    if (offset === 0) {
      startLoading();
    } else {
      setLoading(true);
    }

    try {
      const data = await getChannelPost(channelRoute, offset, limit);
      if (data.length < limit) setHasNextPage(false);

      setPosts((prev) => [...prev, ...data]);
      setPageParams((prev) => [...prev, offset]);
    } catch (err) {
      console.log(err);
    } finally {
      // 로딩종료
      if (offset === 0) {
        stopLoading();
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getData(offset);
  }, [offset]);

  // observer를 통해 무한스크롤
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && hasNextPage && !isLoading && !loading) {
        setOffset((prev) => prev + limit);
      }
    });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-8 py-8 border-2 border-green-500 dark:bg-lightBlackDark">
      {/* 로딩창 */}
      <Loading />
      {/* 검색창 */}
      <div className="flex justify-center w-full">
        <SearchBar
          placeholder="검색어를 입력해 주세요"
          keyword={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style="w-full max-w-[785px] mb-8"
          posts={posts}
          setStatus={setStatus}
          setSearchPosts={setSearchPosts}
        />
      </div>
      {/* 피드 게시물 */}
      <div className="flex flex-col items-center gap-16 border-2 border-blue-500">
        {status === "searching" &&
          (searchPosts.length ? (
            searchPosts.map((post) => <Review key={post._id} {...post} />)
          ) : (
            <p className="text-[25px] font-semibold text-[#265CAC] dark:text-[#6FBEFF]">
              검색 결과가 없습니다.
            </p>
          ))}

        {status === "idle" &&
          (posts.length ? (
            posts.map((post) => <Review key={post._id} {...post} />)
          ) : (
            <p>로딩중...</p>
          ))}
      </div>
      {/* 무한스크롤 적용 */}
      <div
        ref={observerRef}
        className={twMerge(hasNextPage && !isLoading ? "" : "hidden")}
      >
        {status !== "searching" ? <InfinityLoading /> : null}
      </div>
    </div>
  );
}
