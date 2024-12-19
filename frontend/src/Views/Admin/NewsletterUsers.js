import React, { useEffect, useState } from "react";
import "./NewsletterUsers.css";
import { useTranslation } from "../../TranslationContext";

function NewsletterUsers() {
  const { translate } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Obtener datos desde el backend
    const fetchUsers = async () => {
      try {
        const response = await fetch("/newsletter/allNewsletterUsers");
        if (!response.ok) {
          throw new Error("Error al obtener los datos.");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (e) => {
    let email = e.target.parentNode.parentNode.children[1].textContent;
    try {
      const response = await fetch("/newsletter/deleteNewsletterUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario.");
      }

      // Actualizar la lista de usuarios después de la eliminación
      setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
      alert(translate("delete_success_label"));
    } catch (err) {
      alert(translate("delete_error_label"));
      console.error(err);
    }
  };

  if (loading) {
    return <div className="admin-page-loading">Cargando...</div>;
  }

  if (error) {
    return <div className="admin-page-error">{error}</div>;
  }

  return (
    <div className="admin-page">
      <h1>Usuarios Suscritos a la Newsletter</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar usuario..."
          onChange={(e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredUsers = users.filter((user) =>
              user.email.toLowerCase().includes(searchTerm)
            );
            setUsers(filteredUsers);
          }}
        />
      </div>

      <table className="admin-page-table">
        <thead>
          <tr>
            <th>{translate("id_label")}</th>
            <th>{translate("email_label")}</th>
            <th>{translate("date_label")}</th>
            <th>{translate("delete_label")}</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
                <td>
                  <i
                    className="fa-solid fa-trash"
                    onClick={deleteUser}
                    style={{ cursor: "pointer", color: "red" }}
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No se encontraron usuarios.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NewsletterUsers;
