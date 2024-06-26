import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import FoodIndex from "./FoodIndex";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

function FoodDetail({ selectedRestaurant, handleMapMove }) {
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleDetailModalOpen = () => {
    setDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
  };

  const handleDetailPost = () => {
    if (!selectedRestaurant || !selectedRestaurant.restaurants_id) {
      console.error("No selected restaurant or restaurant ID");
      return;
    }

    navigate(`/review/${selectedRestaurant.restaurants_id}`, {
      state: {
        id: `${selectedRestaurant.restaurants_id}`,
        name: `${selectedRestaurant.restaurants_name}`,
        address: `${selectedRestaurant.address}`,
        phone: `${selectedRestaurant.phone}`,
        opening_hours: `${selectedRestaurant.opening_hours}`,
        rating: `${selectedRestaurant.rating}`,
        image: `${selectedRestaurant.image}`,
      },
    });
  };

  const moveToMap = () => {
    if (handleMapMove && selectedRestaurant) {
      console.log(selectedRestaurant.latitude, selectedRestaurant.longitude);
      handleMapMove(selectedRestaurant.latitude, selectedRestaurant.longitude);
    } else {
      console.error(
        "handleMapMove 함수가 정의되지 않았거나 selectedRestaurant가 없습니다."
      );
    }
  };

  return (
    <Container>
      <ButtonContainer>
        {selectedRestaurant && (
          <div key={selectedRestaurant.restaurants_id}>
            <Button onClick={handleDetailModalOpen}>세부 정보 보기</Button>
            <Button onClick={handleDetailPost}>리뷰 작성하기</Button>
            <Button onClick={moveToMap}>지도로 이동</Button>
          </div>
        )}
      </ButtonContainer>
      <Modal
        isOpen={isDetailModalOpen}
        onRequestClose={handleDetailModalClose}
        contentLabel="Selected Restaurant"
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            width: "50%",
            maxWidth: "400px",
            maxHeight: "600px",
            margin: "0 auto",
            position: "relative",
            background: "none",
            border: "none",
            padding: "20px",
            borderRadius: "10px",
          },
        }}
      >
        <ModalContent>
          {selectedRestaurant && <FoodIndex restaurant={selectedRestaurant} />}
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default FoodDetail;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background: none;
`;

const ModalContent = styled.div`
  width: 100%;
`;

const Button = styled.button`
  background-color: #d1d195;
  color: black;
  border: none;
  font-weight: bold;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  border: solid 1px;
  cursor: pointer;

  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 200px;
  text-align: center;

  &:hover {
    background-color: #b6b654;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    background-color: #9d9d4d;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;

  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
