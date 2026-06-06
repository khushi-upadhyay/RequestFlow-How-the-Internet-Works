import { useState, useEffect, useCallback, useRef } from 'react';
import type { SimulatorSettings } from '../types/flow';
import { generatePacketsForUrl } from '../utils/packetGenerator';
import type { NetworkPacket } from '../utils/packetGenerator';

export interface ChartDataPoint {
  timestamp: string;
  latency: number;
  qps: number;
  errors: number;
}

export const useRequestSimulation = (settings: SimulatorSettings) => {
  const [url, setUrl] = useState('https://www.google.com');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Packets state
  const [allPackets, setAllPackets] = useState<NetworkPacket[]>([]);
  const [visiblePackets, setVisiblePackets] = useState<NetworkPacket[]>([]);
  const [selectedPacketIndex, setSelectedPacketIndex] = useState<number | null>(null);
  
  // Active animation trail
  const [activeTrail, setActiveTrail] = useState<{ src: string; dst: string; proto: string } | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string>('1-dns');
  
  // DevTools Timing
  const [timingBreakdown, setTimingBreakdown] = useState({
    dns: 50,
    tcp: 40,
    tls: 70,
    ttfb: 185,
    download: 30,
    total: 375
  });

  // Datadog Chart & Metrics
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [metrics, setMetrics] = useState({
    qps: 12.5,
    errorRate: 0.0,
    p50: 180,
    p99: 380,
    cpu: 24,
    ram: 68
  });

  // Addresses
  const [ips, setIps] = useState({
    client: '192.168.1.142',
    dns: '8.8.8.8',
    cdn: '104.16.24.84',
    lb: '10.0.0.1',
    app: '10.0.0.10',
    redis: '10.0.0.15',
    db: '10.0.0.20',
    target: '142.250.190.46'
  });

  const packetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const packetIndexRef = useRef<number>(0);
  const chartTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate initial chart data (past 20 points)
  useEffect(() => {
    const data: ChartDataPoint[] = [];
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const baseLat = 150 + Math.random() * 80;
      data.push({
        timestamp: new Date(now - i * 2000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        latency: Math.round(baseLat),
        qps: parseFloat((10 + Math.random() * 5).toFixed(1)),
        errors: Math.random() > 0.95 ? 1 : 0
      });
    }
    setChartData(data);
  }, []);

  // Background ticker for live Datadog metrics (fluctuations)
  useEffect(() => {
    chartTimerRef.current = setInterval(() => {
      // Small fluctuations in live metrics when idling
      setMetrics(prev => {
        const loadFactor = settings.serverLoad / 100;
        const speedFactor = settings.networkSpeed;
        const targetQps = 10 + Math.random() * 8 + (speedFactor * 1.5);
        const targetCpu = Math.min(99, Math.round(15 + loadFactor * 60 + Math.random() * 6));
        const targetRam = Math.min(99, Math.round(50 + loadFactor * 30 + Math.random() * 3));
        const targetErr = settings.serverLoad > 85 ? parseFloat((Math.random() * 5).toFixed(1)) : 0.0;

        return {
          qps: parseFloat(targetQps.toFixed(1)),
          errorRate: targetErr,
          p50: prev.p50,
          p99: prev.p99,
          cpu: targetCpu,
          ram: targetRam
        };
      });

      // Append live point to chart
      setChartData(prev => {
        const next = [...prev];
        if (next.length > 30) next.shift();
        
        const baseLat = 120 + (11 - settings.networkSpeed) * 35 + (settings.serverLoad * 1.5);
        const randLat = baseLat + Math.random() * 50 - 25;
        
        next.push({
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          latency: Math.round(randLat),
          qps: parseFloat((10 + Math.random() * 6).toFixed(1)),
          errors: settings.serverLoad > 85 && Math.random() > 0.7 ? 1 : 0
        });
        return next;
      });
    }, 2000);

    return () => {
      if (chartTimerRef.current) clearInterval(chartTimerRef.current);
    };
  }, [settings.networkSpeed, settings.serverLoad]);

  const stopTimer = () => {
    if (packetTimerRef.current) {
      clearTimeout(packetTimerRef.current);
      packetTimerRef.current = null;
    }
  };

  const resetSimulation = useCallback(() => {
    stopTimer();
    setIsSimulating(false);
    setIsPaused(false);
    setVisiblePackets([]);
    setSelectedPacketIndex(null);
    setActiveTrail(null);
    packetIndexRef.current = 0;
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsPaused(true);
    stopTimer();
  }, []);

  const runSimulationStep = useCallback(() => {
    if (packetIndexRef.current >= allPackets.length) {
      // Simulation complete!
      setIsSimulating(false);
      setIsPaused(false);
      setActiveTrail(null);
      
      // Update P50/P99 latency based on this run
      setMetrics(prev => ({
        ...prev,
        p50: Math.round(timingBreakdown.total * 0.9),
        p99: timingBreakdown.total
      }));
      
      // Add a distinct trace marker to chart data
      setChartData(prev => {
        const next = [...prev];
        if (next.length > 30) next.shift();
        next.push({
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          latency: timingBreakdown.total,
          qps: prev[prev.length - 1]?.qps || 12,
          errors: 0
        });
        return next;
      });
      return;
    }

    const currentPacket = allPackets[packetIndexRef.current];
    
    // Update visible packets
    setVisiblePackets(prev => [...prev, currentPacket]);
    setSelectedPacketIndex(packetIndexRef.current);
    setCurrentStepId(currentPacket.stepId);
    
    // Trigger trail animation
    let trailProto = currentPacket.protocol as string;
    if (trailProto === 'TLSv1.3') trailProto = 'TLS';
    
    // Identify nodes
    const getMappingNode = (ip: string) => {
      if (ip === ips.client) return 'client';
      if (ip === ips.dns) return 'dns';
      if (ip === ips.cdn) return 'cdn';
      if (ip === ips.lb) return 'lb';
      if (ip === ips.app) return 'app';
      if (ip === ips.redis) return 'redis';
      if (ip === ips.db) return 'db';
      return 'cdn'; // fallback
    };
    
    setActiveTrail({
      src: getMappingNode(currentPacket.source),
      dst: getMappingNode(currentPacket.destination),
      proto: trailProto
    });

    packetIndexRef.current++;

    // Calculate delay to next packet
    let delay = 350; // default transition in ms
    if (packetIndexRef.current < allPackets.length) {
      const nextPacket = allPackets[packetIndexRef.current];
      // Time delta scaled (e.g. 1 second delta = 1500ms real simulation time)
      const delta = nextPacket.time - currentPacket.time;
      // Cap speed so it doesn't freeze or lag
      delay = Math.min(1500, Math.max(150, delta * 2500));
      
      // Scale by network speed
      // High speed = lower delay
      delay = delay / (settings.networkSpeed * 0.4 + 0.6);
    }

    packetTimerRef.current = setTimeout(() => {
      runSimulationStep();
    }, delay);
  }, [allPackets, ips, settings.networkSpeed, timingBreakdown.total]);

  const startSimulation = useCallback(() => {
    resetSimulation();
    setIsSimulating(true);
    setIsPaused(false);
    
    // Generate fresh packet array based on current settings
    const result = generatePacketsForUrl(url, settings);
    
    // Save generated IP mappings
    setIps({
      client: result.clientIp,
      dns: result.dnsResolverIp,
      cdn: result.cdnEdgeIp,
      lb: result.loadBalancerIp,
      app: result.appServerIp,
      redis: result.redisIp,
      db: result.dbIp,
      target: result.targetIp
    });

    setTimingBreakdown(result.timingBreakdown);
    setAllPackets(result.packets);
    packetIndexRef.current = 0;

    // Small initial delay before first packet
    packetTimerRef.current = setTimeout(() => {
      runSimulationStep();
    }, 150);
  }, [url, settings, resetSimulation, runSimulationStep]);

  const resumeSimulation = useCallback(() => {
    setIsPaused(false);
    runSimulationStep();
  }, [runSimulationStep]);

  return {
    url,
    setUrl,
    isSimulating,
    isPaused,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    visiblePackets,
    selectedPacketIndex,
    setSelectedPacketIndex,
    activeTrail,
    currentStepId,
    timingBreakdown,
    chartData,
    metrics,
    ips
  };
};
