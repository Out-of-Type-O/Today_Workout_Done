import React from "react";
import ErrorImg from "../assets/ErrorImg.svg";
import jalnan from "../assets/fonts/jalnan.ttf";

export default function Error() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#F2F3F4]">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#265CAC] font-jalnan">404</h1>
        <h1 className="text-6xl font-bold mt-4 text-[#265CAC] font-jalnan">
          죄송합니다
        </h1>
        <p className="text-2xl font-medium mt-12 [#272727] font-jalnan">
          요청하신 정보가 변경되거나 삭제되어...
        </p>
        <div className="flex justify-center mt-4">
          <img src={ErrorImg} alt="Error image" className="" />
        </div>
      </div>
    </div>
  );
}
