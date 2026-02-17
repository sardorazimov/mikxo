import { create } from "zustand";

type View =
  | "recommend"
  | "chats"
  | "groups"
  | "settings";

type DashboardState = {

  view: View;

  setView: (view: View) => void;

};

export const useDashboardStore =
  create<DashboardState>((set) => ({

    view: "recommend",

    setView: (view) =>
      set({ view }),

  }));
