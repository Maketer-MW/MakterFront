import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import RatingStars from "./RatingStars";

function ReviewItem({ review, onDelete }) {
  const {
    review_id,
    username,
    review_contents,
    review_date,
    hashtags,
    rating,
  } = review;

  console.log(review);
  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // 또는 기본 날짜 문자열을 반환할 수 있습니다.
    }
    const dateParts = dateString.split("T")[0].split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    return `${year}-${month}-${day}`;
  };

  const [isClicked, setIsClicked] = useState(false);

  const reviewDeleteHandler = (event) => {
    event.preventDefault();
    console.log("Deleting review with ID:", review_id); // 삭제 요청 전에 ID 확인
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 500);
    onDelete(review_id);
  };

  return (
    <ReviewItemContainer>
      <Username>{username}</Username>
      <RatingStars rating={rating} />
      <Content>{review_contents}</Content>

      <Date>{formatDate(review_date)}</Date>

      <HashTagsContainer>
        {hashtags.map((hashtag, index) => (
          <HashTag key={index}>#{hashtag}</HashTag>
        ))}
      </HashTagsContainer>
      <ActionButtonsContainer>
        <DeleteButton isClicked={isClicked} onClick={reviewDeleteHandler}>
          <TrashIcon icon={faTrash} size="2xl" isClicked={isClicked} />
        </DeleteButton>
      </ActionButtonsContainer>
    </ReviewItemContainer>
  );
}

export default ReviewItem;

const ReviewItemContainer = styled.div`
  margin-bottom: 20px;
  border-radius: 20px;
  background-color: #f6f5f2;
  padding: 20px;
`;

const Username = styled.span`
  font-weight: bold;
  font-size: 34px;
`;

const Content = styled.div`
  font-size: 22px;
`;

const Date = styled.span`
  color: gray;
  font-size: 18px;
`;

const HashTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const HashTag = styled.p`
  background-color: #fcffe0;
  border-radius: 10px;
  padding: 5px 10px;
  cursor: pointer;
  margin: 5px;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
`;

const DeleteButton = styled.button`
  border-radius: 100px;
  padding: 10px;
  background-color: ${({ isClicked }) => (isClicked ? "red" : "white")};
  transition: transform 0.3s ease;
`;

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-25px);
  }
  60% {
    transform: translateY(-10px);
  }
`;
const TrashIcon = styled(FontAwesomeIcon)`
  color: #ff0000;
  ${({ isClicked }) =>
    isClicked &&
    css`
      color: ${({ isClicked }) => (isClicked ? "white" : "red")};
      animation: ${bounceAnimation} 0.5s;
    `}
`;
