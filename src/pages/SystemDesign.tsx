import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
  BackgroundVariant,
} from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { Cloud, Server, Database, GitBranch, Zap, Monitor, Plus, Info, PanelTop } from 'lucide-react';
import { PageShell } from '../components';

const NODE_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
  Client: { accent: '#3b82f6', bg: '#111113', border: '#2b2b30' },
  CDN: { accent: '#3b82f6', bg: '#111113', border: '#2b2b30' },
  'Load Balancer': { accent: '#3b82f6', bg: '#111113', border: '#2b2b30' },
  Cache: { accent: '#3b82f6', bg: '#111113', border: '#2b2b30' },
  Database: { accent: '#3b82f6', bg: '#111113', border: '#2b2b30' },
  Server: { accent: '#3b82f6', bg: '#111113', border: '#2b2b30' },
};

const ArchitectureNode = ({ data, isConnectable }: any) => {
  const style = NODE_COLORS[data.category] || NODE_COLORS.Server;

  return (
    <div
      className="flex min-w-[140px] flex-col items-center gap-2 rounded-2xl border px-4 py-3 text-center shadow-sm"
      style={{
        background: style.bg,
        borderColor: style.border,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="h-2.5 w-2.5 border-none"
        style={{ background: style.accent, top: -6 }}
      />
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl border"
        style={{ background: '#09090b', borderColor: style.border, color: style.accent }}
      >
        {data.icon}
      </div>
      <div>
        <p className="text-xs font-bold text-[#fafafa]">{data.label}</p>
        <p className="mt-0.5 font-mono text-[10px]" style={{ color: style.accent }}>
          {data.latency}ms
        </p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="h-2.5 w-2.5 border-none"
        style={{ background: style.accent, bottom: -6 }}
      />
    </div>
  );
};

const nodeTypes = { architecture: ArchitectureNode };

const initialNodes: Node[] = [
  {
    id: 'client',
    type: 'architecture',
    position: { x: 250, y: 50 },
    data: { label: 'Client (Browser)', icon: <Monitor size={18} />, latency: 20, category: 'Client' },
    deletable: false,
  },
  {
    id: 'server',
    type: 'architecture',
    position: { x: 250, y: 220 },
    data: { label: 'Origin Server', icon: <Server size={18} />, latency: 150, category: 'Server' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e-client-server',
    source: 'client',
    target: 'server',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
];

const COMPONENT_TYPES = [
  {
    id: 'CDN',
    label: 'CDN Edge',
    icon: <Cloud size={16} />,
    latency: 12,
    category: 'CDN',
    sub: 'Edge caching | 12ms',
  },
  {
    id: 'Load Balancer',
    label: 'Load Balancer',
    icon: <GitBranch size={16} />,
    latency: 5,
    category: 'Load Balancer',
    sub: 'Traffic routing | 5ms',
  },
  {
    id: 'Cache',
    label: 'Redis Cache',
    icon: <Zap size={16} />,
    latency: 2,
    category: 'Cache',
    sub: 'In-memory store | 2ms',
  },
  {
    id: 'Database',
    label: 'PostgreSQL DB',
    icon: <Database size={16} />,
    latency: 80,
    category: 'Database',
    sub: 'SQL / NoSQL | 80ms',
  },
];

export const SystemDesign: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [idCount, setIdCount] = useState(0);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } }, eds)),
    [],
  );

  const addNode = (type: (typeof COMPONENT_TYPES)[number]) => {
    const newNode: Node = {
      id: `node-${idCount}`,
      type: 'architecture',
      position: {
        x: 400 + (Math.random() - 0.5) * 80,
        y: 200 + (Math.random() - 0.5) * 80,
      },
      data: {
        label: type.label,
        icon: type.icon,
        latency: type.latency,
        category: type.id,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setIdCount((c) => c + 1);
  };

  const totalLatency = useMemo(
    () => nodes.reduce((sum, node) => sum + (node.data.latency || 0), 0),
    [nodes],
  );

  return (
    <PageShell fullBleed className="bg-[#09090b] text-white" contentClassName="py-6 sm:py-8">
      <div className="space-y-6">
        <header className="rounded-2xl border border-[#2b2b30] bg-[#18181b] p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2b2b30] bg-[#111113] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                <PanelTop size={11} />
                Interactive architecture builder
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-[#fafafa] sm:text-2xl">
                  Build Your Architecture
                </h1>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#a1a1aa] sm:text-sm">
                  Add components to the canvas, connect them with edges, and watch the estimated latency change
                  as your topology grows.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#2b2b30] bg-[#111113] px-4 py-3">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#71717a]">
                Estimated latency
              </span>
              <span className="mt-1 block font-mono text-2xl font-extrabold text-blue-500">
                {totalLatency}ms
              </span>
            </div>
          </div>
        </header>

        <div className="grid min-h-[72vh] grid-cols-1 overflow-hidden rounded-2xl border border-[#2b2b30] bg-[#18181b] shadow-sm lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="flex shrink-0 flex-row gap-3 overflow-x-auto border-b border-[#2b2b30] p-4 lg:flex-col lg:border-b-0 lg:border-r lg:overflow-y-auto">
            <div className="hidden text-[10px] font-bold uppercase tracking-widest text-[#71717a] lg:block">
              Components
            </div>

            {COMPONENT_TYPES.map((comp) => (
              <button
                key={comp.id}
                onClick={() => addNode(comp)}
                className="group flex min-w-[170px] items-center gap-3 rounded-xl border border-[#2b2b30] bg-[#111113] p-3 text-left transition-colors hover:bg-[#232326] hover:border-[#3a3a40] lg:min-w-0"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#2b2b30] bg-[#09090b] text-blue-500">
                  {comp.icon}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-[#fafafa]">{comp.label}</p>
                  <p className="truncate text-[10px] text-[#71717a]">{comp.sub}</p>
                </div>
                <Plus size={12} className="ml-auto shrink-0 text-[#71717a] transition-colors group-hover:text-[#a1a1aa]" />
              </button>
            ))}

            <div className="hidden rounded-xl border border-[#2b2b30] bg-[#111113] p-3.5 text-[10px] leading-relaxed text-[#a1a1aa] lg:flex lg:flex-col">
              <div className="mb-1.5 flex items-center gap-1.5 font-bold text-blue-400">
                <Info size={11} />
                Pro tip
              </div>
              Click a component to add it, then connect node handles to shape the request path.
            </div>
          </aside>

          <div className="min-h-[420px] lg:min-h-0">
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
              <Background variant={BackgroundVariant.Dots} color="#2b2b30" gap={20} size={1.5} />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
