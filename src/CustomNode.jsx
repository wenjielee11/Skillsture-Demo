import React from 'react';
import { Handle } from 'react-flow-renderer';

const SkillNode = ({ data }) => {
  return (
    <div className="skill-node" style={{ background: '#fff', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
      <Handle type="target" position="top" style={{ borderRadius: 0 }} />
      <div>{data.label}</div>
      <Handle type="source" position="bottom" style={{ borderRadius: 0 }} />
    </div>
  );
};

export default SkillNode;
