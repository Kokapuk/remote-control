import useSocketStore from '@stores/socket';
import { toaster } from '@ui/toaster';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/shallow';
import ConnectedActionBar from '../components/ConnectedActionBar';
import TouchPad from '../components/TouchPad';

export default function Controls() {
  const { socket, setSocket, setHostname } = useSocketStore(
    useShallow((s) => ({ socket: s.socket, setSocket: s.setSocket, setHostname: s.setHostname }))
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) {
      navigate('/');
      return;
    }

    const handleError = () => {
      toaster.error({ title: 'Connection lost' });
      setHostname(null);
      setSocket(null);
    };

    const handleClose = () => {
      toaster.warning({ title: 'Disconnected' });
      setHostname(null);
      setSocket(null);
    };

    socket.addEventListener('close', handleClose);
    socket.addEventListener('error', handleError);

    return () => {
      socket.removeEventListener('close', handleClose);
      socket.removeEventListener('error', handleError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <>
      <TouchPad position="absolute" inset="0" />
      <ConnectedActionBar />
    </>
  );
}
