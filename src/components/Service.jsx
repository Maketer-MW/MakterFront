// Service.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DeviceFrameset } from "react-device-frameset";
import { useNavigate } from "react-router-dom";

const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center; /* Center align the items vertically */
  width: 100%;
  padding: 20px;
  flex-direction: column; /* Ensure items are stacked vertically */
`;

const Form = styled.div`
  flex: 1;
  max-width: 1000px;
  width: 100%; /* Ensure the form takes full width of its container */
`;

const Wrap = styled.div`
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 5px solid black;
  width: 100%;
  padding: 20px;
`;

const LikertHeader = styled.h1`
  padding-left: 4.25%;
  margin: 20px 0 0;
  text-align: center;
  font-family: "GowunDodum-Regular";
`;

const Statement = styled.label`
  display: block;
  font-size: 25px;
  font-weight: bold;
  padding: 30px 0 0 4.25%;
  margin-bottom: 25px;
  font-family: "GowunDodum-Regular";
`;

const LikertList = styled.ul`
  list-style: none;
  margin: 0 auto;
  padding: 0 0 35px;
  display: block;
  border-bottom: 4px solid #000000;

  &:last-of-type {
    border-bottom: 0;
  }
`;

const LikertItem = styled.li`
  display: inline-block;
  width: 20%;
  text-align: center;
  vertical-align: top;
`;

const LikertInput = styled.input`
  display: block;
  position: relative;
  top: 0;
  left: 50%;
  margin-left: -6px;
`;

const LikertLabel = styled.label`
  width: 100%;
  font-family: "GowunDodum-Regular";
  font-size: 20px;
`;

const Buttons = styled.div`
  margin: 30px 0;
  padding: 0 4.25%;
  text-align: center;
`;

const ClearButton = styled.button`
  padding: 10px 20px;
  background-color: #e9e9e9;
  border: 2px solid #e9e9e9;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #ccc;
    border-color: #ccc;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #67ab49;
  border: 2px solid #67ab49;
  border-radius: 5px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #14892c;
    border-color: #14892c;
  }
`;

const Progress = styled.div`
  width: 100%;
  background-color: #ddd;
  height: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 2px solid black;
`;

const ProgressBar = styled.div`
  width: ${({ progress }) => progress}%;
  background-color: #67ab49;
  height: 100%;
  border-radius: 10px;
  border-right: 2px solid black;
