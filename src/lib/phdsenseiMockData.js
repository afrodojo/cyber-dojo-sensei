// ───────────────────────────────────────────────────────────────────────────
// PhD Sensei — Mock Research Data
// TODO(ZOTERO): Replace LITERATURE below with a live fetch from the Zotero API.
// Planned integration:
//   1. Create a Zotero API key + library ID at https://www.zotero.org/settings/keys
//   2. Add a backend function `fetchZoteroLibrary` that calls:
//        GET https://api.zotero.org/users/<userID>/items?format=json&itemType=-attachment
//      with header `Zotero-API-Key: <secret>` (store via set_secrets → ZOTERO_API_KEY).
//   3. Map each Zotero item to the shape below (title, authors, year, venue, tags, takeaway).
//      "My Takeaway" will be authored manually in a local notes collection keyed by itemKey.
//   4. Cache results in a ResearchPaper entity or client-side SWR for offline-first reading.
// ───────────────────────────────────────────────────────────────────────────

export const LITERATURE = [
  {
    id: "carlini-wagner-2017",
    title: "Towards Evaluating the Robustness of Neural Networks",
    authors: "Nicholas Carlini, David Wagner",
    year: 2017,
    venue: "IEEE S&P",
    tags: ["Adversarial ML", "Evasion"],
    takeaway:
      "Introduced the C&W attack — optimization-based evasion that defeats defensive distillation and remains the benchmark for evaluating ML robustness.",
    url: "https://arxiv.org/abs/1608.04644",
  },
  {
    id: "goodfellow-fgsm-2015",
    title: "Explaining and Harnessing Adversarial Examples",
    authors: "Ian Goodfellow, Jonathon Shlens, Christian Szegedy",
    year: 2015,
    venue: "ICLR",
    tags: ["Adversarial ML", "Evasion", "FGSM"],
    takeaway:
      "FGSM: a single-step linear perturbation that reveals how deep nets are not robust to small input perturbations — foundational for adversarial training.",
    url: "https://arxiv.org/abs/1412.6572",
  },
  {
    id: "saxe-berlin-2015",
    title:
      "Deep Neural Network-Based Malware Detection Using Two-dimensional Binary Program Features",
    authors: "Joshua Saxe, Konstantin Berlin",
    year: 2015,
    venue: "ICMLA",
    tags: ["Malware Detection", "Data Science"],
    takeaway:
      "Static malware detection with deep learning on 2D image representations of binaries — paved the way for data-science-driven malware pipelines.",
    url: "https://arxiv.org/abs/1508.03096",
  },
  {
    id: "biggio-evasion-2013",
    title: "Evasion Attacks against Machine Learning at Test Time",
    authors: "Battista Biggio, Igino Corona, Davide Maiorca, et al.",
    year: 2013,
    venue: "ECML PKDD",
    tags: ["Adversarial ML", "Evasion"],
    takeaway:
      "First formalization of evasion attacks at test time against ML-based detectors — key reference for adversarial resilience in security classifiers.",
    url: "https://arxiv.org/abs/1708.06131",
  },
  {
    id: "badnets-2019",
    title:
      "BadNets: Identifying Vulnerabilities in the Deep Learning Model Supply Chain",
    authors: "Tianyu Gu, Kang Liu, et al.",
    year: 2019,
    venue: "arXiv",
    tags: ["Data Poisoning", "Backdoor"],
    takeaway:
      "Backdoor attacks survive supply-chain model transfer — data poisoning plants triggers invisible to standard validation, threatening defense pipelines.",
    url: "https://arxiv.org/abs/1708.06733",
  },
  {
    id: "usama-nids-2020",
    title:
      "Adversarial Robustness of Deep Learning Based Network Intrusion Detection Systems",
    authors: "Muhammad Usama, Ahmed A. S. Obaidat, et al.",
    year: 2020,
    venue: "ICC",
    tags: ["NIDS", "Adversarial ML", "Evasion"],
    takeaway:
      "Demonstrates that NIDS classifiers degrade sharply under adversarial evasion — motivates robust training for network anomaly detection.",
    url: "https://arxiv.org/abs/1911.08965",
  },
];

