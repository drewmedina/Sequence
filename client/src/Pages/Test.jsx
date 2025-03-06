import React from 'react';
import DefaultGameBoard from '../Components/Board';
import { useState } from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  background-color: pink;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;
function Test() {
    return (
        <AppContainer>
        <DefaultGameBoard></DefaultGameBoard>
        </AppContainer>
    )
   
}

export default Test