`;

const Service = ({ restaurantsData }) => {
  const [progress, setProgress] = useState(0);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foodType, setFoodType] = useState("");
  const [spicy, setSpicy] = useState("");
  const [sweet, setSweet] = useState("");
  const [salty, setSalty] = useState("");
  const [sour, setSour] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (restaurantsData) {
      setRestaurants(restaurantsData);
    } else {
      fetch("https://makterbackend.fly.dev/api/v1/restaurants")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          return response.json();
        })
        .then((data) => {
          setRestaurants(data.data);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [restaurantsData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "food_type") {
      setFoodType(value);
    } else if (name === "spicy") {
      setSpicy(value);
    } else if (name === "sweet") {
      setSweet(value);
    } else if (name === "salty") {
      setSalty(value);
    } else if (name === "sour") {
      setSour(value);
    }

    const totalQuestions = 5;
    const checkedItems = document.querySelectorAll(
      'input[type="radio"]:checked'
    );
    const newProgress = (checkedItems.length / totalQuestions) * 100;
    setProgress(newProgress);
  };

  const handleSubmit = () => {
    const answers = {
      food_type: foodType,
      spicy: getLikertValue(spicy),
      sweet: getLikertValue(sweet),
      sour: getLikertValue(sour),
      salty: getLikertValue(salty),
    };

    const userPreference = {
      Spicy: answers.spicy,
      Sweet: answers.sweet,
      Sour: answers.sour,
      Salty: answers.salty,
      food_type: answers.food_type,
    };

    filterRestaurants(userPreference);
  };

  const filterRestaurants = (userPreference) => {
    const filtered = restaurants.filter((restaurant) => {
      const Spicydifference = Math.abs(restaurant.spicy - userPreference.Spicy);
      const Sweetdifference = Math.abs(restaurant.sweet - userPreference.Sweet);
      const Sourdifference = Math.abs(restaurant.sour - userPreference.Sour);
      const Saltydifference = Math.abs(restaurant.salty - userPreference.Salty);
      const foodTypeMatch =
        restaurant.food_type === userPreference.food_type ||
        userPreference.food_type === "Random";

      return (
        Spicydifference <= 1 &&
        Sweetdifference <= 1 &&
        Sourdifference <= 1 &&
        Saltydifference <= 1 &&
        foodTypeMatch
      );
    });

    const formattedRestaurants = filtered.map((el) => ({
      id: el.restaurants_id,
      name: el.restaurants_name,
      phone: el.phone,
      opening_hours: el.opening_hours,
      rating: el.rating,
      category: el.category,
      address: el.address,
      image: el.image,
      menus: el.food_menu.menus.map((menu) => menu.name),
    }));

    navigate(`/servicefoods`, {
      state: {
        restaurants: formattedRestaurants,
      },
    });
  };

  const getLikertValue = (value) => {
    switch (value) {
      case "Verygood":
        return 5;
      case "Good":
        return 4;
      case "Normal":
        return 3;
      case "Bad":
        return 2;
      case "Verybad":
        return 1;
      default:
        return 0;
    }
  };

  return (
    <Layout>
      <Form>
        <DeviceFrameset
          device="iPad Mini"
          color="black"
          width="100%"
          height="auto"
        >
          <Wrap>
            <LikertHeader>맛집 추천을 위한 설문조사</LikertHeader>
            <Progress>
              <ProgressBar progress={progress} />
            </Progress>
            <form id="surveyForm" onChange={handleChange}>
              <Statement>어떤 종류의 음식을 가장 좋아하시나요?</Statement>
              <LikertList>
                <LikertItem>
                  <LikertInput type="radio" name="food_type" value="Korean" />
                  <LikertLabel>한식</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="food_type" value="Western" />
                  <LikertLabel>양식</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="food_type" value="Chinese" />
                  <LikertLabel>중식</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="food_type" value="Japanese" />
                  <LikertLabel>일식</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="food_type" value="Random" />
                  <LikertLabel>기타</LikertLabel>
                </LikertItem>
              </LikertList>
              <Statement>매운 음식을 얼마나 좋아하시나요?</Statement>
              <LikertList>
                <LikertItem>
                  <LikertInput type="radio" name="spicy" value="Verygood" />
                  <LikertLabel>아주 좋아합니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="spicy" value="Good" />
                  <LikertLabel>좋아합니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="spicy" value="Normal" />
                  <LikertLabel>보통입니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="spicy" value="Bad" />
                  <LikertLabel>별로 좋아하지 않습니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="spicy" value="Verybad" />
                  <LikertLabel>전혀 좋아하지 않습니다</LikertLabel>
                </LikertItem>
              </LikertList>
              <Statement>달달한 음식을 얼마나 좋아하시나요?</Statement>
              <LikertList>
                <LikertItem>
                  <LikertInput type="radio" name="sweet" value="Verygood" />
                  <LikertLabel>아주 좋아합니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="sweet" value="Good" />
                  <LikertLabel>좋아합니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="sweet" value="Normal" />
                  <LikertLabel>보통입니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="sweet" value="Bad" />
                  <LikertLabel>별로 좋아하지 않습니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="sweet" value="Verybad" />
                  <LikertLabel>전혀 좋아하지 않습니다</LikertLabel>
                </LikertItem>
              </LikertList>
              <Statement>짠 음식을 얼마나 좋아하시나요?</Statement>
              <LikertList>
                <LikertItem>
                  <LikertInput type="radio" name="salty" value="Verygood" />
                  <LikertLabel>아주 좋아합니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="salty" value="Good" />
                  <LikertLabel>좋아합니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="salty" value="Normal" />
                  <LikertLabel>보통입니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="salty" value="Bad" />
                  <LikertLabel>별로 좋아하지 않습니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="salty" value="Verybad" />
                  <LikertLabel>전혀 좋아하지 않습니다</LikertLabel>
                </LikertItem>
              </LikertList>
              <Statement>신 음식을 얼마나 좋아하시나요?</Statement>
              <LikertList>
                <LikertItem>
                  <LikertInput type="radio" name="sour" value="Verygood" />
                  <LikertLabel>아주 좋아합니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="sour" value="Good" />
                  <LikertLabel>좋아합니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="sour" value="Normal" />
                  <LikertLabel>보통입니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="sour" value="Bad" />
                  <LikertLabel>별로 좋아하지 않습니다</LikertLabel>
                </LikertItem>
                <LikertItem>
                  <LikertInput type="radio" name="sour" value="Verybad" />
                  <LikertLabel>전혀 좋아하지 않습니다</LikertLabel>
                </LikertItem>
              </LikertList>
              <Buttons>
                <ClearButton type="reset">Clear</ClearButton>
                <SubmitButton type="button" onClick={handleSubmit}>
                  Submit
                </SubmitButton>
              </Buttons>
            </form>
          </Wrap>
        </DeviceFrameset>
      </Form>
    </Layout>
  );
};

export default Service;
