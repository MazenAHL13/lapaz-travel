import { create } from "zustand";

type User = {
  id: "mazen" | "diego" | "fidel";
  name: string;
  email: string;
  avatar?: string; 
};

type UserState = {
  currentUser: User | null;
  loginAs: (id: User["id"]) => void;
  logout: () => void;
  setAvatar: (uri: string) => void; 
};

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,

  loginAs: (id) => {
    const baseUsers: Record<User["id"], User> = {
      mazen: {
        id: "mazen",
        name: "Mazen Abu Hamdan",
        email: "mazen@lapaz.travel",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      diego: {
        id: "diego",
        name: "Diego Alba",
        email: "diego@lapaz.travel",
        avatar: "https://i.pravatar.cc/150?img=20",
      },
      fidel: {
        id: "fidel",
        name: "Fidel Aguilar",
        email: "fidel@lapaz.travel",
        avatar: "https://i.pravatar.cc/150?img=32",
      },
    };
    set({ currentUser: baseUsers[id] ?? null });
  },

  logout: () => set({ currentUser: null }),

  setAvatar: (uri) => {
    const user = get().currentUser;
    if (!user) return;
    set({ currentUser: { ...user, avatar: uri } });
  },
}));