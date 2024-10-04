import React, { useState } from "react";
import { DeviceFrameset } from "react-device-frameset";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensilSpoon } from "@fortawesome/free-solid-svg-icons";
import { faFish } from "@fortawesome/free-solid-svg-icons";
import { faCookie } from "@fortawesome/free-solid-svg-icons";
import { faPizzaSlice } from "@fortawesome/free-solid-svg-icons";
import { faDrumstickBite } from "@fortawesome/free-solid-svg-icons";
import { faIceCream } from "@fortawesome/free-solid-svg-icons";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faHamburger } from "@fortawesome/free-solid-svg-icons";

function MainReviewPages() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [restaurants, setRestaurants] = useState({});
  const [categories, setCategories] = useState([
    "한식",
    "일식",
    "중식",
    "양식",
    "치킨",
    "디저트",
    "음료",
    "버거",
  ]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // 서버에 해당 카테고리의 데이터를 요청
    fetch(`https://makterback.fly.dev/api/v1/restaurants/category/${category}`)
      .then((response) => {
        if (response.ok) {
          return response.json(); // 응답이 성공적이면 JSON 형태로 변환
        }
        throw new Error("Network response was not ok."); // 응답 실패 처리
      })
      .then((data) => {
        console.log(data.data.map((el) => el)); // 받은 데이터를 콘솔에 로그로 출력
        setRestaurants(data.data);

        // Pass menu items to the next page
        navigate(`/category/${category}`, {
          state: {
            restaurants: data.data.map((el) => ({
              id: el.restaurants_id,
              name: el.restaurants_name,
              phone: el.phone,
              opening_hours: el.opening_hours,
              rating: el.rating,
              category: el.category,
              address: el.address,
              image: el.image,
              menus: el.food_menu.menus.map((menu) => menu.name),
            })),
          },
        });
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "한식":
        return faUtensilSpoon;
      case "일식":
        return faFish;
      case "중식":
        return faCookie;
      case "양식":
        return faPizzaSlice;
      case "치킨":
        return faDrumstickBite;
      case "디저트":
        return faIceCream;
      case "음료":
        return faCoffee;
      case "버거":
        return faHamburger;
      default:
        return null;
    }
  };

  return (
    <ReviewPage>
      <ReviewPageWrapper>
        <DeviceFrameset
          device="iPad Mini"
          color="black"
          width="100%"
          height="75%"
        >
          <CategoryContainer>
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                onClick={() => handleCategorySelect(category)}
                active={selectedCategory === category}
              >
                <FontAwesomeIcon icon={getCategoryIcon(category)} size="2x" />
                <CategoryLabel>{category}</CategoryLabel>
              </CategoryCard>
            ))}
          </CategoryContainer>
          <CategoriesGridContainer></CategoriesGridContainer>
        </DeviceFrameset>
      </ReviewPageWrapper>
    </ReviewPage>
  );
}

export default MainReviewPages;

const ReviewPage = styled.div`
  background: linear-gradient(#e7e78b, #f0f0c3);
  height: 100%;
`;

const ReviewPageWrapper = styled.div`
  max-width: 1000px;
  height: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 100px;
`;

const CategoriesGridContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 20px;
  margin: 15px 0;
`;

const CategoryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  border-radius: 60px 60px 0 0;
  padding: 20px;
  margin: 20px;
`;

const CategoryCard = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px;
  background-color: #fff;

  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  width: 100px;
  height: 100px;
  margin-right: 15px;

  &:hover {
    background-color: ${({ active }) => (active ? "#e7f1c9" : " #e9e5a9")};
    transform: translateY(10px);
  }
`;

const CategoryLabel = styled.span`
  margin-top: 5px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  font-family: "GowunDodum-Regular";
`;
