// src/components/LoginRequiredOverlay.jsx

import React, { useState } from "react";
import styled from "styled-components";
import AuthModal from "./User/AuthModal";

const LoginRequiredOverlay = ({ onLoginSuccess }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleLoginSuccess = () => {
    closeAuthModal(); // 모달 닫기
    window.location.reload(); // 브라우저 새로고침
  };

  return (
    <>
      <Overlay>
        <OverlayContent>
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
