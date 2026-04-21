import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { uploadPDF, chatWithNotes, deleteDocument } from "../services/api";
import remarkGfm from "remark-gfm";

export default function ChatWithNotes() {
  const [files, setFiles] = useState([]);
  const [docId, setDocId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (docId) deleteDocument(docId);
    };
  }, [docId]);

  const uploadFiles = async (newFiles) => {
    if (docId) {
      await deleteDocument(docId);
      setDocId(null);
      setMessages([]);
    }
    setError("");
    setUploading(true);
    try {
      const data = await uploadPDF(newFiles);
      setDocId(data.doc_id);
    } catch (err) {
      setError(err.message || "Failed to process PDFs. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFilesSelected = async (selectedFiles) => {
    const pdfs = Array.from(selectedFiles).filter(
      (f) => f.type === "application/pdf" || f.name.endsWith(".pdf")
    );
    if (pdfs.length === 0) {
      setError("Only PDF files are supported.");
      return;
    }
    if (pdfs.some((f) => f.size > 10 * 1024 * 1024)) {
      setError("Each file must be under 10MB.");
      return;
    }
    const merged = [...files, ...pdfs].slice(0, 5);
    setFiles(merged);
    await uploadFiles(merged);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleRemoveFile = async (indexToRemove) => {
    const updated = files.filter((_, i) => i !== indexToRemove);
    setFiles(updated);
    if (updated.length === 0) {
      if (docId) await deleteDocument(docId);
      setDocId(null);
      setMessages([]);
    } else {
      await uploadFiles(updated);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !docId || loading) return;
    const userMessage = { role: "user", text: input.trim() };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const reply = await chatWithNotes(docId, input.trim(), messages);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Chat with Notes
        </h1>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          Upload up to 5 PDFs and ask anything about your study material.
        </p>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 animate-fade-up-delay-1">
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--text-muted)" }}>
              Study Materials ({files.length}/5)
            </p>

            <div
              onClick={() => !uploading && files.length < 5 && fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="rounded-xl border-2 border-dashed p-5 text-center transition-all mb-4"
              style={{
                borderColor: dragOver ? "var(--accent)" : "var(--border)",
                backgroundColor: dragOver ? "var(--accent-light)" : "var(--bg-subtle)",
                cursor: files.length >= 5 ? "not-allowed" : "pointer",
                opacity: files.length >= 5 ? 0.5 : 1,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 animate-spin"
                    style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
                  />
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Processing...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">☁️</span>
                  <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    {files.length >= 5 ? "Max 5 PDFs reached" : "Drop PDFs here or click to browse"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>PDF only · max 10MB each</p>
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="flex flex-col gap-2">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ backgroundColor: "var(--bg-subtle)" }}
                  >
                    <span className="text-base shrink-0">📄</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {file.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(i)}
                      disabled={uploading}
                      className="text-xs shrink-0 transition-colors disabled:opacity-40"
                      style={{ color: "var(--text-muted)" }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <p className="text-xs mt-1" style={{ color: docId ? "#16a34a" : "var(--text-muted)" }}>
                  {uploading ? "Re-processing..." : docId ? `✓ ${files.length} PDF${files.length > 1 ? "s" : ""} ready` : ""}
                </p>
              </div>
            )}

            {error && (
              <p className="mt-2 text-xs" style={{ color: "#ef4444" }}>{error}</p>
            )}
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
              Tips
            </p>
            {[
              "Upload multiple PDFs to compare topics",
              "Ask specific questions about your notes",
              "Request summaries of sections",
              "Ask to explain complex concepts",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-2 mb-2">
                <span style={{ color: "var(--accent)" }} className="text-xs mt-0.5">✦</span>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl border flex flex-col overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow)",
            height: "600px",
          }}
        >
          <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
            >
              💬
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {files.length === 0
                  ? "No files uploaded"
                  : files.length === 1
                  ? files[0].name
                  : `${files.length} PDFs loaded`}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {uploading
                  ? "Processing your PDFs..."
                  : docId
                  ? "Ready to answer questions"
                  : "Upload PDFs to start chatting"}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-50">
                <span className="text-4xl">📚</span>
                <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
                  {uploading
                    ? "Processing your PDFs..."
                    : docId
                    ? "Ask anything about your notes!"
                    : "Upload PDFs on the left to get started."}
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}>
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { backgroundColor: "var(--accent)", color: "#fff", borderBottomRightRadius: "4px" }
                      : { backgroundColor: "var(--bg-subtle)", color: "var(--text-primary)", borderBottomLeftRadius: "4px" }
                  }
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 flex flex-col gap-1">{children}</ol>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 flex flex-col gap-1">{children}</ul>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        h1: ({ children }) => <h1 className="font-display font-bold text-lg mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="font-display font-bold text-base mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="font-semibold mb-1">{children}</h3>,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-up">
                <div
                  className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                  style={{ backgroundColor: "var(--bg-subtle)", borderBottomLeftRadius: "4px" }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: "var(--text-muted)",
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-4 border-t flex items-end gap-3" style={{ borderColor: "var(--border)" }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!docId || uploading}
              placeholder={
                uploading ? "Processing PDFs..." : docId ? "Ask a question..." : "Upload PDFs first..."
              }
              rows={1}
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed resize-none"
              style={{
                backgroundColor: "var(--bg-subtle)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
                maxHeight: "120px",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!docId || !input.trim() || loading}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              style={{ backgroundColor: "var(--accent)" }}
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}