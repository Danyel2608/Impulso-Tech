import React, { useState } from "react";
import "./ChatBoot.css";

function ChatBoot() {
  // Estado para manejar la apertura del chatbot
  const [isOpen, setIsOpen] = useState(false);

  // Estado para almacenar los mensajes de la conversación
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hola, ¿en qué puedo ayudarte?" },
  ]);

  // Estado para manejar los botones y las opciones
  const [showButtons, setShowButtons] = useState(true);
  const [userMessage, setUserMessage] = useState("");
  const [isConversationEnded, setIsConversationEnded] = useState(false); // Estado para manejar si la conversación está terminada

  // Función para alternar la ventana del chatbot
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Función que devuelve la respuesta programada según el mensaje del usuario
  const getProgrammedResponse = (message) => {
    if (message.includes("productos")) {
      return `<ul class="product-info-chat">
      <li><strong>Disponibilidad</strong>: Verifica los productos disponibles en nuestra página web.</li>
      <li><strong>Tipos</strong>: Ropa urbana, accesorios y calzado.</li>
      <li><strong>Catálogo</strong>: <a href="/products" target="_blank" rel="noopener noreferrer">Ver catálogo</a></li>
      <li><strong>Tendencias</strong>: Descubre las últimas tendencias en moda urbana.</li>
    </ul>    
    `;
    }
    if (message.includes("precios") || message.includes("descuentos")) {
      return "Tenemos ofertas especiales y precios de artículos en nuestra tienda. Revisa las promociones actuales en la sección de 'Rebajas' en la página web.";
    }
    if (message.includes("tallas") || message.includes("ajustes")) {
      return "Consulta nuestra guía de tallas aquí: [Enlace a la guía de tallas]. Además, si tienes preguntas sobre disponibilidad de tallas, consulta nuestros productos.";
    }
    if (message.includes("envíos") || message.includes("devoluciones")) {
      return `Para saber cómo recibir tu pedido o devolver productos, visita nuestra sección de Envíos y Devoluciones en la página web. 
              También puedes revisar la política de devoluciones para más detalles.`;
    }
    if (message.includes("registrarse") || message.includes("crear cuenta")) {
      return "Puedes crear una cuenta o recuperar la tuya desde la página de registro en el encabezado de nuestra tienda. Haz clic en 'Iniciar sesión' y sigue los pasos.";
    }
    if (message.includes("horarios") || message.includes("contacto")) {
      return `Nuestro horario es de lunes a viernes, de 9:00 a 18:00. 
              Puedes visitarnos en Calle Ejemplo, Ciudad Ejemplo. 
              Para contacto, también tenemos el correo: contacto@example.com.`;
    }
    if (message.includes("políticas")) {
      return `Nuestra tienda tiene políticas de privacidad, devoluciones y términos de uso. Puedes consultarlas en los enlaces al pie de la página de inicio de nuestra tienda.`;
    }
    // Se resetean los botones iniciales y se termina la conversación cuando se pide otra consulta
    if (message.includes("otra consulta")) {
      return ""; // Evitamos que se genere un mensaje vacío de respuesta
    }

    return "Lo siento, no entendí tu mensaje. ¿Podrías reformularlo?";
  };

  // Función para manejar el envío de mensajes
  const sendMessage = (text) => {
    const userText = text || userMessage.trim();
    if (!userText || isConversationEnded) return; // Evitar mensajes vacíos o cuando la conversación esté terminada

    // Agregar el mensaje del usuario a la lista
    const userMessageObject = { role: "user", content: userText };
    const newMessages = [...messages, userMessageObject];
    setMessages(newMessages);

    // Calcular la respuesta del chatbot
    const botResponse = getProgrammedResponse(userText);
    if (botResponse) {
      const botMessageObject = { role: "assistant", content: botResponse };
      setMessages([...newMessages, botMessageObject]);
    }

    // Ocultar los botones después de la selección
    setShowButtons(false);

    // Limpia el campo de entrada
    setUserMessage("");
  };

  // Función para terminar la conversación
  const endConversation = () => {
    setMessages([
      ...messages,
      {
        role: "assistant",
        content: "Espero haberte ayudado, gracias por elegir ModaUrbana.",
      },
    ]);
    setIsConversationEnded(true); // Marcar como finalizada la conversación
    setShowButtons(false); // Desaparecer botones al finalizar
  };

  // Función para reiniciar la conversación
  const restartConversation = () => {
    setMessages([
      { role: "assistant", content: "Hola, ¿en qué puedo ayudarte?" },
    ]);
    setUserMessage("");
    setIsConversationEnded(false); // Volver a permitir interacción
    setShowButtons(true); // Volver a mostrar los botones de opciones
  };

  // Función especial para manejar el clic en "Otra consulta"
  const handleAnotherQuery = () => {
    setShowButtons(true); // Mostrar nuevamente los botones de opciones
    setMessages([
      { role: "assistant", content: "Hola, ¿en qué puedo ayudarte?" },
    ]); // Reiniciar los mensajes
    setUserMessage(""); // Limpiar el campo de entrada
  };

  return (
    <div>
      {/* Ícono del chatbot */}
      <div className="chatboot" onClick={toggleChat}>
        <i className="fa-solid fa-comments"></i>
      </div>

      {/* Ventana del chatbot (se muestra solo si está abierto) */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Encabezado del chatbot */}
          <div className="chatbot-header">
            <h4>Asistente Virtual</h4>
            <button className="close-btn" onClick={toggleChat}>
              ✖
            </button>
          </div>

          {/* Cuerpo del chatbot */}
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

            {/* Mostrar los botones de opciones al principio */}
            {!isConversationEnded && showButtons && (
              <div className="quick-replies">
                <button onClick={() => sendMessage("productos")}>
                  Productos
                </button>
                <button onClick={() => sendMessage("precios")}>
                  Precios y descuentos
                </button>
                <button onClick={() => sendMessage("tallas")}>
                  Tallas y ajustes
                </button>
                <button onClick={() => sendMessage("envíos")}>
                  Envíos y devoluciones
                </button>
                <button onClick={() => sendMessage("registrarse")}>
                  Registrarse o crear cuenta
                </button>
                <button onClick={() => sendMessage("horarios")}>
                  Horarios y contacto
                </button>
                <button onClick={() => sendMessage("políticas")}>
                  Políticas
                </button>
              </div>
            )}

            {/* Preguntar por más consultas después de mostrar la respuesta */}
            {!isConversationEnded && !showButtons && (
              <div className="quick-replies">
                <button onClick={handleAnotherQuery}>
                  ¿Quieres hacer otra consulta?
                </button>
                <button onClick={endConversation}>No, gracias</button>
              </div>
            )}

            {/* Botón para empezar otra consulta */}
            {isConversationEnded && (
              <div className="quick-replies">
                <button onClick={restartConversation}>
                  Empezar otra consulta
                </button>
              </div>
            )}
          </div>

          {/* Footer del chatbot */}
          {!isConversationEnded && (
            <div className="chatbot-footer">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                className="chatbot-input"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Enviar con Enter
              />
              <button className="send-btn" onClick={() => sendMessage()}>
                Enviar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatBoot;
