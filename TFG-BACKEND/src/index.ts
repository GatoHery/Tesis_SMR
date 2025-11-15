import dotenv from "dotenv";
import Server from "./models/server";
import { dbConnection } from "./database/config";

dotenv.config();

const server = new Server();

// Conectar a la base de datos antes de iniciar el servidor
dbConnection().then(() => {
  server.listen();
}).catch((error) => {
  console.error("❌ No se pudo conectar a la base de datos:", error);
  process.exit(1);
});