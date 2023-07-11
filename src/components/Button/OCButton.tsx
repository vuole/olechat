import React from "react";
import { styled } from "styled-components";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
};

const Button = styled.button`
  width: 250px;
  background-color: #7b96ec;
  color: white;
  padding: 10px;
  font-weight: bold;
  border: none;
  cursor: pointer;
`;

const OCButton = ({ children, ...props }: ButtonProps) => {
  return <Button {...props}>{children}</Button>;
};

export default OCButton;
