import React from 'react';
import styled from 'styled-components';

const NodeBox = styled.div`
  border: 1px solid #000;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
`;

const CustomNode = ({ nodeDatum, toggleNode }) => (
  <NodeBox onClick={() => nodeDatum.onClick && nodeDatum.onClick()}>
    {nodeDatum.name}
  </NodeBox>
);

export default CustomNode;
