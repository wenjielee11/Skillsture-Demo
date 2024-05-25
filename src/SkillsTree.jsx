import React from 'react';
import Tree from 'react-d3-tree';
import CustomNode from './CustomNode';

const skillData = {
  name: 'a',
  onClick: () => alert('You clicked on a'),
  children: [
    {
      name: 'b',
      onClick: () => alert('You clicked on b'),
      children: [
        {
          name: 'c',
          onClick: () => alert('You clicked on c'),
        },
        {
          name: 'd',
          onClick: () => alert('You clicked on d'),
        },
      ],
    },
  ],
};



const SkillsTree = () => {
  const handleNodeClick = (nodeData, evt) => {
    if (nodeData.data.onClick) {
      nodeData.data.onClick();
    }
  };

  return (
    <div>
      <Tree
        data={skillData}
        renderCustomNodeElement={(rd3tProps) =>
          <CustomNode {...rd3tProps} />
        }
        onClick={handleNodeClick}
      />
    </div>
  );
};

export default SkillsTree;
