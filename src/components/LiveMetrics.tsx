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

export const LiveMetrics: React.FC<LiveMetricsProps> = ({ metrics, chartData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    ctx.clearRect(0, 0, W, H);

    if (chartData.length === 0) return;

    const latencies = chartData.map((d) => d.latency);
    const maxLat = Math.max(...latencies, 400);
    const PAD_L = 44;
    const PAD_B = 20;
    const PAD_T = 10;
    const chartW = W - PAD_L - 12;
    const chartH = H - PAD_B - PAD_T;

    ctx.font = '9px var(--font-mono)';
    ctx.textAlign = 'right';
    for (let i = 1; i <= 4; i++) {
      const yVal = Math.round((maxLat * i) / 4);
      const yPos = H - PAD_B - (yVal / maxLat) * chartH;
      ctx.beginPath();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = 'rgba(43, 43, 48, 0.9)';
      ctx.lineWidth = 1;
      ctx.moveTo(PAD_L, yPos);
      ctx.lineTo(W - 12, yPos);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#71717a';
      ctx.fillText(`${yVal}ms`, PAD_L - 4, yPos + 3);
    }

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = '#2b2b30';
    ctx.lineWidth = 1;
    ctx.moveTo(PAD_L, H - PAD_B);
    ctx.lineTo(W - 12, H - PAD_B);
    ctx.stroke();

    const count = chartData.length;
    const xStep = chartW / Math.max(count - 1, 1);

    const latPath = new Path2D();
    chartData.forEach((d, i) => {
      const x = PAD_L + i * xStep;
      const y = H - PAD_B - (d.latency / maxLat) * chartH;
      i === 0 ? latPath.moveTo(x, y) : latPath.lineTo(x, y);
    });

    const fillPath = new Path2D(latPath);
    fillPath.lineTo(PAD_L + (count - 1) * xStep, H - PAD_B);
    fillPath.lineTo(PAD_L, H - PAD_B);
    fillPath.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.fill(fillPath);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke(latPath);

    const qpsValues = chartData.map((d) => d.qps);
    const maxQps = Math.max(...qpsValues, 25);
    ctx.beginPath();
    chartData.forEach((d, i) => {
      const x = PAD_L + i * xStep;
      const y = H - PAD_B - (d.qps / maxQps) * chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#71717a';
    ctx.font = '8px var(--font-mono)';
    chartData.forEach((d, i) => {
      if (i % 5 === 0) {
        const x = PAD_L + i * xStep;
        ctx.fillText(d.timestamp, x, H - 3);
      }
    });

    chartData.forEach((d, i) => {
      if (d.errors > 0) {
        const x = PAD_L + i * xStep;
        const y = H - PAD_B - (d.latency / maxLat) * chartH;
        ctx.beginPath();
        ctx.fillStyle = '#ef4444';
        ctx.moveTo(x, y - 8);
        ctx.lineTo(x - 5, y + 2);
        ctx.lineTo(x + 5, y + 2);
        ctx.closePath();
        ctx.fill();
      }
    });
  }, [chartData]);

  const vitals = [
    {
      label: 'P99 Latency',
      value: `${metrics.p99}ms`,
      sub: 'Tail delay',
      icon: Clock,
      color: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-[#2b2b30]',
    },
    {
      label: 'Throughput',
      value: `${metrics.qps} rps`,
      sub: 'Live rate',
      icon: Activity,
      color: 'text-[#fafafa]',
      iconBg: 'bg-[#111113] border-[#2b2b30]',
    },
    {
      label: 'Error Rate',
      value: `${metrics.errorRate.toFixed(1)}%`,
      sub: 'HTTP 5xx',
      icon: AlertTriangle,
      color: metrics.errorRate > 0 ? 'text-red-500' : 'text-[#71717a]',
      iconBg: metrics.errorRate > 0 ? 'bg-red-500/10 border-[#2b2b30]' : 'bg-[#111113] border-[#2b2b30]',
    },
    {
      label: 'App Load',
      value: `${metrics.cpu}%`,
      sub: `RAM ${metrics.ram}%`,
      icon: Server,
      color: 'text-[#fafafa]',
      iconBg: 'bg-[#111113] border-[#2b2b30]',
      bar: metrics.cpu,
    },
  ];

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-[#2b2b30] bg-[#18181b] p-5 shadow-sm">
      <div className="grid grid-cols-2 gap-3">
        {vitals.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.label} className="flex flex-col gap-2 rounded-xl border border-[#2b2b30] bg-[#111113] p-3.5">
              <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${v.iconBg}`}>
                  <Icon size={13} className={v.color} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717a]">{v.label}</span>
              </div>
              <span className={`font-mono text-xl font-extrabold tracking-tight ${v.color}`}>{v.value}</span>
              {v.bar !== undefined ? (
                <div className="h-1 w-full overflow-hidden rounded-full bg-[#2b2b30]">
                  <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${v.bar}%` }} />
                </div>
              ) : null}
              <span className="text-[9px] text-[#71717a]">{v.sub}</span>
            </div>
          );
        })}
      </div>

      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#71717a]">
            Latency &amp; Requests
          </h4>
          <div className="flex items-center gap-3 text-[9px] font-semibold text-[#71717a]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1 w-3 rounded-full bg-blue-500" />
              Latency
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-1 w-3 rounded-full bg-green-500" />
              RPS
            </span>
          </div>
        </div>

        <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#2b2b30] bg-[#111113]">
          <canvas ref={canvasRef} className="block h-full w-full" />
        </div>
      </div>
    </div>
  );
};
