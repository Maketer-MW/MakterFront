import React, { useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { authState } from "../state/userAtoms";
import AuthModal from "./User/AuthModal";
import LoadingBurger from "./LoadingBurger";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginRequiredOverlay = ({ onLoginSuccess }) => {
  const [auth, setAuth] = useRecoilState(authState);
  const { isAuthenticated, isLoading } = auth;

  // 만약 로그인이 되어 있다면 이 컴포넌트를 렌더링하지 않도록 함
  if (isAuthenticated) {
    return null; // 로그인된 상태에서는 오버레이를 렌더링하지 않음
  }

  // 콘솔 로그 추가
  useEffect(() => {
    console.log("현재 인증 상태: ", isAuthenticated);
  }, [isAuthenticated]);

  const handleLoginClick = () => {
    console.log("로그인 버튼 클릭됨");
    setAuth((prevState) => ({
      ...prevState,
      showAuthModal: true,
    }));
  };

  const closeAuthModal = () => {
    console.log("모달 닫기");
    setAuth((prevState) => ({
      ...prevState,
      showAuthModal: false,
    }));
  };

  const handleLoginSuccess = async () => {
    closeAuthModal();
    setAuth((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    try {
      const response = await fetch(
        "https://makterback.fly.dev/api/v1/check-session",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result.isAuthenticated) {
        setAuth((prevState) => ({
          ...prevState,
          isAuthenticated: true,
          isLoading: false,
        }));
        toast.success("로그인 성공!", {
          onClose: () => {
            window.location.reload(); // 토스트 메시지가 닫힌 후 새로고침
          },
        });
      } else {
        setAuth((prevState) => ({
          ...prevState,
          isAuthenticated: false,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("세션 확인 중 에러 발생: ", error);
      setAuth((prevState) => ({
        ...prevState,
        isAuthenticated: false,
        isLoading: false,
      }));
      toast.error("로그인 실패. 다시 시도해주세요.");
    }
  };

  return (
    <>
      {isLoading && <LoadingBurger />}
      <Overlay>
        <OverlayContent>
          <p>로그인이 필요합니다. 로그인 후 리뷰를 작성할 수 있습니다.</p>
          <LoginButton onClick={handleLoginClick}>로그인</LoginButton>
        </OverlayContent>
      </Overlay>
      {auth.showAuthModal && (
        <AuthModal
          show={auth.showAuthModal}
          onClose={closeAuthModal}
          setAuth={handleLoginSuccess}
        />
      )}
      <ToastContainer position="top-right" />
    </>
  );
};

export default LoginRequiredOverlay;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  p {
    font-family: "GowunDodum-Regular";
    font-size: 18px;
  }
`;

const OverlayContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const LoginButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #f4ce14;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "GowunDodum-Regular";

  &:hover {
    background-color: #f0f0c3;
  }
`;
