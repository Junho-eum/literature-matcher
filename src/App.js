import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "./supabase";

// ── Theme ─────────────────────────────────────────────────────────────────────
const T = {
  pageBg: "#f0f4f8",
  cardBg: "#ffffff",
  cardBorder: "#dde3ed",
  subtleBg: "#f7fafc",
  inputBg: "#f7fafc",
  inputBorder: "#cbd5e0",
  textDark: "#1a202c",
  textBody: "#2d3748",
  textMuted: "#718096",
  textFaint: "#a0aec0",
  accent: "#2b6cb0",
  accentLight: "#ebf4ff",
  accentBorder: "#bee3f8",
  green: "#276749",
  greenLight: "#f0fff4",
  greenBorder: "#9ae6b4",
  amber: "#744210",
  amberLight: "#fffbeb",
  amberBorder: "#fbd38d",
  red: "#c53030",
  redLight: "#fff5f5",
  redBorder: "#feb2b2",
  headerBg: "#ffffff",
  headerBorder: "#e2e8f0",
  shadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
};

const SC = (s) =>
  s >= 8 ? "#276749" : s >= 6 ? "#2b6cb0" : s >= 4 ? "#b7791f" : "#c53030";
const SBg = (s) =>
  s >= 8 ? "#f0fff4" : s >= 6 ? "#ebf4ff" : s >= 4 ? "#fffbeb" : "#fff5f5";
const SBo = (s) =>
  s >= 8 ? "#9ae6b4" : s >= 6 ? "#90cdf4" : s >= 4 ? "#fbd38d" : "#feb2b2";
const SL = (s) =>
  s >= 8 ? "Strong" : s >= 6 ? "Good" : s >= 4 ? "Partial" : "Weak";

