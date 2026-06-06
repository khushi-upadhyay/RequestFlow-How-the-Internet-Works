import type { SimulatorSettings } from '../types/flow';

export interface NetworkPacket {
  num: number;
  time: number; // relative timestamp in seconds
  source: string;
  destination: string;
  protocol: 'DNS' | 'TCP' | 'TLSv1.3' | 'HTTP' | 'REDIS' | 'SQL' | 'RENDER';
  length: number; // bytes
  info: string;
  stepId: string; // references requestFlowSteps ID
  details: {
    headers?: { [key: string]: string };
    payload?: string;
    response?: string;
    hexDump: string;
  };
}

// Simple hash function to generate a stable IP from a hostname
const getTargetIP = (hostname: string): string => {
  let hash = 0;
  for (let i = 0; i < hostname.length; i++) {
    hash = hostname.charCodeAt(i) + ((hash << 5) - hash);
  }
  const ip = [
    (hash & 0xff000000) >>> 24,
    (hash & 0x00ff0000) >>> 16,
    (hash & 0x0000ff00) >>> 8,
    (hash & 0x000000ff)
  ];
  // Ensure it's not a multicast or loopback, clamp to valid range
  ip[0] = (Math.abs(ip[0]) % 220) + 12; 
  ip[1] = Math.abs(ip[1]) % 255;
  ip[2] = Math.abs(ip[2]) % 255;
  ip[3] = Math.abs(ip[3]) % 254 + 1;
  return ip.join('.');
};

// Generates a mock hex dump of some text
export const generateHexDump = (label: string, text: string): string => {
  const cleanText = label + '\n' + text;
  const lines: string[] = [];
  const bytes = Array.from(new TextEncoder().encode(cleanText.substring(0, 192)));
  
  for (let i = 0; i < bytes.length; i += 16) {
    const chunk = bytes.slice(i, i + 16);
    const hexPart = chunk.map(b => b.toString(16).padStart(2, '0')).join(' ');
    const paddedHexPart = hexPart.padEnd(47, ' ');
    const asciiPart = chunk.map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
    const offset = i.toString(16).padStart(4, '0');
    lines.push(`${offset}  ${paddedHexPart}  |${asciiPart}|`);
  }
  
  if (lines.length === 0) {
    return '0000  00 00 00 00 00 00 00 00                       |........|';
  }
  return lines.join('\n');
};

