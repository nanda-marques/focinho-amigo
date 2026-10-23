import "dotenv/config";
import { Sequelize } from "sequelize";

function obrigatoria(nome: string): string {
  const valor = process.env[nome];
  if (!valor) throw new Error(`Variável de ambiente ${nome} não definida.`);
  return valor;
}

const sequelize = new Sequelize(
  obrigatoria("DB_NAME"),
  obrigatoria("DB_USER"),
  obrigatoria("DB_PASSWORD"),
  {
    host: obrigatoria("DB_HOST"),
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
    define: {
      underscored: true,  
    },
  }
);

export default sequelize;