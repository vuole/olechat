import React from "react";
import styled from "styled-components";
import Add from "../../assets/images/addAvatar.png";

const TextField = styled.input`
  padding: 15px;
  border: none;
  width: 250px;
  border-bottom: 1px solid #a7bcff;
  &::placeholder {
    color: rgb(175, 175, 175);
  }
  &#file {
    display: none;
  }
`;
const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #8da4f1;
  font-size: 12px;
  cursor: pointer;
  & img {
    width: 32px;
  }
`;

const OCTextField = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <>
      <TextField {...props} id={props.type == "file" ? "file" : undefined} />
      {props.type == "file" && (
        <Label htmlFor="file">
          <img src={Add} alt="" />
          <span>Add an avatar</span>
        </Label>
      )}
    </>
  );
};

export default OCTextField;
