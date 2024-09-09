import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import Potodance from "../components/Potodance";
import ProfileModal from "../components/ProfileModal";
import AuthModal from "../components/User/AuthModal";

// Header Component
const Header = ({ setAuth, isAuthenticated }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Toggle for dropdown

  const logoutSuccessfully = () => toast("로그아웃 성공!");

  const logout = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://makterback.fly.dev/api/v1/logout", {
        method: "GET",
        credentials: "include", // Include session cookie
      });
      localStorage.removeItem("sessionId"); // Remove session ID
      setAuth(false);
      logoutSuccessfully();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleProfileClick = () => {
    setShowDropdown((prev) => !prev); // Toggle dropdown visibility
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  return (
    <HeaderContainer>
      <LogoContainer to={"/"}>
        <Potodance />
      </LogoContainer>

      <NavLinks>
        <NavLink to="/food">식당보기</NavLink>
        <NavLink to="/review">탐색 & 리뷰작성</NavLink>
        <NavLink to="/MainListPage">커뮤니티</NavLink>
        <NavLink to="/service">맛 설정 모드</NavLink>
      </NavLinks>

      <ProfileContainer>
        <ProfileImage onClick={handleProfileClick}>
          {isAuthenticated ? (
            <FontAwesomeIcon icon={faUserCircle} size="2x" />
          ) : (
            <PlaceholderCircle>
              <FontAwesomeIcon icon={faUserCircle} size="2x" />
            </PlaceholderCircle>
          )}
        </ProfileImage>

        {showDropdown && (
          <DropdownMenu>
            {/* If the user is logged in, show account info, otherwise show placeholder */}
            {isAuthenticated ? (
              <DropdownHeader>
                <ProfileImageCircle>
                  <img
                    src="profile-image-url" // Replace with the actual user image
                    alt="Profile"
                  />
                </ProfileImageCircle>
                <UserInfo>
                  <UserName>사용자 이름</UserName>
                  <UserEmail>rabbittby@email.com</UserEmail>
                </UserInfo>
              </DropdownHeader>
            ) : (
              <DropdownHeader>
                <ProfileImageCircle>
                  <FontAwesomeIcon icon={faUserCircle} size="3x" />
                </ProfileImageCircle>
                <UserInfo>
                  <UserName>로그인이 필요합니다</UserName>
                  <UserEmail>계정이 없으신가요?</UserEmail>
                </UserInfo>
              </DropdownHeader>
            )}

            <DropdownItems>
              {isAuthenticated ? (
                <>
                  <DropdownItem onClick={() => setShowProfileModal(true)}>
                    <FontAwesomeIcon icon={faUserCircle} />
                    계정 설정
                  </DropdownItem>
                  <DropdownItem>
                    <FontAwesomeIcon icon={faUserCircle} />내 채널
                  </DropdownItem>
                  <DropdownItem onClick={logout}>
                    <FontAwesomeIcon icon={faSignInAlt} />
                    로그아웃
                  </DropdownItem>
                </>
              ) : (
                <>
                  <DropdownItem>
                    <SmallText>
                      로그인 후 채널을 만들고 관리할 수 있습니다.
                    </SmallText>
                  </DropdownItem>
                  <DropdownItem onClick={handleLoginClick}>
                    <LoginButton>
                      <FontAwesomeIcon icon={faSignInAlt} />
                      로그인
                    </LoginButton>
                  </DropdownItem>
                </>
              )}
            </DropdownItems>
          </DropdownMenu>
        )}
      </ProfileContainer>

      {showLoginModal && (
        <AuthModal
          show={showLoginModal}
          onClose={closeLoginModal}
          setAuth={setAuth}
        />
      )}
      {showProfileModal && (
        <ProfileModal show={showProfileModal} onClose={closeProfileModal} />
      )}
    </HeaderContainer>
  );
};

export default Header;

// Styled Components
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: linear-gradient(#b6b654, #e7e78b);
`;

const LogoContainer = styled(Link)`
  width: 200px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  padding: 0 25px;
  font-size: 20px;
  font-weight: bold;
  font-family: "GowunDodum-Regular";
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ProfileContainer = styled.div`
  position: relative;
`;

const ProfileImage = styled.div`
  width: 50px;
  height: 50px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const PlaceholderCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ccc; /* Gray circle for placeholder */
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 250px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 15px;
`;

// Header section for authenticated user
const DropdownHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
`;

const ProfileImageCircle = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 10px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const UserEmail = styled.div`
  font-size: 14px;
  color: #666;
`;

const DropdownItems = styled.div`
  margin-top: 15px;
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
  font-family: "GowunDodum-Regular";
  border-bottom: 1px solid #eee;
  color: #333;

  svg {
    margin-right: 10px;
  }

  &:hover {
    background-color: #f0f0f0;
  }
`;

const SmallText = styled.div`
  font-size: 14px;
  color: #666;
  padding: 10px 0;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  font-size: 18px;
  background-color: #e7e78b;
  border: none;
  border-radius: 5px;
  color: #333;
  font-family: "GowunDodum-Regular";
  cursor: pointer;
  width: 100%;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background-color: #d6d670;
  }
`;
