import { styled } from "styled-components";
import RegisterContainer from "../containers/RegisterContainer";

export const FormContainer = styled.div`
  background-color: #a7bcff;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RegisterPage = () => {
  return (
    <FormContainer>
      <RegisterContainer />
    </FormContainer>
  );
};

export default RegisterPage;
