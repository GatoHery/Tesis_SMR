import { monitorService } from "@/services/monitor.service";
import { Resource } from "@/types/monitor.type";
import { create } from "zustand";
import socket from "@/services/socket.client";

type ResourceState = {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  fetchResources: () => Promise<void>;
  initializeWebsocket: () => void;
};

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
    socket.on("simplifiedResources", (data: Resource[]) => {
      set({ resources: data });
    });

    return () => {
      socket.off("simplifiedResources");
    };
  },
}));

export default useResourceStore;