// ── Papers ────────────────────────────────────────────────────────────────────
const PAPERS = [
  {
    id: 0,
    title: "Trusted Digital Identities for Mobile Devices",
    year: "2020",
    authors: ["P. Carnley", "P. Rowland", "D. Bishop"],
    url: "https://ieeexplore.ieee.org/document/9251128/",
    citationKey: "carnleyTrustedDigitalIdentities2020",
    abstract:
      "A framework that updates PKI to accommodate digital identities on smartphones, tablets, or smartwatches. Addresses two-factor authentication for mobile devices and IoT.",
  },
  {
    id: 1,
    title: "Towards a Mobile-First Cross-Border eID Framework",
    year: "2023",
    authors: ["R. Czerny", "C. Kollmann", "B. Podgorelec"],
    url: "https://dl.acm.org/doi/10.1145/3598469.3598562",
    citationKey: "czernyMobileFirstCrossBorderEID2023",
    abstract:
      "Discusses concepts for transitioning eIDAS browser-based authentication flows to native mobile app-to-app communication while maintaining compatibility with existing infrastructure.",
  },
  {
    id: 2,
    title:
      "Towards the Design of a Privacy-preserving Attribute Based Credentials-based Digital ID in Denmark",
    year: "2021",
    authors: ["M. Andersen"],
    url: "https://dl.acm.org/doi/10.1145/3465481.3469211",
    citationKey: "andersenDesignPrivacypreservingAttribute2021",
    abstract:
      "Explores why pABCs have not been adopted in real-life identity solutions. Presents 8 design recommendations based on interviews with service providers and users.",
  },
  {
    id: 3,
    title:
      "The Introduction of Digital Identity Evolution and the Industry of Decentralized Identity",
    year: "2021",
    authors: ["Y. Jing", "J. Li", "Y. Wang"],
    url: "",
    citationKey: "jingIntroductionDigitalIdentity2021",
    abstract:
      "Illustrates three discrete paths in the evolution of digital identity and key technical elements in decentralized identity.",
  },
  {
    id: 4,
    title:
      "Overcoming the UX Challenges Faced by FIDO Credentials in the Consumer Space",
    year: "2023",
    authors: ["A. Moallem", "F. Corella"],
    url: "https://link.springer.com/10.1007/978-3-031-35822-7_30",
    citationKey: "corellaOvercomingUXChallenges2023",
    abstract:
      "Proposes two alternative UX approaches to overcome FIDO credential challenges.",
  },
  {
    id: 5,
    title:
      "Lose Your Phone Lose Your Identity: Exploring Users Perceptions and Expectations of a Digital Identity Service",
    year: "2021",
    authors: ["M. Lutaaya", "H. Assal", "K. Baig"],
    url: "",
    citationKey: "lutaayaLoseYourPhone2021",
    abstract:
      "User study with 22 participants in Canada exploring perceptions of digital identity services. Participants valued convenience but expressed concerns about privacy risks.",
  },
  {
    id: 6,
    title: "From Self-Sovereign Identity to Fiduciary Identity",
    year: "2024",
    authors: ["F. Schardong", "R. Custodio"],
    url: "https://dl.acm.org/doi/10.1145/3605098.3636061",
    citationKey: "schardongSelfSovereignIdentityFiduciary2024",
    abstract:
      "Introduces the Fiduciary Identity model to address SSI usability limitations.",
  },
  {
    id: 7,
    title:
      "Who is the Better Operator of an Identity Wallet Prioritised by the User?",
    year: "2024",
    authors: ["S. Kostic"],
    url: "https://dl.acm.org/doi/10.1145/3613905.3647961",
    citationKey: "kosticWhoBetterOperator2024",
    abstract:
      "Quantitative survey with 306 people ranking preferred identity wallet operators.",
  },
  {
    id: 8,
    title: "What is a Digital Identity Wallet? A Systematic Literature Review",
    year: "2022",
    authors: ["B. Podgorelec", "L. Alber", "T. Zefferer"],
    url: "https://ieeexplore.ieee.org/document/9842532/",
    citationKey: "podgorelecWhatDigitalIdentity2022",
    abstract:
      "Systematic review finding no generally accepted definitions of digital identity wallet concepts.",
  },
  {
    id: 9,
    title:
      "An Empirical Study of a Decentralized Identity Wallet: Usability, Security, and Perspectives on User Control",
    year: "2022",
    authors: ["M. Korir", "S. Parkin", "P. Dunphy"],
    url: "",
    citationKey: "korirEmpiricalStudyDecentralized2022",
    abstract:
      "User study with 30 participants using a prototype decentralized identity wallet app.",
  },
  {
    id: 10,
    title:
      "Comparative Analysis of Popular Electronic Wallets in Indonesia in Daily Life Selection",
    year: "2022",
    authors: ["T. Firdaus", "M. Lubis"],
    url: "https://dl.acm.org/doi/10.1145/3568834.3568865",
    citationKey: "firdausComparativeAnalysisPopular2022",
    abstract:
      "Analyzes three Indonesian e-wallets (Dana, OVO, DOKU) using quantitative methods with 1500 respondents.",
  },
  {
    id: 11,
    title:
      "Control is Nothing Without Trust: A First Look into Digital Identity Wallet Trends",
    year: "2023",
    authors: ["Z. Ansaroudi", "R. Carbone", "G. Sciarretta"],
    url: "",
    citationKey: "ansaroudiControlNothingTrust2023",
    abstract:
      "Systematic analysis of digital identity wallets. Proposes classification along two dimensions: trust establishment and controlled credential sharing.",
  },
  {
    id: 12,
    title:
      "Designing and Evaluating a Resident-Centric Digital Wallet Experience",
    year: "2023",
    authors: ["S. Chuhan", "V. Wojnas"],
    url: "",
    citationKey: "chuhanDesigningEvaluatingResidentCentric2023",
    abstract:
      "Usability testing of an SSI wallet prototype with 47 Ontario residents.",
  },
  {
    id: 13,
    title:
      "Developing Digital Wallet Services in Indonesia: A Multigeneration Perspective",
    year: "2020",
    authors: ["Arindy", "A. Suzianti"],
    url: "https://dl.acm.org/doi/10.1145/3429789.3429811",
    citationKey: "arindyDevelopingDigitalWallet2020",
    abstract:
      "Identifies influencing factors on digital wallet adoption across generations.",
  },
  {
    id: 14,
    title:
      "Do Users Want To Use Digital Identities? A Study Of A Concept Of An Identity Wallet",
    year: "2022",
    authors: ["S. Kostic", "M. Poikela"],
    url: "",
    citationKey: "kosticUsersWantUse2022",
    abstract:
      "Tests an identity wallet concept with 16 participants. Wallet operator has strong influence on trust.",
  },
  {
    id: 15,
    title:
      "Examining the Antecedents of Customer Adoption and Intention to Use Mobile Wallet",
    year: "2020",
    authors: ["M. Leong", "J. Kwan", "M. Lai"],
    url: "https://dl.acm.org/doi/10.1145/3377571.3377613",
    citationKey: "leongExaminingAntecedentsCustomer2020",
    abstract: "Examines mobile wallet adoption in Malaysia.",
  },
  {
    id: 16,
    title:
      "Impulse Buyings Antecedents and Consequences: Malaysian E-wallet Users Perceptions",
    year: "2021",
    authors: ["Y. Yong Lee", "C. Lay Gan", "T. Wei Liew"],
    url: "https://dl.acm.org/doi/10.1145/3507485.3507493",
    citationKey: "yongleeImpulseBuyingsAntecedents2021",
    abstract:
      "Applies S-O-R model to examine E-wallet usage and impulse buying.",
  },
  {
    id: 17,
    title:
      "Research on User Experience for Digital Identity Wallets: State-of-the-Art and Recommendations",
    year: "2023",
    authors: ["R. Sellung", "M. Kubach"],
    url: "",
    citationKey: "sellungResearchUserExperience2023",
    abstract: "First overview of UX research on digital identity wallets.",
  },
  {
    id: 18,
    title:
      "The role of Mobile Skillfulness and User Innovation toward Electronic Wallet Acceptance",
    year: "2020",
    authors: ["B. Khoa"],
    url: "https://ieeexplore.ieee.org/document/9264967/",
    citationKey: "khoaRoleMobileSkillfulness2020",
    abstract:
      "Enriches TAM to explore mobile skillfulness and user innovation in e-wallet acceptance.",
  },
  {
    id: 19,
    title:
      "Uncovering Impact of Mental Models towards Adoption of Multi-device Crypto-Wallets",
    year: "2023",
    authors: ["E. Mangipudi", "U. Desai", "M. Minaei"],
    url: "https://dl.acm.org/doi/10.1145/3576915.3623218",
    citationKey: "mangipudiUncoveringImpactMental2023",
    abstract:
      "Survey of 357 crypto-wallet users. Reveals gap between mental models and actual security guarantees.",
  },
  {
    id: 20,
    title: "Usability Evaluation of SSI Digital Wallets",
    year: "2023",
    authors: ["A. Satybaldy"],
    url: "",
    citationKey: "satybaldyUsabilityEvaluationSSI2023",
    abstract: "Evaluates usability of SSI wallets using cognitive walkthrough.",
  },
  {
    id: 21,
    title:
      "User Experience Aspect Assessment Method for Digital Wallet Mobile Application in Indonesia",
    year: "2021",
    authors: ["I. Dwijayanti", "P. Santoso", "B. Hantono"],
    url: "https://ieeexplore.ieee.org/document/9611828/",
    citationKey: "dwijayantiUserExperienceAspect2021",
    abstract:
      "Reviews 19 studies from 2016-2020 on UX assessment methods for digital wallet apps in Indonesia.",
  },
  {
    id: 22,
    title:
      "A more User-Friendly Digital Wallet? User Scenarios of a Future Wallet",
    year: "2023",
    authors: ["A. Krauss", "S. Kostic", "R. Sellung"],
    url: "",
    citationKey: "kraussMoreUserFriendlyDigital2023",
    abstract:
      "Presents an enhanced wallet concept with user-centric scenarios.",
  },
  {
    id: 23,
    title:
      "A Comparison on the Usability of Mobile e-Wallet Applications: GCash, Maya, Grabpay",
    year: "2023",
    authors: ["M. Gumasing", "G. Cangco", "S. Ilagan"],
    url: "https://dl.acm.org/doi/10.1145/3588243.3588253",
    citationKey: "gumasingComparisonUsabilityMobile2023",
    abstract: "SUS-based usability comparison of three Philippine e-wallets.",
  },
  {
    id: 24,
    title:
      "A large-scale study of performance and equity of commercial remote identity verification technologies across demographics",
    year: "2024",
    authors: ["K. Fatima", "M. Schuckers", "G. Cruz-Ortiz"],
    url: "",
    citationKey: "fatimaLargescaleStudyPerformance2024",
    abstract: "Assesses 5 commercial RIdV solutions across 3,991 subjects.",
  },
  {
    id: 25,
    title:
      "Its Just a Lot of Prerequisites: A User Perception and Usability Analysis of the German ID Card as a FIDO2 Authenticator",
    year: "2022",
    authors: ["M. Keil", "P. Markert", "M. Durmuth"],
    url: "https://dl.acm.org/doi/10.1145/3549015.3554208",
    citationKey: "keilItsJustLot2022",
    abstract:
      "Study with 20 participants on using German ID card as FIDO2 second factor.",
  },
  {
    id: 26,
    title:
      "Privacy requirements specification for digital identity management systems implementation",
    year: "2011",
    authors: ["G. Ben Ayed", "S. Ghernaouti-Helie"],
    url: "https://ieeexplore.ieee.org/document/6148406/",
    citationKey: "benayedPrivacyRequirementsSpecification2011",
    abstract: "Argues privacy must be considered from project start.",
  },
  {
    id: 27,
    title: "Demographic-Reliant Algorithmic Fairness",
    year: "2022",
    authors: ["M. Andrus", "S. Villeneuve"],
    url: "https://dl.acm.org/doi/10.1145/3531146.3533226",
    citationKey: "andrusDemographicReliantAlgorithmicFairness2022",
    abstract:
      "Challenges algorithmic fairness through more demographic data collection.",
  },
  {
    id: 28,
    title:
      "Self-sovereign Identity: Opportunities and Challenges for the Digital Revolution",
    year: "2017",
    authors: ["U. Der", "S. Jahnichen", "J. Surmeli"],
    url: "http://arxiv.org/abs/1712.01767",
    citationKey: "derSelfsovereignIdentity2017",
    abstract: "Introduces SSI as an alternative to central identity providers.",
  },
  {
    id: 29,
    title:
      "Self-Sovereign Identity and User Control for Privacy-Preserving Contact Tracing",
    year: "2022",
    authors: ["W. Song", "R. Nokhbeh Zaeem", "D. Liau"],
    url: "https://dl.acm.org/doi/10.1145/3486622.3493914",
    citationKey: "songSelfSovereignIdentityUser2022",
    abstract: "Builds on SSI for privacy-preserving contact tracing.",
  },
  {
    id: 30,
    title: "Multi-Generation Perception Towards Digital Wallet in Indonesia",
    year: "2020",
    authors: ["Arindy", "A. Suzianti"],
    url: "https://dl.acm.org/doi/10.1145/3400934.3400940",
    citationKey: "arindyMultiGenerationPerceptionDigital2020",
    abstract:
      "Multi-generational study on digital wallet adoption with 205 respondents.",
  },
  {
    id: 31,
    title: "Public Acceptance of Advanced Identity Documents",
    year: "2018",
    authors: ["T. Kalvet", "M. Tiits", "K. Laas-Mikko"],
    url: "https://dl.acm.org/doi/10.1145/3209415.3209456",
    citationKey: "kalvetPublicAcceptanceAdvanced2018",
    abstract:
      "Exploratory study across 9 countries on improving identity document security.",
  },
  {
    id: 32,
    title:
      "A Survey on Blockchain-based Identity Management and Decentralized Privacy for Personal Data",
    year: "2020",
    authors: ["K. Gilani", "E. Bertin", "J. Hatin"],
    url: "https://ieeexplore.ieee.org/document/9223312/",
    citationKey: "gilaniSurveyBlockchainbasedIdentity2020",
    abstract:
      "Coherent view of SSI central concepts including identity proofing and authentication solutions.",
  },
  {
    id: 33,
    title:
      "Privacy Decision-making and the Effects of Privacy Choice Architecture",
    year: "2024",
    authors: ["C. Sprigman", "S. Tontrup"],
    url: "https://papers.ssrn.com/abstract=4359681",
    citationKey: "sprigmanPrivacyDecisionmakingEffects2024",
    abstract:
      "Argues the notice and choice privacy framework fails to empower individuals.",
  },
  {
    id: 34,
    title: "Usability Evaluation of SSI Digital Wallets (Extended Version)",
    year: "2023",
    authors: ["A. Satybaldy", "F. Bieker", "J. Meyer"],
    url: "",
    citationKey: "satybaldyUsabilityEvaluationSSI2023b",
    abstract: "Extended cognitive walkthrough of SSI wallets.",
  },
  {
    id: 35,
    title:
      "On the Acceptance of Privacy-Preserving Authentication Technology: The Curious Case of National Identity Cards",
    year: "2013",
    authors: ["M. Harbach", "S. Fahl", "M. Rieger"],
    url: "",
    citationKey: "harbachAcceptancePrivacyPreserving2013",
    abstract:
      "Focus groups and interviews examining adoption of the German national eID card.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const lsGet = (k, fb = "") => {
  try {
    return localStorage.getItem(k) ?? fb;
  } catch {
    return fb;
  }
};
const lsSet = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

const readBase64 = (f) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(f);
  });

