import { DataTypes, Model } from "sequelize";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import sequelize from "../config/database.js";
import Cargo from "./Cargo.js";

export class Administrador extends Model<
  InferAttributes<Administrador>,
  InferCreationAttributes<Administrador>
> {
  declare id: CreationOptional<number>;
  declare nomeCompleto: string;
  declare email: string;
  declare senhaHash: string;
  declare cargo: number;
  declare ativo: CreationOptional<boolean>;
  declare criadoEm: CreationOptional<Date>;
}

Administrador.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    nomeCompleto: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "nome_completo",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    senhaHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "senha_hash",
    },
    cargo: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "cargo",                       
      references: { model: Cargo, key: "id" },
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    criadoEm: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "criado_em",
    },
  },
  {
    sequelize,
    tableName: "administradores",
    timestamps: true,
    createdAt: "criado_em",   
    updatedAt: false,                     
  }
);

export default Administrador;