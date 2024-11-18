import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ConfirmMail.css";

function ConfirmEmail() {
  const [status, setStatus] = useState("Cargando...");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Obtenemos el email de los parámetros de la URL
    const email = searchParams.get("email");

    // Verificamos que el email exista antes de hacer la solicitud
    if (email) {
      // Hacemos la solicitud de confirmación al backend
      fetch(
        `http://localhost:8001/emails/confirmar/${encodeURIComponent(email)}`,
        {
          method: "PUT",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.data.confirmado) {
            setStatus("Correo confirmado exitosamente. Redirigiendo...");
            setTimeout(() => navigate("/login"), 3000); // Redirige al usuario al login después de 3 segundos
          } else {
            setStatus("Error: Correo no encontrado o ya confirmado.");
          }
        })
        .catch((error) => {
          console.error("Error en la confirmación:", error);
          setStatus("Error al confirmar el correo. Intente nuevamente.");
        });
    } else {
      setStatus("Error: Parámetro de email no encontrado.");
    }
  }, [searchParams, navigate]);

  return (
    <div className="confirm-mail">
      <h2>Confirmación de Email</h2>
      <p>{status}</p>
    </div>
  );
}

export default ConfirmEmail;
