import { useState, useRef, useEffect } from "react";
import { chatWithNotes } from "../services/api";

export default function ChatWithNotes() {
  const [file, setFile] = useState(null);
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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setMessages([]);
      setError("");
    } else {
      setError("Only PDF files are supported.");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected?.type === "application/pdf") {
      setFile(selected);
      setMessages([]);
      setError("");
    } else {
      setError("Only PDF files are supported.");
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !file || loading) return;

    const userMessage = { role: "user", text: input.trim() };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await chatWithNotes(file, input.trim(), messages);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Chat with Notes
        </h1>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          Upload your PDF and ask anything about your study material.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-6 animate-fade-up-delay-1">

        {/* ── Left Panel: PDF Upload ── */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--text-muted)" }}>
              Study Material
            </p>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all"
              style={{
                borderColor: dragOver ? "var(--accent)" : file ? "var(--accent)" : "var(--border)",
                backgroundColor: dragOver ? "var(--accent-light)" : file ? "var(--accent-light)" : "var(--bg-subtle)",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: "var(--accent)", color: "#fff" }}
                  >
                    📄
                  </div>
                  <p className="font-semibold text-sm leading-tight" style={{ color: "var(--text-primary)" }}>
                    {file.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); setMessages([]); }}
                    className="text-xs font-medium px-3 py-1 rounded-lg mt-1 transition-all"
                    style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)" }}
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">☁️</span>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Drop your PDF here
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    or click to browse
                  </p>
                </div>
              )}
            </div>

            {error && (
              <p className="mt-2 text-xs" style={{ color: "#ef4444" }}>{error}</p>
            )}
          </div>

          {/* Tips */}
          <div
            className="rounded-2xl border p-5"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
              Tips
            </p>
            {[
              "Ask specific questions about your notes",
              "Request summaries of sections",
              "Ask to explain complex concepts",
              "Request examples from the content",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-2 mb-2">
                <span style={{ color: "var(--accent)" }} className="text-xs mt-0.5">✦</span>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel: Chat ── */}
        <div
          className="rounded-2xl border flex flex-col overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow)",
            height: "600px",
          }}
        >
          {/* Chat Header */}
          <div
            className="px-6 py-4 border-b flex items-center gap-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
            >
              💬
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {file ? file.name : "No file uploaded"}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {file ? "Ready to answer questions" : "Upload a PDF to start chatting"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-50">
                <span className="text-4xl">📚</span>
                <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
                  {file
                    ? "Ask anything about your notes!"
                    : "Upload a PDF on the left to get started."}
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}
              >
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { backgroundColor: "var(--accent)", color: "#fff", borderBottomRightRadius: "4px" }
                      : { backgroundColor: "var(--bg-subtle)", color: "var(--text-primary)", borderBottomLeftRadius: "4px" }
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading bubble */}
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

          {/* Input */}
          <div
            className="px-4 py-4 border-t flex items-center gap-3"
            style={{ borderColor: "var(--border)" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={file ? "Ask a question about your notes..." : "Upload a PDF first..."}
              disabled={!file}
              className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--bg-subtle)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!file || !input.trim() || loading}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
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