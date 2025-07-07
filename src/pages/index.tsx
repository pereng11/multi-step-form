import styled from "@emotion/styled";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <h1>Hello World</h1>
      <StyledLink href="/new">시작</StyledLink>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const StyledLink = styled(Link)`
  background-color: #000;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
`;
