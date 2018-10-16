import styled from 'styled-components';
import {colorDark} from "../../constants/colors";

export const InfoSpan = styled.span`
  font-size: small;
`;

export const RefreshBtn = styled.div`
  align-self: center;
  margin-right: 4px;
  :hover {
    transform: scale(1.2,1.2); 
  }
  transition: all .3s ease-in-out;
  cursor: pointer;
`;

export const BarBlock = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    `;

export const TopBar = styled.div`
    background: ${colorDark};
    display: flex;
    flex-direction: row;
   
    color: #FAFAFA;
    font-size: larger;
    font-weight: bold;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
`;

export const MenuToggle = styled.div`
    padding: 3px;
    margin-bottom: 2px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 3px;
    :hover {
      border-color: white;
    }    
    transition: all .3s ease-in-out;
`;
