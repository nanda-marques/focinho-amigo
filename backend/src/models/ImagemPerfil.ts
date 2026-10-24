import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import Administrador from "./Administrador.js";

interface ImagemPerfilAttributes {
  id?: number;
  idAdministradores: number;
  url: string; // path do bucket privado (ex: "admins/5/1717_foto.jpg")
}

class ImagemPerfil
  extends Model<ImagemPerfilAttributes>
  implements ImagemPerfilAttributes
{
  declare id: number;
  declare idAdministradores: number;
  declare url: string;
}

ImagemPerfil.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idAdministradores: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: "id_administradores", // snake_case no banco
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ImagemPerfil",
    tableName: "imagem_perfil",
    timestamps: false, 
  }
);

// Associação: 1 admin tem 1 imagem de perfil
Administrador.hasOne(ImagemPerfil, {
  foreignKey: "idAdministradores",
  as: "fotoPerfil",
  onDelete: "CASCADE",
});

ImagemPerfil.belongsTo(Administrador, {
  foreignKey: "idAdministradores",
  as: "administrador",
});

export default ImagemPerfil;