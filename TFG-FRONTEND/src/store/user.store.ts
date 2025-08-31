import { userService } from "@/services/user.service";
import { User, UserStats } from "@/types/user.type";
import { toast } from "react-toastify";
import { create } from "zustand";

type UserState = {
  users: User[];
  stats: UserStats;
  loading: boolean;
  loadingStats: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
  createUser: (values: { email: string, name: string, password: string }) => Promise<void>;
}

const initialStats: UserStats = {
  totalUsers: 0,
  diffFromLastWeek: 0,
};

const useUserStore = create<UserState>()(
  (set, get) => ({
    users: [],
    stats: initialStats,
    loading: true,
    loadingStats: true,
    error: null,

    fetchUsers: async () => {
      try {
        const data = await userService.fetchUsers();

        set({
          users: data,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching users: ", error);
        set({ loading: false, error: "Failed to fetch users..." });
      }
    },

    fetchUserStats: async () => {
      try {
        const data = await userService.fetchUserStats();

        set({
          stats: data,
          loadingStats: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching user stats: ", error);
        set({ loadingStats: false, error: "Failed to fetch user stats..." });
      }
    },

    createUser: async (values) => {
      const { email, name, password } = values;

      try {
        const data = await userService.createUser(email, name, password);
        
        toast.success(data.message || "User created successfully!");
        
        await get().fetchUsers();
        await get().fetchUserStats();      
      } catch (error) {
        console.error("Error creating user: ", error);
        set({ error: "Failed to create user..." });
      }
    },
  }),
);

export default useUserStore;