const guessMatch = (fname) => {
  const n = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const fn = n(fname);
  let best = null,
    top = 0;
  for (const p of PAPERS) {
    const words = p.title.split(" ").filter((w) => w.length > 4);
    const hits = words.filter((w) => fn.includes(n(w))).length;
    const score = hits / Math.max(words.length, 1);
    if (score > top) {
      top = score;
      best = p;
    }
  }
  return top > 0.25 ? best : null;
};

// ── Supabase helpers ──────────────────────────────────────────────────────────
async function fetchExtractedKeys() {
  const { data, error } = await supabase.from("papers").select("citation_key");
  if (error) {
    console.error(error);
    return new Set();
  }
  return new Set((data || []).map((r) => r.citation_key));
}

async function fetchAllFindings() {
  const { data, error } = await supabase.from("papers").select("*");
  if (error) {
    console.error(error);
    return [];
  }
  return data || [];
}

async function saveFindings(paper, findings, source = "abstract") {
  const { error } = await supabase.from("papers").upsert(
    {
      citation_key: paper.citationKey,
      title: paper.title,
      authors: paper.authors,
      year: paper.year,
      url: paper.url,
      findings: findings,
      source: source, // ← add this
      extracted_at: new Date().toISOString(),
    },
    { onConflict: "citation_key" },
  );
  if (error) throw error;
}

