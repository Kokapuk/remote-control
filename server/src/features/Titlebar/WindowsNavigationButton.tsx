import { Tooltip } from '@/ui/tooltip';
import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { RefAttributes } from 'react';

export type WindowsNavigationButtonVariant = 'default' | 'close';
export type WindowsNavigationButtonBaseProps = { tooltip?: string; variant?: WindowsNavigationButtonVariant };
export type WindowsNavigationButtonProps = WindowsNavigationButtonBaseProps &
  Omit<IconButtonProps, 'variant'> &
  RefAttributes<HTMLButtonElement>;

export default function WindowsNavigationButton({
  tooltip,
  variant = 'default',
  ...props
}: WindowsNavigationButtonProps) {
  const hoverBackgroundColor = { default: 'fg/6', close: 'red.600' }[variant];
  const activeBackgroundColor = { default: 'fg/4', close: 'red.600/90' }[variant];

  return (
    <Tooltip content={tooltip} disabled={!tooltip}>
      <IconButton
        aria-label={tooltip}
        variant="ghost"
        width="11"
        borderRadius="0"
        color="fg"
        _hover={{ backgroundColor: hoverBackgroundColor }}
        _expanded={{ backgroundColor: hoverBackgroundColor }}
        _active={{ backgroundColor: activeBackgroundColor, color: 'fg/78' }}
        _icon={{ width: '2.5', height: '2.5' }}
        {...props}
      />
    </Tooltip>
  );
}
