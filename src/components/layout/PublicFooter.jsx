import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function PublicFooter() {
  return (
    <footer className="bg-[#151b27] text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-14">

        {/* Conteúdo principal */}
        <div className="grid gap-10 md:grid-cols-4">

          {/* Logo e descrição */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img
                src="src/assets/logo.svg"
                alt="Focinho Amigo"
                className="h-10 w-auto"
              />

              <span className="text-lg font-bold">
                Focinho Amigo
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-xs leading-5 text-slate-300">
              Apoiamos e conectamos o bem-estar animal,
              acolhendo animais em situação de abandono e
              mobilizando pessoas para transformar suas vidas.
            </p>

            {/* Redes sociais */}
            <div className="mt-5 flex gap-2">
            <a
                href="https://www.facebook.com/FocinhoAmigoIndaiatuba"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white transition hover:bg-marca"
            >
                <FaFacebookF size={14} />
            </a>

            <a
                href="https://www.instagram.com/focinhoamigoindaiatuba/"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white transition hover:bg-marca"
            >
                <FaInstagram size={15} />
            </a>

            <a
                href="https://www.tiktok.com/@focinhoamigoindaiatuba"
                aria-label="TikTok"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white transition hover:bg-marca"
            >
                <FaTiktok size={14} />
            </a>
            </div>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="mb-4 text-sm font-bold">
              Institucional
            </h3>

            <nav className="flex flex-col gap-3 text-xs text-slate-300">
              <Link
                to="/sobre-nos"
                className="hover:text-white"
              >
                Sobre Nós
              </Link>

              <Link
                to="/adocao"
                className="hover:text-white"
              >
                Animais para Adoção
              </Link>

              <Link
                to="/apadrinhamento"
                className="hover:text-white"
              >
                Apadrinhamento
              </Link>

              <Link
                to="/campanhas-e-noticias"
                className="hover:text-white"
              >
                Blog / Notícias
              </Link>
            </nav>
          </div>

          {/* Links úteis */}
          <div>
            <h3 className="mb-4 text-sm font-bold">
              Links Úteis
            </h3>

            <nav className="flex flex-col gap-3 text-xs text-slate-300">
              <Link
                to="/contato"
                className="hover:text-white"
              >
                Fale Conosco
              </Link>

              <Link
                to="/contato"
                className="hover:text-white"
              >
                Perguntas Frequentes
              </Link>

              <Link
                to="/politica-privacidade"
                className="hover:text-white"
              >
                Política de Privacidade
              </Link>
            </nav>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-4 text-sm font-bold">
              Contato
            </h3>

            <div className="space-y-3 text-xs leading-5 text-slate-300">
              <p>
                Sede: R. Nove de Julho, 1399 - Vila 
                <br />
                Georgina, Indaiatuba - SP, 13333 070
              </p>
              <p>
                Bazar: Rua São Carlos, 538 - Vila de todos os Santos
              </p>
              <p>
                 focinhoamigoindaiatuba@gmail.com
              </p>

              <p>
                 +55 (19) 98976-5972
              </p>
            </div>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-10 border-t border-slate-700 pt-5">
          <div className="flex flex-col gap-3 text-[10px] text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>
                © 2026 Focinho Amigo. CNPJ 38.284.355/0001-22.  Organização não governamental (ONG)
            </p>

            <p>
              Desenvolvido pela equipe <a href="https://github.com/nanda-marques/focinho-amigo">Hackeridos</a> para o desafio FiC da Venturus
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}