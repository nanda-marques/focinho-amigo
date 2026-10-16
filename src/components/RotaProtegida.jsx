
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function RotaProtegida({ children }) {
  const [autenticado, setAutenticado] = useState(false);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setVerificando(false);
      return;
    }

    apiRequest("/auth/me")
      .then((resposta) => {
        localStorage.setItem(
          "usuario",
          JSON.stringify(resposta.usuario)
        );
        setAutenticado(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setAutenticado(false);
      })
      .finally(() => {
        setVerificando(false);
      });
  }, []);

  if (verificando) {
    return <p className="p-6">Verificando autenticação...</p>;
  }

  if (!autenticado) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
