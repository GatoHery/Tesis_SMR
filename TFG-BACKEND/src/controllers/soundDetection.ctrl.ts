import { Request, Response } from "express";
import {
  createSound,
  fetchAllSounds,
  fetchSoundById,
} from "../services/soundDetection.services";
import { sendEmail } from "../utils/email";
import { getTodayStartEnd } from "../utils/date";
import { fetchReservations } from "../services/reservation.services";
import { User } from "../models/user";
import { WebSocket, Server as WebSocketServer } from "ws";

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

export const getAllSounds = async (req: Request, res: Response) => {
  try {
    const ws = req.app.get("ws") as WebSocketServer;
    const sounds = await fetchAllSounds();
    res.status(200).json(sounds);
    broadcastData(ws, "getSounds", sounds);
  } catch (error) {
    console.error("Error fetching sounds:", error);
    res.status(500).json({ message: "Error fetching sounds" });
  }
};

export const getSoundById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sound = await fetchSoundById(id);
    const ws = req.app.get("ws") as WebSocketServer;
    res.status(200).json(sound);
    broadcastData(ws, "getSoundById", sound);
  } catch (error) {
    console.error("Error fetching sound:", error);
    res.status(500).json({ message: "Error fetching sound" });
  }
};

export const postSound = async (req: Request, res: Response): Promise<void> => {
  const ws = req.app.get("ws") as WebSocketServer;

  try {
    const alertUsers = await User.find({ receiveAlerts: true });
    console.log("👥 Users with alerts enabled:", alertUsers.length);
    const emailRecipients = alertUsers.map((user) => user.email);
    console.log("📧 Email recipients:", emailRecipients);

    const { decibels, sensorLocation, detectionCount, notification } = req.body;

    // 🗓️ Get today's start and end in GMT-6
    const { todayStart, todayEnd } = getTodayStartEnd();

    // 📥 Fetch reservations
    const reservationsData = await fetchReservations(todayStart, todayEnd);

    const now = new Date();

    console.log(detectionCount + "-------");

    if (detectionCount < 3) {
      console.log("🔇 Detection count is less than 3, ignoring sound event.");
      res.status(200).json({
        triggerBuzzer: false,
        message: "Detection count is less than 3, no action taken.",
      });
      broadcastData(ws, "soundIgnored", {
        message: "Detection count is less than 3, no action taken.",
      });

      return;
    }

    // 🔍 Check if the location is currently reserved
    const activeReservations = reservationsData.reservations.filter(
      (res: any) =>
        res.resourceName === sensorLocation &&
        new Date(res.startDate) <= now &&
        new Date(res.endDate) >= now
    );

    if (activeReservations.length > 0) {
      console.log(
        "🔇 Reservation active for",
        sensorLocation,
        ", ignoring sound event."
      );
      res.status(200).json({
        triggerBuzzer: false,
        message: "Reservation active, no action taken.",
      });
      broadcastData(ws, "soundIgnored", {
        message: "Reservation active, no action taken.",
      });
      return;
    }

    console.log("🚨 No reservation, recording sound event!");

    // 🕑 Convert to GMT-6 timestamp
    const gmt6Date = new Date();
    gmt6Date.setHours(gmt6Date.getHours() - 6);

    const formattedDate = gmt6Date
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    // 📝 Save sound event
    const newSound = await createSound({
      decibels,
      timestamp: gmt6Date,
      sensorLocation,
    });

    if (notification) {
      // ✉️ Send notification email
      await sendEmail(
        emailRecipients,
        "Pico de sonido detectado",
        `Se ha detectado un pico de sonido de ${decibels} dB en la ubicación ${sensorLocation} a las ${formattedDate}`
      );
    }

    res.status(201).json({
      triggerBuzzer: true,
      message: "Sound event recorded and email sent.",
      sound: newSound,
    });
    broadcastData(ws, "newSoundDetected", newSound);
  } catch (error) {
    console.error("❌ Error creating sound:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error creating sound" });
    }
  }
};
