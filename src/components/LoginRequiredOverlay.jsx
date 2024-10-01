import React, { useState } from "react";
import styled from "styled-components";
import AuthModal from "./User/AuthModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBurger from "./LoadingBurger"; // 로딩 컴포넌트 임포트
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginRequiredOverlay = ({ onLoginSuccess }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleLoginSuccess = () => {
    closeAuthModal(); // 모달 닫기
    setIsLoading(true); // 로딩 시작
    toast.success("로그인 성공!", {
      onClose: () => {
        setIsLoading(false); // 로딩 종료
        window.location.reload(); // 토스트 메시지가 닫힌 후 새로고침
      },
    });
  };

  return (
    <>
      {isLoading && <LoadingBurger />} {/* 로딩 컴포넌트 표시 */}
      <Overlay>
        <OverlayContent>
          <FontAwesomeIcon
            icon="fa-solid fa-circle-xmark"
            style={{ color: "#ff0000" }}
          />
          <p>로그인이 필요합니다. 로그인 후 리뷰를 작성할 수 있습니다.</p>
          <LoginButton onClick={handleLoginClick}>로그인</LoginButton>
        </OverlayContent>
      </Overlay>
      {showAuthModal && (
        <AuthModal
          show={showAuthModal}
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