export const FEED_ITEMS = [
  {
    id: "feed-001",
    source: "arXiv cs.CR",
    title: "Adaptive Evasion Attacks Against Robust Network Intrusion Detectors",
    authors: "Chen, L., Patel, A.",
    summary:
      "Proposes adaptive adversarial attacks that bypass gradient-masking defenses in NIDS, exposing a 34% robustness overestimate in prior work.",
    publishedAt: "2026-06-28",
    tag: "Adversarial ML",
    url: "#",
  },
  {
    id: "feed-002",
    source: "MITRE ATLAS",
    title: "Case Study: ML Supply Chain Compromise via Poisoned Pretrained Weights",
    authors: "MITRE ATLAS Team",
    summary:
      "ATLAS case update documenting a real-world backdoor injected through a poisoned model registry — highlights model provenance risk.",
    publishedAt: "2026-06-25",
    tag: "Supply Chain",
    url: "#",
  },
  {
    id: "feed-003",
    source: "arXiv cs.CR",
    title: "Data Poisoning Defenses for Federated Malware Classifiers",
    authors: "Okon, T., Reyes, M.",
    summary:
      "Introduces a robust aggregation rule that limits a malicious client's influence to under 3% accuracy loss under 20% Byzantine participation.",
    publishedAt: "2026-06-22",
    tag: "Data Poisoning",
    url: "#",
  },
  {
    id: "feed-004",
    source: "MITRE ATLAS",
    title: "Technique Update: TAML-T0048 — Reconnaissance for ML Models",
    authors: "MITRE ATLAS Team",
    summary:
      "New technique cataloguing passive model fingerprinting from inference endpoints, enabling targeted downstream evasion.",
    publishedAt: "2026-06-19",
    tag: "Reconnaissance",
    url: "#",
  },
  {
    id: "feed-005",
    source: "arXiv cs.CR",
    title: "Interpretable Anomaly Scoring for Encrypted Traffic via Self-Supervision",
    authors: "Vasquez, R., Liang, Y.",
    summary:
      "Self-supervised representation learning over encrypted flows produces calibrated anomaly scores without decryption, beating prior baselines by 8% F1.",
    publishedAt: "2026-06-17",
    tag: "NIDS",
    url: "#",
  },
];

export const INSIGHTS = [
  {
    id: "insight-1",
    title: "Gradient masking inflates perceived robustness",
    summary:
      "Many NIDS defenses report high accuracy under attack due to obfuscated gradients, not true robustness. Always re-evaluate with adaptive attacks.",
    metric: "−34%",
    metricLabel: "accuracy drop under adaptive attack",
    accent: "amber",
  },
  {
    id: "insight-2",
    title: "Provenance is the first line of defense",
    summary:
      "Poisoned pretrained weights evade validation. Pin model hashes and audit the supply chain before any downstream fine-tuning.",
    metric: "1 in 6",
    metricLabel: "public checkpoints backdoor-susceptible",
    accent: "rose",
  },
  {
    id: "insight-3",
    title: "Flow features beat raw packets for anomaly detection",
    summary:
      "Aggregated (src, dst, proto, bytes, IAT) features train faster and generalize better than raw packet bytes on encrypted traffic.",
    metric: "+8% F1",
    metricLabel: "over byte-level baseline",
    accent: "emerald",
  },
  {
    id: "insight-4",
    title: "Calibrate before trusting anomaly scores",
    summary:
      "Self-supervised scores are often uncalibrated; temperature scaling + isotonic regression make SOC alerting actionable.",
    metric: "0.91",
    metricLabel: "post-calibration Brier score",
    accent: "cyan",
  },
];

export const SANDBOX_POSTS = [
  {
    id: "poc-001",
    title: "Extracting Network Flow Features from PCAPs for Anomaly Detection",
    date: "2026-06-27",
    author: "PhD Sensei",
    tags: ["NIDS", "Feature Engineering"],
    excerpt:
      "A first pass at pulling flow-level features from raw packet captures to feed an anomaly detector — the foundation for every downstream PoC in this sandbox.",
    content: `## Motivation

Before training any network anomaly detector, we need a clean feature representation of traffic. Raw PCAPs are too granular, so we aggregate packets into **flows** keyed by the (src, dst, protocol) tuple. This collapses millions of packets into a few thousand learnable events.

## Approach

We use \`dpkt\` to parse the capture and group packets by flow. For now we count packets per flow; byte counts and inter-arrival statistics come next.

\`\`\`python
import dpkt
import socket
from collections import Counter

def extract_flow_features(pcap_path):
    """Extract basic flow features from a PCAP for NIDS anomaly detection."""
    flows = Counter()
    with open(pcap_path, "rb") as f:
        for ts, buf in dpkt.pcap.Reader(f):
            try:
                eth = dpkt.ethernet.Ethernet(buf)
                if not isinstance(eth.data, dpkt.ip.IP):
                    continue
                ip = eth.data
                src = socket.inet_ntoa(ip.src)
                dst = socket.inet_ntoa(ip.dst)
                key = (src, dst, ip.p)
                flows[key] += 1
            except Exception:
                continue
    return flows.most_common(10)

top_flows = extract_flow_features("capture.pcap")
for (src, dst, proto), count in top_flows:
    print(f"{src} -> {dst} (proto {proto}): {count} pkts")
\`\`\`

## Next Steps

- Extend to **bidirectional** flow aggregation (merge A→B and B→A).
- Add byte counts, packet-size histograms, and inter-arrival statistics.
- Benchmark against the CICIDS-2017 baseline before adding any adversarial perturbation.`,
  },
];