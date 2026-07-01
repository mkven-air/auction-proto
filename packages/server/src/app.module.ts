import { randomUUID } from "node:crypto";
import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { AdminController } from "./admin/admin.controller.js";
import { PassengerController } from "./passenger/passenger.controller.js";

const isProduction = process.env.NODE_ENV === "production";

const prettyTransport = {
  target: "pino-pretty",
  options: {
    colorize: true,
    singleLine: true,
    translateTime: "SYS:HH:MM:ss.l",
    ignore: "pid,hostname,req,res,responseTime,reqId",
  },
};

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
        genReqId: (req, res) => {
          const incoming = req.headers["x-request-id"];
          const id = typeof incoming === "string" && incoming.length > 0 ? incoming : randomUUID();
          res.setHeader("x-request-id", id);
          return id;
        },
        redact: {
          paths: ["req.headers.authorization", "req.headers.cookie"],
          censor: "[redacted]",
        },
        customLogLevel: (_req, res, err) => {
          if (err || res.statusCode >= 500) return "error";
          if (res.statusCode >= 400) return "warn";
          return "info";
        },
        customSuccessMessage: (req, res, responseTime) =>
          `${req.method ?? "?"} ${req.url ?? "?"} \u2192 ${res.statusCode} (${responseTime}ms)`,
        customErrorMessage: (req, res, err) =>
          `${req.method ?? "?"} ${req.url ?? "?"} \u2192 ${res.statusCode}: ${err.message}`,
        ...(isProduction ? {} : { transport: prettyTransport }),
      },
    }),
  ],
  controllers: [AdminController, PassengerController],
})
export class AppModule {}
