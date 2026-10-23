import Cargo from "./Cargo.js";
import Administrador from "./Administrador.js";

// Associações
Cargo.hasMany(Administrador, {
  foreignKey: "cargo",
  as: "administradores",
});

Administrador.belongsTo(Cargo, {
  foreignKey: "cargo",
  as: "cargoRef",
});

export { Cargo, Administrador };