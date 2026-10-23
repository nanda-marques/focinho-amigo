import { DataTypes, Model } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../config/database.js";

export class Cargo extends Model<
  InferAttributes<Cargo>,
  InferCreationAttributes<Cargo>
> {
  declare id: CreationOptional<number>;
  declare nomeCargo: string;
  declare podeGerenciarAnimais: CreationOptional<boolean>;
  declare podeGerenciarConteudo: CreationOptional<boolean>;
  declare podeGerenciarNewsletter: CreationOptional<boolean>;
  declare podeGerenciarAdmins: CreationOptional<boolean>;
}

Cargo.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nomeCargo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "nome_cargo",                  
    },
    podeGerenciarAnimais: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "pode_gerenciar_animais",
    },
    podeGerenciarConteudo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "pode_gerenciar_conteudo",
    },
    podeGerenciarNewsletter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "pode_gerenciar_newsletter",
    },
    podeGerenciarAdmins: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "pode_gerenciar_admins",
    },
  },
  {
    sequelize,
    tableName: "cargos",
    timestamps: false, 
  }
);

export default Cargo;