import useSocketStore from '@stores/socket';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import ConnectionForm from '../components/ConnectionForm';

export default function Connection() {
  const socket = useSocketStore((s) => s.socket);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      navigate('/controls');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return <ConnectionForm />;
}
