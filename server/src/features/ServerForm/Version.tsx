import { Text, TextProps } from '@chakra-ui/react';
import { getTauriVersion, getVersion } from '@tauri-apps/api/app';
import { RefAttributes, useEffect, useState } from 'react';

export type AppVersionProps = TextProps & RefAttributes<HTMLParagraphElement>;

export default function Versions(props: AppVersionProps) {
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const [tauriVersion, setTauriVersion] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [appVersion, tauriVersion] = await Promise.all([getVersion(), getTauriVersion()]);

      setAppVersion(appVersion);
      setTauriVersion(tauriVersion);
    })();
  }, []);

  if (!appVersion) {
    return;
  }

  return (
    <Text fontSize="xs" color="fg.subtle" {...props}>
      App: {appVersion} Tauri: {tauriVersion}
    </Text>
  );
}
