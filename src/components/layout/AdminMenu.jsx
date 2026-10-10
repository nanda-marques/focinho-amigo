import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuFileText,
  LuMegaphone,
  LuCalendar,
  LuHeart,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";
import logo from "../../assets/image 3.svg"; // ajuste o caminho conforme a pasta do arquivo

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icone: LuLayoutDashboard },
  { to: "/admin/publicacoes", label: "Publicações", icone: LuFileText },
  { to: "/admin/campanhas", label: "Campanhas", icone: LuMegaphone },
  { to: "/admin/eventos", label: "Eventos", icone: LuCalendar },
  { to: "/admin/animais", label: "Animais", icone: LuHeart },
  { to: "/admin/configuracoes", label: "Configurações", icone: LuSettings },
];

const itemClass =
  "flex w-full items-center gap-3.5 rounded-lg px-4 py-3 text-[15px] font-bold text-white transition-colors";

export default function AdminMenu() {
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();

  function sair() {
    // Limpe aqui a sessão já existente no projeto (token, contexto de auth etc.)
    localStorage.removeItem("token");
    navigate("/admin/login");
  }

  return (
    <>
      {/* Botão hambúrguer (mobile) */}
      <button
        type="button"
        onClick={() => setAberto(true)}
        aria-label="Abrir menu"
        className="fixed left-4 top-4 z-30 rounded-md bg-[#2174b7] px-3 py-2 text-xl text-white shadow lg:hidden"
      >
        ☰
      </button>

      {/* Fundo escuro (mobile) */}
      {aberto && (
        <div onClick={() => setAberto(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-[#2174b7] px-6 py-8 font-['Inter',Arial,sans-serif] transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          aberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <NavLink to="/admin/dashboard" className="mb-10 flex items-center gap-2.5 text-white no-underline">
          <img src={logo} alt="" className="h-[50px] w-[54px] object-contain" />
          <span className="flex flex-col leading-tight">
            <strong className="text-[17px] font-extrabold">Focinho Amigo</strong>
            <small className="text-[11px] font-semibold text-[#ffb800]">Painel Admin</small>
          </span>
        </NavLink>

        {/* Links */}
        <nav aria-label="Menu administrativo" className="flex flex-col gap-1.5">
          {links.map(({ to, label, icone: Icone }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setAberto(false)}
              className={({ isActive }) =>
                `${itemClass} ${isActive ? "bg-white/20" : "hover:bg-white/10"}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icone className={`h-5 w-5 shrink-0 ${isActive ? "text-[#ffb800]" : ""}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}

          <button type="button" onClick={sair} className={`${itemClass} cursor-pointer hover:bg-white/10`}>
            <LuLogOut className="h-5 w-5 shrink-0" />
            Sair
          </button>
        </nav>
      </aside>
    </>
  );
}