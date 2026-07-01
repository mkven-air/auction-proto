import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module.js";

const PORT = Number(process.env.PORT ?? 3000);

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.enableCors();
  await app.listen(PORT);
  app.get(Logger).log(`@auction/server listening on http://localhost:${PORT}`, "Bootstrap");
}

void bootstrap();
