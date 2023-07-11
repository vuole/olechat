import styled from "styled-components";

const FormWrapper = styled.div`
  background-color: white;
  padding: 20px 60px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;
const Logo = styled.span`
  color: #5d5b8d;
  font-weight: bold;
  font-size: 24px;
`;
const Title = styled.span`
  color: #5d5b8d;
  font-size: 12px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
const Nav = styled.p`
  color: #5d5b8d;
  font-size: 12px;
  margin-top: 10px;
`;

const OCFormWrapper = ({ children, ...props }: any) => {
  return (
    <FormWrapper>
      <Logo>Ole Chat</Logo>
      <Title>{props.title}</Title>
      <Form
        onSubmit={(e: any) => {
          props.onSubmit(e);
        }}
      >
        {children}
      </Form>
      <Nav>{props.navigate}</Nav>
    </FormWrapper>
  );
};

export default OCFormWrapper;
