import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-nos" element={<About />} />
        <Route path="/adocao" element={<Adoption />} />
        <Route path="/apadrinhamento" element={<Sponsorship />} />
        <Route path="/voluntariado" element={<Volunteer />} />
        <Route path="/como-ajudar" element={<Help />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/campanhas-e-noticias" element={<CampaignsNews />} />

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/cadastro" element={<Register />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/animais" element={<Animals />} />
        <Route path="/admin/publicacoes" element={<Publications />} />
        <Route path="/admin/publicacoes/criar-editar" element={<PublicationEditor />} />
        <Route path="/admin/preview" element={<Preview />} />
        <Route path="/admin/config" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;