import fastify from "fastify";
import cors from "@fastify/cors";
import { appRoutes } from "./routes";

const port = process.env.PORT || 3002;
const app = fastify();
app.register(cors);
app.register(appRoutes);

app.listen({ port: 3002 }).then(() => {
  console.log(`Servidor aberto em http://localhost:${port}`);
});
