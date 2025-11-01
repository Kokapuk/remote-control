import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HotbarStore {
  hotbarKeycodes: string[];
  addHotbarKeycode(constant: string): void;
  removeHotbarKeycode(constant: string): void;
}

const useHotbarStore = create<HotbarStore>()(
  persist(
    (set) => ({
      hotbarKeycodes: [],
      addHotbarKeycode(constant) {
        set((prev) => ({
          hotbarKeycodes: [...prev.hotbarKeycodes.filter((keycode) => keycode !== constant), constant],
        }));
      },
      removeHotbarKeycode(constant) {
        set((prev) => ({
          hotbarKeycodes: prev.hotbarKeycodes.filter((keycode) => keycode !== constant),
        }));
      },
    }),
    {
      name: 'hotbar',
    }
  )
);

export default useHotbarStore;
