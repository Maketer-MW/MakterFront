import styled from "styled-components";

function Mypage() {
  return <Background></Background>;
}

export default Mypage;

const Background = styled.div`
  background: linear-gradient(#e7e78b, #f0f0c3);
  min-height: 100vh;
  align-items: center;
  position: relative;
  display: flex;
  width: 100%;
  contain: paint;
`;
