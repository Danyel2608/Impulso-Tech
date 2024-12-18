import React, { useEffect, useState } from "react";
import "./AdminPage.css";
import ProductsTable from "./ProductsTable";
import { useTranslation } from "../../TranslationContext";

function AdminPage() {
  const { translate } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deleteUser = async (e) => {
    const deleteButton = e.target;
    const emailUser =
      deleteButton.parentNode.previousElementSibling.previousElementSibling
        .textContent;

    const token = localStorage.getItem("refresh-token");

    try {
      const response = await fetch("/auth/deleteUser", {
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
        throw new Error(
          `${translate("error_label")} ${response.status}: ${
            response.statusText
          }`
        );
      }

      // Después de eliminar, recargar usuarios desde el servidor
      await fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/auth/allLogins", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!response.ok) {
        throw new Error(
          `${translate("error_label")} ${response.status}: ${
            response.statusText
          }`
        );
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
    return (
      <div className="admin-page-loading">{translate("loading_users")}</div>
    );
  }

  if (error) {
    return (
      <div className="admin-page-error">{`${translate(
        "error_label"
      )}: ${error}`}</div>
    );
  }

  return (
    <div className="admin-page">
      <a href="/">
        <i className="fa-solid fa-house"></i>
      </a>
      <h2>{translate("admin_panel_title")}</h2>
      <table className="admin-page-table">
        <thead>
          <tr>
            <th>{translate("id_label")}</th>
            <th>{translate("first_name_label")}</th>
            <th>{translate("last_name_label")}</th>
            <th>{translate("email_label")}</th>
            <th>{translate("confirm_label")}</th>
            <th>{translate("role_label")}</th>
            <th>{translate("delete_label")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.confirmEmail === true ? "Sí" : "No"}</td>
              <td>{user.role}</td>
              <td>
                <i className="fa-solid fa-trash" onClick={deleteUser}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProductsTable />
    </div>
  );
}

export default AdminPage;
