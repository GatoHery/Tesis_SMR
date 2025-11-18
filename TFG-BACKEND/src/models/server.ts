import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnection } from "../database/config";
import { Server as SocketIOServer, Socket } from "socket.io";
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
import { broadcastData } from "../utils/websocketConnection";
import { dashbordEmitter } from "../emitters/dashboard.emitter";

dotenv.config();

class Server {
  private app: Application;
  private server: http.Server;
  private io: SocketIOServer;
  private port: string | undefined;

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
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:8080",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      },
    });

    /* inicializando webSocket */
    this.initializeSocketIO();

    this.authPath = "/api/auth";
    this.dashboardPath = "/api/dashboard";
    this.reservationPath = "/api/reservations";
    this.resourcesPath = "/api/resources";
    this.rolesPath = "/api/roles";
    this.sensorDevicePath = "/api/sensor-devices";
    this.soundDetectionPath = "/api/sound-detection";
    this.userPath = "/api/users";

    this.app.set("socket: Socket", this.io);

    this.connectingDatabase();
    this.middlewares();
    this.routes();
  }

  private initializeSocketIO() {
    this.io.on("connection", (socket: Socket) => {
      console.log("🔌 New client connected");

      socket.on("message", (msg) => {
        console.log("📨 Received:", msg);
        broadcastData(this.io, "message", msg);
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected");
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
      dashbordEmitter(this.io);
    });
  }
}

export default Server;
