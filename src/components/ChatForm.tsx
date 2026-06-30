import { useEffect, useRef, useState } from "react";

interface ChatStep {
  id: string;
  botMessage: string;
  inputType: "text" | "email" | "textarea" | "choice";
  placeholder?: string;
  choices?: string[];
  fieldName: string;
  validation?: (value: string) => string | null;
}

const CHAT_STEPS: ChatStep[] = [
  {
    id: "name",
    botMessage: "Hey there 👋 I'm Pranav's assistant. What's your name?",
    inputType: "text",
    placeholder: "Your name...",
    fieldName: "name",
    validation: (value) =>
      value.trim().length < 2 ? "Please enter at least 2 characters" : null,
  },
  {
    id: "type",
    botMessage: "Nice to meet you, {name}! What brings you here?",
    inputType: "choice",
    choices: ["💼 Work opportunity", "🤝 Collaboration", "💬 Just saying hi", "🛠️ Project inquiry"],
    fieldName: "type",
  },
  {
    id: "email",
    botMessage: "Great! What's the best email to reach you?",
    inputType: "email",
    placeholder: "your@email.com",
    fieldName: "email",
    validation: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Please enter a valid email",
  },
  {
    id: "message",
    botMessage: "What would you like to tell Pranav?",
    inputType: "textarea",
    placeholder: "Your message...",
    fieldName: "message",
    validation: (value) =>
      value.trim().length < 10 ? "Please write at least 10 characters" : null,
  },
];

interface FormDataState {
  [key: string]: string;
}

type FormStatus = "idle" | "typing" | "submitted" | "error";

export function ChatForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormDataState>({});
  const [messages, setMessages] = useState<
    Array<{ id: string; sender: "bot" | "user"; text: string; animate?: boolean }>
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  useEffect(() => {
    const saved = sessionStorage.getItem("chat_form_progress");
    if (!saved) return;
    try {
      const { step, data, msgs } = JSON.parse(saved) as {
        step: number;
        data: FormDataState;
        msgs: Array<{ id: string; sender: "bot" | "user"; text: string; animate?: boolean }>;
      };
      setCurrentStep(step);
      setFormData(data);
      setMessages(msgs);
      setHasStarted(true);
    } catch {
      sessionStorage.removeItem("chat_form_progress");
    }
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    sessionStorage.setItem(
      "chat_form_progress",
      JSON.stringify({
        step: currentStep,
        data: formData,
        msgs: messages,
      }),
    );
  }, [currentStep, formData, messages, hasStarted]);

  const interpolate = (text: string) =>
    text.replace(/\{(\w+)\}/g, (_, key: string) => formData[key] || key);

  const addBotMessage = async (text: string) => {
    setIsBotTyping(true);
    setStatus("typing");
    await new Promise((resolve) => window.setTimeout(resolve, 900 + text.length * 12));
    setIsBotTyping(false);
    setStatus("idle");
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: interpolate(text),
        animate: true,
      },
    ]);
  };

  const startChat = async () => {
    setHasStarted(true);
    await addBotMessage(CHAT_STEPS[0].botMessage);
  };

  const handleSubmitAnswer = async (value: string) => {
    const step = CHAT_STEPS[currentStep];
    if (!step) return;

    if (step.validation) {
      const err = step.validation(value);
      if (err) {
        setInputError(err);
        return;
      }
    }

    setInputError(null);
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: value,
      },
    ]);

    const newData = { ...formData, [step.fieldName]: value };
    setFormData(newData);
    setInputValue("");

    const nextIdx = currentStep + 1;
    if (nextIdx < CHAT_STEPS.length) {
      setCurrentStep(nextIdx);
      await addBotMessage(CHAT_STEPS[nextIdx].botMessage);
      return;
    }

    await addBotMessage(
      "Thanks! I'll make sure Pranav sees this. Expect a reply within 24 hours 🙌",
    );
    setStatus("submitted");
    sessionStorage.removeItem("chat_form_progress");

    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY ?? "YOUR_KEY",
          subject: `Portfolio contact: ${newData.type}`,
          from_name: newData.name,
          email: newData.email,
          message: newData.message,
          type: newData.type,
        }),
      });
    } catch (err) {
      console.error("[ChatForm] Submit error:", err);
      setStatus("error");
    }
  };

  const step = CHAT_STEPS[currentStep];

  return (
    <div className="chat-form-wrap">
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-avatar">
            <span>P</span>
            <span className="chat-avatar-online" />
          </div>
          <div className="chat-header-info">
            <span className="chat-header-name">Pranav&apos;s Assistant</span>
            <span className="chat-header-status">{isBotTyping ? "typing..." : "online"}</span>
          </div>
        </div>

        <div className="chat-messages">
          {!hasStarted ? (
            <div className="chat-start-prompt">
              <p>Want to get in touch?</p>
              <button className="chat-start-btn" onClick={startChat} data-cursor="hover">
                Start conversation →
              </button>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble chat-bubble--${msg.sender}${msg.animate ? " is-entering" : ""}`}
                >
                  {msg.sender === "bot" ? <span className="chat-bubble-avatar">P</span> : null}
                  <span className="chat-bubble-text">{msg.text}</span>
                </div>
              ))}
              {isBotTyping ? (
                <div className="chat-bubble chat-bubble--bot is-entering">
                  <span className="chat-bubble-avatar">P</span>
                  <span className="chat-typing-indicator">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              ) : null}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {hasStarted && status === "idle" && !isBotTyping ? (
          <div className="chat-input-bar">
            {inputError ? <span className="chat-input-error">{inputError}</span> : null}

            {step?.inputType === "choice" ? (
              <div className="chat-choices">
                {step.choices?.map((choice) => (
                  <button
                    key={choice}
                    className="chat-choice-btn"
                    onClick={() => handleSubmitAnswer(choice)}
                    data-cursor="hover"
                  >
                    {choice}
                  </button>
                ))}
              </div>
            ) : step?.inputType === "textarea" ? (
              <div className="chat-input-row">
                <textarea
                  ref={inputRef as React.Ref<HTMLTextAreaElement>}
                  className="chat-input"
                  placeholder={step.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) {
                      void handleSubmitAnswer(inputValue);
                    }
                  }}
                />
                <button
                  className="chat-send-btn"
                  onClick={() => void handleSubmitAnswer(inputValue)}
                  disabled={!inputValue.trim()}
                  data-cursor="hover"
                >
                  ↑
                </button>
              </div>
            ) : (
              <div className="chat-input-row">
                <input
                  ref={inputRef as React.Ref<HTMLInputElement>}
                  type={step?.inputType === "email" ? "email" : "text"}
                  className="chat-input"
                  placeholder={step?.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      void handleSubmitAnswer(inputValue);
                    }
                  }}
                  autoFocus
                />
                <button
                  className="chat-send-btn"
                  onClick={() => void handleSubmitAnswer(inputValue)}
                  disabled={!inputValue.trim()}
                  data-cursor="hover"
                >
                  ↑
                </button>
              </div>
            )}

            <div className="chat-step-dots">
              {CHAT_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`chat-step-dot${i < currentStep ? " is-done" : i === currentStep ? " is-active" : ""}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {status === "submitted" ? (
          <div className="chat-submitted">
            <span className="chat-submitted-icon">✓</span>
            <p>Message sent!</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
