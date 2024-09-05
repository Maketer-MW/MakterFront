import React, { useState } from "react";
import styled from "styled-components";
import LoadingBurger from "../components/LoadingBurger"; // 경로에 맞춰서 import

import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faEnvelope,
  faIdCard,
  faPhone,
} from "@fortawesome/free-solid-svg-icons"; // 아이콘 임포트

function AuthModal({ show, onClose, setAuth }) {
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    full_name: "",
    phone_number: "",
  });
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 상태
  const [isLogin, setIsLogin] = useState(true); // 로그인/회원가입 상태 관리

  // 입력값 변경 핸들러 (상태에 따라 loginData 또는 registerData 업데이트)
  const handleChange = (e) => {
    if (isLogin) {
      setLoginData({
        ...loginData,
        [e.target.name]: e.target.value,
      });
    } else {
      setRegisterData({
        ...registerData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // 비밀번호 표시 여부 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 전화번호 입력창 전화번호 형식변환 함수
  const onInputPhone = (e) => {
    const { value } = e.target;
    e.target.value = value
      .replace(/[^0-9]/g, "") // 숫자 이외의 문자 제거
      .replace(
        /(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g,
        "$1-$2-$3" // 전화번호 형식 변환
      );
  };

  /* 유효성 검증 함수 */

  // id : 글자 수 제한 (4글자이상 ~ 12글자 이하)
  const idLength = (value) => {
    return value.length >= 4 && value.length <= 12;
  };
  // id : 영어 또는 숫자만 가능
  const onlyNumberAndEnglish = (str) => {
    return /^[A-Za-z0-9][A-Za-z0-9]*$/.test(str);
  };

  // 비밀번호 : 8글자 이상, 영문, 숫자, 특수문자 사용
  const strongPassword = (str) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      str
    );
  };

  // 비밀번호 확인: 비밀번호와 비밀번호 확인 일치
  const isMatch = (password1, password2) => {
    return password1 === password2;
  };

  /* end 유효성 검증 함수 */

  // 제출 핸들러 (상태에 따라 다른 데이터를 전송)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사 (회원가입일 경우에만 수행)
    if (!isLogin) {
      if (!idLength(registerData.username)) {
        return toast.error("아이디는 4글자 이상, 12글자 이하로 입력해주세요.");
      }

      if (!onlyNumberAndEnglish(registerData.username)) {
        return toast.error("아이디는 영어 또는 숫자만 입력 가능합니다.");
      }

      if (!strongPassword(registerData.password)) {
        return toast.error(
          "비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
        );
      }

      if (!isMatch(registerData.password, registerData.confirmPassword)) {
        return toast.error("비밀번호가 일치하지 않습니다.");
      }

      if (!registerData.phone_number) {
        return toast.error("전화번호를 입력해주세요.");
      }

      if (registerData.phone_number.length < 10) {
        return toast.error("전화번호 형식이 올바르지 않습니다.");
      }
    }

    // 유효성 검사가 통과하면 로딩 시작
    setLoading(true);

    const endpoint = isLogin
      ? "https://makterback.fly.dev/api/v1/login"
      : "https://makterback.fly.dev/api/v1/register";

    const data = isLogin ? loginData : registerData;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const parseRes = await response.json();
      setLoading(false);

      if (parseRes.resultCode === "S-1") {
        if (isLogin) {
          localStorage.setItem("sessionId", parseRes.sessionId);
          setAuth(true);
          toast.success("로그인 성공!");
          onClose();
        } else {
          toast.success("회원가입 성공!");
          setIsLogin(true); // 회원가입 성공 시 로그인 모드로 전환
        }
      } else {
        toast.error(isLogin ? "로그인 실패!" : "회원가입 실패!");
      }
    } catch (err) {
      setLoading(false);
      toast.error("서버 오류 발생: " + err.message);
    }
  };

  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Makter</h2>

        {/* 로딩 중일 때는 햄버거 로딩 컴포넌트를 보여줍니다 */}
        {loading ? (
          <LoadingBurger />
        ) : (
          <form onSubmit={handleSubmit}>
            {/* 로그인 필드 */}
            <InputWrapper>
              <FontAwesomeIcon icon={faIdCard} />
              <input
                type="text"
                name="username"
                placeholder="아이디를 입력해주세요"
                value={isLogin ? loginData.username : registerData.username}
                onChange={handleChange}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <FontAwesomeIcon icon={faLock} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="비밀번호를 입력해주세요"
                value={isLogin ? loginData.password : registerData.password}
                onChange={handleChange}
                required
              />
              <PasswordToggleIcon onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </PasswordToggleIcon>
            </InputWrapper>

            {/* 회원가입 필드 */}
            {!isLogin && (
              <>
                <InputWrapper>
                  <FontAwesomeIcon icon={faLock} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="비밀번호 확인"
                    value={registerData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <PasswordToggleIcon onClick={togglePasswordVisibility}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </PasswordToggleIcon>
                </InputWrapper>
                <InputWrapper>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <input
                    type="email"
                    name="email"
                    placeholder="이메일을 입력해주세요"
                    value={registerData.email}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>

                <InputWrapper>
                  <FontAwesomeIcon icon={faUser} />
                  <input
                    type="text"
                    name="full_name"
                    placeholder="이름을 입력해주세요"
                    value={registerData.full_name}
                    onChange={handleChange}
                  />
                </InputWrapper>
                <InputWrapper>
                  <FontAwesomeIcon icon={faPhone} />
                  <input
                    type="tel"
                    name="phone_number"
                    placeholder="전화번호를 입력해주세요"
                    value={registerData.phone_number}
                    onInput={onInputPhone} // 함수는 직접 참조
                    maxLength={14} // 전화번호 형식에 맞게 최대 길이 제한
                    onChange={handleChange}
                  />
                </InputWrapper>
              </>
            )}

            {isLogin ? (
              <>
                <a href="">비밀번호 재설정</a>
                <button type="submit">로그인</button>
                <button type="button" onClick={() => setIsLogin(false)}>
                  회원가입
                </button>
              </>
            ) : (
              <>
                <button type="submit">회원가입</button>
                <button type="button" onClick={() => setIsLogin(true)}>
                  로그인으로 돌아가기
                </button>
              </>
            )}
          </form>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
}

export default AuthModal;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100% !important; /* 우선순위를 높이기 위해 !important 사용 */
    padding: 0.5rem 0.5rem 0.5rem 2.5rem !important;
    font-size: 1.5rem !important;
    border: 1px solid #ddd !important;
    border-radius: 5px !important;
    font-family: "GowunDodum-Regular";
  }
  svg {
    position: absolute;
    left: 10px;
    color: #333;
    font-size: 1rem;
  }
`;

const PasswordToggleIcon = styled.span`
  position: absolute;
  right: 10px; /* 오른쪽에 아이콘을 배치 */
  cursor: pointer;
  color: #333;
  font-size: 1rem;

  svg {
    position: absolute;
    left: -25px;
    top: -12px;
    color: #333;
    font-size: 1.5rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  max-width: 468px;
  max-height: 668px;
  width: 100%;
  height: 100%;
  padding: 2rem;
  border: 0px;
  border-radius: 50px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  text-align: center;
  position: relative;
  z-index: 1001;
  background: linear-gradient(#f0f0c3, #f0f0c3);

  h2 {
    font-size: 38px;
    font-family: "GowunDodum-Regular";
  }

  a {
    font-size: 24px;
    font-weight: 400;
    line-height: 160%;
    color: #667380;
    text-decoration-line: underline;
    font-family: "GowunDodum-Regular";
    letter-spacing: -0.087px;
    text-align: right;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    button {
      padding: 0.5rem 0.5rem;
      font-size: 1.5rem;
      border: none;
      border-radius: 5px;
      background: #e7e78b; /* 변경된 부분 */
      font-family: "GowunDodum-Regular";
      color: black;
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: white;
      }
    }
  }
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 2rem;
  cursor: pointer;
`;
