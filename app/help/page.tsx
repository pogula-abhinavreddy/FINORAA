"use client";
import { useState } from "react";

const faqData = [
  { q: "How do I start investing?", a: "Navigate to the 'Invest' tab and click 'Buy Assets'. You can browse stocks, ETFs, and crypto. Start with small amounts and diversify your portfolio. We recommend starting with an S&P 500 ETF if you're new to the market." },
  { q: "How does XP and leveling work?", a: "You earn XP by completing lessons, quests, and daily check-ins. XP accumulates toward your level. Higher levels unlock advanced courses, exclusive market insights, and lower transaction fees in the simulated environment." },
  { q: "Is my financial data secure?", a: "Absolutely. We use bank-grade AES-256 encryption, two-factor authentication, and never share your data with third parties. Visit the Safety page to manage your security sessions." },
  { q: "How do I export my budget report?", a: "Go to the Budget page and click 'Export Report'. Alternatively, go to the Statements page to download monthly or quarterly PDFs of your transaction history." },
  { q: "Can I link my bank account?", a: "Yes! Go to Settings and look for 'Connected Accounts'. We support major banks through secure API connections. This allows for real-time tracking of your real-world expenses." },
  { q: "What is Stealth Mode?", a: "Stealth Mode masks your account balances on all screens. This is useful if you're using FINORAA in public spaces and want to keep your net worth private. You can enable it in Safety settings." },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ subject: "", message: "", category: "General Support" });
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filteredFaqs = faqData.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleSubmit() {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      showToastMsg("Please fill in all fields before submitting.");
      return;
    }
    setSubmitted(true);
    showToastMsg("Success! Our support team will get back to you within 24 hours.");
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({ subject: "", message: "", category: "General Support" });
    }, 3000);
  }

  return (
    <>
      <div className="p-10 max-w-5xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl text-on-surface mb-4">How can we help?</h2>
          <p className="text-body-lg text-outline mb-8">Search our knowledge base or get in touch with our expert financial team.</p>
          
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              placeholder="Search for questions (e.g., 'investing', 'security')..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-outline-variant/30 rounded-full py-5 pl-14 pr-6 font-body-md shadow-[0_12px_32px_rgba(120,118,129,0.08)] focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface"
            />
          </div>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: "chat_bubble", title: "Live Support", desc: "Chat with a human expert now", action: "Start Chat", color: "bg-primary/10 text-primary" },
            { icon: "mail", title: "Email Support", desc: "Response time: < 24 hours", action: "Email Us", color: "bg-surface-container text-on-surface" },
            { icon: "menu_book", title: "Guides", desc: "Browse 50+ detailed guides", action: "View Library", color: "bg-surface-container-low text-outline" },
          ].map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] hover:shadow-[0_12px_32px_rgba(120,118,129,0.08)] hover:scale-[1.02] transition-all group flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-[12px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${card.color}`}>
                <span className="material-symbols-outlined text-3xl">{card.icon}</span>
              </div>
              <h4 className="font-display text-xl text-on-surface mb-2">{card.title}</h4>
              <p className="text-[12px] font-semibold text-outline mb-6 px-4">{card.desc}</p>
              <button
                onClick={() => showToastMsg(`${card.action} initiating...`)}
                className="w-full py-3 bg-surface-container-low hover:bg-primary hover:text-white text-primary font-bold rounded-lg transition-all active:scale-95 text-[14px]"
              >
                {card.action}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-[16px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(120,118,129,0.05)] p-10 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-2xl text-on-surface">Common Questions</h3>
            {searchQuery && <span className="text-[12px] text-primary font-bold">Showing results for &quot;{searchQuery}&quot;</span>}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <div key={i} className={`border rounded-[12px] transition-all ${openFaq === i ? "border-primary/30 bg-primary/5" : "border-outline-variant/30 hover:border-primary/20 hover:bg-surface-container-low"}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left outline-none"
                  >
                    <span className="font-semibold text-on-surface text-[16px]">{faq.q}</span>
                    <span className={`material-symbols-outlined text-outline transition-transform duration-300 ${openFaq === i ? "rotate-180 text-primary" : ""}`}>
                      expand_more
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-6 pb-6 text-body-md text-outline leading-relaxed border-t border-outline-variant/20 pt-4">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">sentiment_dissatisfied</span>
                <p className="font-display text-xl text-outline">No matching questions found.</p>
                <button onClick={() => setSearchQuery("")} className="text-primary font-bold hover:underline mt-2">Clear search</button>
              </div>
            )}
          </div>
        </div>

        {/* Support Ticket Section */}
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-5 flex flex-col justify-center">
            <h3 className="font-display text-3xl text-on-surface mb-4">Still need help?</h3>
            <p className="text-body-lg text-outline mb-8">If you couldn't find what you were looking for, send us a detailed message and we'll investigate further.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-[12px] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-on-surface">Verified Support</p>
                  <p className="text-[12px] font-semibold text-outline">Official assistance from certified planners</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-[12px] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
                <div>
                  <p className="font-semibold text-[14px] text-on-surface">24/7 Availability</p>
                  <p className="text-[12px] font-semibold text-outline">We never sleep when it comes to your wealth</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-7 bg-white rounded-[16px] border border-outline-variant/30 shadow-[0_12px_32px_rgba(120,118,129,0.08)] p-10">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-bold text-outline uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={contactForm.category}
                    onChange={e => setContactForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-outline-variant/30 rounded-lg px-5 py-4 font-body-md focus:ring-2 focus:ring-primary outline-none bg-surface-container-low text-on-surface"
                  >
                    <option>General Support</option>
                    <option>Investment Inquiry</option>
                    <option>Technical Issue</option>
                    <option>Billing & Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-outline uppercase tracking-wider mb-2">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={e => setContactForm(p => ({ ...p, subject: e.target.value }))}
                    placeholder="Brief summary..."
                    className="w-full border border-outline-variant/30 rounded-lg px-5 py-4 font-body-md focus:ring-2 focus:ring-primary outline-none text-on-surface"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-bold text-outline uppercase tracking-wider mb-2">Message Details</label>
                <textarea
                  value={contactForm.message}
                  onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Describe your question or issue in detail..."
                  rows={6}
                  className="w-full border border-outline-variant/30 rounded-lg px-5 py-4 font-body-md focus:ring-2 focus:ring-primary outline-none resize-none text-on-surface"
                />
              </div>
              <button
                onClick={handleSubmit}
                className={`w-full py-4 rounded-lg font-bold text-[16px] transition-all active:scale-[0.98] shadow-sm ${
                  submitted 
                    ? "bg-primary text-white" 
                    : "bg-primary text-white hover:shadow-[0_4px_20px_rgba(84,66,219,0.2)]"
                }`}
              >
                {submitted ? "✓ Ticket Submitted" : "Submit Support Ticket"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-[16px] shadow-[0_12px_32px_rgba(120,118,129,0.08)] flex items-center gap-3 animate-slide-up z-50 border border-outline-variant/20">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </>
  );
}
