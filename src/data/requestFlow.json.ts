import type { RequestStep } from '../types/flow';

export const requestFlowSteps: RequestStep[] = [
  {
    id: '1-dns',
    name: 'DNS Resolution',
    description: 'Converts domain name to IP address',
    latency: 50,
    icon: 'Globe',
    category: 'network',
    details: {
      whatHappens: 'Your browser queries a DNS resolver to convert www.google.com into an IP address (e.g., 142.250.185.46). The resolver may cache the result, or recursively query nameservers.',
      whyItExists: 'Humans remember domain names, but computers need IP addresses to route packets. DNS translates human-readable names to machine-readable addresses.',
      realWorldExample: 'When you type google.com, DNS servers worldwide contain records mapping google.com → 142.250.185.46. Your ISP\'s resolver checks its cache first; if empty, it queries root nameservers → TLD nameservers → authoritative nameservers.',
    },
    interviewQuestions: [
      {
        question: 'What is DNS and why do we need it?',
        difficulty: 'beginner',
        answer: 'DNS (Domain Name System) translates human-readable domain names (google.com) into IP addresses (142.250.185.46) that computers use for routing.',
      },
      {
        question: 'What is the difference between recursive and iterative DNS queries?',
        difficulty: 'intermediate',
        answer: 'Recursive: Client asks resolver to fully resolve the query. Iterative: Each server returns the next server to query.',
      },
      {
        question: 'Explain DNS propagation and TTL.',
        difficulty: 'intermediate',
        answer: 'DNS TTL (Time To Live) controls how long records are cached. After TTL expires, caches must re-query. Propagation takes time as DNS records spread across global servers.',
      },
    ],
    bottlenecks: [
      'DNS cache miss - requires full resolution (~100-300ms)',
      'Slow resolver performance',
      'Geographic distance to resolver',
      'DNSSEC validation overhead',
    ],
    technologies: ['BIND', 'Cloudflare DNS', 'Route 53', 'Google Public DNS'],
    relatedConcepts: ['TCP/IP', 'Caching', 'Network Protocols'],
  },
  {
    id: '2-tcp-handshake',
    name: 'TCP Handshake',
    description: '3-way handshake establishes connection',
    latency: 40,
    icon: 'Handshake',
    category: 'network',
    details: {
      whatHappens: 'Browser initiates a TCP connection with 3 packets: SYN (client hello), SYN-ACK (server hello), ACK (client ack). Once complete, a reliable connection exists.',
      whyItExists: 'TCP ensures reliable, ordered delivery of data. The handshake establishes sequence numbers and confirms both sides are ready to communicate.',
      realWorldExample: 'Your phone calls a friend. Phone 1 says "Can you hear me?" (SYN), Friend says "Yes, I hear you" (SYN-ACK), Phone 1 says "Great, let\'s talk" (ACK). Now conversation can happen.',
    },
    interviewQuestions: [
      {
        question: 'Explain the TCP 3-way handshake.',
        difficulty: 'beginner',
        answer: 'SYN: Client sends sequence number. SYN-ACK: Server responds with its sequence and acknowledges client\'s. ACK: Client acknowledges server\'s sequence. Connection established.',
      },
      {
        question: 'Why do we need TCP handshake?',
        difficulty: 'intermediate',
        answer: 'To establish a reliable, ordered, and stateful connection. Confirms both sides are ready, synchronizes sequence numbers, and allows acknowledgment of data.',
      },
      {
        question: 'What are TCP vs UDP? When use each?',
        difficulty: 'intermediate',
        answer: 'TCP: Reliable, ordered, slower (email, web). UDP: Fast, unreliable, unordered (video streaming, gaming, DNS). Choose based on reliability vs speed tradeoffs.',
      },
    ],
    bottlenecks: [
      'High latency networks (satellite, long distance)',
      'Packet loss requiring retransmission',
      'Connection timeouts if server unreachable',
    ],
    technologies: ['TCP', 'UDP', 'QUIC', 'Network protocols'],
    relatedConcepts: ['DNS Resolution', 'TLS Handshake', 'Networking'],
  },
  {
    id: '3-tls-handshake',
    name: 'TLS Handshake',
    description: 'Negotiates encryption for HTTPS',
    latency: 70,
    icon: 'Lock',
    category: 'network',
    details: {
      whatHappens: 'Browser and server negotiate encryption: Client sends supported ciphers, Server responds with chosen cipher + certificate, Client verifies certificate and generates shared secret, Session encryption key established.',
      whyItExists: 'HTTPS encrypts data in transit using TLS. The handshake authenticates the server (via certificate) and agrees on encryption keys without letting eavesdroppers know the key.',
      realWorldExample: 'Alice and Bob want to communicate secretly. Alice sends a list of locks she has. Bob picks one, shows Alice his ID card signed by a trusted authority, and Alice sends the key encrypted with his lock. Now they can communicate secretly.',
    },
    interviewQuestions: [
      {
        question: 'What is TLS and why is it important?',
        difficulty: 'beginner',
        answer: 'TLS (Transport Layer Security) encrypts data in transit, preventing eavesdropping. It\'s the "S" in HTTPS.',
      },
      {
        question: 'Explain TLS 1.2 vs TLS 1.3 handshake.',
        difficulty: 'advanced',
        answer: 'TLS 1.2: 2 round-trips (4 messages). TLS 1.3: 1 round-trip (3 messages), faster. TLS 1.3 also hides which protocols are used.',
      },
      {
        question: 'What is a certificate and why do we need it?',
        difficulty: 'intermediate',
        answer: 'A certificate proves a server\'s identity. It\'s digitally signed by a trusted Certificate Authority, preventing man-in-the-middle attacks.',
      },
    ],
    bottlenecks: [
      'Expensive certificate validation',
      'Slow cipher suites',
      'Session resumption failures',
      'Certificate revocation checks (OCSP)',
    ],
    technologies: ['TLS 1.3', 'SSL', 'OpenSSL', 'mTLS'],
    relatedConcepts: ['Encryption', 'Public Key Infrastructure', 'Certificates'],
  },
  {
    id: '4-cdn',
    name: 'CDN - Content Delivery',
    description: 'Serves cached content from nearest edge',
    latency: 30,
    icon: 'Network',
    category: 'server',
    details: {
      whatHappens: 'If content is cached at a CDN edge server near you, it\'s served directly from there. CDN nodes worldwide cache popular content, reducing latency and origin server load.',
      whyItExists: 'Reduces latency by serving content from geographically distributed edge servers. Users get faster downloads, origin gets less load, and videos/images don\'t stall.',
      realWorldExample: 'Netflix has servers in data centers worldwide. When you watch a movie, it streams from the Netflix server closest to you, not Netflix HQ in California.',
    },
    interviewQuestions: [
      {
        question: 'What is a CDN and why use it?',
        difficulty: 'beginner',
        answer: 'A CDN (Content Delivery Network) caches content at geographically distributed edge servers, reducing latency and origin server load.',
      },
      {
        question: 'Explain cache invalidation strategies.',
        difficulty: 'intermediate',
        answer: 'TTL-based: Expire after time. Purge API: Manually invalidate. Versioning: Use URLs with version numbers (style-v2.css vs style-v1.css).',
      },
      {
        question: 'Compare HTTP/2 Server Push vs CDN prefetching.',
        difficulty: 'advanced',
        answer: 'Server Push: Server sends resources before client requests them. Prefetching: Client proactively fetches resources. Both reduce latency.',
      },
    ],
    bottlenecks: [
      'Cache miss - request goes to origin',
      'Cache invalidation challenges',
      'Cost of maintaining CDN infrastructure',
      'Stale content issues',
    ],
    technologies: ['Cloudflare', 'Akamai', 'CloudFront', 'Fastly'],
    relatedConcepts: ['Caching', 'Load Balancing', 'Geographic Distribution'],
  },
  {
    id: '5-load-balancer',
    name: 'Load Balancer',
    description: 'Distributes traffic across servers',
    latency: 5,
    icon: 'GitBranch',
    category: 'server',
    details: {
      whatHappens: 'Request hits a load balancer which routes it to one of many backend servers based on algorithms like round-robin, least connections, or IP hash.',
      whyItExists: 'Distributes load across multiple servers for scalability and high availability. If one server fails, others handle traffic. Enables horizontal scaling.',
      realWorldExample: 'A popular website gets 100,000 requests/sec. One server can\'t handle it. 100 servers behind a load balancer each handle ~1,000 requests/sec.',
    },
    interviewQuestions: [
      {
        question: 'What is a load balancer and what problems does it solve?',
        difficulty: 'beginner',
        answer: 'Distributes traffic across multiple servers. Solves: scalability (handle more load), high availability (redundancy), session persistence.',
      },
      {
        question: 'Compare load balancing algorithms: round-robin, least connections, IP hash.',
        difficulty: 'intermediate',
        answer: 'Round-robin: Even distribution. Least connections: Sends to server with fewest active connections. IP hash: Routes same IP to same server (session affinity).',
      },
      {
        question: 'What is sticky sessions and when do you need it?',
        difficulty: 'intermediate',
        answer: 'Routes all requests from a client to the same backend server. Needed when servers maintain session state. Can cause uneven load.',
      },
    ],
    bottlenecks: [
      'Single point of failure (mitigated by active-active setup)',
      'Session affinity reduces parallelization',
      'Uneven load distribution if algorithm is poor',
    ],
    technologies: ['HAProxy', 'NGINX', 'AWS ELB', 'Kubernetes Service'],
    relatedConcepts: ['Distributed Systems', 'Scalability', 'High Availability'],
  },
  {
    id: '6-application-server',
    name: 'Application Server',
    description: 'Processes business logic',
    latency: 100,
    icon: 'Server',
    category: 'server',
    details: {
      whatHappens: 'Request reaches application code (Node.js, Python, Java, etc.). Server routes to appropriate handler, executes business logic, queries database, and generates response.',
      whyItExists: 'Executes custom logic to handle requests. Without it, you\'d only serve static files. Most of your custom code runs here.',
      realWorldExample: 'You search for "flights to NYC". Backend searches flight database, applies filters, ranks by price, checks seat availability, and returns results.',
    },
    interviewQuestions: [
      {
        question: 'What is an application server vs web server?',
        difficulty: 'beginner',
        answer: 'Web server (NGINX): Serves static files, proxies requests. App server (Node.js): Executes business logic, database queries.',
      },
      {
        question: 'Explain vertical vs horizontal scaling.',
        difficulty: 'intermediate',
        answer: 'Vertical: Bigger machine (more CPU/RAM). Horizontal: More machines. Horizontal is cheaper and more resilient.',
      },
      {
        question: 'What is connection pooling and why is it important?',
        difficulty: 'intermediate',
        answer: 'Reuses database connections instead of creating new ones per request. Reduces overhead and improves throughput.',
      },
    ],
    bottlenecks: [
      'Slow business logic',
      'Inefficient database queries',
      'Memory leaks over time',
      'High CPU usage',
    ],
    technologies: ['Node.js', 'Python/Django', 'Java/Spring', 'Go', 'Ruby on Rails'],
    relatedConcepts: ['Microservices', 'APIs', 'Scalability'],
  },
  {
    id: '7-cache',
    name: 'Cache - Redis',
    description: 'In-memory store for quick lookups',
    latency: 2,
    icon: 'Zap',
    category: 'data',
    details: {
      whatHappens: 'Before querying database, check cache (Redis). If data exists, return immediately. If not (cache miss), query database, store in cache for next time.',
      whyItExists: 'Memory access (μs) is 1000x faster than disk access (ms). Caching frequently-accessed data reduces database load and latency.',
      realWorldExample: 'User profiles loaded 1,000 times/day are cached in Redis for 1 hour. Cache hits avoid 999 expensive database queries.',
    },
    interviewQuestions: [
      {
        question: 'What is caching and why is it important?',
        difficulty: 'beginner',
        answer: 'Storing frequently-accessed data in fast storage (memory). Reduces latency and database load by avoiding repeated expensive computations.',
      },
      {
        question: 'Explain cache invalidation problem.',
        difficulty: 'intermediate',
        answer: 'Phil Karlton: "Two hard things in CS: cache invalidation and naming things." Must ensure cache reflects current state. Use TTL, event-based, or versioning.',
      },
      {
        question: 'Compare different cache policies: LRU, LFU, FIFO.',
        difficulty: 'advanced',
        answer: 'LRU: Evict least recently used. LFU: Evict least frequently used. FIFO: Evict oldest. LRU is most common.',
      },
    ],
    bottlenecks: [
      'Cache misses on cold start',
      'Cache invalidation complexity',
      'Memory limitations',
      'Stale data issues',
    ],
    technologies: ['Redis', 'Memcached', 'Varnish', 'Application caches'],
    relatedConcepts: ['Databases', 'Performance Optimization', 'Data Consistency'],
  },
  {
    id: '8-database',
    name: 'Database Query',
    description: 'Retrieves data from persistent storage',
    latency: 150,
    icon: 'Database',
    category: 'data',
    details: {
      whatHappens: 'Application executes SQL query (SELECT, UPDATE, etc.). Database engine parses query, optimizes execution plan, searches indexes, retrieves data, and returns result.',
      whyItExists: 'Provides durable, queryable storage. Data persists across server restarts. Enables complex queries and ACID guarantees.',
      realWorldExample: 'SELECT * FROM users WHERE id=123 hits a B-tree index, retrieves user data in microseconds, returns name/email/profile.',
    },
    interviewQuestions: [
      {
        question: 'What is ACID in databases?',
        difficulty: 'beginner',
        answer: 'Atomicity: All-or-nothing. Consistency: Valid state transitions. Isolation: Concurrent independence. Durability: Persists after crash.',
      },
      {
        question: 'Explain database indexing.',
        difficulty: 'intermediate',
        answer: 'Index: Data structure (B-tree, hash) enabling fast lookups. Without index: O(n) scan. With index: O(log n). Tradeoff: faster reads, slower writes.',
      },
      {
        question: 'What is database sharding and when do you use it?',
        difficulty: 'advanced',
        answer: 'Split data across multiple databases by key (user_id % num_shards). Enables horizontal scaling. Complexity: cross-shard queries, rebalancing.',
      },
    ],
    bottlenecks: [
      'Slow queries (missing indexes, bad joins)',
      'Lock contention under high concurrency',
      'Disk I/O bottleneck',
      'N+1 query problem',
    ],
    technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Cassandra', 'DynamoDB'],
    relatedConcepts: ['Caching', 'Performance Tuning', 'Distributed Systems'],
  },
  {
    id: '9-response-generation',
    name: 'Response Generation',
    description: 'Serializes data and formats response',
    latency: 10,
    icon: 'FileText',
    category: 'server',
    details: {
      whatHappens: 'Server takes queried data, applies business logic, serializes to JSON/XML, sets HTTP headers, and sends back to client.',
      whyItExists: 'Converts internal data structures into transportable format. Enables clients to understand and use the data.',
      realWorldExample: 'Database returns binary data. Server converts to JSON: {"id":1,"name":"Alice"} with Content-Type: application/json header.',
    },
    interviewQuestions: [
      {
        question: 'What is serialization and why is it needed?',
        difficulty: 'beginner',
        answer: 'Converting internal data structures to transportable format (JSON, XML, protobuf). Necessary for network transmission.',
      },
      {
        question: 'Compare JSON vs Protocol Buffers vs MessagePack.',
        difficulty: 'intermediate',
        answer: 'JSON: Text, human-readable, larger. Protobuf: Binary, smaller, faster. MessagePack: Similar to protobuf. Choose based on readability vs efficiency.',
      },
      {
        question: 'What HTTP status codes should you use?',
        difficulty: 'beginner',
        answer: '200: OK. 201: Created. 400: Bad Request. 401: Unauthorized. 403: Forbidden. 404: Not Found. 500: Internal Error.',
      },
    ],
    bottlenecks: [
      'Large response sizes',
      'Inefficient serialization',
      'Missing compression (gzip)',
    ],
    technologies: ['JSON', 'XML', 'Protocol Buffers', 'GraphQL'],
    relatedConcepts: ['APIs', 'HTTP', 'Data Formats'],
  },
  {
    id: '10-browser-render',
    name: 'Browser Rendering',
    description: 'Parses HTML, CSS, executes JS',
    latency: 200,
    icon: 'Monitor',
    category: 'browser',
    details: {
      whatHappens: 'Browser receives HTML response. Parses HTML (DOM tree), loads CSS (CSSOM), executes JavaScript, applies styles, layouts elements, paints pixels.',
      whyItExists: 'Converts HTML/CSS/JS into visual webpage. Rendering pipeline is optimized to be fast for smooth 60fps.',
      realWorldExample: 'HTML: <h1>Hello</h1>. Browser parses, creates DOM node, applies CSS color:blue, paints blue "Hello" on screen.',
    },
    interviewQuestions: [
      {
        question: 'Explain the browser rendering pipeline.',
        difficulty: 'intermediate',
        answer: 'Parse HTML → Build DOM. Parse CSS → Build CSSOM. Execute JavaScript. Combine → Render tree. Layout (reflow). Paint (repaint).',
      },
      {
        question: 'What causes layout thrashing and how do you fix it?',
        difficulty: 'advanced',
        answer: 'Repeatedly reading layout properties then modifying causes reflows. Fix: Batch reads then writes. Use DocumentFragment or requestAnimationFrame.',
      },
      {
        question: 'What is Critical Rendering Path?',
        difficulty: 'intermediate',
        answer: 'Sequence of steps browser takes to convert HTML/CSS/JS to pixels. Optimizing it improves First Contentful Paint (FCP).',
      },
    ],
    bottlenecks: [
      'Large JavaScript bundle (blocks parsing)',
      'Render-blocking CSS',
      'Forced reflows (layout thrashing)',
      'Large images not optimized',
    ],
    technologies: ['Webkit', 'Blink', 'SpiderMonkey', 'V8'],
    relatedConcepts: ['Web Performance', 'Frontend Optimization', 'HTTP/2 Push'],
  },
];

