import React from 'react';
import { motion } from 'framer-motion';
import { 
  Laptop, 
  Globe, 
  Cloud, 
  GitBranch, 
  Server, 
  Zap, 
  Database 
} from 'lucide-react';

interface DatadogTopologyProps {
  activeTrail: { src: string; dst: string; proto: string } | null;
  ips: {
    client: string;
    dns: string;
    cdn: string;
    lb: string;
    app: string;
    redis: string;
    db: string;
    target: string;
  };
  darkMode: boolean;
}

export const DatadogTopology: React.FC<DatadogTopologyProps> = ({
  activeTrail,
  ips,
  darkMode,
}) => {
  // Node coordinates (SVG scale: 800 x 360)
  const coords: { [key: string]: { x: number; y: number; label: string; icon: any; color: string } } = {
    client: { x: 70, y: 180, label: 'Client Browser', icon: Laptop, color: 'from-blue-500 to-cyan-500' },
    dns: { x: 200, y: 70, label: 'DNS Resolver', icon: Globe, color: 'from-cyan-500 to-teal-500' },
    cdn: { x: 240, y: 180, label: 'CDN Edge Server', icon: Cloud, color: 'from-indigo-500 to-purple-500' },
    lb: { x: 400, y: 180, label: 'Load Balancer', icon: GitBranch, color: 'from-purple-500 to-pink-500' },
    app: { x: 560, y: 180, label: 'App Server', icon: Server, color: 'from-pink-500 to-rose-500' },
    redis: { x: 700, y: 70, label: 'Redis Cache', icon: Zap, color: 'from-rose-500 to-orange-500' },
    db: { x: 700, y: 290, label: 'PostgreSQL DB', icon: Database, color: 'from-amber-500 to-yellow-500' },
  };

  // Define paths connecting nodes
  const paths = [
    { id: 'client-dns', src: 'client', dst: 'dns', path: 'M 70 180 Q 120 100, 200 70' },
    { id: 'client-cdn', src: 'client', dst: 'cdn', path: 'M 70 180 L 240 180' },
    { id: 'cdn-lb', src: 'cdn', dst: 'lb', path: 'M 240 180 L 400 180' },
    { id: 'lb-app', src: 'lb', dst: 'app', path: 'M 400 180 L 560 180' },
    { id: 'app-redis', src: 'app', dst: 'redis', path: 'M 560 180 Q 610 110, 700 70' },
    { id: 'app-db', src: 'app', dst: 'db', path: 'M 560 180 Q 610 250, 700 290' },
  ];

  // Helper to determine the color of active protocol trail
  const getProtoColor = (proto: string) => {
    switch (proto.toUpperCase()) {
      case 'DNS': return '#06b6d4'; // Cyan
      case 'TCP': return '#94a3b8'; // Slate
      case 'TLS': return '#c084fc'; // Purple
      case 'HTTP': return '#22c55e'; // Green
      case 'REDIS': return '#f43f5e'; // Rose
      case 'SQL': return '#f59e0b'; // Amber
      default: return '#3b82f6'; // Blue
    }
  };

  // Check if a specific path is currently active (forward or backward)
  const getActivePath = () => {
    if (!activeTrail) return null;
    const { src, dst } = activeTrail;
    return paths.find(
      p => (p.src === src && p.dst === dst) || (p.src === dst && p.dst === src)
    );
  };

  const activePath = getActivePath();
  const activeColor = activeTrail ? getProtoColor(activeTrail.proto) : '#3b82f6';
  
  // Decide active animation direction
  const isReverse = activeTrail && activePath && activeTrail.src === activePath.dst;

  return (
    <div className={`p-6 rounded-xl border relative overflow-hidden ${
      darkMode 
        ? 'bg-slate-950 border-slate-800 shadow-2xl' 
        : 'bg-white border-gray-200 shadow-lg'
    }`}>
      {/* Background decoration grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h3 className={`text-md font-bold flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            Live Trace Map
          </h3>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Network topology and packet routing visualization
          </p>
        </div>
        
        {/* Protocol legend */}
        <div className="flex flex-wrap gap-2 text-[10px] font-semibold max-w-xs justify-end">
          {[
            { label: 'DNS', color: 'bg-cyan-500 text-cyan-950' },
            { label: 'TCP', color: 'bg-slate-400 text-slate-950' },
            { label: 'TLS', color: 'bg-purple-400 text-purple-950' },
            { label: 'HTTP', color: 'bg-emerald-500 text-emerald-950' },
            { label: 'REDIS', color: 'bg-rose-500 text-rose-950' },
            { label: 'SQL', color: 'bg-amber-500 text-amber-950' }
          ].map(l => (
            <span key={l.label} className={`px-1.5 py-0.5 rounded ${l.color}`}>
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* SVG canvas */}
      <div className="w-full relative min-h-[260px] md:min-h-[300px]">
        <svg viewBox="0 0 800 360" className="w-full h-full select-none overflow-visible">
          {/* Filters for glow effects */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComponentTransfer in="blur" result="boost">
                <feFuncA type="linear" slope="1.5" />
              </feComponentTransfer>
              <feComposite in="SourceGraphic" in2="boost" operator="over" />
            </filter>
          </defs>

          {/* Draw static/inactive paths */}
          {paths.map(p => {
            const isActive = activePath?.id === p.id;
            return (
              <path
                key={p.id}
                d={p.path}
                fill="none"
                stroke={isActive ? activeColor : (darkMode ? '#1e293b' : '#e2e8f0')}
                strokeWidth={isActive ? 3 : 2}
                strokeDasharray={isActive ? 'none' : '4 4'}
                className="transition-colors duration-300"
                style={{
                  filter: isActive ? `drop-shadow(0 0 4px ${activeColor})` : 'none'
                }}
              />
            );
          })}

          {/* Draw active animated particle trail */}
          {activeTrail && activePath && (
            <g key={`${activeTrail.src}-${activeTrail.dst}-${activeTrail.proto}`}>
              {/* Pulsing line glow */}
              <path
                d={activePath.path}
                fill="none"
                stroke={activeColor}
                strokeWidth={5}
                opacity={0.3}
                style={{ filter: 'url(#glow-strong)' }}
              />
              
              {/* Particle 1 */}
              <circle r="6" fill={activeColor} style={{ filter: 'url(#glow)' }}>
                <animateMotion
                  dur="0.7s"
                  repeatCount="indefinite"
                  path={activePath.path}
                  keyPoints={isReverse ? '1;0' : '0;1'}
                  keyTimes="0;1"
                />
              </circle>

              {/* Particle 2 (Trail) */}
              <circle r="4" fill={activeColor} opacity={0.6}>
                <animateMotion
                  dur="0.7s"
                  begin="0.08s"
                  repeatCount="indefinite"
                  path={activePath.path}
                  keyPoints={isReverse ? '1;0' : '0;1'}
                  keyTimes="0;1"
                />
              </circle>

              {/* Particle 3 (Fading tail) */}
              <circle r="2" fill={activeColor} opacity={0.3}>
                <animateMotion
                  dur="0.7s"
                  begin="0.16s"
                  repeatCount="indefinite"
                  path={activePath.path}
                  keyPoints={isReverse ? '1;0' : '0;1'}
                  keyTimes="0;1"
                />
              </circle>
            </g>
          )}

          {/* Draw Nodes */}
          {Object.entries(coords).map(([key, node]) => {
            const Icon = node.icon;
            // Check if this node is source/destination right now
            const isProcessing = activeTrail && (activeTrail.src === key || activeTrail.dst === key);
            
            // Extract IP for tooltips
            const getIPLabel = () => {
              if (key === 'client') return ips.client;
              if (key === 'dns') return ips.dns;
              if (key === 'cdn') return ips.cdn;
              if (key === 'lb') return ips.lb;
              if (key === 'app') return ips.app;
              if (key === 'redis') return ips.redis;
              if (key === 'db') return ips.db;
              return '';
            };

            return (
              <g key={key} transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer">
                {/* Outer pulsing ring for processing nodes */}
                {isProcessing && (
                  <circle
                    r="26"
                    fill="none"
                    stroke={activeColor}
                    strokeWidth="2"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="r"
                      values="20;34;20"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.8;0;0.8"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Node main background */}
                <circle
                  r="20"
                  className={`${
                    isProcessing 
                      ? 'fill-slate-900 stroke-slate-800' 
                      : darkMode 
                      ? 'fill-slate-900 stroke-slate-800 hover:fill-slate-850' 
                      : 'fill-gray-100 stroke-gray-300 hover:fill-gray-50'
                  } transition-colors duration-200`}
                  strokeWidth="2.5"
                  style={{
                    filter: isProcessing ? `drop-shadow(0 0 6px ${activeColor})` : 'none'
                  }}
                />

                {/* Node icon inside */}
                <g transform="translate(-10, -10)">
                  <Icon
                    size={20}
                    className={
                      isProcessing
                        ? `text-[${activeColor}]` // dynamic tailwind won't compile, use style
                        : darkMode
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }
                    style={{ color: isProcessing ? activeColor : undefined }}
                  />
                </g>

                {/* Server Status indicator light */}
                <circle
                  cx="12"
                  cy="-12"
                  r="4"
                  className={
                    key === 'client' 
                      ? 'fill-cyan-400' 
                      : isProcessing 
                      ? 'fill-amber-400 animate-pulse' 
                      : 'fill-emerald-500'
                  }
                />

                {/* Node Label Text */}
                <text
                  y="35"
                  textAnchor="middle"
                  className={`text-[11px] font-bold ${
                    darkMode ? 'fill-gray-200' : 'fill-gray-800'
                  }`}
                >
                  {node.label}
                </text>

                {/* IP address subtitle */}
                <text
                  y="48"
                  textAnchor="middle"
                  className={`text-[9px] font-mono ${
                    isProcessing
                      ? 'fill-blue-400 font-bold'
                      : darkMode
                      ? 'fill-gray-500'
                      : 'fill-gray-400'
                  }`}
                >
                  {getIPLabel()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
