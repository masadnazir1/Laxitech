export type TokenKind =
  | 'keyword'
  | 'type'
  | 'func'
  | 'prop'
  | 'string'
  | 'number'
  | 'comment'
  | 'punct'
  | 'ident';

export interface CodeToken {
  text: string;
  kind: TokenKind;
}

export interface StudioSnippet {
  file: string;
  languageLabel: string;
  dotColor: string;
  lines: CodeToken[][];
  lineNotes: string[];
}

const k = (text: string): CodeToken => ({ text, kind: 'keyword' });
const t = (text: string): CodeToken => ({ text, kind: 'type' });
const f = (text: string): CodeToken => ({ text, kind: 'func' });
const pr = (text: string): CodeToken => ({ text, kind: 'prop' });
const s = (text: string): CodeToken => ({ text, kind: 'string' });
const n = (text: string): CodeToken => ({ text, kind: 'number' });
const c = (text: string): CodeToken => ({ text, kind: 'comment' });
const p = (text: string): CodeToken => ({ text, kind: 'punct' });
const id = (text: string): CodeToken => ({ text, kind: 'ident' });

export const STUDIO_BIO_SNIPPETS: StudioSnippet[] = [
  {
    file: 'laxitech.cloud.ts',
    languageLabel: 'TS',
    dotColor: '#38BDF8',
    lines: [
      [c('// Laxitech Technologies Inc. — Enterprise Custom Software & Multi-Cloud')],
      [k('export const '), f('LaxitechCore'), p(' = {')],
      [
        p('  '),
        pr('headquarters'),
        p(': '),
        s("'Silicon Valley, CA • Pakistan Data Center'"),
        p(', '),
        pr('standards'),
        p(': '),
        s("'ISO 27001 & SOC 2'"),
        p(','),
      ],
      [
        p('  '),
        pr('services'),
        p(': ['),
        s("'Custom Software'"),
        p(', '),
        s("'Multi-Cloud Architecture'"),
        p(', '),
        s("'Zero-Trust'"),
        p('],'),
      ],
      [
        p('  '),
        pr('products'),
        p(': '),
        s("'Pakistan Hosted VPS (<5ms) + GXMail Domain Engine'"),
        p(','),
      ],
      [
        p('  '),
        pr('devOps'),
        p(': '),
        s("'Automated CI/CD, Terraform GitOps & Chaos Testing'"),
        p(','),
      ],
      [
        p('  '),
        pr('sla'),
        p(': { '),
        pr('uptime'),
        p(': '),
        s("'99.99%'"),
        p(', '),
        pr('projectsShipped'),
        p(': '),
        n('150'),
        p(', '),
        pr('support'),
        p(': '),
        s("'24/7'"),
        p(' },'),
      ],
      [p('} '), k('as const'), p(';')],
    ],
    lineNotes: [
      'Laxitech enterprise cloud and custom software engineering architecture header.',
      'Typed production platform configuration exported for mission-critical deployments.',
      'Silicon Valley headquarters paired with domestic high-speed Pakistan data center.',
      'Full-stack software engineering, AWS/Azure/GCP migration, and DevSecOps.',
      'In-country NVMe VPS hosting with low local latency and secure business email.',
      'Automated GitOps pipelines, blue/green deployments, and chaos test suites.',
      'Enterprise 99.99% SLA uptime target across over 150 delivered systems.',
      'Immutable compile-time specification guaranteeing zero infrastructure debt.',
    ],
  },
  {
    file: 'multi-cloud.mesh.ts',
    languageLabel: 'TS',
    dotColor: '#8B5CF6',
    lines: [
      [c('// Multi-Cloud Orchestration & Automated Zero-Downtime Failover')],
      [
        k('import '),
        p('{ '),
        t('KubernetesCluster'),
        p(', '),
        t('TerraformState'),
        p(' } '),
        k('from '),
        s("'@laxitech/cloud-mesh'"),
        p(';'),
      ],
      [
        k('export async function '),
        f('routeTraffic'),
        p('('),
        id('region'),
        p(': '),
        t('ClusterRegion'),
        p(') {'),
      ],
      [
        p('  '),
        k('const '),
        id('mesh '),
        p('= '),
        k('await '),
        t('TerraformState'),
        p('.'),
        f('syncTopology'),
        p('('),
        id('region'),
        p(', { '),
        pr('latencyMs'),
        p(': '),
        n('5'),
        p(' });'),
      ],
      [p('  '), k('if '), p('('), id('mesh'), p('.'), pr('healthScore'), p(' >= '), n('0.99'), p(') {')],
      [
        p('    '),
        k('return '),
        t('KubernetesCluster'),
        p('.'),
        f('dispatchHighThroughput'),
        p('('),
        id('region'),
        p(', '),
        id('mesh'),
        p('.'),
        pr('nodes'),
        p(');'),
      ],
      [p('  }')],
      [p('  '), k('return '), id('mesh'), p('.'), f('triggerZeroDowntimeFailover'), p('();')],
      [p('}')],
    ],
    lineNotes: [
      'Automated multi-cloud failover orchestration module across AWS, GCP, and Azure.',
      'Imports Laxitech Kubernetes cluster controllers and Terraform state sync.',
      'Dynamically routes enterprise traffic according to real-time regional latencies.',
      'Sub-5ms response thresholds maintained across all provisioned nodes.',
      'Validates cluster health before routing high-throughput production requests.',
      'Dispatches workloads smoothly across containerized microservices.',
      'Closes optimal routing branch.',
      'Triggers instant zero-downtime failover if any regional anomaly is detected.',
      'End of multi-cloud routing controller.',
    ],
  },
  {
    file: 'vps.pakistan.ts',
    languageLabel: 'TS',
    dotColor: '#0066FF',
    lines: [
      [c('// Pakistan Hosted VPS — NVMe SSD Storage & Domestic Data Sovereignty')],
      [k('export const '), f('configurePakistanVPS'), p(' = () => ({')],
      [
        p('  '),
        pr('datacenter'),
        p(': '),
        s("'Islamabad / Lahore In-Country Tier III Facility'"),
        p(','),
      ],
      [
        p('  '),
        pr('specs'),
        p(': { '),
        pr('vcpu'),
        p(': '),
        s("'1-4 Cores'"),
        p(', '),
        pr('ram'),
        p(': '),
        s("'2-8 GB'"),
        p(', '),
        pr('storage'),
        p(': '),
        s("'Enterprise NVMe Gen4'"),
        p(' },'),
      ],
      [
        p('  '),
        pr('latency'),
        p(': '),
        s("'<5ms Local Ping • 99.9% Network Uptime SLA'"),
        p(','),
      ],
      [
        p('  '),
        pr('billing'),
        p(': '),
        s("'Billed in PKR directly with zero foreign exchange fees'"),
        p(','),
      ],
      [p('});')],
    ],
    lineNotes: [
      'Pakistan local high-performance VPS cloud architecture on enterprise NVMe.',
      'Exports deterministic server configuration for domestic and regional workloads.',
      'Physical bare metal hosting in Pakistan ensuring complete data sovereignty.',
      'Scalable vCPU, RAM, and ultra-fast NVMe storage tiers from Rs 999/month.',
      'Guaranteed sub-5ms local roundtrip ping and 99.9% network reliability.',
      'Seamless local currency billing and 24/7 in-country technical support.',
      'End of Pakistan VPS cloud specification.',
    ],
  },
  {
    file: 'gxmail.security.ts',
    languageLabel: 'TS',
    dotColor: '#2DD4BF',
    lines: [
      [c('// GXMail Engine — SPF, DKIM, DMARC & TLS Authenticated Business Mail')],
      [
        k('export async function '),
        f('provisionDomainMail'),
        p('('),
        id('domain'),
        p(': '),
        t('string'),
        p(') {'),
      ],
      [
        p('  '),
        k('const '),
        id('keys '),
        p('= '),
        k('await '),
        t('GXMailDNS'),
        p('.'),
        f('generateAuthRecords'),
        p('('),
        id('domain'),
        p(', { '),
        pr('rsaBits'),
        p(': '),
        n('2048'),
        p(' });'),
      ],
      [
        p('  '),
        k('return '),
        f('activateMailboxCluster'),
        p('({'),
      ],
      [
        p('    '),
        pr('auth'),
        p(': ['),
        s("'SPF=Pass'"),
        p(', '),
        s("'DKIM=2048-bit'"),
        p(', '),
        s("'DMARC=Reject'"),
        p('],'),
      ],
      [
        p('    '),
        pr('storage'),
        p(': '),
        s("'Encrypted NVMe with Real-Time Spam & Phishing Filters'"),
        p(','),
      ],
      [
        p('    '),
        pr('uptime'),
        p(': '),
        s("'99.9% SLA with TLS Encrypted SMTP/IMAP Protocols'"),
        p(','),
      ],
      [p('  });')],
      [p('}')],
    ],
    lineNotes: [
      'Secure enterprise business email hosting for custom domains (@yourcompany.com).',
      'Provisions cryptographic keys and validates domain ownership automatically.',
      'Generates 2048-bit RSA authentication keys for high inbox deliverability.',
      'Activates dedicated mailboxes with full SPF, DKIM, and DMARC enforcement.',
      'Prevents spoofing and phishing while keeping inbox delivery rates at 100%.',
      'Encrypted NVMe email storage with automated anti-malware scanning.',
      'TLS 1.3 protocol encryption for all incoming and outgoing mail traffic.',
      'Closes mailbox provisioning pipeline.',
      'End of GXMail domain email setup module.',
    ],
  },
  {
    file: 'zero-trust.deploy.ts',
    languageLabel: 'TS',
    dotColor: '#34D399',
    lines: [
      [c('// Zero-Trust Security, ISO 27001 Certification & DevSecOps Pipelines')],
      [k('export const '), f('verifyEnterpriseCompliance'), p(' = () => ({')],
      [
        p('  '),
        pr('standards'),
        p(': ['),
        s("'ISO 27001 Certified'"),
        p(', '),
        s("'SOC 2 Type II Compliant'"),
        p('],'),
      ],
      [
        p('  '),
        pr('networkSecurity'),
        p(': '),
        s("'Zero-Trust Perimeter, mTLS & Automated Chaos Drills'"),
        p(','),
      ],
      [
        p('  '),
        pr('monitoring'),
        p(': '),
        s("'24/7/365 Real-Time Observability & Instant Alerting'"),
        p(','),
      ],
      [p('});')],
    ],
    lineNotes: [
      'Comprehensive security hardening, compliance, and enterprise audit baseline.',
      'Validates organizational and infrastructure security posture.',
      'Full ISO 27001 and SOC 2 compliance verification across active nodes.',
      'Zero-trust network architecture preventing lateral intrusion and unauthorized access.',
      'Round-the-clock metric telemetry and sub-second automated incident alerting.',
      'End of enterprise compliance and security manifest.',
    ],
  },
];

export function getTotalCharCount(lines: CodeToken[][]): number {
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    for (const tok of lines[i]) {
      count += tok.text.length;
    }
    if (i < lines.length - 1) {
      count += 1;
    }
  }
  return count;
}

export function slicePreTokenizedLines(
  lines: CodeToken[][],
  charLimit: number
): CodeToken[][] {
  if (charLimit <= 0) return [[]];
  const result: CodeToken[][] = [];
  let remaining = charLimit;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const currentLine: CodeToken[] = [];
    const sourceLine = lines[lineIdx];

    for (let tokIdx = 0; tokIdx < sourceLine.length; tokIdx++) {
      if (remaining <= 0) break;
      const tok = sourceLine[tokIdx];
      if (remaining >= tok.text.length) {
        currentLine.push(tok);
        remaining -= tok.text.length;
      } else {
        currentLine.push({
          text: tok.text.slice(0, remaining),
          kind: tok.kind,
        });
        remaining = 0;
      }
    }

    result.push(currentLine);

    if (remaining <= 0) {
      break;
    }
    remaining -= 1;
    if (remaining <= 0 && lineIdx < lines.length - 1) {
      result.push([]);
      break;
    }
  }

  return result.length ? result : [[]];
}
