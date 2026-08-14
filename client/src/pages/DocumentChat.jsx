import { useAuth } from "@clerk/clerk-react";
import { FileText, Loader2, MessageSquare, Send, Trash2, UploadCloud } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import axios from "../lib/axios";

const DocumentChat = () => {
  const { getToken } = useAuth();
  const fileInputRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);

  const completedDocuments = useMemo(
    () => documents.filter((document) => document.status === "COMPLETED"),
    [documents]
  );

  const authHeaders = useCallback(async () => ({
    Authorization: `Bearer ${await getToken()}`,
  }), [getToken]);

  const loadDocuments = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const { data } = await axios.get("/rag/documents", { headers: await authHeaders() });
      if (!data.success) throw new Error(data.message || "Unable to load documents.");
      setDocuments(data.documents || []);
    } catch (error) {
      toast.error(error.message || "Unable to load documents.");
    } finally {
      setLoadingDocs(false);
    }
  }, [authHeaders]);

  const loadChats = useCallback(async () => {
    try {
      const { data } = await axios.get("/rag/chats", { headers: await authHeaders() });
      if (data.success) setChats(data.chats || []);
    } catch (error) {
      console.warn("Unable to load RAG chat history", error.message);
    }
  }, [authHeaders]);

  useEffect(() => {
    loadDocuments();
    loadChats();
  }, [loadDocuments, loadChats]);

  const uploadDocument = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);
    setUploading(true);

    try {
      const { data } = await axios.post("/rag/documents/upload", formData, {
        headers: {
          ...(await authHeaders()),
          "Content-Type": "multipart/form-data",
        },
      });
      if (!data.success) throw new Error(data.message || "Unable to upload document.");
      toast.success("Document indexed.");
      await loadDocuments();
    } catch (error) {
      toast.error(error.message || "Unable to upload document.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      const { data } = await axios.delete(`/rag/documents/${documentId}`, { headers: await authHeaders() });
      if (!data.success) throw new Error(data.message || "Unable to delete document.");
      setDocuments((current) => current.filter((document) => document.id !== documentId));
      if (selectedDocumentId === documentId) setSelectedDocumentId("");
      toast.success("Document deleted.");
    } catch (error) {
      toast.error(error.message || "Unable to delete document.");
    }
  };

  const askQuestion = async (event) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    setQuestion("");
    setAsking(true);
    setMessages((current) => [...current, { role: "user", content: trimmed }]);

    try {
      const payload = { question: trimmed };
      if (selectedDocumentId) payload.documentId = selectedDocumentId;
      const { data } = await axios.post("/rag/chat", payload, { headers: await authHeaders() });
      if (!data.success) throw new Error(data.message || "Unable to answer question.");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer, sources: data.sources || [] },
      ]);
      loadChats();
    } catch (error) {
      toast.error(error.message || "Unable to answer question.");
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "I could not answer that question right now." },
      ]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Documents</h1>
              <p className="mt-1 text-sm text-slate-500">{documents.length} uploaded</p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-60"
              title="Upload document"
            >
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={uploadDocument}
              className="hidden"
            />
          </div>

          {loadingDocs ? (
            <div className="flex h-36 items-center justify-center text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <div key={document.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{document.originalName}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span>{document.mimeType?.split("/").pop()?.toUpperCase()}</span>
                        <span>{formatBytes(document.fileSize)}</span>
                        <span>{formatDate(document.createdAt)}</span>
                      </div>
                      <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass(document.status)}`}>
                        {document.status}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteDocument(document.id)}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 border-t border-slate-200 pt-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Recent Chats</h2>
            {chats.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No chat history yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {chats.slice(0, 5).map((chat) => {
                  const userMessage = chat.messages?.find((message) => message.role === "user");
                  return (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => setMessages(chat.messages || [])}
                      className="w-full rounded-lg border border-slate-200 p-3 text-left text-sm transition hover:border-blue-200 hover:bg-blue-50"
                    >
                      <p className="line-clamp-2 font-medium text-slate-700">{userMessage?.content || "Document chat"}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDate(chat.createdAt)}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="flex min-h-[calc(100vh-120px)] min-w-0 flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">AI Document Chat</h2>
                  <p className="text-sm text-slate-500">Premium document answers</p>
                </div>
              </div>
              <select
                value={selectedDocumentId}
                onChange={(event) => setSelectedDocumentId(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="">All completed documents</option>
                {completedDocuments.map((document) => (
                  <option key={document.id} value={document.id}>{document.originalName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 text-center text-sm text-slate-500">
                Ask a question about your uploaded documents.
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[min(760px,90%)] rounded-lg px-4 py-3 text-sm leading-6 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"
                  }`}>
                    {message.role === "assistant" ? <Markdown>{message.content}</Markdown> : message.content}
                    {message.sources?.length > 0 && (
                      <div className="mt-3 border-t border-slate-200 pt-2 text-xs text-slate-500">
                        {message.sources.map((source) => `${source.fileName}${source.page ? `, page ${source.page}` : ""}`).join(" · ")}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {asking && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Thinking...</div>}
          </div>

          <form onSubmit={askQuestion} className="border-t border-slate-200 p-4">
            <div className="flex gap-3">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                disabled={asking || completedDocuments.length === 0}
                placeholder={completedDocuments.length === 0 ? "Upload a completed document first" : "Ask a question about your documents..."}
                className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
              />
              <button
                type="submit"
                disabled={asking || completedDocuments.length === 0 || !question.trim()}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:opacity-60"
                title="Send"
              >
                {asking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
};

const statusClass = (status) => {
  if (status === "COMPLETED") return "bg-emerald-100 text-emerald-700";
  if (status === "FAILED") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
};

export default DocumentChat;
