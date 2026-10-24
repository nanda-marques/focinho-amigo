import { useEffect, useState } from "react";
import { adminApi } from "../services/adminApi";

export function useFotoPerfil(path: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!path) {
      setUrl(null);
      return;
    }
    let ativo = true;
    setCarregando(true);
    adminApi
      .urlFotoPerfil(path)
      .then((u) => { if (ativo) setUrl(u); })
      .catch(() => { if (ativo) setUrl(null); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [path]);

  return { url, carregando };
}