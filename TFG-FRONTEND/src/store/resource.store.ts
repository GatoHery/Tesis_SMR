import { monitorService } from "@/services/monitor.service";
import { Resource } from "@/types/monitor.type";
import { create } from "zustand";

type ResourceState = {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  fetchResources: () => Promise<void>;
}

const useResourceStore = create<ResourceState>()(
  (set) => ({
    resources: [],
    loading: true,
    error: null,

    fetchResources: async () => {
      try {
        const data = await monitorService.fetchResources();

        set({
          resources: data,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching resources: ", error);
        set({ loading: false, error: "Failed to fetch resources..." });
      }
    },
  })
);

export default useResourceStore;