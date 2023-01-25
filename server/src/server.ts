import fastify from "fastify";
import cors from "@fastify/cors";
import { appRoutes } from "./routes";

const port = process.env.PORT || 3002;
const app = fastify();
app.register(cors, { origin: "*" });
app.register(appRoutes);

app.listen({ host: "192.168.1.24", port: 3002 }).then(() => {
  console.log(`Servidor aberto em http://localhost:${port}`);
});
