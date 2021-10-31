// src/Pages/src/AboutPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { VirtualList } from '~/Components/VirtualList';

const ListContainer = styled.div`
  width: 360px;
  height: 500px;
`;

const randomColor = () =>
  '#' + Math.round(Math.random() * 0xffffff).toString(16);

const Item = styled.div`
  height: 100px;
  width: 100%;
  font-size: 48px;
  font-weight: bold;
`;

const AboutPage = () => {
  const [list, setList] = useState(Array.from({ length: 65000 }, (_, i) => i));

  const handleClick = () => {
    setList((beforeList) => {
      return [...beforeList, beforeList.length];
    });
  };

  return (
    <div>
      <button onClick={handleClick}>add row</button>
      <ListContainer>
        <VirtualList
          rowHeight={100}
          totalRow={list.length}
          renderRow={(index) => {
            return (
              <Item style={{ backgroundColor: randomColor() }}>{index}</Item>
            );
          }}
        />
      </ListContainer>
    </div>
  );
};

export default AboutPage;
