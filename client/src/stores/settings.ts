import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsStore {
  moveSensitivity: number;
  scrollSensitivity: number;
  setSettings(partialSettings: Partial<Omit<SettingsStore, 'setSettings'>>): void;
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      moveSensitivity: 2,
      scrollSensitivity: 0.05,
      setSettings(partialSettings) {
        set(partialSettings);
      },
    }),
    {
      name: 'settings',
    }
  )
);

export default useSettingsStore;
