import React, { useState } from "react";
import "./ChatBoot.css";
import { useTranslation } from "../../TranslationContext"; // Asegúrate de importar el contexto

function ChatBoot() {
  const { translate } = useTranslation(); // Obtener la función translate
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: translate("chatbotGreeting") },
  ]);
  const [showButtons, setShowButtons] = useState(true);
  const [userMessage, setUserMessage] = useState("");
  const [isConversationEnded, setIsConversationEnded] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  // Detectar patrones y generar respuestas simuladas de IA
  const generateResponse = (message) => {
    const userInput = message.toLowerCase();

    // Respuestas básicas por patrones
    if (userInput.includes(translate("queryHelloKey").toLowerCase())) {
      return translate("responseHello");
    }

    if (userInput.includes(translate("queryProductKey").toLowerCase())) {
      return translate("responseProducts");
    }

    if (userInput.includes(translate("queryPriceKey").toLowerCase())) {
      return translate("responsePrices");
    }
    if (userInput.includes(translate("querySizeKey").toLowerCase())) {
      return translate("responseSizes");
    }
    if (userInput.includes(translate("queryShippingKey").toLowerCase())) {
      return translate("responseShipping");
    }

    if (userInput.includes(translate("queryRegisterKey").toLowerCase())) {
      return translate("responseRegister");
    }

    if (userInput.includes(translate("queryThanksKey").toLowerCase())) {
      return translate("responseThanks");
    }

    if (userInput.includes(translate("queryGoodbyeKey").toLowerCase())) {
      return translate("responseGoodbye");
    }
    if (userInput.includes(translate("queryHelpMe").toLowerCase())) {
      return translate("responseHelpMe");
    }

    // Respuesta genérica si no se encuentra un patrón
    return translate("responseNotUnderstood");
  };

  const sendMessage = (text) => {
    const userText = text || userMessage.trim();
    if (!userText || isConversationEnded) return;

    // Mensaje del usuario
    const userMessageObject = { role: "user", content: userText };
    const newMessages = [...messages, userMessageObject];
    setMessages(newMessages);

    // Generar la respuesta del bot basada en el mensaje del usuario
    const botResponse = generateResponse(userText);
    if (botResponse) {
      const botMessageObject = { role: "assistant", content: botResponse };
      setMessages([...newMessages, botMessageObject]);
    }

    setShowButtons(false);
    setUserMessage("");
  };

  const endConversation = () => {
    setMessages([
      ...messages,
      { role: "assistant", content: translate("chatbotGoodbye") },
    ]);
    setIsConversationEnded(true);
    setShowButtons(false);
  };

  const restartConversation = () => {
    setMessages([{ role: "assistant", content: translate("chatbotGreeting") }]);
    setUserMessage("");
    setIsConversationEnded(false);
    setShowButtons(true);
  };

  const handleAnotherQuery = () => {
    setMessages([{ role: "assistant", content: translate("chatbotGreeting") }]);
    setUserMessage("");
    setShowButtons(true);
  };

  return (
    <div>
      <div className="chatboot" onClick={toggleChat}>
        <i className="fa-solid fa-comments"></i>
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>{translate("chatbotTitle")}</h4>
            <button className="close-btn" onClick={toggleChat}>
              ✖
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.role === "user" ? "user-message" : "bot-message"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.content }}
              ></div>
            ))}

            {!isConversationEnded && showButtons && (
              <div className="quick-replies">
                <button
                  onClick={() => sendMessage(translate("queryProductKey"))}
                >
                  {translate("btnProducts")}
                </button>
                <button onClick={() => sendMessage(translate("queryPriceKey"))}>
                  {translate("btnPrices")}
                </button>
                <button onClick={() => sendMessage(translate("querySizeKey"))}>
                  {translate("btnSizes")}
                </button>
                <button
                  onClick={() => sendMessage(translate("queryShippingKey"))}
                >
                  {translate("btnShipping")}
                </button>
                <button
                  onClick={() => sendMessage(translate("queryRegisterKey"))}
                >
                  {translate("btnRegister")}
                </button>
                <button onClick={() => sendMessage(translate("queryHelpMe"))}>
                  {translate("btnHelp")}
                </button>
              </div>
            )}

            {!isConversationEnded && !showButtons && (
              <div className="quick-replies">
                <button onClick={handleAnotherQuery}>
                  {translate("btnAnotherQuery")}
                </button>
                <button onClick={endConversation}>{translate("btnEnd")}</button>
              </div>
            )}

            {isConversationEnded && (
              <div className="quick-replies">
                <button onClick={restartConversation}>
                  {translate("btnRestart")}
                </button>
              </div>
            )}
          </div>

          {!isConversationEnded && (
            <div className="chatbot-footer">
              <input
                type="text"
                placeholder={translate("inputPlaceholder")}
                className="chatbot-input"
                value={userMessage}
                onChange={(e) =>
                  setUserMessage(
                    e.target.value.charAt(0).toUpperCase() +
                      e.target.value.slice(1)
                  )
                }
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="send-btn" onClick={() => sendMessage()}>
                {translate("btnSend")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatBoot;