export const learnTopics = [
  {
    id: 'dns-deep-dive',
    title: 'DNS Deep Dive',
    description: 'Understanding Domain Name System',
    content: `DNS (Domain Name System) is the internet's directory service. When you type google.com, your browser asks a DNS resolver "what's the IP for google.com?" The resolver checks its cache, then queries a hierarchy of nameservers until it finds the answer.

Key concepts:
- Recursive queries: Client asks resolver to fully resolve
- Iterative queries: Each server returns next server to try
- TTL (Time To Live): How long to cache the record
- DNS records: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail)
- Authority: Each domain has authoritative nameservers

Why it matters:
- Without DNS, you'd memorize IP addresses
- DNS is highly distributed for reliability
- DNS is relatively slow (50-300ms) - good candidate for caching
- DNS security (DNSSEC) prevents spoofing`,
    relatedSteps: ['1-dns'],
    keyPoints: [
      'DNS translates domain names to IP addresses',
      'Three-level hierarchy: Root → TLD → Authoritative',
      'Caching at multiple levels (resolver, ISP, browser)',
      'DNSSEC provides authentication',
      'DoH/DoT encrypt DNS queries for privacy',
    ],
  },
  {
    id: 'tcp-ip-networking',
    title: 'TCP/IP Networking',
    description: 'The foundation of internet communication',
    content: `TCP/IP is the protocol suite underlying the internet. IP handles routing (getting packets to the right address), TCP handles reliability (ensuring packets arrive in order).

TCP 3-way handshake:
1. Client sends SYN (sequence number = x)
2. Server responds SYN-ACK (ack = x+1, sequence = y)
3. Client sends ACK (ack = y+1)

TCP vs UDP:
- TCP: Reliable, ordered, slower (web, email)
- UDP: Fast, unreliable (video, DNS, gaming)

TCP congestion control:
- Slow start: Gradually increase window size
- Congestion avoidance: Back off if loss detected
- Fast recovery: Quickly resume after loss

Why it matters:
- TCP is fundamental to web, email, SSH
- Packet loss causes retransmission (latency)
- High-latency networks (satellite) hurt TCP performance
- QUIC modernizes TCP with better congestion control`,
    relatedSteps: ['2-tcp-handshake'],
    keyPoints: [
      'TCP ensures reliable, ordered delivery',
      'Sequence numbers prevent duplicates and reordering',
      'Acknowledgments confirm receipt',
      'Sliding window optimizes throughput',
      'Congestion control prevents network collapse',
    ],
  },
  {
    id: 'https-security',
    title: 'HTTPS & Security',
    description: 'Encryption and authentication in transit',
    content: `HTTPS uses TLS (Transport Layer Security) to encrypt communication. Without it, eavesdroppers can read your data.

TLS handshake (simplified):
1. Client: "What ciphers do you support?"
2. Server: "I'll use AES-256-GCM, here's my certificate"
3. Client verifies certificate with trusted CA, generates shared secret encrypted with server's public key
4. Both compute session key, switch to encrypted communication

Certificates:
- Prove server identity via trusted Certificate Authority
- Contain domain name, public key, expiration date
- Prevent man-in-the-middle attacks
- Certificate pinning (mobile apps) adds extra security

Perfect Forward Secrecy (PFS):
- Session key depends on ephemeral (temporary) key
- Even if private key is compromised later, past sessions are safe
- All modern TLS uses PFS

Why it matters:
- HTTPS is now standard (Chrome warns on HTTP)
- TLS handshake adds latency (mitigated by session resumption, TLS 1.3)
- Certificate expiration breaks sites (Let's Encrypt automates renewal)
- mTLS (mutual TLS) authenticates both client and server`,
    relatedSteps: ['3-tls-handshake'],
    keyPoints: [
      'TLS encrypts data in transit',
      'Certificates prove server identity',
      'Handshake negotiates encryption keys',
      'Session resumption avoids full handshake',
      'TLS 1.3 is faster than 1.2',
    ],
  },
  {
    id: 'cdn-caching',
    title: 'CDN & Caching',
    description: 'Serving content from the edge',
    content: `CDNs (Content Delivery Networks) cache content worldwide. Instead of requests going to origin servers in California, they're served from edge servers in nearby cities.

How CDNs work:
- Origin server: Primary data source
- Edge servers: Geographically distributed caches
- DNS routes requests to nearest edge server
- If cache miss, edge server fetches from origin

Cache invalidation strategies:
1. TTL-based: Cache expires after N seconds (simplest)
2. Event-based: API call immediately invalidates cache
3. Versioning: URL contains version (app-v2.js vs app-v1.js)

HTTP caching headers:
- Cache-Control: max-age=3600 (cache for 1 hour)
- ETag: File hash enables cache validation
- Last-Modified: Update time for validation
- Surrogate-Key: Group related cache entries for bulk invalidation

Why it matters:
- Reduces latency (users get content from nearby servers)
- Reduces origin load (fewer requests to origin)
- Critical for video streaming (Netflix)
- Cost: CDN charges per GB transferred`,
    relatedSteps: ['4-cdn', '7-cache'],
    keyPoints: [
      'CDN reduces latency and origin load',
      'Edge servers cache popular content',
      'TTL controls cache duration',
      'Cache invalidation is complex',
      'Multiple caching layers (browser, ISP, CDN, origin)',
    ],
  },
  {
    id: 'load-balancing-scaling',
    title: 'Load Balancing & Scaling',
    description: 'Distributing traffic across servers',
    content: `Load balancers distribute traffic across multiple backend servers, enabling horizontal scalability.

Load balancing algorithms:
- Round-robin: Distribute evenly in order
- Least connections: Send to server with fewest active connections
- IP hash: Same client IP → same server (session affinity)
- Weighted: Send more to faster servers
- Random: Simple, works surprisingly well

High availability:
- Active-passive: One load balancer, one backup (failover on failure)
- Active-active: Multiple load balancers, traffic split
- Health checks: Detect and remove failed servers

Session persistence:
- Sticky sessions: Route client to same server (avoid session loss)
- Tradeoff: Reduces parallelization, uneven load
- Better: Use shared session store (Redis) instead

Why it matters:
- Enables horizontal scaling (add more servers)
- High availability (tolerate server failures)
- Improves throughput (more servers = more load)
- Single point of failure risk (mitigated with HA setup)`,
    relatedSteps: ['5-load-balancer'],
    keyPoints: [
      'Load balancers distribute traffic across servers',
      'Round-robin and least-connections are common',
      'Sticky sessions ensure session persistence',
      'Health checks detect failures',
      'Enable horizontal scaling and high availability',
    ],
  },
];
