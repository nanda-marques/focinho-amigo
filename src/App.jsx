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
import PublicationEditor from "./pages/admin/PublicationEditor/PublicationEditor";
import Preview from "./pages/admin/Preview/Preview";
import Settings from "./pages/admin/Settings/Settings";

import RotaProtegida from "./components/RotaProtegida";

function PublicLayout() {
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

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#f0f0f0]">
      <AdminMenu />
      <main className="min-w-0 flex-1 p-6 pt-16 lg:pt-6">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
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
        <Route path="/admin/preview" element={<Preview />} />

        {/* ADMIN COM MENU: ROTAS PROTEGIDAS */}
        <Route
          path="/admin"
          element={
            <RotaProtegida>
              <AdminLayout />
            </RotaProtegida>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="animais" element={<Animals />} />
          <Route path="publicacoes" element={<Publications />} />
          <Route
            path="publicacoes/criar-editar"
            element={<PublicationEditor />}
          />
          <Route path="config" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;