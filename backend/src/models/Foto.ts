import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";  

interface FotoAttributes {
  id?: number;
  url: string;
}

export class Foto extends Model<FotoAttributes> implements FotoAttributes {
  declare id: number;
  declare url: string;
}

Foto.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    url: { type: DataTypes.STRING(500), allowNull: false },
  },
  { sequelize, modelName: "Foto", tableName: "fotos" }
);