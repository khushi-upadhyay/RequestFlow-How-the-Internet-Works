import React, { useEffect, useRef } from 'react';
import type { ChartDataPoint } from '../hooks/useRequestSimulation';
import { Activity, Server, Clock, AlertTriangle } from 'lucide-react';

interface LiveMetricsProps {
  metrics: {
    qps: number;
    errorRate: number;
    p50: number;
    p99: number;
    cpu: number;
    ram: number;
  };
  chartData: ChartDataPoint[];
  darkMode: boolean;
}

export const LiveMetrics: React.FC<LiveMetricsProps> = ({
  metrics,
  chartData,
  darkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redraw canvas whenever chartData or darkMode changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI screens (Retina)
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (chartData.length === 0) return;

    // Compute max and min values for scaling
    const latencies = chartData.map(d => d.latency);
    const maxLat = Math.max(...latencies, 400); // minimum scale ceiling 400ms
    const minLat = 0;

    // Grid lines (horizontal)
    const gridLines = 4;
    ctx.strokeStyle = darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)';
    ctx.lineWidth = 1;
    ctx.font = '9px monospace';
    ctx.fillStyle = darkMode ? '#64748b' : '#94a3b8';

    for (let i = 1; i <= gridLines; i++) {
      const yVal = Math.round(maxLat * (i / gridLines));
      const yPos = height - (yVal / maxLat) * (height - 30) - 15;
      
      // Draw grid line
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(40, yPos);
      ctx.lineTo(width - 15, yPos);
      ctx.stroke();
      
      // Draw Y label
      ctx.setLineDash([]);
      ctx.fillText(`${yVal}ms`, 5, yPos + 3);
    }

    // Chart path definitions
    const pointsCount = chartData.length;
    const xStep = (width - 60) / (pointsCount - 1);
    
    // Draw Latency Line & Gradient
    ctx.beginPath();
    chartData.forEach((d, i) => {
      const x = 45 + i * xStep;
      const y = height - (d.latency / maxLat) * (height - 30) - 15;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = '#3b82f6'; // Blue
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(59, 130, 246, 0.4)';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // Latency Area Gradient Fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, darkMode ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.15)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
    
    ctx.lineTo(45 + (pointsCount - 1) * xStep, height - 15);
    ctx.lineTo(45, height - 15);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw QPS Line (Secondary axis or overlayed)
    // Scale QPS separately to fit beautifully
    const qpsValues = chartData.map(d => d.qps);
    const maxQps = Math.max(...qpsValues, 25);
    
    ctx.beginPath();
    chartData.forEach((d, i) => {
      const x = 45 + i * xStep;
      const y = height - (d.qps / maxQps) * (height - 35) - 15;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#10b981'; // Emerald Green
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw grid bounds bottom axis
    ctx.strokeStyle = darkMode ? '#334155' : '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(40, height - 15);
    ctx.lineTo(width - 15, height - 15);
    ctx.stroke();

    // Draw timestamps for some points (every 5 points)
    ctx.fillStyle = darkMode ? '#64748b' : '#64748b';
    ctx.textAlign = 'center';
    chartData.forEach((d, i) => {
      if (i % 5 === 0) {
        const x = 45 + i * xStep;
        ctx.fillText(d.timestamp, x, height - 2);
      }
    });

    // Draw error indicators as tiny red triangles
    chartData.forEach((d, i) => {
      if (d.errors > 0) {
        const x = 45 + i * xStep;
        const y = height - (d.latency / maxLat) * (height - 30) - 15;
        
        ctx.beginPath();
        ctx.fillStyle = '#ef4444'; // Red
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x - 5, y + 2);
        ctx.lineTo(x + 5, y + 2);
        ctx.closePath();
        ctx.fill();
      }
    });
  }, [chartData, darkMode]);

  return (
    <div className={`p-6 rounded-xl border flex flex-col gap-6 ${
      darkMode 
        ? 'bg-slate-950 border-slate-800 shadow-2xl text-white' 
        : 'bg-white border-gray-200 shadow-lg text-gray-800'
    }`}>
      {/* Vitals Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* P99 Latency */}
        <div className={`p-4 rounded-lg border flex flex-col ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-100'
        }`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Clock size={16} className="text-blue-500" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">P99 Latency</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-blue-500 font-mono">
            {metrics.p99}ms
          </span>
          <span className="text-[9px] text-gray-500">Tail response delay</span>
        </div>

        {/* Throughput QPS */}
        <div className={`p-4 rounded-lg border flex flex-col ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-100'
        }`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Activity size={16} className="text-emerald-500" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Throughput</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-emerald-500 font-mono">
            {metrics.qps} rps
          </span>
          <span className="text-[9px] text-gray-500">Live request speed</span>
        </div>

        {/* Error Rate */}
        <div className={`p-4 rounded-lg border flex flex-col ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-100'
        }`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <AlertTriangle size={16} className={metrics.errorRate > 0 ? 'text-red-500 animate-bounce' : 'text-slate-400'} />
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Error Rate</span>
          </div>
          <span className={`text-2xl font-bold tracking-tight font-mono ${
            metrics.errorRate > 0 ? 'text-red-500' : 'text-slate-400'
          }`}>
            {metrics.errorRate.toFixed(1)}%
          </span>
          <span className="text-[9px] text-gray-500">HTTP 5xx responses</span>
        </div>

        {/* CPU / Server Load */}
        <div className={`p-4 rounded-lg border flex flex-col ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-100'
        }`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Server size={16} className="text-pink-500" />
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">App Load</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold tracking-tight text-pink-500 font-mono">
              {metrics.cpu}%
            </span>
            <span className="text-xs font-semibold text-gray-500 font-mono">RAM {metrics.ram}%</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </div>
      </div>

      {/* Latency Live Chart Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Response Latency & Requests (Live Scroll)
          </h4>
          <div className="flex items-center gap-3 text-[10px] font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1.5 rounded-sm bg-blue-500 inline-block" />
              Latency (ms)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-1.5 rounded-sm bg-emerald-500 inline-block" />
              Requests (QPS)
            </span>
          </div>
        </div>
        
        {/* Canvas wrapper */}
        <div className="w-full h-44 rounded-lg border border-slate-850 bg-slate-950/40 relative overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
      </div>
    </div>
  );
};
