import React from 'react';
import { motion } from 'framer-motion';
import {
  Laptop,
  Globe,
  Cloud,
  GitBranch,
  Server,
  Zap,
  Database,
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

export const DatadogTopology: React.FC<DatadogTopologyProps> = ({ activeTrail, ips, darkMode }) => {
  const coords: Record<string, { x: number; y: number; label: string; icon: any }> = {
    client: { x: 70, y: 180, label: 'Client', icon: Laptop },
    dns: { x: 200, y: 70, label: 'DNS', icon: Globe },
    cdn: { x: 240, y: 180, label: 'CDN', icon: Cloud },
    lb: { x: 400, y: 180, label: 'Load Balancer', icon: GitBranch },
    app: { x: 560, y: 180, label: 'App Server', icon: Server },
    redis: { x: 700, y: 70, label: 'Redis', icon: Zap },
    db: { x: 700, y: 290, label: 'Database', icon: Database },
  };

  const paths = [
    { id: 'client-dns', src: 'client', dst: 'dns', path: 'M 70 180 Q 120 100, 200 70' },
    { id: 'client-cdn', src: 'client', dst: 'cdn', path: 'M 70 180 L 240 180' },
    { id: 'cdn-lb', src: 'cdn', dst: 'lb', path: 'M 240 180 L 400 180' },
    { id: 'lb-app', src: 'lb', dst: 'app', path: 'M 400 180 L 560 180' },
    { id: 'app-redis', src: 'app', dst: 'redis', path: 'M 560 180 Q 610 110, 700 70' },
    { id: 'app-db', src: 'app', dst: 'db', path: 'M 560 180 Q 610 250, 700 290' },
  ];

  const getProtoColor = (proto: string) => {
    switch (proto.toUpperCase()) {
      case 'HTTP':
        return '#22c55e';
      case 'TLS':
      case 'TCP':
      case 'DNS':
      default:
        return '#3b82f6';
      case 'SQL':
        return '#f59e0b';
      case 'REDIS':
        return '#71717a';
    }
  };

  const activePath = activeTrail
    ? paths.find(
        (p) =>
          (p.src === activeTrail.src && p.dst === activeTrail.dst) ||
          (p.src === activeTrail.dst && p.dst === activeTrail.src),
      )
    : null;
  const activeColor = activeTrail ? getProtoColor(activeTrail.proto) : '#3b82f6';
  const isReverse = activeTrail && activePath && activeTrail.src === activePath.dst;

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#2b2b30] bg-[#18181b] p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-md font-semibold text-[#fafafa]">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            Live Trace Map
          </h3>
          <p className="text-xs text-[#71717a]">Network topology and packet routing</p>
        </div>
        <div className="flex max-w-xs flex-wrap justify-end gap-2 text-[10px] font-semibold">
          {[
            { label: 'DNS', color: 'bg-blue-500/10 text-blue-400' },
            { label: 'TCP', color: 'bg-[#111113] text-[#a1a1aa]' },
            { label: 'TLS', color: 'bg-[#111113] text-[#a1a1aa]' },
            { label: 'HTTP', color: 'bg-green-500/10 text-green-500' },
            { label: 'REDIS', color: 'bg-[#111113] text-[#a1a1aa]' },
            { label: 'SQL', color: 'bg-amber-500/10 text-amber-500' },
          ].map((l) => (
            <span key={l.label} className={`rounded border border-[#2b2b30] px-1.5 py-0.5 ${l.color}`}>
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative min-h-[260px] w-full md:min-h-[300px]">
        <svg viewBox="0 0 800 360" className="h-full w-full select-none overflow-visible">
          {paths.map((p) => {
            const isActive = activePath?.id === p.id;
            return (
              <path
                key={p.id}
                d={p.path}
                fill="none"
                stroke={isActive ? activeColor : '#2b2b30'}
                strokeWidth={isActive ? 3 : 2}
                strokeDasharray={isActive ? 'none' : '4 4'}
                className="transition-colors duration-200"
              />
            );
          })}

          {activeTrail && activePath && (
            <g key={`${activeTrail.src}-${activeTrail.dst}-${activeTrail.proto}`}>
              <path d={activePath.path} fill="none" stroke={activeColor} strokeWidth={4} opacity={0.18} />
              <circle r="5" fill={activeColor}>
                <animateMotion
                  dur="0.8s"
                  repeatCount="indefinite"
                  path={activePath.path}
                  keyPoints={isReverse ? '1;0' : '0;1'}
                  keyTimes="0;1"
                />
              </circle>
            </g>
          )}

          {Object.entries(coords).map(([key, node]) => {
            const Icon = node.icon;
            const isProcessing = activeTrail && (activeTrail.src === key || activeTrail.dst === key);
            const ip =
              key === 'client'
                ? ips.client
                : key === 'dns'
                ? ips.dns
                : key === 'cdn'
                ? ips.cdn
                : key === 'lb'
                ? ips.lb
                : key === 'app'
                ? ips.app
                : key === 'redis'
                ? ips.redis
                : ips.db;

            return (
              <g key={key} transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer">
                {isProcessing && <circle r="24" fill="none" stroke={activeColor} strokeWidth="1.5" opacity="0.35" />}
                <circle
                  r="20"
                  className={darkMode ? 'fill-[#111113] stroke-[#2b2b30]' : 'fill-white stroke-[#e4e4e7]'}
                  strokeWidth="2"
                />
                <g transform="translate(-10, -10)">
                  <Icon size={20} className={isProcessing ? 'text-blue-500' : 'text-[#71717a]'} />
                </g>
                <circle
                  cx="12"
                  cy="-12"
                  r="4"
                  className={key === 'client' ? 'fill-blue-500' : isProcessing ? 'fill-green-500' : 'fill-[#71717a]'}
                />
                <text y="35" textAnchor="middle" className={`text-[11px] font-bold ${darkMode ? 'fill-[#e4e4e7]' : 'fill-[#111113]'}`}>
                  {node.label}
                </text>
                <text
                  y="48"
                  textAnchor="middle"
                  className={`text-[9px] font-mono ${isProcessing ? 'fill-blue-500 font-bold' : 'fill-[#71717a]'}`}
                >
                  {ip}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
