import { create } from 'zustand';

export interface SocketStore {
  socket: WebSocket | null;
  setSocket(socket: WebSocket | null): void;
  hostname: string | null;
  setHostname(hostname: string | null): void;
}

const useSocketStore = create<SocketStore>()((set) => ({
  socket: null,
  setSocket(socket) {
    set({ socket });
  },
  hostname: null,
  setHostname(hostname) {
    set({ hostname });
  },
}));

export default useSocketStore;
