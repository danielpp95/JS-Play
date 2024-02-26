import { createStore } from "zustand/vanilla";
import { persist } from 'zustand/middleware';

import DEFAULT_INITIAL_SETTINGS from '../../editor.config.json'

const useStore = createStore(
    persist(
      (set, get) => ({
        ...DEFAULT_INITIAL_SETTINGS,
        updateSettings: ({ key, value }) => {
          set({ [key]: value })
        }
      }),
      { name: 'appInitialState', getStorage: () => window.localStorage }
    )
);

export const { getState, setState, subscribe } = useStore;
