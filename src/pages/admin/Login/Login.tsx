import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiHeart } from "react-icons/fi";
import { FaPaw } from "react-icons/fa";

import logo from "../../../assets/logo_pequena.svg";

/** Página de login administrativo. */
export default function Login(): React.JSX.Element {
  const [email, setEmail] = useState("administrador@focinhoamigo.org");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();
    console.log({ email, password });
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[38.9%_61.1%] font-['Inter',Arial,sans-serif] text-[#202b3e] bg-[#f0f0f0]">
      {/* Painel Esquerdo */}
      <aside className="min-h-auto lg:min-h-screen py-6 px-[25px] sm:py-[36px] sm:px-[38px] lg:py-[40px] lg:px-[64px] flex flex-col justify-between text-white bg-[#2174b7]">
        <a className="flex items-center gap-3 w-fit ml-0 lg:ml-2.5 text-white no-underline" href="/" aria-label="Focinho Amigo">
          <img src={logo} alt="Focinho Amigo" className="w-[54px] h-[49px] object-contain" />
          <span className="flex flex-col gap-0.5">
            <strong className="text-[15px] font-extrabold">Focinho Amigo</strong>
            <small className="text-[#ffd21f] text-[11px] font-semibold">Painel Admin</small>
          </span>
        </a>

        <section className="max-w-[405px] my-[24px] lg:my-auto">
          <h1 className="m-0 mb-3 lg:mb-[18px] text-[28px] sm:text-[32px] lg:text-[clamp(30px,2.5vw,36px)] leading-[1.2] tracking-[-1px] font-extrabold">
            Nos ajude a salvar<br />vidas.
          </h1>
          <p className="max-w-[400px] m-0 text-[#e1edf9] text-[14px] lg:text-[15.5px] leading-[1.5]">
            Faça parte da nossa rede administrativa e ajude a coordenar campanhas, gerenciar adoções, voluntários e divulgar conquistas de nossa ONG.
          </p>
        </section>

        <footer className="flex items-center gap-3 text-[#b7d7f3] text-[12.5px]">
          <FiHeart className="w-[19px] h-[19px] shrink-0" />
          <span>Focinho Amigo ONG • Proteção Animal</span>
        </footer>
      </aside>

      {/* Painel Direito */}
      <section className="min-h-auto lg:min-h-screen flex items-center justify-center py-[34px] px-5 sm:p-8 lg:p-12 bg-[#f0f0f0]">
        <div className="w-full max-w-[482px] p-[28px_19px] sm:p-[34px_30px] lg:p-[39px_40px_38px] bg-white border border-[#e2e2e2] rounded-[17px] shadow-[0_2px_3px_rgb(0_0_0/22%)]">
          <header className="mb-[31px] text-center">
            <div className="w-[56px] h-[56px] mx-auto mb-3 flex items-center justify-center text-[#0874ca] bg-[#e8f3fd] rounded-full">
              <FaPaw className="w-[29px] h-[29px]" />
            </div>
            <h2 className="m-0 mb-3 text-[#202b3e] text-[20px] sm:text-[22px] lg:text-[24px] leading-[1.25] tracking-[-0.55px] font-extrabold">Acesso Administrativo</h2>
            <p className="m-0 text-[#667b9b] text-[13.5px] leading-[1.45]">Entre para gerenciar o conteúdo da ONG</p>
          </header>

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-[#202b3e] text-[12.5px] font-bold" htmlFor="login-email">E-mail</label>
            <div className="h-[44px] flex items-center gap-2.5 px-3.5 text-[#687d9a] bg-[#f7f9fb] border border-[#dce5ef] rounded-[8px] transition-all duration-150 focus-within:border-[#2174b7] focus-within:ring-4 focus-within:ring-[#2174b7]/10">
              <FiMail className="w-[19px] h-[19px] shrink-0 stroke-[2.5]" />
              <input id="login-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className="w-full min-w-0 p-0 text-[#273449] font-inherit text-[13.5px] bg-transparent border-0 outline-none" />
            </div>

            <label className="block mt-[21px] mb-2 text-[#202b3e] text-[12.5px] font-bold" htmlFor="login-password">Senha</label>
            <div className="h-[44px] flex items-center gap-2.5 px-3.5 text-[#687d9a] bg-[#f7f9fb] border border-[#dce5ef] rounded-[8px] transition-all duration-150 focus-within:border-[#2174b7] focus-within:ring-4 focus-within:ring-[#2174b7]/10">
              <FiLock className="w-[19px] h-[19px] shrink-0 stroke-[2.5]" />
              <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua senha" required className="w-full min-w-0 p-0 text-[#273449] font-inherit text-[13.5px] bg-transparent border-0 outline-none" />
              <button className="flex items-center p-[3px_0_3px_8px] text-[#687d9a] bg-transparent border-0 cursor-pointer" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                {showPassword ? <FiEyeOff className="w-[19px] h-[19px]" /> : <FiEye className="w-[19px] h-[19px]" />}
              </button>
            </div>

            <button className="p-0 mt-[21px] text-[#0874ca] text-[12.5px] font-bold font-inherit bg-transparent border-0 cursor-pointer hover:underline block" type="button" onClick={() => { window.location.href = "/admin/recuperar-senha"; }}>Esqueci minha senha</button>

            <button className="w-full h-[42px] mt-[31px] text-white font-inherit text-[13px] font-bold bg-[#2174b7] border-0 rounded-[8px] cursor-pointer transition-colors duration-150 hover:bg-[#1767a8]" type="submit">Entrar no Painel</button>
          </form>

          <p className="mt-[21px] mb-0 text-[#687d9a] text-[12.5px] text-center">
            Ainda não possui uma conta?{" "}
            <button className="p-0 text-[#0874ca] text-[12.5px] font-bold font-inherit bg-transparent border-0 cursor-pointer hover:underline inline" type="button" onClick={() => { window.location.href = "/admin/cadastro"; }}>Cadastre-se</button>
          </p>
        </div>
      </section>
    </div>
  );
}
