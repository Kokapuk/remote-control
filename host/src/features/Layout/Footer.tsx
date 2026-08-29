import { Link, Stack, StackProps } from '@chakra-ui/react';
import { openUrl } from '@tauri-apps/plugin-opener';
import { RefAttributes } from 'react';
import { FaGithub } from 'react-icons/fa';
import Versions from '../ServerForm/Version';

export type FooterProps = StackProps & RefAttributes<HTMLDivElement>;

export default function Footer(props: FooterProps) {
  const githubUrl = 'https://github.com/Kokapuk/remote-control';

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      minHeight="6"
      {...props}
    >
      <Versions />
      <Link
        aria-label="Remote Control on GitHub"
        color="fg.muted"
        href={githubUrl}
        onClick={(event) => {
          event.preventDefault();
          void openUrl(githubUrl);
        }}
      >
        <FaGithub />
      </Link>
    </Stack>
  );
}
