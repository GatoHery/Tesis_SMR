import { monitorService } from "@/services/monitor.service";
import { Resource } from "@/types/monitor.type";
import { create } from "zustand";
import socket from "@/services/socket.client";
import { Slide, toast } from "react-toastify";
import useThemeStore from "./theme.store";

type ResourceState = {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  fetchResources: () => Promise<void>;
  initializeWebsocket: () => void;
};

const { darkMode } = useThemeStore();
const useResourceStore = create<ResourceState>()((set) => ({
  resources: [],
  loading: true,
  error: null,

  fetchResources: async () => {
    try {
      const data = await monitorService.fetchResources();
      const transformed: Resource[] = (data as any[]).map((item: any) => ({
        id: item.id,
        name: item.name,
        location: item.location,
        maxParticipants: item.maxParticipants,
      }));

      set({
        resources: transformed,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching resources: ", error);
      set({ loading: false, error: "Failed to fetch resources..." });
    }
  },

  initializeWebsocket: () => {
    socket.off("simplified resources");
    socket.on("simplified resources", (data: Resource[]) => {
      toast.success("Datos de recursos simplificados actualizados", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light",
        transition: Slide,
      });

      console.log("Received simplified resources via websocket: ", data);
      set({ resources: data });
    });
  },
}));

export default useResourceStore;
