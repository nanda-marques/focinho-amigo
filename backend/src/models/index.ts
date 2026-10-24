import Cargo from "./Cargo.js";
import Administrador from "./Administrador.js";
import ImagemPerfil from "./ImagemPerfil.js"; 

// Associações
Cargo.hasMany(Administrador, {
  foreignKey: "cargo",
  as: "administradores",
});

Administrador.belongsTo(Cargo, {
  foreignKey: "cargo",
  as: "cargoRef",
});

export { Cargo, Administrador, ImagemPerfil };