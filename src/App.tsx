import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import PublicMenu from "./components/layout/PublicMenu";
import PublicFooter from "./components/layout/PublicFooter";
import AdminMenu from "./components/layout/AdminMenu";

import Home from "./pages/public/Home/Home";
import About from "./pages/public/About/About";
import Adoption from "./pages/public/Adoption/Adoption";
import Sponsorship from "./pages/public/Sponsorship/Sponsorship";
import Volunteer from "./pages/public/Volunteer/Volunteer";
import Help from "./pages/public/Help/Help";
import Contact from "./pages/public/Contact/Contact";
import CampaignsNews from "./pages/public/CampaignsNews/CampaignsNews";

import Login from "./pages/admin/Login/Login";
import Register from "./pages/admin/Register/Register";
import Dashboard from "./pages/admin/Dashboard/Dashboard";
import Animals from "./pages/admin/Animals/Animals";
import Publications from "./pages/admin/Publications/Publications";
import PublicationEditor from "./pages/admin/Publications/PublicationEditor";
import PublicationPreview from "./pages/admin/Publications/PublicationPreview";
import Settings from "./pages/admin/Settings/Settings";

/**
 * Layout público: cabeçalho, conteúdo e rodapé.
 */
function PublicLayout(): React.JSX.Element {
  return (
    <>
      <PublicMenu />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
}

/**
 * Layout administrativo: menu lateral + área de conteúdo.
 *
 * - A área de conteúdo é uma <div>, e não um <main>, porque o index.css aplica
 *   padding: 40px em todo <main>. Cada tela cuida do próprio espaçamento.
 * - A classe "admin-area" zera esse padding global para qualquer <main> dentro
 *   do admin (veja a regra correspondente no index.css).
 */
function AdminLayout(): React.JSX.Element {
  return (
    <div className="admin-area flex min-h-screen bg-[#f0f0f0]">
      <AdminMenu />
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}

/**
 * Componente raiz da aplicação.
 * Define as rotas públicas e administrativas usando react-router-dom.
 */
function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* PÁGINAS PÚBLICAS */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre-nos" element={<About />} />
          <Route path="/adocao" element={<Adoption />} />
          <Route path="/apadrinhamento" element={<Sponsorship />} />
          <Route path="/voluntariado" element={<Volunteer />} />
          <Route path="/como-ajudar" element={<Help />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/campanhas-e-noticias" element={<CampaignsNews />} />
        </Route>

        {/* ADMIN SEM MENU */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/cadastro" element={<Register />} />

        {/* ADMIN COM MENU */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/animais" element={<Animals />} />
          <Route path="/admin/publicacoes" element={<Publications />} />
          <Route path="/admin/publicacoes/nova" element={<PublicationEditor />} />
          <Route path="/admin/publicacoes/:id/editar" element={<PublicationEditor />} />
          <Route path="/admin/publicacoes/:id/preview" element={<PublicationPreview />} />
          <Route path="/admin/configuracoes" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;