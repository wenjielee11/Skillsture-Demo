import React, { useState, useCallback } from 'react';
import Tree from 'react-d3-tree';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const NodeType = 'NODE';

const DraggableNode = ({ nodeData }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: NodeType,
    item: { nodeData },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [nodeData]);

  return (
    <div ref={drag} className="draggable-node" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {nodeData.name}
    </div>
  );
};

const DroppableTreeNode = ({ nodeDatum, onDropNode, children }) => {
  const [, drop] = useDrop(() => ({
    accept: NodeType,
    drop: (item) => onDropNode(item.nodeData, nodeDatum),
  }), [nodeDatum, onDropNode]);

  return (
    <g ref={drop}>
      {children}
    </g>
  );
};

const SkillTree = () => {
  const [treeData, setTreeData] = useState([
    {
      name: 'abc',
      children: [
        { name: 'def' },
        {
          name: 'ghi',
          children: [
            { name: 'jkl' },
            { name: 'mno' },
          ],
        },
      ],
    },
  ]);

  const [unconnectedNodes, setUnconnectedNodes] = useState([
    { name: 'pqr' },
    { name: 'stu' },
    { name: 'vwx' },
  ]);

  const handleNodeClick = (nodeData) => {
    // Handle node click if needed
  };

  const handleDropNode = (draggedNode, targetNode) => {
    const addNodeToTree = (nodes, targetNode) => {
      return nodes.map((node) => {
        if (node.name === targetNode.name) {
          return {
            ...node,
            children: [...(node.children || []), draggedNode],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: addNodeToTree(node.children, targetNode),
          };
        }
        return node;
      });
    };

    setTreeData((prevTreeData) => addNodeToTree(prevTreeData, targetNode));
    setUnconnectedNodes((prevNodes) => prevNodes.filter((node) => node.name !== draggedNode.name));
  };

  const renderCustomNode = useCallback(({ nodeDatum, toggleNode }) => (
    <DroppableTreeNode nodeDatum={nodeDatum} onDropNode={handleDropNode}>
      <g>
        <rect
          width="60"
          height="30"
          x="-30"
          y="-15"
          fill="white"
          stroke="black"
          strokeWidth="1"
          onClick={() => handleNodeClick(nodeDatum)}
        />
        <text fill="black" x="0" y="0" textAnchor="middle" alignmentBaseline="middle">
          {nodeDatum.name}
        </text>
      </g>
    </DroppableTreeNode>
  ), [handleDropNode]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <div className="unconnected-nodes">
          {unconnectedNodes.map((node) => (
            <DraggableNode key={node.name} nodeData={node} />
          ))}
        </div>
        <div id="treeWrapper" style={{ width: '100%', height: '100vh' }}>
          <Tree
            data={treeData}
            translate={{ x: 200, y: 200 }}
            renderCustomNodeElement={renderCustomNode}
          />
        </div>
      </div>
    </DndProvider>
  );
};

function App() {
  return (
    <div className="App">
      <SkillTree />
    </div>
  );
}

export default App;
