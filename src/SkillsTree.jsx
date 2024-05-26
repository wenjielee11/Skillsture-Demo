import React, { useState } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls, Background } from 'react-flow-renderer';


  const initialNodes = [
    { id: '1', type: 'input', position: { x: 0, y: 25 }, data: { label: 'Basic Training' } }, // Entry skill for all
    { id: '2', position: { x: 200, y: 0 }, data: { label: 'Sword Mastery' } },
    { id: '3', position: { x: 200, y: 50 }, data: { label: 'Shield Defense' } },
    { id: '4', position: { x: 400, y: 0 }, data: { label: 'Advanced Swordplay' } },
    { id: '5', position: { x: 400, y: 50 }, data: { label: 'Battle Tactics' } },
    { id: '6', position: { x: 200, y: 150 }, data: { label: 'Basic Spells' } },
    { id: '7', position: { x: 400, y: 125 }, data: { label: 'Fireball' } },
    { id: '8', position: { x: 400, y: 175 }, data: { label: 'Ice Shield' } },
    { id: '9', position: { x: 200, y: 250 }, data: { label: 'Crafting Basics' } },
    { id: '10', position: { x: 400, y: 250 }, data: { label: 'Weapon Forging' } },
    { id: '11', position: { x: 600, y: 250 }, data: { label: 'Armor Crafting' } },
  ];



  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3' },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e3-5', source: '3', target: '5' },
    { id: 'e1-6', source: '1', target: '6' },
    { id: 'e6-7', source: '6', target: '7' },
    { id: 'e6-8', source: '6', target: '8' },
    { id: 'e1-9', source: '1', target: '9' },
    { id: 'e9-10', source: '9', target: '10' },
    { id: 'e10-11', source: '10', target: '11' },
  ];

const SkillTree = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));
  const onLoad = (_reactFlowInstance) => setReactFlowInstance(_reactFlowInstance);

  return (
    <div style={{ height: 800 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onLoad={onLoad}
        nodeTypes={nodeTypes} // Define custom nodes if necessary
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default SkillTree;
