import { Request, Response } from "express";

import {
  getDashboardMetrics,
  get3hAverages,
  getWeeklyLocationAverages,
} from "../services/dashboard.services";

export const getDashboard = async (_: Request, res: Response) => {
  try {
    const metrics = await getDashboardMetrics();
    res.status(200).json(metrics);
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
  } catch (error) {
    console.error("Error fetching weekly location averages:", error);
    res
      .status(500)
      .json({ message: "Error fetching weekly location averages" });
  }
};
