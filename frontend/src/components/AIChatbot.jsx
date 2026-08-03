import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X,Trash2, Copy, Mic,Volume2,Square} from "lucide-react";
const CHAT_STORAGE_KEY = "campusPilotChatHistory";
function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I am CampusPilot AI. Ask me any academic doubt.",
    },
  ]);
const [isTyping, setIsTyping] = useState(false);
const [error, setError] = useState("");
const messagesEndRef = useRef(null);
const [isListening, setIsListening] = useState(false);
const recognitionRef = useRef(null);
const [speakingMessageId, setSpeakingMessageId] = useState(null);
const [userSettings, setUserSettings] = useState({
  aiLanguage: "English",
  answerStyle: "Simple",
  voiceOutput: true,
  saveChatHistory: true,
});
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);
useEffect(() => {
  const savedChats = localStorage.getItem(CHAT_STORAGE_KEY);

  if (savedChats) {
    setMessages(JSON.parse(savedChats));
  }
}, []);
useEffect(() => {
  const savedSettings = localStorage.getItem("campusPilotSettings");

  if (savedSettings) {
    try {
      setUserSettings(JSON.parse(savedSettings));
    } catch (error) {
      console.error(error);
    }
  }
}, []);
useEffect(() => {
  if (userSettings.saveChatHistory) {
    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify(messages)
    );
  }
}, [messages, userSettings]);
  const handleSend = async () => {
  const trimmedMessage = message.trim();

  if (!trimmedMessage || isTyping) {
    return;
  }

  const userMessage = {
    id: Date.now(),
    sender: "user",
    text: trimmedMessage,
  };

  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);
  setMessage("");
  setError("");
  setIsTyping(true);

  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(
   `${API_URL}/api/chatbot/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "AI response failed.");
    }

    const botMessage = {
      id: Date.now() + 1,
      sender: "bot",
      text: data.reply,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      botMessage,
    ]);
  } catch (requestError) {
    console.error("Chatbot request error:", requestError);

    setError(
      "AI response failed. Backend running undo check cheyyi."
    );
  } finally {
    setIsTyping(false);
  }
};
const clearChat = () => {
  const defaultMessage = [
    {
      id: 1,
      sender: "bot",
      text: "Hi! I am CampusPilot AI. Ask me any academic doubt.",
    },
  ];

  setMessages(defaultMessage);

  localStorage.removeItem(CHAT_STORAGE_KEY);
};
const copyMessage = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error(error);
  }
};
const startVoiceInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    setError(
      "Voice recognition is not supported in this browser. Use Chrome or Edge."
    );
    return;
  }

  if (isListening) {
    recognitionRef.current?.stop();
    setIsListening(false);
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = true;

  recognitionRef.current = recognition;

  recognition.onstart = () => {
    setIsListening(true);
    setError("");
  };

  recognition.onresult = (event) => {
    let spokenText = "";

    for (let index = event.resultIndex; index < event.results.length; index++) {
      spokenText += event.results[index][0].transcript;
    }

    setMessage(spokenText);
  };
recognition.onerror = (event) => {
  console.error("Voice recognition error:", event.error);

  const errorMessages = {
    "not-allowed": "Microphone permission was denied.",
    "audio-capture": "Microphone not detected.",
    "no-speech": "No speech detected. Please speak clearly.",
    network:
      "Voice service network error. Check internet and try again in Chrome or Edge.",
  };

  setError(
    errorMessages[event.error] ||
      "Voice recognition failed. Please try again."
  );

  setIsListening(false);
};

  recognition.onend = () => {
    setIsListening(false);
  };

  recognition.start();
};
const speakMessage = (text, messageId) => {
  if (!userSettings.voiceOutput) {
  setError("Voice Output is disabled in Settings.");
  return;
}
  if (!window.speechSynthesis) {
    setError("Text-to-speech is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  if (speakingMessageId === messageId) {
    setSpeakingMessageId(null);
    return;
  }

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-IN";
  speech.rate = 1;
  speech.pitch = 1;

  speech.onstart = () => {
    setSpeakingMessageId(messageId);
  };

  speech.onend = () => {
    setSpeakingMessageId(null);
  };

  speech.onerror = () => {
    setSpeakingMessageId(null);
    setError("Unable to read the answer aloud.");
  };

  window.speechSynthesis.speak(speech);
};

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/30"
        aria-label="Open AI chatbot"
      >
        <MessageCircle size={26} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-colors duration-300 dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-800">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-100 p-2 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                <Bot size={22} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">
                  CampusPilot AI
                </h2>

                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                title="Clear Chat"
                aria-label="Clear chat"
              >
                <Trash2 size={18} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Close AI chatbot"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4 dark:bg-slate-900">
            {messages.map((chatMessage) => (
              <div
                key={chatMessage.id}
                className={`flex ${
                  chatMessage.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    chatMessage.sender === "user"
                      ? "rounded-br-md bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {chatMessage.text}
                  </p>

                  {chatMessage.sender === "bot" && (
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => copyMessage(chatMessage.text)}
                        className="inline-flex items-center gap-1 text-xs text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                      >
                        <Copy size={13} />
                        Copy
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          speakMessage(chatMessage.text, chatMessage.id)
                        }
                        className="inline-flex items-center gap-1 text-xs text-cyan-600 transition hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                        title={
                          speakingMessageId === chatMessage.id
                            ? "Stop speaking"
                            : "Read answer aloud"
                        }
                      >
                        {speakingMessageId === chatMessage.id ? (
                          <>
                            <Square size={13} />
                            Stop
                          </>
                        ) : (
                          <>
                            <Volume2 size={14} />
                            Listen
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-bl-md rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-white/10 dark:bg-slate-800 dark:text-slate-300">
                  CampusPilot AI is thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            {error && (
              <p className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </p>
            )}

            <div className="flex items-end gap-2 rounded-xl border border-slate-300 bg-slate-50 p-2 transition focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/10 dark:border-white/10 dark:bg-slate-950">
              <textarea
                value={message || ""}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your doubt..."
                rows={1}
                className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600"
              />

              <button
                type="button"
                onClick={startVoiceInput}
                className={`rounded-lg p-3 transition ${
                  isListening
                    ? "animate-pulse bg-red-500 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
                aria-label={
                  isListening ? "Stop listening" : "Start voice input"
                }
                title={isListening ? "Listening..." : "Ask using voice"}
              >
                <Mic size={18} />
              </button>

              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim() || isTyping}
                className="rounded-lg bg-cyan-500 p-3 text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-600">
              CampusPilot AI may make mistakes. Verify important answers.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;