export const generatePacketsForUrl = (
  urlStr: string,
  settings: SimulatorSettings
): {
  clientIp: string;
  dnsResolverIp: string;
  cdnEdgeIp: string;
  loadBalancerIp: string;
  appServerIp: string;
  redisIp: string;
  dbIp: string;
  targetIp: string;
  packets: NetworkPacket[];
  timingBreakdown: {
    dns: number;
    tcp: number;
    tls: number;
    ttfb: number;
    download: number;
    total: number;
  };
} => {
  let hostname = 'example.com';
  let path = '/';
  let query = '';
  
  try {
    const formattedUrl = urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;
    const parsed = new URL(formattedUrl);
    hostname = parsed.hostname || hostname;
    path = parsed.pathname || path;
    query = parsed.search || query;
  } catch (e) {
    // Treat as raw domain or word
    hostname = urlStr || hostname;
  }

  const clientIp = '192.168.1.142';
  const dnsResolverIp = '8.8.8.8';
  const targetIp = getTargetIP(hostname);
  const cdnEdgeIp = `104.16.${Math.abs(parseInt(targetIp.split('.')[2], 10)) % 255}.84`; // Mock CDN edge
  const loadBalancerIp = '10.0.0.1';
  const appServerIp = '10.0.0.10';
  const redisIp = '10.0.0.15';
  const dbIp = '10.0.0.20';

  // Base latencies from requestFlow.json.ts
  // settings.networkSpeed multiplier (1 = slow, 10 = fast) => delay = base / speedMultiplier
  const netSpeed = settings.networkSpeed;
  const netMult = (11 - netSpeed) / 4; // 10x is very fast (0.25x delay), 1x is slow (2.5x delay)
  const serverLoadMult = 1 + (settings.serverLoad / 100) * 2.5; // 0% is normal, 100% is 3.5x slower
  const isCacheHit = Math.random() * 100 < settings.cacheHitRate;

  // Let's compute durations for steps (ms)
  const dnsDuration = Math.round(50 * netMult);
  const tcpDuration = Math.round(40 * netMult);
  const tlsDuration = Math.round(70 * netMult);
  const cdnDuration = Math.round(30 * netMult);
  const lbDuration = Math.round(5 * serverLoadMult);
  const appServerLogicDuration = Math.round(100 * serverLoadMult);
  const redisDuration = 2; // Redis is in-memory, always ~2ms
  const databaseDuration = isCacheHit ? 0 : Math.round(150 * serverLoadMult);
  const responseSerializationDuration = Math.round(10 * serverLoadMult);
  const browserRenderDuration = 200; // Render is local, doesn't depend on network, slightly on load but static here.

  let currentTime = 0; // relative seconds
  const packets: NetworkPacket[] = [];
  let packetNum = 1;

  const addPacket = (
    src: string,
    dst: string,
    protocol: NetworkPacket['protocol'],
    length: number,
    info: string,
    stepId: string,
    detailsText: string,
    headers?: { [key: string]: string },
    payload?: string,
    response?: string
  ) => {
    packets.push({
      num: packetNum++,
      time: parseFloat(currentTime.toFixed(4)),
      source: src,
      destination: dst,
      protocol,
      length,
      info,
      stepId,
      details: {
        headers,
        payload,
        response,
        hexDump: generateHexDump(`${protocol} Packet #${packetNum - 1}`, detailsText)
      }
    });
  };

  // --- 1. DNS RESOLUTION ---
  currentTime += 0.002;
  addPacket(
    clientIp,
    dnsResolverIp,
    'DNS',
    74,
    `Standard query 0x8a92 A ${hostname}`,
    '1-dns',
    `DNS Standard Query\nTransaction ID: 0x8a92\nQueries:\n  Name: ${hostname}\n  Type: A (Host Address)\n  Class: IN (Internet)`,
    {
      'Transaction ID': '0x8a92',
      'Query Name': hostname,
      'Query Type': 'A (IPv4 Address)',
      'DNS Server': dnsResolverIp
    },
    `Query: A record for ${hostname}`
  );
  
  currentTime += (dnsDuration / 1000);
  addPacket(
    dnsResolverIp,
    clientIp,
    'DNS',
    90,
    `Standard query response 0x8a92 A ${hostname} A ${targetIp}`,
    '1-dns',
    `DNS Query Response\nTransaction ID: 0x8a92\nAnswers:\n  Name: ${hostname}\n  Type: A\n  Address: ${targetIp}\n  Time to live: 300 seconds`,
    {
      'Transaction ID': '0x8a92',
      'Answer Address': targetIp,
      'Time to Live (TTL)': '300s',
      'Flags': '0x8180 (Standard query response, No error)'
    },
    undefined,
    `Resolved: ${hostname} -> ${targetIp}`
  );

  // --- 2. TCP HANDSHAKE ---
  currentTime += 0.005;
  // Packet 1: SYN
  addPacket(
    clientIp,
    cdnEdgeIp,
    'TCP',
    66,
    `44332 → 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460`,
    '2-tcp-handshake',
    `Transmission Control Protocol\nSource Port: 44332\nDestination Port: 443 (HTTPS)\nSequence Number: 0 (relative)\nFlags: 0x002 (SYN)\nWindow: 64240`,
    {
      'Source Port': '44332',
      'Destination Port': '443',
      'Sequence Number': '0',
      'Flags': 'SYN (Synchronize)'
    },
    'TCP Connection SYN handshake packet.'
  );

  currentTime += (tcpDuration / 2000); // one way
  // Packet 2: SYN, ACK
  addPacket(
    cdnEdgeIp,
    clientIp,
    'TCP',
    66,
    `443 → 44332 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0`,
    '2-tcp-handshake',
    `Transmission Control Protocol\nSource Port: 443\nDestination Port: 44332\nSequence Number: 0 (relative)\nAcknowledgment Number: 1 (relative)\nFlags: 0x012 (SYN, ACK)\nWindow: 65535`,
    {
      'Source Port': '443',
      'Destination Port': '44332',
      'Sequence Number': '0',
      'Acknowledgment Number': '1',
      'Flags': 'SYN, ACK'
    },
    'TCP Connection SYN-ACK response packet.'
  );

  currentTime += (tcpDuration / 2000); // back
  // Packet 3: ACK
  addPacket(
    clientIp,
    cdnEdgeIp,
    'TCP',
    54,
    `44332 → 443 [ACK] Seq=1 Ack=1 Win=64240 Len=0`,
    '2-tcp-handshake',
    `Transmission Control Protocol\nSource Port: 44332\nDestination Port: 443\nSequence Number: 1\nAcknowledgment Number: 1\nFlags: 0x010 (ACK)\nWindow: 64240`,
    {
      'Source Port': '44332',
      'Destination Port': '443',
      'Sequence Number': '1',
      'Acknowledgment Number': '1',
      'Flags': 'ACK'
    },
    'TCP Handshake complete.'
  );

  // --- 3. TLS HANDSHAKE ---
  currentTime += 0.002;
  // Client Hello
  addPacket(
    clientIp,
    cdnEdgeIp,
    'TLSv1.3',
    512,
    `Client Hello (TLS 1.3), SNI=${hostname}`,
    '3-tls-handshake',
    `Transport Layer Security\nTLSv1.3 Record Layer: Handshake Protocol: Client Hello\nVersion: TLS 1.3 (0x0304)\nExtension: server_name (SNI = ${hostname})\nSupported Cipher Suites: 17 suites`,
    {
      'TLS Version': 'TLS 1.3',
      'Handshake Type': 'Client Hello (1)',
      'Server Name Indication (SNI)': hostname,
      'Supported Ciphers': 'TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_AES_128_GCM_SHA256'
    },
    `SNI: ${hostname}`
  );

  currentTime += (tlsDuration / 2000);
  // Server Hello, Certificate, Keys
  addPacket(
    cdnEdgeIp,
    clientIp,
    'TLSv1.3',
    1420,
    `Server Hello, Change Cipher Spec, Certificate, Key Exchange`,
    '3-tls-handshake',
    `Transport Layer Security\nTLSv1.3 Record Layer: Handshake Protocol: Server Hello\nSelected Cipher Suite: TLS_AES_256_GCM_SHA384 (0x1302)\nCertificate Authority: Let's Encrypt Authority X3`,
    {
      'Selected Cipher Suite': 'TLS_AES_256_GCM_SHA384',
      'Certificate Authority': "Let's Encrypt Authority X3",
      'Certificate Subject': `CN=${hostname}`,
      'Key Agreement': 'ECDHE-ECDSA-P256'
    },
    undefined,
    `Negotiated: TLS 1.3, Cipher=TLS_AES_256_GCM_SHA384, Server Cert Valid`
  );

  currentTime += (tlsDuration / 2000);
  // Client Finished, Key Exchange
  addPacket(
    clientIp,
    cdnEdgeIp,
    'TLSv1.3',
    120,
    `Client Key Exchange, Finished`,
    '3-tls-handshake',
    `Transport Layer Security\nTLSv1.3 Handshake Protocol: Finished\nSession Key established. Perfect Forward Secrecy secured.`,
    {
      'Handshake Type': 'Finished (20)',
      'Cipher Status': 'Encrypted Session Active'
    },
    'Keys established. Switching to encrypted payload.'
  );

  // --- 4. CDN CACHE CHECK ---
  currentTime += 0.005;
  // Browser sends HTTP Request
  const cacheStatusHeader = isCacheHit ? 'HIT' : 'MISS';
  addPacket(
    clientIp,
    cdnEdgeIp,
    'HTTP',
    450,
    `GET ${path}${query} HTTP/1.1`,
    '4-cdn',
    `Hypertext Transfer Protocol\nGET ${path} HTTP/1.1\nHost: ${hostname}\nUser-Agent: Mozilla/5.0 Chrome/120.0.0.0\nAccept: text/html\nAccept-Encoding: gzip, deflate, br`,
    {
      'Request Method': 'GET',
      'Request URI': path + query,
      'Host': hostname,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RequestFlow/1.0',
      'Accept': 'text/html,application/xhtml+xml,application/json'
    },
    `GET Request path=${path}`
  );

  currentTime += (cdnDuration / 1000);

  if (isCacheHit) {
    // CDN cache hit -> returns response immediately! Skip origin steps
    currentTime += 0.01; // short serialization
    addPacket(
      cdnEdgeIp,
      clientIp,
      'HTTP',
      850,
      `HTTP/1.1 200 OK (text/html) [CDN HIT]`,
      '4-cdn',
      `Hypertext Transfer Protocol\nHTTP/1.1 200 OK\nContent-Type: text/html; charset=UTF-8\nServer: cloudflare\nCF-Cache-Status: HIT\nAge: 4322\nCache-Control: public, max-age=86400`,
      {
        'Status Code': '200 OK',
        'Content-Type': 'text/html; charset=utf-8',
        'Server': 'cloudflare',
        'CF-Cache-Status': 'HIT',
        'Cache-Control': 'public, max-age=86400',
        'Age': '4322s'
      },
      undefined,
      `<!DOCTYPE html><html><head><title>${hostname}</title></head><body>CDN Cached Content</body></html>`
    );
  } else {
    // CDN cache miss -> Proxies to Load Balancer
    addPacket(
      cdnEdgeIp,
      loadBalancerIp,
      'HTTP',
      480,
      `GET ${path}${query} HTTP/1.1 (Proxy via CDN)`,
      '4-cdn',
      `Hypertext Transfer Protocol (CDN Proxy Request)\nForwarded-For: ${clientIp}\nCF-Connecting-IP: ${clientIp}\nHost: ${hostname}`,
      {
        'Request': `GET ${path}`,
        'X-Forwarded-For': clientIp,
        'CF-Ray': '82c82301fa383921-MIA'
      },
      `Proxied GET request. Cache status: MISS`
    );

    // --- 5. LOAD BALANCER ---
    currentTime += (lbDuration / 1000);
    // LB decides which server (we have appServerIp)
    addPacket(
      loadBalancerIp,
      appServerIp,
      'HTTP',
      510,
      `GET ${path}${query} HTTP/1.1 [Routed by LB]`,
      '5-load-balancer',
      `Hypertext Transfer Protocol (LB Routed)\nRouted-To: ${appServerIp}\nAlgorithm: Least Connections\nSession ID: srv_a1b2`,
      {
        'Request URI': path,
        'Routing Algorithm': 'Least Connections',
        'Target Node': 'app-server-01 (10.0.0.10)',
        'Session Persistence': 'Sticky (srv_a1b2)'
      },
      `Routed load to application instance 1`
    );

    // --- 6. APP SERVER START ---
    currentTime += 0.002;
    addPacket(
      appServerIp,
      redisIp,
      'REDIS',
      82,
      `GET cache:keys:${hostname.replace(/\./g, ':')}`,
      '6-application-server',
      `Redis In-Memory Key Lookup\nCommand: GET cache:keys:${hostname.replace(/\./g, ':')}\nDatabase: db0`,
      {
        'Database': '0 (Default)',
        'Command': 'GET',
        'Key': `cache:keys:${hostname.replace(/\./g, ':')}`
      },
      `Query Redis cache for key "cache:keys:${hostname.replace(/\./g, ':')}"`
    );

    // --- 7. CACHE LOOKUP (REDIS) ---
    currentTime += (redisDuration / 1000);
    // We check if it is cache hit in redis or database check is needed
    // To make it interesting, database step happens only if there's a database miss
    // Let's assume Redis cache misses or hits:
    const isRedisHit = settings.cacheHitRate > 50 && Math.random() * 100 < settings.cacheHitRate;
    
    if (isRedisHit) {
      addPacket(
        redisIp,
        appServerIp,
        'REDIS',
        256,
        `Value: {"status": "success", "data": "Cached API response"} [Redis HIT]`,
        '7-cache',
        `Redis Command Response\nStatus: Key Found (Cache Hit)\nPayload Length: 256 bytes\nJSON payload data retrieved from RAM.`,
        {
          'Status': 'OK',
          'Cache Status': 'HIT',
          'Data Size': '256 bytes'
        },
        undefined,
        `{"status":"success","cached":true,"data":"API Profile data for ${hostname}"}`
      );
    } else {
      addPacket(
        redisIp,
        appServerIp,
        'REDIS',
        30,
        `Key Not Found [Redis MISS]`,
        '7-cache',
        `Redis Command Response\nStatus: Key Not Found (Cache Miss)\nMust query persistent store.`,
        {
          'Status': 'NIL',
          'Cache Status': 'MISS'
        },
        undefined,
        'Redis key returned nil.'
      );

      // --- 8. DATABASE QUERY ---
      currentTime += 0.005;
      const sqlQuery = `SELECT * FROM endpoints WHERE host = '${hostname}' LIMIT 1;`;
      addPacket(
        appServerIp,
        dbIp,
        'SQL',
        120,
        `PostgreSQL Query: ${sqlQuery}`,
        '8-database',
        `PostgreSQL Client Query\nProtocol Version: 3.0\nQuery: ${sqlQuery}`,
        {
          'Database Driver': 'pg-pool-v8',
          'Query Type': 'SELECT',
          'Target Table': 'endpoints'
        },
        sqlQuery
      );

      currentTime += (databaseDuration / 1000);
      const dbResponseJson = `{"id": 421, "host": "${hostname}", "owner": "admin", "qps_limit": 1000, "updated_at": "2026-06-06T12:00:00Z"}`;
      addPacket(
        dbIp,
        appServerIp,
        'SQL',
        340,
        `Row returned: ${dbResponseJson}`,
        '8-database',
        `PostgreSQL Server Response\nStatus: Command Complete (SELECT 1 row)\nColumns:\n  id: int4\n  host: text\n  owner: text\n  qps_limit: int4\n  updated_at: timestamp`,
        {
          'Status': 'SELECT 1',
          'Rows Returned': '1',
          'Postgres Backend PID': '10482'
        },
        undefined,
        dbResponseJson
      );

      // Cache the result back in Redis
      currentTime += 0.001;
      addPacket(
        appServerIp,
        redisIp,
        'REDIS',
        180,
        `SET cache:keys:${hostname.replace(/\./g, ':')} ${dbResponseJson} EX 3600`,
        '7-cache',
        `Redis Command Write\nCommand: SET\nKey: cache:keys:${hostname.replace(/\./g, ':')}\nTTL: 3600s`,
        {
          'Command': 'SET',
          'Key': `cache:keys:${hostname.replace(/\./g, ':')}`,
          'Expiry Time (s)': '3600'
        },
        dbResponseJson
      );
    }

    // --- 9. RESPONSE GENERATION ---
    currentTime += (appServerLogicDuration / 1000);
    const finalResponsePayload = `{"status":"online","host":"${hostname}","resolved_ip":"${targetIp}","speed_multiplier":${settings.networkSpeed},"latency_ms":${Math.round(currentTime * 1000)},"cached":${isRedisHit}}`;
    
    // Server sends response to Load Balancer
    addPacket(
      appServerIp,
      loadBalancerIp,
      'HTTP',
      320,
      `HTTP/1.1 200 OK (application/json) [Response Generated]`,
      '9-response-generation',
      `Hypertext Transfer Protocol Response\nHTTP/1.1 200 OK\nContent-Type: application/json\nContent-Length: ${finalResponsePayload.length}\nDate: Sat, 06 Jun 2026 16:09:44 GMT`,
      {
        'Status Code': '200 OK',
        'Content-Type': 'application/json',
        'Content-Length': finalResponsePayload.length.toString()
      },
      undefined,
      finalResponsePayload
    );

    currentTime += (lbDuration / 1000);
    // LB to CDN Edge
    addPacket(
      loadBalancerIp,
      cdnEdgeIp,
      'HTTP',
      320,
      `HTTP/1.1 200 OK (application/json) [Proxy Back]`,
      '9-response-generation',
      `Hypertext Transfer Protocol Response\nProxied through Load Balancer to CDN Edge.\nStatus: 200 OK`,
      {
        'Status': '200 OK',
        'Connection': 'keep-alive'
      },
      undefined,
      finalResponsePayload
    );

    currentTime += (cdnDuration / 1000);
    // CDN Edge to client
    addPacket(
      cdnEdgeIp,
      clientIp,
      'HTTP',
      410,
      `HTTP/1.1 200 OK (application/json) [CF-Cache-Status: MISS]`,
      '9-response-generation',
      `Hypertext Transfer Protocol Response\nHTTP/1.1 200 OK\nContent-Type: application/json\nCF-Cache-Status: MISS\nCF-Ray: 82c82301fa383921-MIA\nServer: cloudflare`,
      {
        'Status Code': '200 OK',
        'Content-Type': 'application/json',
        'CF-Cache-Status': 'MISS',
        'Server': 'cloudflare',
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Length': finalResponsePayload.length.toString()
      },
      undefined,
      finalResponsePayload
    );
  }

  // --- 10. BROWSER RENDERING ---
  currentTime += (browserRenderDuration / 1000);
  addPacket(
    clientIp,
    clientIp,
    'RENDER',
    0,
    `Parse response JSON, layout elements, Paint screen`,
    '10-browser-render',
    `Browser Local Rendering Engine\nParsing JSON response...\nUpdated DOM Tree\nRecalculated styles\nLayout (Reflow) complete\nPainted pixels to display.`,
    {
      'Local Process': 'Chrome Render Pipeline',
      'Action': 'DOM Layout & Painting',
      'FPS': '60.0'
    },
    'Initiated Paint.'
  );

  // Timing breakdown for DevTools Waterfall
  const total = Math.round(currentTime * 1000);
  const timingBreakdown = {
    dns: dnsDuration,
    tcp: tcpDuration,
    tls: tlsDuration,
    ttfb: isCacheHit
      ? Math.round(cdnDuration)
      : Math.round(cdnDuration + lbDuration * 2 + appServerLogicDuration + redisDuration + databaseDuration),
    download: Math.round(isCacheHit ? cdnDuration : cdnDuration * 2),
    total
  };

  return {
    clientIp,
    dnsResolverIp,
    cdnEdgeIp,
    loadBalancerIp,
    appServerIp,
    redisIp,
    dbIp,
    targetIp,
    packets,
    timingBreakdown
  };
};
