import { NextRequest } from "next/server";

// ── Model cascade: try each in order until one responds ──────────────────────
// gemini-2.0-flash and gemini-2.0-flash-lite free-tier quota is exhausted on
// this API key. gemini-2.5-flash has a separate quota and is confirmed working.
const MODEL_CASCADE = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are FINORAA, a friendly and knowledgeable AI financial assistant embedded in the FINORAA personal finance app.
You help Indian users with budgeting, investments (stocks, mutual funds, SIPs, crypto), savings goals, tax optimization (80C, 80D, HRA, etc.), and general financial advice.
Use Indian Rupee (₹) for all currency amounts. Be concise, practical, and encouraging.
If asked about specific stocks or investments, always remind users this is informational only, not financial advice.
Keep responses under 250 words unless a detailed explanation is genuinely needed.
Use markdown formatting: **bold** for key terms, bullet points for lists, numbered lists for steps.
Always relate advice to the Indian financial context (NSE/BSE, Indian tax laws, Indian banks, UPI, etc.).`;

// ── Smart local fallback responses ────────────────────────────────────────────
// These fire only when ALL models fail, keeping the bot always usable.
function getLocalFallback(message: string): string {
  const q = message.toLowerCase();

  if (q.match(/budget|spend|expense|saving|save/)) {
    return "**Budgeting tip 💡**\n\nA great place to start is the **50/30/20 rule**:\n- **50%** → Needs (rent, food, utilities)\n- **30%** → Wants (dining out, entertainment)\n- **20%** → Savings & debt repayment\n\nFor example, on a ₹50,000/month income, try saving at least ₹10,000 every month. Would you like help building a custom budget?";
  }
  if (q.match(/invest|stock|mutual fund|sip|equity|nifty|sensex/)) {
    return "**Investing in India 📈**\n\nFor beginners, **SIP (Systematic Investment Plan)** in index mutual funds is a great starting point:\n- Low cost, diversified exposure\n- Start with as little as ₹500/month\n- Popular choices: Nifty 50 index funds, Nifty Next 50\n\nRemember, past performance does not guarantee future returns. *This is for informational purposes only, not financial advice.*";
  }
  if (q.match(/tax|itr|income tax|tds|80c|deduction/)) {
    return "**Tax Saving Tips 🧾**\n\nUnder **Section 80C** you can save up to ₹1.5 lakh in tax by investing in:\n- PPF (Public Provident Fund)\n- ELSS Mutual Funds (best returns, 3-year lock-in)\n- NSC, 5-year FD\n- EPF contributions\n\nAdditionally, **Section 80D** lets you deduct health insurance premiums up to ₹25,000. Want more details on any of these?";
  }
  if (q.match(/loan|emi|interest|mortgage|home loan|car loan/)) {
    return "**Loan Management 🏦**\n\nKey things to check before taking any loan:\n1. **Interest rate** – Compare across lenders (use EMI calculators)\n2. **Processing fees** – These add to total cost\n3. **Prepayment charges** – Can you pay early without penalty?\n\nFor home loans, interest up to ₹2 lakh is tax-deductible under **Section 24**. Would you like help comparing EMI options?";
  }
  if (q.match(/crypto|bitcoin|ethereum|btc|eth/)) {
    return "**Cryptocurrency ₿**\n\nCrypto is a high-risk, high-reward asset class. Key points:\n- Never invest more than **5–10%** of your portfolio in crypto\n- In India, crypto gains are taxed at **30%** (flat)\n- 1% TDS applies on crypto transactions\n\nStick to reputable exchanges and always use hardware wallets for large holdings. *This is informational, not financial advice.*";
  }
  if (q.match(/portfolio|diversif/)) {
    return "**Portfolio Diversification 📊**\n\nA balanced portfolio might look like:\n- **60%** Equity (stocks/mutual funds)\n- **20%** Debt (bonds, FD)\n- **15%** Gold or REITs\n- **5%** Cash/liquid funds\n\nRebalance once a year to maintain your target allocation. The right mix depends on your age, risk tolerance, and goals.";
  }
  if (q.match(/emergency|fund|liquid/)) {
    return "**Emergency Fund 🛡️**\n\nAn emergency fund should cover **3–6 months** of expenses. Keep it in:\n- High-interest savings account\n- Liquid mutual funds (better returns, quick redemption)\n\nFor example, if your monthly expenses are ₹30,000, aim for ₹90,000–₹1,80,000 in your emergency fund before investing aggressively.";
  }
  if (q.match(/gold|sovereign|sgb/)) {
    return "**Gold Investment Options 🥇**\n\nBest ways to invest in gold in India:\n1. **Sovereign Gold Bonds (SGB)** – Best option: earns 2.5% interest + price appreciation, no capital gains tax if held to maturity\n2. **Gold ETFs** – Trade like stocks, lower expense ratio\n3. **Digital Gold** – Convenient but storage charges apply\n\nPhysical gold has high making charges and storage risks — SGBs are generally preferred.";
  }
  if (q.match(/hello|hi|hey|good morning|good afternoon|good evening|what can you do|help/)) {
    return "**Hello! 👋 I'm FINORAA, your personal finance assistant.**\n\nI can help you with:\n- 💰 **Budgeting** – Plan and track your expenses\n- 📈 **Investments** – Stocks, SIPs, mutual funds\n- 🧾 **Tax Saving** – 80C, 80D deductions and more\n- 🏦 **Loans** – EMI calculations and comparisons\n- 🛡️ **Emergency Fund** – How much and where to keep it\n- ₿ **Crypto** – Risk and tax implications\n\nWhat would you like to explore today?";
  }
  // Default
  return "That's a great question! I can help you with **budgeting**, **investments**, **tax saving**, **loans**, **emergency funds**, and **crypto**.\n\nTry asking me something like:\n- *\"How should I invest ₹10,000 per month?\"*\n- *\"What are the best tax-saving options under 80C?\"*\n- *\"How do I build a 6-month emergency fund?\"*";
}

// ── Try one model, return null on 429/503 so caller can try next ──────────────
async function tryModel(
  modelName: string,
  contents: object[],
  apiKey: string
): Promise<{ text: string } | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
        topP: 0.95,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    }),
  });

  if (res.status === 429 || res.status === 503) {
    // Quota exhausted or overloaded — skip to next model
    console.warn(`[FINORAA] Model ${modelName} returned ${res.status}, trying next...`);
    return null;
  }

  if (!res.ok) {
    const body = await res.text();
    console.error(`[FINORAA] Model ${modelName} error ${res.status}:`, body);
    return null;
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.warn(`[FINORAA] Model ${modelName} returned empty text`);
    return null;
  }

  return { text };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasRealKey =
    apiKey &&
    apiKey !== "your-gemini-api-key-here" &&
    apiKey.trim().length > 10;

  const { messages, userMessage } = await request.json();

  // ── No API key: use smart local fallback ─────────────────────────────────
  if (!hasRealKey) {
    const fallback = getLocalFallback(userMessage);
    return Response.json({ text: fallback, usingFallback: true, model: "local" });
  }

  // ── Build conversation history ────────────────────────────────────────────
  const contents = [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }],
    },
    {
      role: "model",
      parts: [
        {
          text: "Understood! I'm FINORAA, your AI financial assistant. I'm here to help with budgeting, investments, tax tips, and more. How can I help you today?",
        },
      ],
    },
    // Prior conversation (last 10 messages, strip HTML tags)
    ...messages.slice(-10).map((m: { sender: string; text: string }) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text.replace(/<[^>]+>/g, "").trim() }],
    })),
    // Current message
    { role: "user", parts: [{ text: userMessage }] },
  ];

  // ── Try each model in cascade ─────────────────────────────────────────────
  try {
    for (const model of MODEL_CASCADE) {
      const result = await tryModel(model, contents, apiKey);
      if (result) {
        console.log(`[FINORAA] Responded using model: ${model}`);
        return Response.json({
          text: result.text,
          usingFallback: false,
          model,
        });
      }
    }

    // All models failed — use smart local fallback
    console.warn("[FINORAA] All models exhausted, using local fallback");
    const fallback = getLocalFallback(userMessage);
    return Response.json({ text: fallback, usingFallback: true, model: "local" });
  } catch (err) {
    console.error("[FINORAA] Unexpected route error:", err);
    const fallback = getLocalFallback(userMessage);
    return Response.json({ text: fallback, usingFallback: true, model: "local" });
  }
}
