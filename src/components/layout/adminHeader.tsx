import type { JSX, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { authApi } from "../../services/authApi";
import { useFotoPerfil } from "../../hooks/useFotoPerfil";

interface AdminHeaderProps {
  titulo: string;
  subtitulo?: string;
  acoes?: ReactNode;
}

function AdminHeader({ titulo, subtitulo, acoes }: AdminHeaderProps): JSX.Element {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    window.addEventListener("usuario-atualizado", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("usuario-atualizado", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const usuario = authApi.usuarioAtual();   // agora é re-lido a cada render
  const { url: fotoUrl } = useFotoPerfil(usuario?.fotoPath);

  const iniciais = useMemo(() => {
    if (!usuario?.nomeCompleto) return "AD";
    return usuario.nomeCompleto
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [usuario?.nomeCompleto]);

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-[#e2e2e2] bg-white py-4 pl-[72px] pr-5 sm:pr-8 lg:px-8 lg:py-5">
      <div className="min-w-0">
        <h1 className="m-0 text-[22px] font-extrabold leading-[1.2] tracking-[-0.5px] sm:text-[26px]">
          {titulo}
        </h1>
        {subtitulo && (
          <p className="m-0 mt-[4px] text-[13px] text-[#667b9b]">{subtitulo}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {acoes}

        <div className="grid h-[38px] w-[38px] place-items-center overflow-hidden rounded-full bg-[#e8f3fd] text-[13px] font-bold text-[#0874ca]">
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt={usuario?.nomeCompleto ?? "Foto de perfil"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{iniciais}</span>
          )}
        </div>

        <div className="hidden text-right leading-tight sm:block">
          <p className="m-0 text-[14px] font-bold">
            {usuario?.nomeCompleto ?? "Administrador"}
          </p>
          <p className="m-0 text-[12.5px] text-[#667b9b]">
            {usuario?.cargo ?? ""}
          </p>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;