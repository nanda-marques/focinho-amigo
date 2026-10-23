import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, JSX } from "react";
import { Link } from "react-router-dom";
import { FiX, FiUser, FiMail, FiShield, FiCheckCircle } from "react-icons/fi";
import { FaPaw, FaBone } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/* Configurações do pop-up                                             */
/* ------------------------------------------------------------------ */
const CHAVE_DE_ARMAZENAMENTO = "focinho-amigo:newsletter";
const DIAS_ATE_REAPARECER = 7; // depois de fechado ou enviado, volta a aparecer após esse tempo
const ATRASO_MS = 1500; // espera um pouco depois de entrar no site

// Patinhas decorativas: distância da borda direita, do topo, e giro
const patas = [
  { direita: 44, topo: 88, giro: 14 },
  { direita: 74, topo: 124, giro: -22 },
  { direita: 22, topo: 154, giro: 14 },
  { direita: 56, topo: 190, giro: -14 },
];

/* ------------------------------------------------------------------ */
/* Controle de "já mostrei" (para o pop-up não aparecer a cada visita) */
/* ------------------------------------------------------------------ */
function jaFoiVista(): boolean {
  try {
    const salvo = localStorage.getItem(CHAVE_DE_ARMAZENAMENTO);
    if (!salvo) return false;
    const dias = (Date.now() - Number(salvo)) / 86_400_000;
    return dias < DIAS_ATE_REAPARECER;
  } catch {
    // Armazenamento bloqueado (ex.: aba anônima): mostra normalmente
    return false;
  }
}

function marcarComoVista(): void {
  try {
    localStorage.setItem(CHAVE_DE_ARMAZENAMENTO, String(Date.now()));
  } catch {
    // Sem armazenamento disponível: só vai reaparecer na próxima visita
  }
}

/* ------------------------------------------------------------------ */

const campoClass =
  "h-[48px] flex items-center gap-[14px] px-[14px] text-[#1f2937] bg-white border border-[#cfd8e3] rounded-[8px] transition-all duration-150 focus-within:border-[#1a73b8] focus-within:ring-4 focus-within:ring-[#1a73b8]/15";

const inputClass =
  "w-full min-w-0 p-0 text-[15px] text-[#1f2937] bg-transparent border-0 outline-none placeholder:text-[#475569]";

