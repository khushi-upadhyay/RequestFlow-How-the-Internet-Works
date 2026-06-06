import React, { useEffect, useRef, useState } from 'react';
import type { NetworkPacket } from '../utils/packetGenerator';
import { Terminal, ShieldAlert, Cpu, Timer } from 'lucide-react';

interface WiresharkPaneProps {
  packets: NetworkPacket[];
  selectedPacketIndex: number | null;
  onSelectPacket: (index: number) => void;
  timingBreakdown: {
    dns: number;
    tcp: number;
    tls: number;
    ttfb: number;
    download: number;
    total: number;
  };
  darkMode: boolean;
}

type TabType = 'headers' | 'payload' | 'timing' | 'hex';

export const WiresharkPane: React.FC<WiresharkPaneProps> = ({
  packets,
  selectedPacketIndex,
  onSelectPacket,
  timingBreakdown,
  darkMode,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('headers');
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll list when packets change (only if selected is the latest)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Scroll to bottom
      container.scrollTop = container.scrollHeight;
    }
  }, [packets]);

  const selectedPacket = selectedPacketIndex !== null ? packets[selectedPacketIndex] : null;

  // Custom styling per protocol for the Wireshark list rows
  const getProtocolStyles = (protocol: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-600/90 text-white font-bold border-blue-500';
    }

    switch (protocol) {
      case 'DNS':
        return darkMode 
          ? 'bg-sky-950/20 text-sky-400 hover:bg-sky-900/20 border-sky-900/30' 
          : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-100';
      case 'TCP':
        return darkMode 
          ? 'bg-slate-900/60 text-slate-400 hover:bg-slate-800/40 border-slate-800/30' 
          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-100';
      case 'TLSv1.3':
        return darkMode 
          ? 'bg-purple-950/20 text-purple-400 hover:bg-purple-900/20 border-purple-900/30' 
          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100';
      case 'HTTP':
        return darkMode 
          ? 'bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/20 border-emerald-900/30' 
          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100';
      case 'REDIS':
        return darkMode 
          ? 'bg-rose-950/20 text-rose-400 hover:bg-rose-900/20 border-rose-900/30' 
          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-100';
      case 'SQL':
        return darkMode 
          ? 'bg-amber-950/20 text-amber-400 hover:bg-amber-900/20 border-amber-900/30' 
          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100';
      case 'RENDER':
        return darkMode 
          ? 'bg-yellow-950/20 text-yellow-400 hover:bg-yellow-900/20 border-yellow-900/30' 
          : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-100';
      default:
        return darkMode 
          ? 'bg-slate-900 text-slate-300 border-slate-800' 
          : 'bg-white text-gray-700 border-gray-100';
    }
  };

  return (
    <div className={`p-6 rounded-xl border flex flex-col gap-6 h-full ${
      darkMode 
        ? 'bg-slate-950 border-slate-800 shadow-2xl text-white' 
        : 'bg-white border-gray-200 shadow-lg text-gray-800'
    }`}>
      {/* 1. WIRESHARK PACKET CAPTURE VIEW (Top half) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-bold flex items-center gap-2">
            <Terminal size={18} className="text-blue-500" />
            Wireshark Packet Inspector
          </h3>
          <span className="text-[10px] font-mono text-gray-400">
            {packets.length} packets captured
          </span>
        </div>

        {/* Monospace table viewport */}
        <div className={`border rounded-lg overflow-hidden flex flex-col ${
          darkMode ? 'border-slate-850 bg-slate-900/40' : 'border-gray-200 bg-gray-50'
        }`}>
          {/* Table Headers */}
          <div className={`grid grid-cols-12 text-[10px] uppercase font-bold tracking-wider py-1.5 px-3 border-b ${
            darkMode ? 'bg-slate-900/80 border-slate-800 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'
          } font-mono`}>
            <div className="col-span-1">No.</div>
            <div className="col-span-2">Time (s)</div>
            <div className="col-span-2">Source</div>
            <div className="col-span-2">Destination</div>
            <div className="col-span-1.5">Protocol</div>
            <div className="col-span-1 text-right pr-2">Len</div>
            <div className="col-span-2.5 pl-2">Info</div>
          </div>

          {/* Table Rows Container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-y-auto max-h-[175px] min-h-[120px] font-mono text-[11px] divide-y divide-slate-800/10 dark:divide-slate-800/40"
          >
            {packets.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Awaiting connection trace request...
              </div>
            ) : (
              packets.map((p, idx) => {
                const isSelected = selectedPacketIndex === idx;
                return (
                  <div
                    key={p.num}
                    onClick={() => onSelectPacket(idx)}
                    className={`grid grid-cols-12 py-1 px-3 border-b cursor-pointer transition-colors duration-150 ${getProtocolStyles(p.protocol, isSelected)}`}
                  >
                    <div className="col-span-1">{p.num}</div>
                    <div className="col-span-2">{p.time.toFixed(4)}</div>
                    <div className="col-span-2 truncate pr-1">{p.source}</div>
                    <div className="col-span-2 truncate pr-1">{p.destination}</div>
                    <div className="col-span-1.5 font-bold">{p.protocol}</div>
                    <div className="col-span-1 text-right pr-2">{p.length}</div>
                    <div className="col-span-2.5 truncate pl-2" title={p.info}>
                      {p.info}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={listEndRef} />
          </div>
        </div>
      </div>

      {/* 2. CHROME DEVTOOLS PACKET DETAILS INSPECTOR (Bottom half) */}
      <div className={`border rounded-lg flex flex-col flex-1 overflow-hidden min-h-[200px] ${
        darkMode ? 'border-slate-850 bg-slate-950/60' : 'border-gray-200 bg-white'
      }`}>
        {/* DevTools Tab Bar */}
        <div className={`flex border-b text-xs font-mono select-none ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-100 border-gray-200'
        }`}>
          {[
            { id: 'headers', label: 'Headers' },
            { id: 'payload', label: 'Payload/Query' },
            { id: 'timing', label: 'Timing Waterfall' },
            { id: 'hex', label: 'Wireshark Hex' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabType)}
              className={`py-2 px-4 border-r focus:outline-none transition-colors ${
                activeTab === t.id
                  ? darkMode
                    ? 'bg-slate-950 text-blue-400 border-b-2 border-b-blue-500 font-bold border-r-slate-850'
                    : 'bg-white text-blue-600 border-b-2 border-b-blue-500 font-bold border-r-gray-250'
                  : darkMode
                  ? 'text-gray-400 hover:bg-slate-850 border-r-slate-800'
                  : 'text-gray-600 hover:bg-gray-50 border-r-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* DevTools Tab Content */}
        <div className="p-4 overflow-y-auto text-xs flex-1">
          {!selectedPacket ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-center flex-col gap-2">
              <Cpu size={24} className="text-gray-600 animate-pulse" />
              <span>Select a packet in the table above to inspect its headers and payload details.</span>
            </div>
          ) : (
            <>
              {/* HEADERS TAB */}
              {activeTab === 'headers' && (
                <div className="space-y-4 font-mono">
                  {/* General */}
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold text-blue-500 border-b border-slate-800 pb-1 mb-1.5">General</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-gray-400">Request URL:</span>
                      <span className="col-span-2 truncate">{selectedPacket.info.includes('GET') || selectedPacket.info.includes('POST') ? 'https://' + selectedPacket.destination + selectedPacket.info.split(' ')[1] : 'N/A'}</span>
                      
                      <span className="text-gray-400">Request Method:</span>
                      <span className="col-span-2 font-bold text-amber-500">
                        {selectedPacket.info.startsWith('GET') ? 'GET' : selectedPacket.info.startsWith('POST') ? 'POST' : 'N/A'}
                      </span>
                      
                      <span className="text-gray-400">Status Code:</span>
                      <span className="col-span-2 font-bold text-emerald-500">
                        {selectedPacket.info.includes('200 OK') ? '200 OK' : '101 Switching Protocols / Active Connection'}
                      </span>
                      
                      <span className="text-gray-400">Remote Address:</span>
                      <span className="col-span-2">{selectedPacket.destination}</span>
                    </div>
                  </div>

                  {/* Packet headers */}
                  {selectedPacket.details.headers && (
                    <div className="space-y-1 mt-3">
                      <h4 className="text-[11px] font-bold text-blue-500 border-b border-slate-800 pb-1 mb-1.5">Packet Headers</h4>
                      <div className="space-y-1 font-mono text-[11px]">
                        {Object.entries(selectedPacket.details.headers).map(([key, val]) => (
                          <div key={key} className="grid grid-cols-3 gap-2 py-0.5">
                            <span className="text-indigo-400 font-semibold">{key}:</span>
                            <span className="col-span-2 text-gray-300 break-all">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PAYLOAD TAB */}
              {activeTab === 'payload' && (
                <div className="space-y-3 font-mono">
                  <h4 className="text-[11px] font-bold text-blue-500 border-b border-slate-800 pb-1 mb-1.5">Packet Payload / Details</h4>
                  
                  {selectedPacket.details.payload && (
                    <div className="space-y-1">
                      <h5 className="text-[10px] text-gray-500 font-bold">Request Payload:</h5>
                      <pre className="p-3 bg-slate-900/60 rounded border border-slate-800 text-amber-400 whitespace-pre-wrap overflow-x-auto">
                        {selectedPacket.details.payload}
                      </pre>
                    </div>
                  )}

                  {selectedPacket.details.response && (
                    <div className="space-y-1 mt-3">
                      <h5 className="text-[10px] text-gray-500 font-bold">Response Data:</h5>
                      <pre className="p-3 bg-slate-900/60 rounded border border-slate-800 text-emerald-400 whitespace-pre-wrap overflow-x-auto">
                        {selectedPacket.details.response}
                      </pre>
                    </div>
                  )}

                  {!selectedPacket.details.payload && !selectedPacket.details.response && (
                    <div className="text-gray-500 italic py-2">
                      No request or response payload in this control packet.
                    </div>
                  )}
                </div>
              )}

              {/* TIMING WATERFALL TAB */}
              {activeTab === 'timing' && (
                <div className="space-y-4 font-sans">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-850">
                    <h4 className="text-[11px] font-mono font-bold text-blue-500">Chrome DevTools Waterfall</h4>
                    <span className="text-xs font-bold font-mono">Total Duration: {timingBreakdown.total}ms</span>
                  </div>

                  <div className="space-y-2 mt-3 font-mono text-[11px]">
                    {/* Waterfall row generator helper */}
                    {[
                      { label: 'DNS Lookup', duration: timingBreakdown.dns, color: 'bg-cyan-500', startOffset: 0 },
                      { label: 'TCP Handshake', duration: timingBreakdown.tcp, color: 'bg-slate-400', startOffset: timingBreakdown.dns },
                      { label: 'TLS Handshake', duration: timingBreakdown.tls, color: 'bg-purple-400', startOffset: timingBreakdown.dns + timingBreakdown.tcp },
                      { label: 'TTFB (Server Response)', duration: timingBreakdown.ttfb, color: 'bg-amber-500', startOffset: timingBreakdown.dns + timingBreakdown.tcp + timingBreakdown.tls },
                      { label: 'Content Download', duration: timingBreakdown.download, color: 'bg-emerald-500', startOffset: timingBreakdown.dns + timingBreakdown.tcp + timingBreakdown.tls + timingBreakdown.ttfb }
                    ].map(item => {
                      const totalWidth = timingBreakdown.total;
                      const startPercent = (item.startOffset / totalWidth) * 100;
                      const widthPercent = (item.duration / totalWidth) * 100;

                      return (
                        <div key={item.label} className="grid grid-cols-12 items-center gap-2 py-1">
                          <span className="col-span-3 text-gray-300 truncate" title={item.label}>
                            {item.label}
                          </span>
                          <span className="col-span-2 text-right pr-2 font-bold text-gray-400">
                            {item.duration}ms
                          </span>
                          <div className="col-span-7 bg-slate-900 rounded-sm h-3 relative overflow-hidden">
                            <div
                              className={`${item.color} h-full absolute rounded-sm`}
                              style={{
                                left: `${startPercent}%`,
                                width: `${widthPercent}%`
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* WIRESHARK HEX VIEW */}
              {activeTab === 'hex' && (
                <div className="space-y-2 font-mono">
                  <h4 className="text-[11px] font-bold text-blue-500 border-b border-slate-800 pb-1 mb-1.5">Raw Frame Hex Dump</h4>
                  <pre className="p-3 bg-slate-900/80 rounded border border-slate-850 text-slate-300 overflow-x-auto text-[11px] leading-tight select-text">
                    {selectedPacket.details.hexDump}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
