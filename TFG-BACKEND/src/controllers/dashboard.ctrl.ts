import { Request, Response } from "express";
import { WebSocket, Server as WebSocketServer } from "ws";
import {
  getDashboardMetrics,
  get3hAverages,
  getWeeklyLocationAverages,
} from "../services/dashboard.services";

/* Función para emitir datos por WebSocket */
const broadcastData = (ws: WebSocketServer, eventType: string, data: any) => {
  ws.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(
        JSON.stringify({
          type: eventType,
          data,
        })
      );
    }
  });
};

export const getDashboard = async (_: Request, res: Response) => {
  try {
    const metrics = await getDashboardMetrics();
    res.status(200).json(metrics);

    const ws = _.app.get("ws") as WebSocketServer;
    broadcastData(ws, "dashboardMetrics", metrics);
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ message: "Error fetching dashboard metrics" });
  }
};

export const getHourlyAverages = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await get3hAverages();
    res.status(200).json(data);
    const ws = _req.app.get("ws") as WebSocketServer;
    broadcastData(ws, "hourlyAverages", data);
  } catch (error) {
    console.error("Error fetching 3h averages:", error);
    res.status(500).json({ message: "Error fetching 3h averages" });
  }
};

export const getWeeklyLocationAveragesCtrl = async (
  _req: Request,
  res: Response
) => {
  try {
    const { labels, values } = await getWeeklyLocationAverages();
    res.status(200).json({ labels, values });

    const ws = _req.app.get("ws") as WebSocketServer;
    broadcastData(ws, "weeklyLocationAverages", { labels, values });
  } catch (error) {
    console.error("Error fetching weekly location averages:", error);
    res
      .status(500)
      .json({ message: "Error fetching weekly location averages" });
  }
};
