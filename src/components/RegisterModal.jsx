function RegisterModal() {
  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>맛케터 로그인</h2>
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              name="username"
              placeholder="아이디를 입력해주세요"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InputWrapper>

          <InputWrapper>
            <FontAwesomeIcon icon={faLock} />
            <input
              type={showPassword ? "text" : "password"} // 비밀번호 표시 여부에 따라 input 타입 변경
              name="password"
              placeholder="비밀번호를 입력해주세요"
              value={formData.password}
              onChange={handleChange}
              required
            />{" "}
            <PasswordToggleIcon onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />{" "}
              {/* 아이콘 토글 */}
            </PasswordToggleIcon>
          </InputWrapper>
          <a href="">비밀번호 재설정</a>
          <button type="submit">로그인</button>
          <button type="submit">회원가입</button>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default RegisterModal;

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
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
  z-index: 1001;

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
        background: #f0f0c3;
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
