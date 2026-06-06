import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position
} from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { Cloud, Server, Database, GitBranch, Zap, Monitor } from 'lucide-react';

// Custom Node Component
const ArchitectureNode = ({ data, isConnectable }: any) => {
  return (
    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 shadow-lg min-w-[150px] flex flex-col items-center gap-2">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500 border-none" />
      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
        {data.icon}
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-gray-100">{data.label}</p>
        <p className="text-[10px] font-mono text-gray-400 mt-1">{data.latency}ms latency</p>
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500 border-none" />
    </div>
  );
};

const nodeTypes = { architecture: ArchitectureNode };

const initialNodes: Node[] = [
  {
    id: 'client',
    type: 'architecture',
    position: { x: 250, y: 50 },
    data: { label: 'Client (Browser)', icon: <Monitor size={20} />, latency: 20 },
    deletable: false,
  },
  {
    id: 'server',
    type: 'architecture',
    position: { x: 250, y: 200 },
    data: { label: 'Origin Server', icon: <Server size={20} />, latency: 150 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e-client-server', source: 'client', target: 'server', animated: true, style: { stroke: '#3b82f6' } },
];

export const SystemDesign: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [idCount, setIdCount] = useState(0);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: '#3b82f6' } }, eds)), []);

  const addNode = (type: string) => {
    let nodeData;
    switch (type) {
      case 'CDN': nodeData = { label: 'CDN Edge', icon: <Cloud size={20} />, latency: 12 }; break;
      case 'Load Balancer': nodeData = { label: 'Load Balancer', icon: <GitBranch size={20} />, latency: 5 }; break;
      case 'Cache': nodeData = { label: 'Redis Cache', icon: <Zap size={20} />, latency: 2 }; break;
      case 'Database': nodeData = { label: 'PostgreSQL DB', icon: <Database size={20} />, latency: 80 }; break;
      default: return;
    }

    const newNode: Node = {
      id: `node-${idCount}`,
      type: 'architecture',
      position: { x: 400, y: 200 },
      data: nodeData,
    };

    setNodes((nds) => [...nds, newNode]);
    setIdCount((c) => c + 1);
  };

  const totalLatency = useMemo(() => {
    return nodes.reduce((sum, node) => sum + (node.data.latency || 0), 0);
  }, [nodes]);

  return (
    <div className="flex-grow flex flex-col min-h-0 bg-slate-950 text-white">
      
      {/* Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex flex-col sm:flex-row justify-between items-center z-10 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-xl font-bold text-gray-100">Build Your Architecture</h1>
          <p className="text-sm text-gray-400 mt-1">Drag components to the canvas and connect them to see latency changes.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Estimated Latency</span>
            <span className="text-2xl font-mono font-extrabold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/30">
              {totalLatency}ms
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative min-h-0">
        {/* Component Palette */}
        <div className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-row md:flex-col gap-3 z-10 overflow-x-auto md:overflow-y-auto shrink-0">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0 md:mb-2 hidden md:block">Components</h3>
          
          <button onClick={() => addNode('CDN')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-blue-500 bg-slate-800 transition-colors text-left min-w-[160px] md:min-w-0 shrink-0">
            <Cloud size={18} className="text-blue-400" />
            <div>
              <div className="text-sm font-bold text-gray-100">CDN</div>
              <div className="text-[10px] text-gray-400">Edge Caching (12ms)</div>
            </div>
          </button>

          <button onClick={() => addNode('Load Balancer')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-purple-500 bg-slate-800 transition-colors text-left min-w-[160px] md:min-w-0 shrink-0">
            <GitBranch size={18} className="text-purple-400" />
            <div>
              <div className="text-sm font-bold text-gray-100">Load Balancer</div>
              <div className="text-[10px] text-gray-400">Traffic Routing (5ms)</div>
            </div>
          </button>

          <button onClick={() => addNode('Cache')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-orange-500 bg-slate-800 transition-colors text-left min-w-[160px] md:min-w-0 shrink-0">
            <Zap size={18} className="text-orange-400" />
            <div>
              <div className="text-sm font-bold text-gray-100">Redis Cache</div>
              <div className="text-[10px] text-gray-400">In-Memory Store (2ms)</div>
            </div>
          </button>

          <button onClick={() => addNode('Database')} className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-amber-500 bg-slate-800 transition-colors text-left min-w-[160px] md:min-w-0 shrink-0">
            <Database size={18} className="text-amber-400" />
            <div>
              <div className="text-sm font-bold text-gray-100">Database</div>
              <div className="text-[10px] text-gray-400">SQL/NoSQL (80ms)</div>
            </div>
          </button>
          
          <div className="hidden md:block mt-auto p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-400 leading-relaxed">
            <strong>Pro Tip:</strong> Click a component to add it, then drag the colored handles to connect them. Select and press Backspace to delete.
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative min-h-[400px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="react-flow-dark"
          >
            <Background color="#334155" gap={16} size={2} />
            <Controls className="bg-slate-800 border-slate-700 fill-gray-200" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};
