import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  CalendarDays,
  Heart,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/publicacoes", label: "Publicações", icon: FileText },
  { to: "/admin/campanhas", label: "Campanhas", icon: Megaphone },
  { to: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { to: "/admin/animais", label: "Animais", icon: Heart },
  { to: "/admin/config", label: "Configurações", icon: Settings },
];

// Título mostrado na barra branca, de acordo com a rota
const titulos = {
  "/admin/dashboard": "Dashboard",
  "/admin/publicacoes": "Publicações",
  "/admin/publicacoes/criar-editar": "Criar / Editar Publicação",
  "/admin/campanhas": "Campanhas",
  "/admin/eventos": "Eventos",
  "/admin/animais": "Animais",
  "/admin/preview": "Pré-visualização",
  "/admin/config": "Configurações",
};

// Por enquanto fixo; depois dá para trocar pelos dados do usuário logado
const usuario = { nome: "Mariana Silva", cargo: "Gestora de Projetos" };

export default function AdminMenu() {
  const [aberto, setAberto] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const titulo = titulos[pathname] ?? "Painel Admin";
  const iniciais = usuario.nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const sair = () => {
    // aqui entra a lógica de logout (limpar token etc.)
    navigate("/admin/login");
  };

  const itemClass = (ativo) =>
    `flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 ${
      ativo ? "bg-white/15" : ""
    }`;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Fundo escuro no mobile quando o menu está aberto */}
      {aberto && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setAberto(false)}
        />
      )}

      {/* Barra lateral azul */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-marca px-3 py-6 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          aberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2 px-3">
          <img src="/image 3.svg" alt="" className="h-11 w-auto" />
          <span className="flex flex-col leading-tight">
            <strong className="whitespace-nowrap text-lg font-bold text-white">
              Focinho Amigo
            </strong>
            <small className="text-xs font-semibold text-destaque">
              Painel Admin
            </small>
          </span>
        </div>

        {/* Links */}
        <nav aria-label="Menu do painel" className="flex flex-col gap-1.5">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setAberto(false)}
              className={({ isActive }) => itemClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className={isActive ? "text-destaque" : "text-white"}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}

          <button type="button" onClick={sair} className={itemClass(false)}>
            <LogOut size={20} />
            Sair
          </button>
        </nav>
      </aside>

      {/* Lado direito: barra branca + conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAberto(true)}
              aria-label="Abrir menu"
              className="rounded-md p-2 text-slate-900 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">{titulo}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-sm font-semibold text-slate-900">
                {usuario.nome}
              </p>
              <p className="text-xs text-slate-500">{usuario.cargo}</p>
            </div>
            <div
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-marca text-sm font-bold text-white"
            >
              {iniciais}
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}