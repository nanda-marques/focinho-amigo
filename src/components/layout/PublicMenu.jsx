import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Início" },
  { to: "/sobre-nos", label: "Sobre Nós" },
  { to: "/adocao", label: "Adoção" },
  { to: "/apadrinhamento", label: "Apadrinhamento" },
  { to: "/voluntariado", label: "Voluntariado" },
  { to: "/como-ajudar", label: "Como Ajudar" },
  { to: "/contato", label: "Contato" },
  { to: "/campanhas-e-noticias", label: "Eventos" },
];

const filtros = [
  { value: "padrao", label: "Cores padrão" },
  { value: "protanopia", label: "Protanopia (vermelho)" },
  { value: "deuteranopia", label: "Deuteranopia (verde)" },
  { value: "tritanopia", label: "Tritanopia (azul)" },
  { value: "monocromia", label: "Escala de cinza" },
];

// Matrizes de correção de cores (daltonização), aplicadas via SVG
const matrizes = {
  protanopia:
    "1 0 0 0 0  0.478897 0.476911 0.044192 0 0  0.597282 -0.688692 1.09141 0 0  0 0 0 1 0",
  deuteranopia:
    "1 0 0 0 0  0.16279 0.725047 0.112165 0 0  0.454695 -0.645392 1.190697 0 0  0 0 0 1 0",
  tritanopia:
    "0.996687 -0.483957 0.48727 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0",
};

function aplicarFiltro(valor) {
  const root = document.getElementById("root");
  if (valor === "padrao") root.style.filter = "";
  else if (valor === "monocromia") root.style.filter = "grayscale(1)";
  else root.style.filter = `url(#filtro-${valor})`;
}

export default function PublicMenu() {
  const [filtro, setFiltro] = useState(
    () => localStorage.getItem("filtro-cores") || "padrao"
  );
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    aplicarFiltro(filtro);
    localStorage.setItem("filtro-cores", filtro);
  }, [filtro]);

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap text-sm font-semibold transition-colors hover:text-marca ${
      isActive ? "text-marca" : "text-zinc-900"
    }`;

  const seletor = (
    <select
      value={filtro}
      onChange={(e) => setFiltro(e.target.value)}
      aria-label="Filtro de cores para daltonismo"
      className="cursor-pointer rounded-lg bg-slate-300 px-3.5 py-2.5 text-xs font-semibold text-zinc-900 hover:bg-slate-400/70"
    >
      {filtros.map((f) => (
        <option key={f.value} value={f.value}>
          {f.label}
        </option>
      ))}
    </select>
  );

  return (
    <header className="bg-white shadow-sm">
      {/* Filtros SVG usados pelo seletor de daltonismo */}
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          {Object.entries(matrizes).map(([nome, values]) => (
            <filter
              key={nome}
              id={`filtro-${nome}`}
              colorInterpolationFilters="sRGB"
            >
              <feColorMatrix type="matrix" values={values} />
            </filter>
          ))}
        </defs>
      </svg>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 lg:px-14">
        {/* Logo */}
<NavLink to="/" className="flex shrink-0 items-center gap-2">
  <img src="/logo 1.svg" alt="" className="h-11 w-auto" />
  <span className="flex flex-col leading-none">
    <strong className="whitespace-nowrap text-xl font-bold text-marca">
      Focinho Amigo
    </strong>
    <small className="mt-1 whitespace-nowrap text-[9px] font-bold uppercase tracking-wide text-destaque">
      Nos ajude a salvar vidas.
    </small>
  </span>
</NavLink>

        {/* Links (desktop) */}
        <nav aria-label="Menu principal" className="hidden items-center gap-6 lg:flex">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === "/"} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Ações (desktop) */}
        <div className="hidden items-center gap-4 lg:flex">
          <NavLink
            to="/como-ajudar"
            className="whitespace-nowrap rounded-lg bg-destaque px-5 py-2.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-destaque-escura"
          >
            Doe Agora
          </NavLink>
          {seletor}
        </div>

        {/* Botão hambúrguer (mobile) */}
        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-expanded={menuAberto}
          aria-label="Abrir menu"
          className="rounded-md p-2 text-2xl text-zinc-900 lg:hidden"
        >
          {menuAberto ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <div className="flex flex-col items-start gap-4 border-t border-zinc-200 px-5 py-4 lg:hidden">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuAberto(false)}
              className={linkClass}
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/como-ajudar"
            onClick={() => setMenuAberto(false)}
            className="rounded-lg bg-destaque px-5 py-2.5 text-sm font-bold text-zinc-900"
          >
            Doe Agora
          </NavLink>
          {seletor}
        </div>
      )}
    </header>
  );
}