import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import Potodance from "../components/Potodance";

const Header = ({ setAuth }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    const getName = async () => {
      try {
        const response = await fetch(
          "https://makterbackend.fly.dev/dashboard",
          {
            method: "GET",
            headers: { token: localStorage.token },
          }
        );

        const parseRes = await response.json();
        setName(parseRes.username);
      } catch (err) {
        console.error(err.message);
      }
    };

    getName();
  }, []);

  const logoutSuccessfully = () => toast("로그아웃 성공!");

  const logout = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://makterbackend.fly.dev/api/v1/logout", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      localStorage.removeItem("token");
      setAuth(false);
      logoutSuccessfully();
    } catch (err) {
      console.error(err.message);
    }
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
    </HeaderContainer>
  );
};

export default Header;

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
  flex-grow: 1;
  justify-content: center; /* 중앙 정렬 */
  margin-left: -5%;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  padding: 0 25px;
  font-size: 25px;
  font-weight: bold;
  transition: transform 0.3s ease;
  font-family: "GowunDodum-Regular";

  &:hover {
    transform: scale(1.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Greeting = styled.span`
  font-size: 1rem;
  font-weight: bold;
  margin-right: 10px;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #555;
  }

  @media screen and (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
`;
