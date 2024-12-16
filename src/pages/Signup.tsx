import { useEffect, useState } from "react";
import logoImg from "../assets/loge.svg";
import { Link, Navigate, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { api } from "../api/axios";
import privateImg from "../assets/private.svg";
import showPwImg from "../assets/showpw.svg";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* 공통 스페이스바 차단 핸들러 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault(); // 스페이스바 입력 차단
    }
  };

  /* 닉네임 필드에 따른 에러 처리 및 중복 확인 */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 공백 제거된 닉네임 값
    const trimmedValue = e.target.value.trim();
    // 허용 가능한 문자: 한글, 영문, 숫자
    const regex = /^[A-Za-z0-9가-힣]+$/;

    // 닉네임 상태 업데이트
    setName(trimmedValue);

    console.log(Array.from(trimmedValue).length);

    // 빈 칸일 때 에러 메시지 제거
    if (trimmedValue === "") {
      setNameError("");
      return;
    }
    // 한글, 영문자, 숫자로 제한
    else if (!regex.test(trimmedValue)) {
      setNameError("닉네임은 한글, 영문자, 숫자만 사용할 수 있습니다.");
      return;
    }
    // 닉네임 글자 수를 7글자로 제한 (한글은 1글자로 간주)
    else if (Array.from(trimmedValue).length > 7) {
      // 1초 뒤에 에러 메시지를 설정하도록 지연
      setTimeout(() => {
        setNameError("닉네임은 최대 7글자까지 가능합니다.");
      }, 50);
      return;
    }
    // 글자 수 제한을 통과한 후에 중복 확인
    else {
      setNameError(""); // 기본적으로 에러 초기화
      checkFullnameAvailability(trimmedValue); // 닉네임 중복 확인
    }
  };

  /* 닉네임 중복 확인 */
  const checkFullnameAvailability = async (name: string) => {
    try {
      const response = await api.get("/users/get-users");
      const existingUser = response.data.find(
        (user: any) => user.fullName === name
      );

      if (existingUser) {
        setNameError("닉네임이 이미 사용 중입니다.");
      } else {
        setNameError(""); // 중복 없음
      }
    } catch (error) {
      console.error("사용자 목록 조회 실패:", error);
      setNameError("닉네임 중복 확인 중 오류가 발생했습니다.");
    }
  };

  /* 이메일 필드에 따른 에러 처리 */
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value.replace(/\s/g, "");

    setEmail(emailValue);

    if (emailValue.trim() === "") {
      setEmailError("");
    } else if (!validateEmail(emailValue)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      // 이메일 형식이 잘못되었으면 중복 확인을 하지 않음
      return;
    } else {
      setEmailError("");
      // 이메일 형식이 맞으면 중복 체크
      checkEmailAvailability(emailValue);
    }
  };

  /* 이메일 중복 확인 */
  const checkEmailAvailability = async (email: string) => {
    if (email.trim() === "") {
      setEmailError("");
      return;
    }

    try {
      const response = await api.get("/users/get-users");
      const existingUser = response.data.find(
        (user: any) => user.email === email
      );

      if (existingUser) {
        setEmailError("이메일이 이미 사용 중입니다.");
      } else {
        setEmailError("");
      }
    } catch (error) {
      console.error("사용자 목록 조회 실패:", error);
    }
  };

  /* 비밀번호 필드에 따른 에러 처리 */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    const regex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
    setPassword(newPassword);

    // 빈 칸일 때 에러 메시지 제거
    if (newPassword === "") {
      setPasswordError("");
    } else if (!regex.test(newPassword)) {
      setPasswordError("영문 대 소문자, 숫자, 특수문자를 사용하세요.");
    } else if (newPassword.length > 16 || newPassword.length < 8) {
      setPasswordError("8 ~ 16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.");
    } else {
      setPasswordError("");
    }

    // 비밀번호 확인 에러 동기화
    if (confirmPassword && newPassword !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않음");
    } else {
      setConfirmPasswordError("");
    }
  };

  /* 비밀번호 확인 필드에 따른 에러 처리 */
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    if (newConfirmPassword === "") {
      setConfirmPasswordError("");
    } else if (newConfirmPassword !== password) {
      setConfirmPasswordError("비밀번호가 일치하지 않음");
    } else {
      setConfirmPasswordError("");
    }
  };

  /* 가입하기 버튼 활성화 조건 */
  const isFormValid =
    name &&
    email &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    nameError === "" &&
    emailError === "" &&
    passwordError === "" &&
    confirmPasswordError === "";

  // useEffect(() => {
  //   const getUser = async () => {
  //     const response = await api.post("/signup", {
  //       email: "sss@gmail.com",
  //       fullName: "songwon",
  //       password: "1234",
  //     });
  //     // axios.get(
  //     //   "https://5th.fe.dev-cos.com:5001/users/get-users"
  //     // );
  //     console.log(response);
  //   };
  //   getUser();
  // }, []);

  /* 사용자 입력 값 회원가입 요청 보내기 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const response = await api.post("/signup", {
        fullName: name,
        email: email,
        password: password,
      });

      console.log("가입 성공:", response.data);
      // 성공 시 리다이렉트나 사용자 알림 처리
    } catch (error) {
      console.error("가입 실패:", error);
      // 에러 메시지 처리
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFFFFF] rounded-[20px] border-red-500 w-[400px] h-[500px] mx-auto my-auto">
      {/* 로고 */}
      <img
        src={logoImg}
        className="pt-[50px] block mx-auto cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* 제목 */}
      <p className="text-center text-[20px] mt-[20px] font-jua ">
        새로운 계정 만들기
      </p>

      <form className="px-[50px]" onSubmit={handleSubmit}>
        {/* 닉네임 입력 필드 */}
        <input
          type="text"
          placeholder="닉네임 (한글, 영문, 숫자 최대 7자)"
          value={name}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          className={twMerge(
            `w-full h-[40px] py-auto pl-[15px] border rounded-[10px] mt-[10px] font-jua text-[18px] ${
              name
                ? "text-[#265CAC] border-[#265CAC] border-[2px] text-[16px] font-ibm font-bold"
                : "text-gray-400 border-[2px]"
            } ${
              nameError ? "border-[#EB003E] border-[2px] text-[#EB003E]" : ""
            }`
          )}
        />

        {/* 닉네임 에러 메시지 */}
        {nameError && (
          <p className="ml-[15px] text-red-500 text-[13px] font-dohyeon">
            {nameError}
          </p>
        )}

        {/* 이메일 주소 입력 필드 */}
        <input
          type="email"
          placeholder="아이디 (이메일 주소를 입력해주세요.)"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={handleKeyDown}
          className={twMerge(
            `w-full h-[40px] py-auto pl-[15px] border rounded-[10px] font-jua text-[18px] ${
              nameError ? "mt-0" : "mt-[19.5px]"
            } ${
              email
                ? "text-[#265CAC] border-[#265CAC] border-[2px] text-[16px] font-ibm font-bold"
                : "text-gray-400"
            } ${
              emailError ? "border-[#EB003E] border-[2px] text-[#EB003E]" : ""
            }`
          )}
        />
        {/* 이메일 에러 메시지 */}
        {emailError && (
          <p className="ml-[15px] text-red-500 text-[13px] font-dohyeon">
            {emailError}
          </p>
        )}

        <div>
          <div>
            {/* 비밀번호 입력 필드 */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
              className={twMerge(
                `w-full h-[40px] py-auto pl-[15px] border rounded-[10px] font-jua text-[18px] ${
                  emailError ? "mt-0" : "mt-[19.5px]"
                } ${
                  password
                    ? "text-[#265CAC] border-[#265CAC] border-[2px] text-[16px]"
                    : "text-gray-400"
                } ${
                  passwordError
                    ? "border-[#EB003E] border-[2px] text-[#EB003E]"
                    : ""
                }`
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[62px] top-[288px] translate-y-[0%] w-[20px] h-[20px] p-0 border-none bg-transparent"
            >
              <img
                src={showPassword ? `${showPwImg}` : `${privateImg}`}
                alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"}
                className="w-full h-full"
              />
            </button>
          </div>

          {/* 비밀번호 에러 메시지 */}
          {passwordError && (
            <p className="ml-[15px] text-red-500 text-[13px] font-dohyeon">
              {passwordError}
            </p>
          )}

          <div>
            {/* 비밀번호 확인 입력 필드 */}
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onKeyDown={handleKeyDown}
              className={twMerge(
                `w-full h-[40px] py-auto pl-[15px] border rounded-[10px] font-jua text-[18px] ${
                  passwordError ? "mt-0" : "mt-[19.5px]"
                } ${
                  confirmPassword
                    ? "text-[#265CAC] border-[#265CAC] border-[2px] text-[16px]"
                    : "text-gray-400"
                } ${
                  confirmPasswordError
                    ? " border-[#EB003E] border-[2px] text-[#EB003E]"
                    : ""
                }`
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-[62px] top-[348px] translate-y-[0%] w-[20px] h-[20px] p-0 border-none bg-transparent"
            >
              <img
                src={showConfirmPassword ? `${showPwImg}` : `${privateImg}`}
                alt={
                  showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보이기"
                }
                className="w-full h-full"
              />
            </button>
          </div>

          {/* 비밀번호 확인 에러 메시지 */}
          {confirmPasswordError && (
            <p className="ml-[15px] text-red-500 text-[13px] font-dohyeon">
              {confirmPasswordError}
            </p>
          )}
        </div>

        {/* 로그인으로 이동하는 링크 */}
        <p
          className={twMerge(
            `text-center text-[#265CAC] font-dohyeon text-[13px] ${
              confirmPasswordError ? "mt-[10px]" : "mt-[29.5px]"
            }`
          )}
        >
          이미 계정이 있으신가요?{" "}
          <Link
            to="/login"
            className="text-[#265CAC] text-[16px] font-bold underline"
          >
            로그인
          </Link>
        </p>

        {/* 가입하기 버튼 */}
        <button
          type="submit"
          className={twMerge(
            `w-full bg-[#265CAC] text-white py-[5px] text-[15px] rounded-[20px] mt-[10px] font-jua ${
              isFormValid && !isSubmitting
                ? ""
                : "bg-[#BABABA] cursor-not-allowed"
            }`
          )}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? "가입 중..." : "가입하기"}
        </button>
      </form>
    </div>
  );
}
