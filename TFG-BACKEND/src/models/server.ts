import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnection } from "../database/config";
import { Server as WebSocketServer } from "ws";
import http from "http";
import {
  authRoutes,
  rolesRoutes,
  resourcesRoutes,
  soundDetectionRoutes,
  userRoutes,
  reservationRoutes,
  sensorDeviceRoutes,
  dashboardRoutes,
} from "../routes";
import passport from "passport";
import "../config/passport";

dotenv.config();

class Server {
  private app: Application;
  private server: http.Server;
  private ws: WebSocketServer;
  private port: string | undefined;

  private startPingInterval() {
    setInterval(() => {
      this.ws.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.ping();
        }
      });
    }, 150000);
  }

  // paths declarations
  public authPath: string;
  public dashboardPath: string;
  public reservationPath: string;
  public resourcesPath: string;
  public rolesPath: string;
  public sensorDevicePath: string;
  public soundDetectionPath: string;
  public userPath: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3000";

    /* Creación de server http */
    this.server = http.createServer(this.app);

    /* Create Websocket server */
    this.ws = new WebSocketServer({ server: this.server });

    /* inicializando webSocket */
    this.initializeWebSocket();

    this.startPingInterval();

    this.authPath = "/api/auth";
    this.dashboardPath = "/api/dashboard";
    this.reservationPath = "/api/reservations";
    this.resourcesPath = "/api/resources";
    this.rolesPath = "/api/roles";
    this.sensorDevicePath = "/api/sensor-devices";
    this.soundDetectionPath = "/api/sound-detection";
    this.userPath = "/api/users";

    this.app.set("ws", this.ws);

    this.connectingDatabase();
    this.middlewares();
    this.routes();
  }

  private initializeWebSocket() {
    this.ws.on("connection", (ws) => {
      console.log("New client connected");

      // Mover el manejo de mensajes dentro del callback de connection
      ws.on("message", (message) => {
        console.log("Received: ", message);

        // Broadcast dentro del callback de message
        this.ws.clients.forEach((client) => {
          if (client !== ws) {
            client.send(message.toString()); // Convertir el mensaje a string
          }
        });
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });
  }

  async connectingDatabase() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
      })
    );

    this.app.use(cookieParser());
    this.app.use(passport.initialize());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.authPath, authRoutes.default);
    this.app.use(this.dashboardPath, dashboardRoutes.default);
    this.app.use(this.reservationPath, reservationRoutes.default);
    this.app.use(this.resourcesPath, resourcesRoutes.default);
    this.app.use(this.rolesPath, rolesRoutes.default);
    this.app.use(this.soundDetectionPath, soundDetectionRoutes.default);
    this.app.use(this.userPath, userRoutes.default);
    this.app.use(this.sensorDevicePath, sensorDeviceRoutes.default);
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`);
    });
  }
}

export default Server;
