import { useAuth } from "@clerk/clerk-react";
import { Code2, FileText, Mail, Sparkles, TextQuote } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "../lib/axios";

const tools = {
  email: { title: "AI Email Writer", description: "Create professional emails tailored to your audience and goal.", endpoint: "/ai/write-email", field: "prompt", label: "Email details", placeholder: "Who are you writing to, what is the purpose, and what tone should it have?", Icon: Mail },
  summarize: { title: "AI Text Summarizer", description: "Turn long content into a concise, actionable summary.", endpoint: "/ai/summarize-text", field: "text", label: "Text to summarize", placeholder: "Paste the text you want summarized...", Icon: TextQuote },
  coverLetter: { title: "Cover Letter Generator", description: "Write a tailored cover letter for your next opportunity.", endpoint: "/ai/generate-cover-letter", field: "prompt", label: "Job and candidate details", placeholder: "Include the job description, your experience, achievements, and preferred tone...", Icon: FileText },
  codeReview: { title: "AI Code Reviewer", description: "Get clear feedback on bugs, security, and maintainability.", endpoint: "/ai/review-code", field: "code", label: "Code to review", placeholder: "Paste your code here...", Icon: Code2 },
};

const markdownComponents = {
  pre: ({ children }) => (
    <pre className="my-4 max-w-full overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className);
    return (
      <code
        className={isBlock
          ? `${className || ""} font-mono`
          : "break-words rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-800"}
      >
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="my-4 max-w-full overflow-x-auto">
      <table className="w-full min-w-max border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border border-slate-200 px-3 py-2 align-top">{children}</td>,
};

const PremiumTool = ({ tool }) => {
  const config = tools[tool];
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const Icon = config.Icon;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = { [config.field]: input };
      if (tool === "codeReview") payload.language = language;
      const { data } = await axios.post(config.endpoint, payload, { headers: { Authorization: `Bearer ${await getToken()}` } });
      if (!data.success) throw new Error(data.message || "Unable to generate a response.");
      setContent(data.content);
    } catch (error) {
      toast.error(error.message || "Unable to generate a response.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-8 overflow-y-auto">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8"><span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold">★ PREMIUM</span><h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-800">{config.title}</h1><p className="mt-2 text-slate-600">{config.description}</p></div>
      <div className="grid min-w-0 lg:grid-cols-2 gap-6">
        <form onSubmit={submit} className="min-w-0 bg-white/90 rounded-2xl shadow-xl p-6 border border-white">
          <div className="flex items-center gap-3 mb-6"><div className="p-3 rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600"><Icon /></div><h2 className="font-bold text-xl text-slate-800">Create with AI</h2></div>
          {tool === "codeReview" && <input value={language} onChange={(event) => setLanguage(event.target.value)} className="w-full mb-4 rounded-xl border border-slate-200 p-3" placeholder="Language (optional, e.g. JavaScript)" />}
          <label className="block text-sm font-semibold text-slate-700 mb-2">{config.label}</label>
          <textarea required value={input} onChange={(event) => setInput(event.target.value)} placeholder={config.placeholder} className="w-full min-h-64 rounded-xl border-2 border-slate-200 p-4 focus:border-blue-500 focus:outline-none" />
          <button disabled={loading} className="mt-5 w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 disabled:opacity-60">{loading ? "Working..." : "Generate"}</button>
        </form>
        <div className="min-w-0 min-h-[420px] bg-white/90 rounded-2xl shadow-xl p-6 border border-white">
          <div className="flex items-center gap-3 mb-5"><Sparkles className="text-amber-500" /><h2 className="font-bold text-xl text-slate-800">Your result</h2></div>
          {content ? (
            <div className="max-h-[65vh] min-w-0 overflow-auto pr-1">
              <div className="prose prose-slate max-w-none break-words">
                <Markdown components={markdownComponents}>{content}</Markdown>
              </div>
            </div>
          ) : <p className="text-slate-500">Your AI-generated result will appear here.</p>}
        </div>
      </div>
    </div>
  </div>;
};

export const EmailWriter = () => <PremiumTool tool="email" />;
export const TextSummarizer = () => <PremiumTool tool="summarize" />;
export const CoverLetterGenerator = () => <PremiumTool tool="coverLetter" />;
export const CodeReviewer = () => <PremiumTool tool="codeReview" />;
