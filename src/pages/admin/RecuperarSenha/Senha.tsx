import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft, FiHeart } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

import logo from "../../../assets/logo_pequena.svg";

export default function RecuperarSenha(): React.JSX.Element {
  const [email, setEmail] = useState("administrador@focinhoamigo.org");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Conecte à API de recuperação de senha quando ela existir.
    console.log({ email });
    setEnviado(true);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[38.9%_61.1%] font-['Inter',Arial,sans-serif] text-[#202b3e] bg-[#f0f0f0] box-border *:box-border">
      {/* Painel esquerdo (marca e introdução) */}
      <aside className="min-h-auto lg:min-h-screen py-[24px] px-[25px] sm:py-[36px] sm:px-[38px] lg:py-[40px] lg:px-[64px] flex flex-col justify-between text-white bg-[#2174b7]">
        <Link
          to="/"
          className="flex items-center gap-3 w-fit ml-0 lg:ml-[10px] text-white no-underline"
          aria-label="Focinho Amigo"
        >
          <img src={logo} alt="Focinho Amigo" className="w-[54px] h-[49px] object-contain" />

          <span className="flex flex-col gap-[2px]">
            <strong className="text-[15px] font-extrabold">Focinho Amigo</strong>
            <small className="text-[#ffd21f] text-[11px] font-semibold">Painel Admin</small>
          </span>
        </Link>

        <section className="max-w-[405px] my-[24px] lg:my-auto">
          <h1 className="m-0 mb-[12px] lg:mb-[18px] text-[28px] sm:text-[32px] lg:text-[clamp(30px,2.5vw,36px)] leading-[1.2] tracking-[-1px] font-extrabold">
            Nos ajude a salvar<br />vidas.
          </h1>
          <p className="max-w-[400px] m-0 text-[#e1edf9] text-[14px] lg:text-[15.5px] leading-[1.5]">
            Faça parte da nossa rede administrativa e ajude a
            coordenar campanhas, gerenciar adoções, voluntários
            e divulgar conquistas de nossa ONG.
          </p>
        </section>

        <footer className="flex items-center gap-3 text-[#b7d7f3] text-[12.5px]">
          <FiHeart className="w-[19px] h-[19px] shrink-0" />
          <span>Focinho Amigo ONG • Proteção Animal</span>
        </footer>
      </aside>

      {/* Painel direito (formulário) */}
      <section className="min-h-auto lg:min-h-screen flex items-center justify-center py-[34px] px-[18px] sm:p-[32px] lg:p-[48px] bg-[#f0f0f0]">
        <div className="w-full max-w-[482px] p-[28px_19px] sm:p-[34px_30px] lg:p-[40px] bg-white border border-[#e2e2e2] rounded-[17px] shadow-[0_2px_3px_rgb(0_0_0/22%)]">
          <header className="mb-[31px] text-center">
            <div className="w-[56px] h-[56px] mx-auto mb-[12px] flex items-center justify-center text-[#0874ca] bg-[#e8f3fd] rounded-full">
              <FaPaw className="w-[29px] h-[29px]" />
            </div>
            <h2 className="m-0 mb-[12px] text-[#202b3e] text-[20px] sm:text-[22px] lg:text-[24px] leading-[1.25] tracking-[-0.55px] font-extrabold">
              Recuperar senha
            </h2>
            <p className="max-w-[330px] mx-auto m-0 text-[#667b9b] text-[13.5px] leading-[1.5]">
              Informe o e-mail cadastrado para receber um link de recuperação de senha.
            </p>
          </header>

          <form onSubmit={handleSubmit}>
            <label
              className="block mb-[8px] text-[#202b3e] text-[12.5px] font-bold"
              htmlFor="recuperar-email"
            >
              E-mail
            </label>

            <div className="h-[44px] flex items-center gap-[10px] px-[13px] text-[#687d9a] bg-[#f7f9fb] border border-[#dce5ef] rounded-[8px] transition-all duration-150 focus-within:border-[#2174b7] focus-within:ring-4 focus-within:ring-[#2174b7]/10">
              <FiMail className="w-[19px] h-[19px] shrink-0 stroke-[2.5]" />
              <input
                id="recuperar-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full min-w-0 p-0 text-[#273449] font-inherit text-[13.5px] bg-transparent border-0 outline-none placeholder:text-[#8a9ab2]"
              />
            </div>

            <button
              className="w-full h-[42px] mt-[32px] text-white font-inherit text-[13px] font-bold bg-[#2174b7] border-0 rounded-[8px] cursor-pointer transition-colors duration-150 hover:bg-[#1767a8]"
              type="submit"
            >
              Enviar link de recuperação
            </button>

            {enviado && (
              <p
                role="status"
                className="m-0 mt-[16px] px-[12px] py-[10px] text-[#0f7a55] text-[12.5px] leading-[1.45] text-center bg-[#e3f8ef] rounded-[8px]"
              >
                Se o e-mail estiver cadastrado, você receberá o link de recuperação em instantes.
              </p>
            )}
          </form>

          <Link
            to="/admin/login"
            className="mt-[20px] flex items-center justify-center gap-[8px] text-[#0874ca] text-[12.5px] font-bold no-underline hover:underline"
          >
            <FiArrowLeft className="w-[16px] h-[16px] shrink-0" />
            Voltar ao login
          </Link>
        </div>
      </section>
    </div>
  );
}