/** Pop-up de cadastro na newsletter. Aparece uma vez ao entrar no site. */
export default function Newsletter(): JSX.Element | null {
  const [aberto, setAberto] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [aceito, setAceito] = useState(false);
  const cartaoRef = useRef<HTMLDivElement>(null);

  const fechar = useCallback(() => {
    marcarComoVista();
    setAberto(false);
  }, []);

  // Abre sozinho, depois de um instante, se ainda não foi visto
  useEffect(() => {
    if (jaFoiVista()) return;
    const temporizador = window.setTimeout(() => setAberto(true), ATRASO_MS);
    return () => window.clearTimeout(temporizador);
  }, []);

  // Enquanto aberto: trava a rolagem da página, foca o pop-up e fecha com Esc
  useEffect(() => {
    if (!aberto) return;

    cartaoRef.current?.focus();
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function aoApertarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") fechar();
    }
    window.addEventListener("keydown", aoApertarTecla);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", aoApertarTecla);
    };
  }, [aberto, fechar]);

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    // Conecte à API de newsletter quando ela existir.
    console.log({ nome, email, aceito });
    marcarComoVista();
    setEnviado(true);
  }

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-[16px] font-['Inter',Arial,sans-serif] text-[#202b3e] box-border *:box-border"
      onClick={(evento) => {
        // Clicar fora do cartão fecha
        if (evento.target === evento.currentTarget) fechar();
      }}
    >
      <div
        ref={cartaoRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-titulo"
        tabIndex={-1}
        className="relative max-h-[calc(100vh-32px)] w-full max-w-[390px] overflow-y-auto rounded-[16px] bg-white shadow-[0_8px_30px_rgb(0_0_0/30%)] outline-none"
      >
        {/* Cabeçalho azul */}
        <header className="relative rounded-t-[16px] bg-[#1a73b8] px-[24px] pb-[28px] pt-[32px] text-white">
          <button
            type="button"
            onClick={fechar}
            aria-label="Fechar"
            className="absolute right-[14px] top-[14px] flex cursor-pointer border-0 bg-transparent p-[4px] text-white transition-opacity hover:opacity-75"
          >
            <FiX className="h-[24px] w-[24px]" />
          </button>

          <h2
            id="newsletter-titulo"
            className="m-0 mb-[14px] max-w-[270px] text-[24px] font-extrabold leading-[1.2] tracking-[-0.3px]"
          >
            Fique por dentro de novas adoções, feiras e eventos!
          </h2>
          <p className="m-0 max-w-[250px] text-[13.5px] leading-[1.45] text-[#e1edf9]">
            Receba por e-mail novidades sobre nossos animais e eventos.
          </p>
        </header>

        {/* Patinhas decorativas */}
        {patas.map((pata) => (
          <FaPaw
            key={`${pata.direita}-${pata.topo}`}
            aria-hidden="true"
            className="pointer-events-none absolute h-[22px] w-[22px] text-[#111827]"
            style={{ right: pata.direita, top: pata.topo, transform: `rotate(${pata.giro}deg)` }}
          />
        ))}

        {/* Corpo */}
        <div className="px-[24px] pb-[24px] pt-[24px]">
          {enviado ? (
            <div role="status" className="py-[16px] text-center">
              <FiCheckCircle className="mx-auto mb-[12px] h-[44px] w-[44px] text-[#10b981]" />
              <h3 className="m-0 mb-[8px] text-[20px] font-extrabold">Cadastro realizado!</h3>
              <p className="m-0 mb-[20px] text-[14px] leading-[1.5] text-[#667b9b]">
                Obrigada por se inscrever. Em breve você receberá nossas novidades por e-mail.
              </p>
              <button
                type="button"
                onClick={fechar}
                className="h-[44px] cursor-pointer rounded-[10px] border-0 bg-[#1a73b8] px-[28px] text-[14px] font-bold text-white transition-colors hover:bg-[#14598d]"
              >
                Fechar
              </button>
            </div>
          ) : (
            <>
              {/* No Figma este título aparece como "Definições de Status" (provável texto
                  de exemplo copiado de outra tela). Troque aqui se quiser outro. */}
              <h3 className="m-0 mb-[14px] text-[16px] font-extrabold">Receba nossas novidades</h3>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-[16px]">
                  <label className={campoClass}>
                    <FiUser className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
                    <span className="sr-only">Nome</span>
                    <input
                      type="text"
                      autoComplete="name"
                      value={nome}
                      onChange={(evento) => setNome(evento.target.value)}
                      placeholder="Nome"
                      required
                      className={inputClass}
                    />
                  </label>

                  <label className={campoClass}>
                    <FiMail className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
                    <span className="sr-only">E-mail</span>
                    <input
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(evento) => setEmail(evento.target.value)}
                      placeholder="E-mail"
                      required
                      className={inputClass}
                    />
                  </label>
                </div>

                <label className="mt-[20px] flex cursor-pointer items-start gap-[14px] text-[12.5px] leading-[1.45] text-[#475569]">
                  <input
                    type="checkbox"
                    checked={aceito}
                    onChange={(evento) => setAceito(evento.target.checked)}
                    required
                    className="mt-[2px] h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#1a73b8]"
                  />
                  <span>
                    Eu autorizo o envio de mensagens por e-mail e concordo com a{" "}
                    {/* Ajuste a rota se a página de privacidade tiver outro endereço */}
                    <Link to="/politica-de-privacidade" className="font-semibold text-[#0b5cb8] hover:underline">
                      Política de Privacidade
                    </Link>{" "}
                    da ONG, em conformidade com a LGPD.
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-[20px] flex h-[52px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[12px] border-0 bg-[#ffb800] text-[18px] font-extrabold text-white shadow-[0_2px_3px_rgb(0_0_0/22%)] transition-colors duration-150 hover:bg-[#e6a600]"
                >
                  <FaBone className="h-[22px] w-[22px]" aria-hidden="true" />
                  Quero receber novidades!
                </button>
              </form>

              <p className="m-0 mt-[20px] flex items-center justify-center gap-[12px] text-[12.5px] leading-[1.4] text-[#667b9b]">
                <FiShield className="h-[22px] w-[22px] shrink-0" aria-hidden="true" />
                <span>
                  Seus dados estão protegidos.
                  <br />
                  Respeitamos nossa privacidade.
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}