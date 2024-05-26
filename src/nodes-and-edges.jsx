import { Position } from 'reactflow';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  style: {
    borderRadius: '100%',
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: {
      label: '⬛️',
    },
    ...nodeDefaults,
  },
  {
    id: '2',
    position: { x: 250, y: -100 },
    data: {
      label: '🟩',
    },
    ...nodeDefaults,
  },
  {
    id: '3',
    position: { x: 250, y: 100 },
    data: {
      label: '🟧',
    },
    ...nodeDefaults,
  },
  {
    id: '4',
    position: { x: 500, y: 0 },
    data: {
      label: '🟦',
    },
    ...nodeDefaults,
  },
  {
    id: '5',
    position: { x: 750, y: -100 },
    data: {
      label: '🟪',
    },
    ...nodeDefaults,
  },
  {
    id: '6',
    position: { x: 750, y: 100 },
    data: {
      label: '🟫',
    },
    ...nodeDefaults,
  },
  {
    id: '7',
    position: { x: 1000, y: 0 },
    data: {
      label: '🟥',
    },
    ...nodeDefaults,
  },
  // Unattached nodes
  {
    id: '8',
    position: { x: 0, y: 300 },
    data: {
      label: '🔶',
    },
    ...nodeDefaults,
  },
  {
    id: '9',
    position: { x: 250, y: 300 },
    data: {
      label: '🔷',
    },
    ...nodeDefaults,
  },
  {
    id: '10',
    position: { x: 500, y: 300 },
    data: {
      label: '🔸',
    },
    ...nodeDefaults,
  },
  {
    id: '11',
    position: { x: 750, y: 300 },
    data: {
      label: '🔹',
    },
    ...nodeDefaults,
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
  },
];

export { initialEdges, initialNodes };
