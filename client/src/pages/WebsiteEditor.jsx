import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { Code2, MessageSquare, Monitor, Rocket, Send, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import Editor from "@monaco-editor/react";

function WebsiteEditor() {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const iframeRef = useRef(null);
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [updateLocading, setUpadateLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showFullPreview, setShowFullPriview] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [thinkingIdx, setThinkingIdx] = useState(0);
  const thinkingSteps = [
    "Understanding your request...",
    "Planning layout changes..",
    "Impoving responsiveness...",
    "Applaying animation...",
    "Finalizing updateCurrentUser....",
  ];

  const handleUpdate = async () => {
    if (!prompt) {
      return;
    }
    setUpadateLoading(true);
    const text = prompt;
    setPrompt("");
    setMessages((m) => [...m, { role: "user", content: prompt }]);
    try {
      console.log("Sending Prompt:", prompt);
      const result = await axios.post(
        `${serverUrl}/api/website/update/${id}`,
        { prompt: text },
        { withCredentials: true },
      );
      console.log(result);

      setUpadateLoading(false);
      setMessages((m) => [...m, { role: "ai", content: result.data.messages }]); // aagal na massage as it is new add
      setCode(result.data.code);
    } catch (error) {
      setUpadateLoading(false);
      console.log("STATUS:", error.response?.status);
      console.log("ERROR:", error.response?.data);
    }
  };

  const handleDeploy = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/website/deploy/${website._id}`,
        {
          withCredentials: true,
        },
      );

      window.open(`${result.data.url}`, "_blank");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!updateLocading) return;
    const i = setInterval(() => {
      setThinkingIdx((i) => (i + 1) % thinkingSteps.length);
    }, 1200);
    return () => clearInterval(i);
  }, [updateLocading]);

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/get-by-id/${id}`,
          {
            withCredentials: true,
          },
        );
        setWebsite(result.data);
        setCode(result.data.latestCode);
        setMessages(result.data.conversation);
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
      }
    };
    handleGetWebsite();
  }, [id]);

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    //file like obj hoy immutable text,binary data read kri saki-->code ne url ma conver kri chhi//ifreme mate
    const blob = new Blob([code], { type: "text/html" });

    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [code]);

  if (error) {
    return (
      <div className="h-screen flex items-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
      {/* left side chating*/}
      <aside className="hidden lg:flex w-[380px] flex-col border-r border-white/10 bg-black/80">
        <Header />
        {/* <Chat /> */}
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] ${
                  m.role === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${
            m.role === "user"
              ? "bg-white text-black"
              : "bg-white/5 border border-white/10 text-zinc-200"
          }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {updateLocading && (
              <div className="max-w-[85%] mr-auto">
                <div className="px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
                  {thinkingSteps[thinkingIdx]}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                placeholder="Describe your changes...."
                className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-outline-none"
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
              />
              <button
                className="px-4 py-3 rounded-2xl bg-white text-black"
                onClick={handleUpdate}
                disabled={updateLocading}
              >
                {" "}
                <Send size={14} />{" "}
              </button>
            </div>
          </div>
        </>
      </aside>

      {/*right side area */}

      <div className="flex-1 flex flex-col">
        {/*right  header area */}
        <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
          <span className="text-xs text-zinc-400">Live Preview</span>
          <div className="flex gap-2">
            {website.deployed ? (
              ""
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition "
                onClick={handleDeploy}
              >
                <Rocket size={14} />
                Deploye
              </button>
            )}

            <button className="p-2 lg:hidden" onClick={() => setShowChat(true)}>
              <MessageSquare size={18} />
            </button>
            <button className="p-2" onClick={() => setShowCode(true)}>
              <Code2 size={18} />
            </button>
            <button className="p-2" onClick={() => setShowFullPriview(true)}>
              <Monitor size={18} />
            </button>
          </div>
        </div>

        <iframe
          ref={iframeRef}
          sandbox="allow-scripts allow-same-origin allow-forms"
          className="flex-1 w-full bg-white"
        />
      </div>

      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col"
          >
            <Header onClose={() => setShowChat(false)} />
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] ${
                      m.role === "user" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${
            m.role === "user"
              ? "bg-white text-black"
              : "bg-white/5 border border-white/10 text-zinc-200"
          }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {updateLocading && (
                  <div className="max-w-[85%] mr-auto">
                    <div className="px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
                      {thinkingSteps[thinkingIdx]}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    placeholder="Describe your changes...."
                    className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-outline-none"
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                  />
                  <button
                    className="px-4 py-3 rounded-2xl bg-white text-black"
                    onClick={handleUpdate}
                    disabled={updateLocading}
                  >
                    {" "}
                    <Send size={14} />{" "}
                  </button>
                </div>
              </div>
            </>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.35,
              ease: "easeInOut",
            }}
            className="fixed top-0 right-0 h-full w-full lg:w-[45%] z-[9999] bg-[#1e1e1e] flex flex-col shadow-2xl"
          >
            <div className="h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]">
              <span className="text-sm font-medium">index.htm</span>
              <button onClick={() => setShowCode(false)}>
                <X size={18} />
              </button>
            </div>

            <Editor
              theme="vs-dark"
              value={code}
              language="html"
              onChange={(v) => setCode(v)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFullPreview && (
          <motion.div className="fixed inset-0 z-[9999] bg-black">
            <iframe
              className="w-full h-full bg-white "
              srcDoc={code}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
            <button
              className="absolute top-4 right-4 p-2 bg-black/70 rounded-lg"
              onClick={() => setShowFullPriview(false)}
            >
              <X />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  function Header({ onClose }) {
    return (
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
        <span className="font-semibold truncate">{website.title}</span>
        {onClose && (
          <button onClick={onClose}>
            <X size={18} color="white" />
          </button>
        )}
      </div>
    );
  }
}

export default WebsiteEditor;
