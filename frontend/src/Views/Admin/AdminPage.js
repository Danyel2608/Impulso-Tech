import React, { useEffect, useState } from "react";
import "./AdminPage.css";
import ProductsTable from "./ProductsTable";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteUser = async (e) => {
    const deleteButton = e.target;
    const emailUser =
      deleteButton.parentNode.previousElementSibling.previousElementSibling
        .textContent;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8001/auth/deleteUser", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          email: emailUser,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Después de eliminar, recargar usuarios desde el servidor
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Mover la función fetchUsers fuera de useEffect para poder reutilizarla
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8001/auth/allLogins", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="admin-page-loading">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="admin-page-error">Error: {error}</div>;
  }

  return (
    <div className="admin-page">
      <a href="/">
        <i class="fa-solid fa-house"></i>
      </a>
      <h1>Panel de Administración</h1>
      <table className="admin-page-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de Usuario</th>
            <th>Apellido de Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <i class="fa-solid fa-trash" onClick={deleteUser}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProductsTable></ProductsTable>
    </div>
  );
}

export default AdminPage;