async function deleteFindings(citationKey) {
  const { error } = await supabase
    .from("papers")
    .delete()
    .eq("citation_key", citationKey);
  if (error) throw error;
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const card = (x = {}) => ({
  background: T.cardBg,
  border: `1px solid ${T.cardBorder}`,
  borderRadius: 10,
  padding: "14px 18px",
  boxShadow: T.shadow,
  ...x,
});
const lbl = (x = {}) => ({
  color: T.textMuted,
  fontSize: 11,
  letterSpacing: "0.06em",
  fontWeight: 600,
  textTransform: "uppercase",
  marginBottom: 6,
  display: "block",
  ...x,
});
const bdg = (c, bg, bo, x = {}) => ({
  background: bg,
  color: c,
  border: `1px solid ${bo}`,
  fontSize: 10,
  padding: "2px 7px",
  borderRadius: 4,
  fontWeight: 600,
  flexShrink: 0,
  ...x,
});

// ── Component ─────────────────────────────────────────────────────────────────
export default function App() {
  const [apiKey, setApiKey] = useState(() => lsGet("hcdid_apikey"));
  const [apiSaved, setApiSaved] = useState(() =>
    lsGet("hcdid_apikey").startsWith("sk-ant-"),
  );
  const [discussion, setDiscussion] = useState(() => lsGet("hcdid_discussion"));

  // uploadQueue: list of { name, sizeMB, matchedPaper, status, error }
  // status: "pending" | "extracting" | "done" | "exists" | "error"
  const [uploadQueue, setUploadQueue] = useState([]);
  const [extractedKeys, setExtractedKeys] = useState(new Set());
  const [dbPapers, setDbPapers] = useState([]); // rows from Supabase

  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ n: 0, total: 0, label: "" });
  const [tab, setTab] = useState("setup");
  const [expanded, setExpanded] = useState(null);
  const [err, setErr] = useState("");
  const [dragging, setDragging] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);

  const abort = useRef(false);
  const fileRef = useRef(null);

  // Load extracted paper keys + rows from Supabase on mount
  useEffect(() => {
    (async () => {
      setDbLoading(true);
      const [keys, rows] = await Promise.all([
        fetchExtractedKeys(),
        fetchAllFindings(),
      ]);
      setExtractedKeys(keys);
      setDbPapers(rows);
      setDbLoading(false);
    })();
  }, []);

  useEffect(() => {
    lsSet("hcdid_discussion", discussion);
  }, [discussion]);

  // ── API key ────────────────────────────────────────────────────────────────
  const confirmKey = () => {
    if (apiKey.trim().startsWith("sk-ant-")) {
      lsSet("hcdid_apikey", apiKey.trim());
      setApiSaved(true);
      setTab("pdfs");
      setErr("");
    } else setErr("Key must start with sk-ant-");
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // ── Upload & extract ───────────────────────────────────────────────────────
  const handleFiles = useCallback(
    async (files) => {
      if (!apiSaved) {
        setErr("Set your API key first.");
        setTab("setup");
        return;
      }
      const pdfs = Array.from(files).filter(
        (f) => f.type === "application/pdf",
      );

      for (const file of pdfs) {
        const match = guessMatch(file.name);

        // Add to queue immediately with status
        const existingRow = dbPapers.find(
          (r) => r.citation_key === match?.citationKey,
        );
        const alreadyExtracted = match && existingRow?.source === "pdf";
        const entry = {
          name: file.name,
          sizeMB: +(file.size / 1024 / 1024).toFixed(2),
          matchedPaper: match,
          status: alreadyExtracted ? "exists" : "pending",
          error: null,
        };

        setUploadQueue((q) => [
          ...q.filter((x) => x.name !== file.name),
          entry,
        ]);
        if (alreadyExtracted) continue;

        // Extract findings via Claude
        setUploadQueue((q) =>
          q.map((x) =>
            x.name === file.name ? { ...x, status: "extracting" } : x,
          ),
        );
        await delay(30000);

        try {
          await delay(5000);
          const b64 = await readBase64(file);
          const prompt = `You are a research assistant. Read this full academic paper and extract its core content for future citation matching.

Return ONLY this JSON object — no other text:
{
  "findings": [
    "Detailed finding or argument 1 (2-3 sentences)",
    "Detailed finding or argument 2 (2-3 sentences)",
    "Detailed finding or argument 3 (2-3 sentences)",
    "Detailed finding or argument 4 (2-3 sentences)",
    "Detailed finding or argument 5 (2-3 sentences)"
  ],
  "methodology": "Brief description of study design, participants, methods used",
  "keyArguments": [
    "Core theoretical or empirical argument 1",
    "Core theoretical or empirical argument 2",
    "Core theoretical or empirical argument 3"
  ],
  "citationUses": [
    "This paper can be cited to support claims about X",
    "This paper can be cited to support claims about Y",
    "This paper can be cited to support claims about Z"
  ]
}`;

          const res = await fetch("/anthropic/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
              // "anthropic-dangerous-direct-browser-access": "true", // ← add this line
            },
            body: JSON.stringify({
              model: "claude-haiku-4-5-20251001",
              max_tokens: 1500,
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "document",
                      source: {
                        type: "base64",
                        media_type: "application/pdf",
                        data: b64,
                      },
                    },
                    { type: "text", text: prompt },
                  ],
                },
              ],
            }),
          });

          if (!res.ok) {
            const e = await res.json();
            throw new Error(e.error?.message || res.statusText);
          }

          const data = await res.json();
          const txt = data.content?.map((c) => c.text || "").join("") || "";
          let cleaned = txt.replace(/```json|```/g, "").trim();
          let parsed;
          try {
            parsed = JSON.parse(cleaned);
          } catch {
            // Truncated — strip everything after the last complete string value
            cleaned = cleaned.replace(/,?\s*"[^"]*$/, ""); // remove trailing incomplete string
            cleaned = cleaned.replace(/,\s*$/, ""); // remove trailing comma
            // Close any open arrays and the root object
            const openBrackets =
              (cleaned.match(/\[/g) || []).length -
              (cleaned.match(/\]/g) || []).length;
            const openBraces =
              (cleaned.match(/\{/g) || []).length -
              (cleaned.match(/\}/g) || []).length;
            cleaned += "]".repeat(Math.max(0, openBrackets));
            cleaned += "}".repeat(Math.max(0, openBraces));
            parsed = JSON.parse(cleaned);
          }

          const paper = match || {
            citationKey: file.name.replace(/\.pdf$/i, ""),
            title: file.name,
            authors: [],
            year: "",
            url: "",
          };
          await saveFindings(paper, parsed, "pdf");

          // Refresh DB state
          const [keys, rows] = await Promise.all([
            fetchExtractedKeys(),
            fetchAllFindings(),
          ]);
          setExtractedKeys(keys);
          setDbPapers(rows);
          // "done" stays here inside the try, after saveFindings:
          setUploadQueue((q) =>
            q.map((x) => (x.name === file.name ? { ...x, status: "done" } : x)),
          );
        } catch (e) {
          setUploadQueue((q) =>
            q.map((x) =>
              x.name === file.name
                ? { ...x, status: "error", error: e.message }
                : x,
            ),
          );
        }
      }
    },
    [apiKey, apiSaved, extractedKeys],
  );

  // ── Delete from DB ─────────────────────────────────────────────────────────
  const handleDelete = async (citationKey) => {
    await deleteFindings(citationKey);
    const [keys, rows] = await Promise.all([
      fetchExtractedKeys(),
      fetchAllFindings(),
    ]);
    setExtractedKeys(keys);
    setDbPapers(rows);
  };

  // ── Analysis ───────────────────────────────────────────────────────────────
  const run = async () => {
    if (!discussion.trim() || !apiKey) return;
    abort.current = false;
    setRunning(true);
    setResults([]);
    setErr("");
    setTab("results");

    // Build combined paper list: DB findings + abstract fallback for unextracted papers
    const extractedCitationKeys = new Set(dbPapers.map((r) => r.citation_key));
    const papersWithFindings = dbPapers;

    const total = papersWithFindings.length;
    setProgress({ n: 0, total, label: "" });
    const all = [];
    let step = 0;

    // Phase 1 — match against extracted findings (no PDF needed)
    for (const row of papersWithFindings) {
      if (abort.current) break;
      setProgress({ n: step, total, label: row.title || row.citation_key });

      const findingsText = [
        ...(row.findings?.findings || []),
        ...(row.findings?.keyArguments || []),
        ...(row.findings?.citationUses || []),
        row.findings?.methodology || "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const prompt = `You are a research assistant. Using the extracted findings below, evaluate how well this paper supports each of the following discussion sentences.

PAPER: "${row.title}" (${(row.authors || []).join(", ")}, ${row.year})

EXTRACTED FINDINGS:
${findingsText}

DISCUSSION SENTENCES:
${discussion}

Return ONLY this JSON:
{
  "overallScore": <0-10>,
  "keyFindings": ["most relevant finding 1", "most relevant finding 2", "most relevant finding 3"],
  "sentenceMatches": [
    { "sentence": "<first ~8 words of discussion sentence>", "score": <0-10>, "citationNote": "<how to use this paper for this sentence>" }
  ]
}`;

      try {
        const res = await fetch("/anthropic/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 600,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        if (!res.ok) {
          const e = await res.json();
          setErr(`API: ${e.error?.message || res.statusText}`);
          setRunning(false);
          return;
        }
        const data = await res.json();
        const txt = data.content?.map((c) => c.text || "").join("") || "";
        const parsed = JSON.parse(txt.replace(/```json|```/g, "").trim());

        if (parsed.overallScore >= 3) {
          const paper = PAPERS.find(
            (p) => p.citationKey === row.citation_key,
          ) || {
            title: row.title,
            authors: row.authors || [],
            year: row.year,
            citationKey: row.citation_key,
            url: row.url,
          };
          all.push({
            paper,
            relevanceScore: parsed.overallScore,
            keyFindings: parsed.keyFindings || [],
            sentenceMatches: parsed.sentenceMatches || [],
            source: "extracted",
          });
          all.sort((a, b) => b.relevanceScore - a.relevanceScore);
          setResults([...all]);
        }
      } catch (e) {
        console.error(e);
      }
      step++;
      setProgress({ n: step, total, label: "" });
    }

    // // Phase 2 — abstract fallback for papers not yet extracted
    // for (let b = 0; b < papersAbstractOnly.length; b += BATCH) {
    //   if (abort.current) break;
    //   const batch = papersAbstractOnly.slice(b, b + BATCH);
    //   setProgress({ n: step, total, label: "Remaining papers (abstracts)…" });

    //   const list = batch
    //     .map(
    //       (p, i) =>
    //         `[${i + 1}] TITLE: ${p.title}\nAUTHORS: ${p.authors.join(", ")} (${p.year})\nABSTRACT: ${p.abstract}`,
    //     )
    //     .join("\n\n---\n\n");
    //   const prompt = `Match these papers to discussion sentences needing citations.\n\nDISCUSSION:\n${discussion}\n\nPAPERS:\n${list}\n\nReturn ONLY JSON array:\n[{"paperIndex":<1-based>,"relevanceScore":<0-10>,"keyFinding":"<1-2 sentences>","supportsSentences":["<excerpt>"],"citationNote":"<how to cite>"}]`;

    //   try {
    //     const res = await fetch("/anthropic/v1/messages", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "x-api-key": apiKey,
    //         "anthropic-version": "2023-06-01",
    //       },
    //       body: JSON.stringify({
    //         model: "claude-haiku-4-5-20251001",
    //         max_tokens: 600,
    //         messages: [{ role: "user", content: prompt }],
    //       }),
    //     });
    //     const data = await res.json();
    //     const txt = data.content?.map((c) => c.text || "").join("") || "";
    //     const parsed = JSON.parse(txt.replace(/```json|```/g, "").trim());

    //     for (const item of parsed) {
    //       if (item.relevanceScore >= 3) {
    //         const p = batch[item.paperIndex - 1];
    //         if (p)
    //           all.push({
    //             paper: p,
    //             relevanceScore: item.relevanceScore,
    //             keyFindings: [item.keyFinding],
    //             sentenceMatches: (item.supportsSentences || []).map((s) => ({
    //               sentence: s,
    //               score: item.relevanceScore,
    //               citationNote: item.citationNote,
    //             })),
    //             source: "abstract",
    //           });
    //       }
    //     }
    //     all.sort((a, b) => b.relevanceScore - a.relevanceScore);
    //     setResults([...all]);
    //   } catch (e) {
    //     console.error(e);
    //   }
    //   step++;
    //   setProgress({ n: step, total, label: "" });
    // }

    setRunning(false);
  };

  // ── Tabs ───────────────────────────────────────────────────────────────────
  const tabs = [
    { id: "setup", label: "① API Key" },
    { id: "pdfs", label: `② Upload PDFs` },
    { id: "library", label: `③ Library (${extractedKeys.size})` },
    { id: "input", label: "④ Discussion" },
    {
      id: "results",
      label: `⑤ Results${results.length > 0 ? ` (${results.length})` : ""}`,
    },
  ];

  const Btn = ({ onClick, disabled, children, primary, small }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? "5px 12px" : "9px 18px",
        borderRadius: 7,
        border: primary && !disabled ? "none" : `1px solid ${T.cardBorder}`,
        background: disabled
          ? T.subtleBg
          : primary
            ? "linear-gradient(135deg,#2b6cb0,#2c5282)"
            : T.cardBg,
        color: disabled ? T.textFaint : primary ? "#fff" : T.textBody,
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 600,
        fontSize: small ? 11 : 12,
        fontFamily: "inherit",
        boxShadow:
          !disabled && primary ? "0 2px 6px rgba(43,108,176,0.3)" : "none",
      }}
    >
      {children}
    </button>
  );

  const statusBadge = (status) => {
    const map = {
      pending: {
        c: T.textMuted,
        bg: T.subtleBg,
        bo: T.cardBorder,
        label: "Pending",
      },
      extracting: {
        c: T.accent,
        bg: T.accentLight,
        bo: T.accentBorder,
        label: "Extracting…",
      },
      done: {
        c: T.green,
        bg: T.greenLight,
        bo: T.greenBorder,
        label: "Saved to DB ✓",
      },
      exists: {
        c: T.amber,
        bg: T.amberLight,
        bo: T.amberBorder,
        label: "Already in DB",
      },
      error: { c: T.red, bg: T.redLight, bo: T.redBorder, label: "Error" },
    };
    const s = map[status] || map.pending;
    return <span style={bdg(s.c, s.bg, s.bo)}>{s.label}</span>;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.pageBg,
        color: T.textBody,
        fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
        fontSize: 14,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: T.headerBg,
          borderBottom: `1px solid ${T.headerBorder}`,
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg,#2b6cb0,#2c5282)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ⚗
          </div>
          <div>
            <div style={{ color: T.textDark, fontWeight: 700, fontSize: 15 }}>
              HCDID Literature Matcher
            </div>
            <div style={{ color: T.textMuted, fontSize: 12 }}>
              {PAPERS.length} papers · {extractedKeys.size} extracted in DB
              {dbLoading && (
                <span style={{ color: T.accent, marginLeft: 8 }}>Loading…</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: `1px solid ${tab === t.id ? T.accent : T.cardBorder}`,
                background: tab === t.id ? T.accentLight : T.cardBg,
                color: tab === t.id ? T.accent : T.textMuted,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: tab === t.id ? 600 : 400,
                fontFamily: "inherit",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px" }}>
        {/* ══ SETUP ══ */}
        {tab === "setup" && (
          <div
            style={card({
              borderColor: T.accentBorder,
              background: T.accentLight,
            })}
          >
            <span style={lbl()}>Anthropic API Key</span>
            <p
              style={{
                color: T.textBody,
                lineHeight: 1.7,
                marginBottom: 16,
                marginTop: 0,
              }}
            >
              Get your key at{" "}
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: T.accent, fontWeight: 500 }}
              >
                console.anthropic.com
              </a>{" "}
              → API Keys → Create Key.
              <br />
              Stored in browser localStorage only — never sent anywhere except
              Anthropic.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setErr("");
                }}
                onKeyDown={(e) => e.key === "Enter" && confirmKey()}
                placeholder="sk-ant-api03-…"
                style={{
                  flex: 1,
                  background: "#fff",
                  border: `1px solid ${T.inputBorder}`,
                  borderRadius: 7,
                  padding: "10px 14px",
                  color: T.textDark,
                  fontSize: 13,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              <Btn onClick={confirmKey} disabled={!apiKey.trim()} primary>
                Save & Continue →
              </Btn>
            </div>
            {err && (
              <div style={{ color: T.red, fontSize: 12, marginTop: 10 }}>
                ⚠ {err}
              </div>
            )}
            {apiSaved && (
              <div style={{ color: T.green, fontSize: 12, marginTop: 10 }}>
                ✓ Saved — go to Upload PDFs tab
              </div>
            )}
          </div>
        )}

        {/* ══ UPLOAD PDFs ══ */}
        {tab === "pdfs" && (
          <div>
            <div
              style={card({
                marginBottom: 16,
                background: T.accentLight,
                borderColor: T.accentBorder,
              })}
            >
              <span style={lbl({ color: T.accent })}>How it works</span>
              <p style={{ color: T.textBody, lineHeight: 1.7, margin: 0 }}>
                Upload a PDF once → Claude reads the full text and extracts key
                findings → findings are saved to your Supabase database
                permanently.
                <br />
                <b>You never need to upload the same PDF again.</b> Future
                analyses use the saved findings directly.
              </p>
            </div>

            {!apiSaved && (
              <div
                style={{
                  background: T.redLight,
                  border: `1px solid ${T.redBorder}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 14,
                  color: T.red,
                  fontSize: 13,
                }}
              >
                ⚠ Set your API key first.
              </div>
            )}

            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? T.accent : T.inputBorder}`,
                borderRadius: 12,
                padding: "32px 20px",
                textAlign: "center",
                cursor: "pointer",
                marginBottom: 16,
                background: dragging ? T.accentLight : "#fff",
                transition: "all 0.2s",
                boxShadow: dragging ? `0 0 0 3px ${T.accentBorder}` : "none",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
              <div
                style={{
                  color: dragging ? T.accent : T.textBody,
                  fontWeight: 500,
                  fontSize: 13,
                }}
              >
                {dragging
                  ? "Drop PDFs here"
                  : "Drag & drop PDFs, or click to browse"}
              </div>
              <div style={{ color: T.textFaint, fontSize: 12, marginTop: 4 }}>
                Findings are extracted once and stored in your database
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                multiple
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* Upload queue */}
            {uploadQueue.length > 0 && (
              <div>
                <span style={lbl()}>This Session</span>
                {uploadQueue.map((entry) => (
                  <div
                    key={entry.name}
                    style={card({
                      marginBottom: 8,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                    })}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 4,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            color: T.textDark,
                            fontWeight: 500,
                            fontSize: 13,
                            wordBreak: "break-word",
                          }}
                        >
                          {entry.name}
                        </span>
                        {statusBadge(entry.status)}
                      </div>
                      <div
                        style={{
                          color: T.textMuted,
                          fontSize: 12,
                          marginBottom: entry.matchedPaper ? 4 : 0,
                        }}
                      >
                        {entry.sizeMB} MB
                      </div>
                      {entry.matchedPaper ? (
                        <div style={{ color: T.accent, fontSize: 12 }}>
                          → {entry.matchedPaper.title.slice(0, 60)}
                          {entry.matchedPaper.title.length > 60 ? "…" : ""}
                        </div>
                      ) : (
                        <div style={{ color: T.amber, fontSize: 12 }}>
                          ⚠ Could not auto-match to a paper in library
                        </div>
                      )}
                      {entry.error && (
                        <div
                          style={{ color: T.red, fontSize: 11, marginTop: 4 }}
                        >
                          Error: {entry.error}
                        </div>
                      )}
                      {entry.status === "extracting" && (
                        <div
                          style={{
                            background: T.cardBorder,
                            borderRadius: 4,
                            height: 4,
                            marginTop: 8,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: "60%",
                              background:
                                "linear-gradient(90deg,#2b6cb0,#276749)",
                              height: "100%",
                              borderRadius: 4,
                              animation: "pulse 1.5s ease-in-out infinite",
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {extractedKeys.size > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 12,
                }}
              >
                <Btn onClick={() => setTab("library")} primary>
                  View Library ({extractedKeys.size}) →
                </Btn>
              </div>
            )}
          </div>
        )}

        {/* ══ LIBRARY ══ */}
        {tab === "library" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div>
                <div
                  style={{ color: T.textDark, fontWeight: 700, fontSize: 15 }}
                >
                  Extracted Papers
                </div>
                <div style={{ color: T.textMuted, fontSize: 12 }}>
                  {dbPapers.length} papers in Supabase ·{" "}
                  {PAPERS.length - dbPapers.length} not yet extracted
                </div>
              </div>
              <Btn onClick={() => setTab("input")} primary>
                Go to Analysis →
              </Btn>
            </div>

            {dbLoading && (
              <div
                style={{
                  color: T.textMuted,
                  fontSize: 13,
                  textAlign: "center",
                  padding: 30,
                }}
              >
                Loading from database…
              </div>
            )}

            {dbPapers.map((row) => (
              <div
                key={row.citation_key}
                style={card({ marginBottom: 8, padding: "12px 16px" })}
              >
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          color: T.textDark,
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {row.title}
                      </span>
                      <span style={bdg(T.green, T.greenLight, T.greenBorder)}>
                        Extracted ✓
                      </span>
                    </div>
                    <div
                      style={{
                        color: T.textMuted,
                        fontSize: 12,
                        marginBottom: 6,
                      }}
                    >
                      {(row.authors || []).join(", ")} · {row.year}
                      <span
                        style={{
                          marginLeft: 8,
                          background: T.subtleBg,
                          border: `1px solid ${T.cardBorder}`,
                          padding: "1px 7px",
                          borderRadius: 4,
                          color: T.accent,
                          fontFamily: "monospace",
                          fontSize: 11,
                        }}
                      >
                        @{row.citation_key}
                      </span>
                    </div>
                    {row.findings?.findings?.[0] && (
                      <div
                        style={{
                          color: T.textBody,
                          fontSize: 12,
                          lineHeight: 1.6,
                          background: T.subtleBg,
                          padding: "8px 10px",
                          borderRadius: 6,
                          marginTop: 4,
                        }}
                      >
                        <b
                          style={{
                            color: T.textMuted,
                            fontSize: 10,
                            display: "block",
                            marginBottom: 4,
                          }}
                        >
                          SAMPLE FINDING
                        </b>
                        {row.findings.findings[0]}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(row.citation_key)}
                    title="Remove from database"
                    style={{
                      background: "transparent",
                      border: `1px solid ${T.redBorder}`,
                      color: T.red,
                      cursor: "pointer",
                      fontSize: 11,
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontFamily: "inherit",
                      flexShrink: 0,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {/* Unextracted papers */}
            {PAPERS.filter((p) => !extractedKeys.has(p.citationKey)).length >
              0 && (
              <div style={{ marginTop: 24 }}>
                <span style={lbl({ color: T.amber })}>
                  Not Yet Extracted ({PAPERS.length - extractedKeys.size})
                </span>
                {PAPERS.filter((p) => !extractedKeys.has(p.citationKey)).map(
                  (p) => (
                    <div
                      key={p.id}
                      style={card({
                        marginBottom: 6,
                        padding: "10px 14px",
                        background: T.subtleBg,
                        borderColor: T.amberBorder,
                      })}
                    >
                      <div
                        style={{
                          color: T.textBody,
                          fontWeight: 500,
                          fontSize: 13,
                        }}
                      >
                        {p.title}
                      </div>
                      <div
                        style={{
                          color: T.textMuted,
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        {p.authors[0]} · {p.year} · will use abstract for
                        matching
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ INPUT ══ */}
        {tab === "input" && (
          <div>
            {!apiSaved && (
              <div
                style={{
                  background: T.redLight,
                  border: `1px solid ${T.redBorder}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 14,
                  color: T.red,
                  fontSize: 13,
                }}
              >
                ⚠ Set your API key in the Setup tab first.
              </div>
            )}
            {dbPapers.length === 0 && !dbLoading && (
              <div
                style={{
                  background: T.amberLight,
                  border: `1px solid ${T.amberBorder}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 14,
                  color: T.amber,
                  fontSize: 13,
                }}
              >
                ⚠ No PDFs extracted yet — analysis will use abstracts only.
                Upload PDFs for better matching.
              </div>
            )}
            {dbPapers.length > 0 && (
              <div
                style={{
                  background: T.greenLight,
                  border: `1px solid ${T.greenBorder}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 14,
                  color: T.green,
                  fontSize: 13,
                }}
              >
                ✓ {dbPapers.length} papers with full extracted findings ·{" "}
                {PAPERS.length - dbPapers.length} using abstracts
              </div>
            )}
            <div
              style={card({
                borderColor: T.accentBorder,
                background: T.accentLight,
                marginBottom: 16,
              })}
            >
              <span style={lbl({ color: T.accent })}>
                Your Discussion Sentences
              </span>
              <p style={{ color: T.textBody, lineHeight: 1.7, margin: 0 }}>
                Paste the sentences from your discussion section that need
                citation support. Your text is auto-saved locally.
              </p>
            </div>
            <textarea
              value={discussion}
              onChange={(e) => setDiscussion(e.target.value)}
              placeholder={
                'Example:\n\n"Users often struggle with the usability of digital identity wallets, particularly when managing cryptographic credentials."\n\n"The adoption of SSI systems has been limited by a lack of user-friendly interfaces and unclear trust models."\n\n"Privacy concerns remain a key barrier to widespread adoption of digital identity services."'
              }
              style={{
                width: "100%",
                minHeight: 210,
                background: "#fff",
                border: `1px solid ${T.inputBorder}`,
                borderRadius: 10,
                padding: 16,
                color: T.textDark,
                fontSize: 13,
                fontFamily: "inherit",
                resize: "vertical",
                lineHeight: 1.8,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 14,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <span style={{ color: T.textMuted, fontSize: 12 }}>
                {dbPapers.length > 0 && (
                  <>
                    <b style={{ color: T.green }}>
                      {dbPapers.length} extracted
                    </b>{" "}
                    +{" "}
                  </>
                )}
                {PAPERS.length - dbPapers.length} abstracts
              </span>
              <Btn
                onClick={run}
                disabled={!discussion.trim() || running || !apiSaved}
                primary
              >
                {running ? "Analyzing…" : "▶ Run Analysis"}
              </Btn>
            </div>
          </div>
        )}

        {/* ══ RESULTS ══ */}
        {tab === "results" && (
          <div>
            {err && (
              <div
                style={{
                  background: T.redLight,
                  border: `1px solid ${T.redBorder}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 14,
                  color: T.red,
                  fontSize: 13,
                }}
              >
                ⚠ {err}
              </div>
            )}

            {running && (
              <div style={card({ marginBottom: 18 })}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{ color: T.textBody, fontSize: 13, fontWeight: 500 }}
                  >
                    {progress.label
                      ? `Matching: ${progress.label.slice(0, 55)}…`
                      : `Step ${progress.n} of ${progress.total}`}
                  </span>
                  <button
                    onClick={() => {
                      abort.current = true;
                      setRunning(false);
                    }}
                    style={{
                      background: T.redLight,
                      border: `1px solid ${T.redBorder}`,
                      color: T.red,
                      padding: "4px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 12,
                      fontFamily: "inherit",
                    }}
                  >
                    Stop
                  </button>
                </div>
                <div
                  style={{
                    background: T.subtleBg,
                    borderRadius: 6,
                    height: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress.total ? (progress.n / progress.total) * 100 : 0}%`,
                      background: "linear-gradient(90deg,#2b6cb0,#276749)",
                      height: "100%",
                      borderRadius: 6,
                      transition: "width 0.4s",
                    }}
                  />
                </div>
                <div style={{ color: T.textMuted, fontSize: 12, marginTop: 8 }}>
                  {results.length} relevant papers found so far…
                </div>
              </div>
            )}

            {results.length === 0 && !running && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: T.textFaint,
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>⚗</div>
                <div>
                  No results yet — paste your discussion sentences and run
                  analysis.
                </div>
              </div>
            )}

            {results.map((r, idx) => (
              <div
                key={idx}
                style={card({
                  marginBottom: 10,
                  padding: 0,
                  overflow: "hidden",
                })}
              >
                <div
                  onClick={() => setExpanded(expanded === idx ? null : idx)}
                  style={{
                    padding: "14px 16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    borderLeft: `4px solid ${SC(r.relevanceScore)}`,
                    borderRadius: "10px 0 0 10px",
                  }}
                >
                  <div style={{ flexShrink: 0, textAlign: "center" }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 10,
                        background: SBg(r.relevanceScore),
                        border: `1px solid ${SBo(r.relevanceScore)}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          color: SC(r.relevanceScore),
                          fontWeight: 700,
                          fontSize: 18,
                        }}
                      >
                        {r.relevanceScore}
                      </div>
                    </div>
                    <div
                      style={{
                        color: SC(r.relevanceScore),
                        fontSize: 10,
                        marginTop: 4,
                        fontWeight: 600,
                      }}
                    >
                      {SL(r.relevanceScore)}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          color: T.textDark,
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {r.paper.title}
                      </span>
                      <span
                        style={bdg(
                          r.source === "extracted" ? T.green : T.accent,
                          r.source === "extracted"
                            ? T.greenLight
                            : T.accentLight,
                          r.source === "extracted"
                            ? T.greenBorder
                            : T.accentBorder,
                        )}
                      >
                        {r.source === "extracted" ? "FULL EXTRACT" : "ABSTRACT"}
                      </span>
                    </div>
                    <div
                      style={{
                        color: T.textMuted,
                        fontSize: 12,
                        marginBottom: 6,
                      }}
                    >
                      {r.paper.authors?.join(", ")} · {r.paper.year}
                      {r.paper.citationKey && (
                        <span
                          style={{
                            marginLeft: 8,
                            background: T.subtleBg,
                            border: `1px solid ${T.cardBorder}`,
                            padding: "1px 7px",
                            borderRadius: 4,
                            color: T.accent,
                            fontFamily: "monospace",
                            fontSize: 11,
                          }}
                        >
                          @{r.paper.citationKey}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        color: T.textBody,
                        lineHeight: 1.6,
                        fontSize: 13,
                      }}
                    >
                      {r.keyFindings?.[0]}
                    </div>
                  </div>
                  <div style={{ color: T.textFaint, flexShrink: 0 }}>
                    {expanded === idx ? "▲" : "▼"}
                  </div>
                </div>

                {expanded === idx && (
                  <div
                    style={{
                      padding: "0 16px 16px",
                      borderTop: `1px solid ${T.cardBorder}`,
                    }}
                  >
                    {r.keyFindings?.length > 0 && (
                      <div style={{ marginTop: 14, marginBottom: 14 }}>
                        <span style={lbl({ color: T.accent })}>
                          Key Findings
                        </span>
                        {r.keyFindings.map((f, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              gap: 10,
                              marginBottom: 6,
                            }}
                          >
                            <span
                              style={{
                                color: T.accent,
                                flexShrink: 0,
                                fontWeight: 700,
                              }}
                            >
                              ·
                            </span>
                            <span
                              style={{
                                color: T.textBody,
                                lineHeight: 1.7,
                                fontSize: 13,
                              }}
                            >
                              {f}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {r.sentenceMatches?.length > 0 && (
                      <div style={{ marginBottom: 14 }}>
                        <span style={lbl({ color: T.green })}>
                          Sentence-Level Matches
                        </span>
                        {r.sentenceMatches
                          .filter((m) => m.score >= 3)
                          .sort((a, b) => b.score - a.score)
                          .map((m, i) => (
                            <div
                              key={i}
                              style={{
                                background: SBg(m.score),
                                border: `1px solid ${SBo(m.score)}`,
                                borderRadius: 8,
                                padding: "10px 13px",
                                marginBottom: 8,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  marginBottom: 6,
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={bdg(
                                    SC(m.score),
                                    SBg(m.score),
                                    SBo(m.score),
                                  )}
                                >
                                  Score: {m.score}/10
                                </span>
                                <span
                                  style={{
                                    color: T.textBody,
                                    fontSize: 13,
                                    fontStyle: "italic",
                                  }}
                                >
                                  "{m.sentence}"
                                </span>
                              </div>
                              <div
                                style={{
                                  color: T.textMuted,
                                  fontSize: 12,
                                  lineHeight: 1.7,
                                }}
                              >
                                {m.citationNote}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                    {r.paper.url && (
                      <a
                        href={r.paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: T.accent,
                          fontSize: 12,
                          fontWeight: 500,
                          textDecoration: "none",
                        }}
                      >
                        → Open paper ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}

            {!running && results.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: 16,
                  color: T.textMuted,
                  fontSize: 12,
                  borderTop: `1px solid ${T.cardBorder}`,
                }}
              >
                Analysis complete · {results.length} relevant papers ·{" "}
                {dbPapers.length} full extracts +{" "}
                {PAPERS.length - dbPapers.length} abstracts
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
