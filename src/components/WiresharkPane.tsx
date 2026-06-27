import React, { useEffect, useRef, useState } from 'react';
import type { NetworkPacket } from '../utils/packetGenerator';
import { Terminal, Cpu } from 'lucide-react';

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

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [packets]);

  const selectedPacket = selectedPacketIndex !== null ? packets[selectedPacketIndex] : null;

  const getProtocolStyles = (protocol: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-500/10 text-[#fafafa] border-blue-500/30';
    }

    switch (protocol) {
      case 'HTTP':
        return 'bg-green-500/5 text-green-500 border-[#2b2b30]';
      case 'SQL':
        return 'bg-amber-500/5 text-amber-500 border-[#2b2b30]';
      case 'REDIS':
      case 'TCP':
      case 'DNS':
      case 'TLSv1.3':
      case 'RENDER':
      default:
        return 'bg-[#111113] text-[#a1a1aa] border-[#2b2b30]';
    }
  };

  return (
    <div className="flex h-full flex-col gap-5 rounded-xl border border-[#2b2b30] bg-[#18181b] p-5 text-[#e4e4e7] shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-md font-semibold text-[#fafafa]">
            <Terminal size={18} className="text-blue-500" />
            Packet Inspector
          </h3>
          <span className="font-mono text-[10px] text-[#71717a]">{packets.length} packets</span>
        </div>

        <div className="flex flex-col overflow-hidden rounded-lg border border-[#2b2b30] bg-[#111113]">
          <div className="grid grid-cols-12 border-b border-[#2b2b30] bg-[#09090b] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#71717a]">
            <div className="col-span-1">No.</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Source</div>
            <div className="col-span-2">Destination</div>
            <div className="col-span-1.5">Proto</div>
            <div className="col-span-1 text-right pr-2">Len</div>
            <div className="col-span-2.5 pl-2">Info</div>
          </div>

          <div
            ref={scrollContainerRef}
            className="max-h-[175px] min-h-[120px] overflow-y-auto font-mono text-[11px]"
          >
            {packets.length === 0 ? (
              <div className="py-8 text-center text-[#71717a]">Awaiting connection trace request...</div>
            ) : (
              packets.map((p, idx) => {
                const isSelected = selectedPacketIndex === idx;
                return (
                  <button
                    key={p.num}
                    type="button"
                    onClick={() => onSelectPacket(idx)}
                    className={`grid w-full grid-cols-12 border-b px-3 py-2 text-left transition-colors ${getProtocolStyles(
                      p.protocol,
                      isSelected,
                    )}`}
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
                  </button>
                );
              })
            )}
            <div ref={listEndRef} />
          </div>
        </div>
      </div>

      <div className="flex min-h-[200px] flex-1 flex-col overflow-hidden rounded-lg border border-[#2b2b30] bg-[#111113]">
        <div className="flex border-b border-[#2b2b30] bg-[#09090b] text-xs font-mono select-none">
          {[
            { id: 'headers', label: 'Headers' },
            { id: 'payload', label: 'Payload' },
            { id: 'timing', label: 'Timing' },
            { id: 'hex', label: 'Hex' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as TabType)}
              className={`border-r px-4 py-2 transition-colors ${
                activeTab === t.id
                  ? 'border-b-2 border-b-blue-500 bg-[#111113] text-[#fafafa]'
                  : 'text-[#71717a] hover:bg-[#18181b] hover:text-[#e4e4e7]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 text-xs">
          {!selectedPacket ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[#71717a]">
              <Cpu size={24} className="text-[#71717a]" />
              <span>Select a packet in the table above to inspect its details.</span>
            </div>
          ) : (
            <>
              {activeTab === 'headers' && (
                <div className="space-y-4 font-mono">
                  <div className="space-y-1">
                    <h4 className="mb-1.5 border-b border-[#2b2b30] pb-1 text-[11px] font-bold text-blue-500">
                      General
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-[#71717a]">Request URL:</span>
                      <span className="col-span-2 truncate text-[#e4e4e7]">
                        {selectedPacket.info.includes('GET') || selectedPacket.info.includes('POST')
                          ? 'https://' + selectedPacket.destination + selectedPacket.info.split(' ')[1]
                          : 'N/A'}
                      </span>

                      <span className="text-[#71717a]">Request Method:</span>
                      <span className="col-span-2 font-bold text-blue-500">
                        {selectedPacket.info.startsWith('GET')
                          ? 'GET'
                          : selectedPacket.info.startsWith('POST')
                          ? 'POST'
                          : 'N/A'}
                      </span>

                      <span className="text-[#71717a]">Status Code:</span>
                      <span className="col-span-2 font-bold text-green-500">
                        {selectedPacket.info.includes('200 OK')
                          ? '200 OK'
                          : '101 Switching Protocols / Active Connection'}
                      </span>

                      <span className="text-[#71717a]">Remote Address:</span>
                      <span className="col-span-2 text-[#e4e4e7]">{selectedPacket.destination}</span>
                    </div>
                  </div>

                  {selectedPacket.details.headers && (
                    <div className="mt-3 space-y-1">
                      <h4 className="mb-1.5 border-b border-[#2b2b30] pb-1 text-[11px] font-bold text-blue-500">
                        Packet Headers
                      </h4>
                      <div className="space-y-1 text-[11px]">
                        {Object.entries(selectedPacket.details.headers).map(([key, val]) => (
                          <div key={key} className="grid grid-cols-3 gap-2 py-0.5">
                            <span className="font-semibold text-blue-400">{key}:</span>
                            <span className="col-span-2 break-all text-[#e4e4e7]">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'payload' && (
                <div className="space-y-3 font-mono">
                  <h4 className="mb-1.5 border-b border-[#2b2b30] pb-1 text-[11px] font-bold text-blue-500">
                    Packet Payload
                  </h4>

                  {selectedPacket.details.payload && (
                    <div className="space-y-1">
                      <h5 className="text-[10px] font-bold text-[#71717a]">Request Payload:</h5>
                      <pre className="overflow-x-auto rounded border border-[#2b2b30] bg-[#09090b] p-3 whitespace-pre-wrap text-[#e4e4e7]">
                        {selectedPacket.details.payload}
                      </pre>
                    </div>
                  )}

                  {selectedPacket.details.response && (
                    <div className="mt-3 space-y-1">
                      <h5 className="text-[10px] font-bold text-[#71717a]">Response Data:</h5>
                      <pre className="overflow-x-auto rounded border border-[#2b2b30] bg-[#09090b] p-3 whitespace-pre-wrap text-[#e4e4e7]">
                        {selectedPacket.details.response}
                      </pre>
                    </div>
                  )}

                  {!selectedPacket.details.payload && !selectedPacket.details.response && (
                    <div className="py-2 italic text-[#71717a]">
                      No request or response payload in this control packet.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'timing' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2b2b30] pb-1">
                    <h4 className="text-[11px] font-bold text-blue-500">Timing Breakdown</h4>
                    <span className="font-mono text-xs font-bold text-[#e4e4e7]">
                      Total Duration: {timingBreakdown.total}ms
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 font-mono text-[11px]">
                    {[
                      { label: 'DNS Lookup', duration: timingBreakdown.dns, color: 'bg-blue-500', startOffset: 0 },
                      { label: 'TCP Handshake', duration: timingBreakdown.tcp, color: 'bg-[#71717a]', startOffset: timingBreakdown.dns },
                      { label: 'TLS Handshake', duration: timingBreakdown.tls, color: 'bg-[#a1a1aa]', startOffset: timingBreakdown.dns + timingBreakdown.tcp },
                      { label: 'TTFB', duration: timingBreakdown.ttfb, color: 'bg-amber-500', startOffset: timingBreakdown.dns + timingBreakdown.tcp + timingBreakdown.tls },
                      { label: 'Content Download', duration: timingBreakdown.download, color: 'bg-green-500', startOffset: timingBreakdown.dns + timingBreakdown.tcp + timingBreakdown.tls + timingBreakdown.ttfb },
                    ].map((item) => {
                      const totalWidth = timingBreakdown.total;
                      const startPercent = (item.startOffset / totalWidth) * 100;
                      const widthPercent = (item.duration / totalWidth) * 100;

                      return (
                        <div key={item.label} className="grid grid-cols-12 items-center gap-2 py-1">
                          <span className="col-span-3 truncate text-[#e4e4e7]" title={item.label}>
                            {item.label}
                          </span>
                          <span className="col-span-2 pr-2 text-right font-bold text-[#71717a]">
                            {item.duration}ms
                          </span>
                          <div className="col-span-7 h-3 overflow-hidden rounded-sm bg-[#09090b]">
                            <div
                              className={`${item.color} absolute h-3 rounded-sm`}
                              style={{ left: `${startPercent}%`, width: `${widthPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'hex' && (
                <div className="space-y-2 font-mono">
                  <h4 className="mb-1.5 border-b border-[#2b2b30] pb-1 text-[11px] font-bold text-blue-500">
                    Raw Frame Hex Dump
                  </h4>
                  <pre className="overflow-x-auto rounded border border-[#2b2b30] bg-[#09090b] p-3 text-[11px] leading-tight text-[#e4e4e7] select-text">
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
