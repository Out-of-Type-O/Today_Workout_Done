import SearchBar from "../components/SearchBar";
import ImageCard from "../components/ImageCard";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import Loading from "../components/Loading";
import { useLoadingStore } from "../stores/loadingStore";
import InfinityLoading from "../components/InfinityLoading";
import { usesidebarToggleStore } from "../stores/sideberToggleStore";
import { twMerge } from "tailwind-merge";
import { getChannelPost } from "../api/Post";

// 무한스크롤에서 몇개씩 보여줄지 선택
const limit = 12;

export default function Home() {
  // 로딩 관리
  const startLoading = useLoadingStore((state) => state.startLoading);
  const stopLoading = useLoadingStore((state) => state.stopLoading);
  const isLoading = useLoadingStore((state) => state.isLoading);

  // 토글 유무 확인
  const isToggle = usesidebarToggleStore((state) => state.isToggle);
  const location = useLocation();
  const channelRoute = location.pathname.split("/")[1];

  // 상태 관리
  // prettier-ignore
  const [status, setStatus] = useState<"idle" | "loading" | "searching">("idle");

  const [posts, setPosts] = useState<PostType[]>([]); // 게시글
  const [keyword, setKeyword] = useState(""); // 검색 키워드
  const [searchPosts, setSearchPosts] = useState<PostType[]>([]); // 검색 게시글 저장

  // 무한 스크롤 구현
  const [offset, setOffset] = useState(0); // 시작점
  const [hasNextPage, setHasNextPage] = useState(true);
  const [pageParams, setPageParams] = useState<number[]>([]); // 히스토리 기록
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  const getData = async (offset: number) => {
    if (pageParams.includes(offset)) return; // 중복 방지

    //로딩 시작 처음 렌더링때만 보이기
    if (offset === 0) {
      startLoading();
    } else {
      setLoading(true);
    }

    try {
      const data = await getChannelPost(channelRoute, offset, limit);
      // 데이터 존재하는지 확인 추가 데이터 있는지 확인
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
    <div className="relative flex flex-col gap-8 py-8 ">
      {/* 로딩창 */}
      <Loading />

      {/* 검색 바 */}
      <div className="flex justify-center">
        <SearchBar
          placeholder="검색어를 입력해 주세요"
          keyword={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style="w-full max-w-[785px]"
          posts={posts}
          setStatus={setStatus}
          setSearchPosts={setSearchPosts}
        />
      </div>

      {/* 피드 이미지 */}
      {/* <PostList /> 컴포넌트화 할때 사용 */}
      <div className="relative flex flex-col items-center mt-8">
        <div
          className={twMerge(
            "grid grid-cols-4 gap-8",
            isToggle
              ? "max-[1396px]:grid-cols-3 max-[1114px]:grid-cols-2 max-[832px]:grid-cols-1"
              : "max-[1176px]:grid-cols-3 max-[894px]:grid-cols-2 max-[612px]:grid-cols-1"
          )}
        >
          {status === "searching" &&
            (searchPosts.length ? (
              searchPosts.map((post) => <ImageCard key={post._id} {...post} />)
            ) : (
              <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <p className="text-[25px] font-semibold text-[#265CAC] dark:text-[#6FBEFF]">
                  검색 결과가 없습니다.
                </p>
              </div>
            ))}

          {status === "idle" &&
            posts.length > 0 &&
            posts.map((post) => <ImageCard key={post._id} {...post} />)}
        </div>

        {/* 무한스크롤 적용 */}
        <div
          ref={observerRef}
          className={twMerge(hasNextPage && !isLoading ? "" : "hidden")}
        >
          {status !== "searching" ? <InfinityLoading /> : null}
        </div>
      </div>
    </div>
  );
}
