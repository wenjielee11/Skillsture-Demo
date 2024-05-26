import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Handle,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
} from 'react-flow-renderer';
import './App.css';

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Skill 1' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: 'Skill 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Skill 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Skill 4' }, position: { x: 250, y: 200 } },
  { id: '5', data: { label: 'Skill 5' }, position: { x: 500, y: 200 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e1-3', source: '1', target: '3', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
];

const onDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onLoad = (rfi) => {
    setReactFlowInstance(rfi);
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowInstance.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const id = (nodes.length + 1).toString();
    const newNode = {
      id,
      type,
      position,
      data: { label: `Skill ${id}` },
    };

    setNodes((nds) => nds.concat(newNode));

    // Determine if drop is on an existing node or edge
    const elements = reactFlowInstance.toObject().elements;
    const targetNode = elements.find((el) => el.position && position.x >= el.position.x && position.x <= el.position.x + 40 && position.y >= el.position.y && position.y <= el.position.y + 40);
    const targetEdge = elements.find((el) => el.source && el.target && position.x >= (el.sourceX + el.targetX) / 2 - 10 && position.x <= (el.sourceX + el.targetX) / 2 + 10 && position.y >= (el.sourceY + el.targetY) / 2 - 10 && position.y <= (el.sourceY + el.targetY) / 2 + 10);

    if (targetNode) {
      const outgoers = nodes.filter((node) => edges.find((edge) => edge.source === targetNode.id && edge.target === node.id));
      setEdges((eds) => [
        ...eds.filter((edge) => edge.source !== targetNode.id || !outgoers.some((node) => node.id === edge.target)),
        ...outgoers.map((outgoer) => ({
          id: `e${newNode.id}-${outgoer.id}`,
          source: newNode.id,
          target: outgoer.id,
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        })),
        { id: `e${targetNode.id}-${newNode.id}`, source: targetNode.id, target: newNode.id, animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      ]);
    } else if (targetEdge) {
      setEdges((eds) => [
        ...eds.filter((edge) => edge.id !== targetEdge.id),
        { id: `e${targetEdge.source}-${newNode.id}`, source: targetEdge.source, target: newNode.id, animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
        { id: `e${newNode.id}-${targetEdge.target}`, source: newNode.id, target: targetEdge.target, animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
      ]);
    }
  };

  const onConnect = (params) => setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds));
  const onNodesRemove = (nodesToRemove) => setNodes((nds) => nds.filter((node) => !nodesToRemove.includes(node)));
  const onEdgesRemove = (edgesToRemove) => setEdges((eds) => eds.filter((edge) => !edgesToRemove.includes(edge)));

  return (
    <div className="dndflow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onLoad={onLoad}
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{ width: '100%', height: '90vh' }}
      />
      <div className="description">You can drag a skill from the left and drop it on the canvas.</div>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: 10, top: 10 }}>
        <div
          draggable
          onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'default')}
          style={{ padding: 10, margin: 5, background: 'lightblue', border: '1px solid blue', borderRadius: 5 }}
        >
          New Skill
        </div>
      </div>
    </div>
  );
};

export default App;
