import React, { useState, useEffect } from "react";
import Main from "./page/Main";
import KakaoMap from "../src/page/Map/KaKaoMap"; // 경로 수정 필요
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/page/Map/Home";
import Header from "./page/Header";
import ServicePage from "./page/ServicePage";
import MainWritePage from "./page/Community/MainWritePage";
import MainListPage from "./page/Community/MainListPage";
import CategoryReviewPage from "./page/Review/CategoryReivewPage";
import ReviewPage from "./page/Review/ReviewPage";
import MainReviewPages from "./page/Review/MainReviewPages";
import EditPage from "./components/Community/EditPage";
import DetailPost from "./components/Community/DetailPost";
import FoodIndex from "./components/FoodIndex"; // FoodIndex 임포트 추가
import ResetPasswordPage from "./components/User/ResetPassword"; // 경로에 맞게 수정

import styled from "styled-components"; // styled-components 임포트 추가
import ServiceFoods from "./components/ServiceFoods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faX } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [mapMoveFunction, setMapMoveFunction] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (mapMoveFunction) {
      console.log("MapMoveFunction is set");
    }
  }, [mapMoveFunction]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          "https://makterback.fly.dev/api/v1/check-session",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
        console.log("Session Data:", data); // 세션 데이터 로그로 출력
        setIsAuthenticated(true); // 세션이 유효하면 인증 상태를 true로 설정
      } catch (error) {
        console.error("세션 확인 중 오류 발생:", error);
        setIsAuthenticated(false); // 세션이 없거나 오류가 발생한 경우 인증 상태 false
      }
    };

    checkSession(); // 세션 체크 함수 호출
  }, []); // 빈 배열을 의존성으로 하여 첫 렌더링 시 세션 체크 실행

  const handleMapMove = (latitude, longitude) => {
    console.log("handleMapMove called with:", latitude, longitude);
    setMapMoveFunction({ latitude, longitude });
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  };

  console.log("handleMapMove called with:", mapMoveFunction);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} />
      <Header setAuth={setIsAuthenticated} isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<MainHN />} />
        <Route
          path="/food"
          element={
            <FoodHN
              handleMapMove={handleMapMove}
              mapMoveFunction={mapMoveFunction}
              selectedRestaurant={selectedRestaurant}
              handleRestaurantClick={handleRestaurantClick}
              isModalOpen={isModalOpen}
              handleCloseDetails={handleCloseDetails}
              error={error}
            />
          }
        />
        <Route path="/service" element={<ServiceHN />} />
        <Route path="/servicefoods" element={<ServiceFoodHN />} />
        <Route path="/review" element={<FullReviewHN />} />
        <Route path="/review/:id" element={<ReviewHN />} />
        <Route path="/MainListPage" element={<CommunityListHN />} />
        <Route path="/MainWritePage" element={<CommunityWriteHN />} />
        <Route path="/category/:category" element={<CategoryReviewHN />} />
        <Route path="/EditPage/:postId" element={<EditPageHN />} />
        <Route path="/Post/:postId" element={<DetailPostPageHN />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const MainHN = () => (
  <div>
    <Main />
  </div>
);

const ReviewHN = () => (
  <div>
    <ReviewPage />
  </div>
);

const FullReviewHN = () => (
  <div>
    <MainReviewPages />
  </div>
);

const FoodHN = ({
  handleMapMove,
  mapMoveFunction,
  selectedRestaurant,
  handleRestaurantClick,
  isModalOpen,
  handleCloseDetails,
  error,
}) => (
  <div>
    <Home
      handleMapMove={handleMapMove}
      mapMoveFunction={mapMoveFunction}
      selectedRestaurant={selectedRestaurant}
    />
    <KakaoMap
      mapMoveFunction={mapMoveFunction}
      handleRestaurantClick={handleRestaurantClick}
    />
    {isModalOpen && selectedRestaurant && (
      <Modal>
        <FoodIndex restaurant={selectedRestaurant} />
        <CloseButton onClick={handleCloseDetails}>
          <FontAwesomeIcon icon={faX} size="l" style={{ color: "#083f1b" }} />
        </CloseButton>
      </Modal>
    )}
  </div>
);

const ServiceHN = () => (
  <div>
    <ServicePage />
  </div>
);

const ServiceFoodHN = () => (
  <div>
    <ServiceFoods />
  </div>
);

const CommunityListHN = () => (
  <div>
    <MainListPage />
  </div>
);

const CommunityWriteHN = () => (
  <div>
    <MainWritePage />
  </div>
);

const CategoryReviewHN = () => (
  <div>
    <CategoryReviewPage />
  </div>
);

const EditPageHN = () => (
  <div>
    <EditPage />
  </div>
);

const DetailPostPageHN = () => (
  <div>
    <DetailPost />
  </div>
);

const Modal = styled.div`
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1000;
  padding: 20px;
  border-radius: 10px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 20px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

export default App;
