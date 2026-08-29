import { Icon } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import {
  FaArrowDown,
  FaArrowLeft,
  FaArrowLeftLong,
  FaArrowRight,
  FaArrowRightArrowLeft,
  FaArrowRightLong,
  FaArrowRotateLeft,
  FaArrowTurnDown,
  FaArrowUp,
  FaBackward,
  FaDeleteLeft,
  FaForward,
  FaForwardStep,
  FaStop,
  FaTableList,
  FaVolumeHigh,
  FaVolumeLow,
  FaVolumeXmark,
  FaWindows,
} from 'react-icons/fa6';

export interface VirtualKeycode {
  value: number;
  description: string;
  label?: ReactNode;
}

const VIRTUAL_KEYCODES: Record<string, VirtualKeycode> = {
  '0': {
    value: 0x30,
    description: '0 key',
    label: '0',
  },
  '1': {
    value: 0x31,
    description: '1 key',
    label: '1',
  },
  '2': {
    value: 0x32,
    description: '2 key',
    label: '2',
  },
  '3': {
    value: 0x33,
    description: '3 key',
    label: '3',
  },
  '4': {
    value: 0x34,
    description: '4 key',
    label: '4',
  },
  '5': {
    value: 0x35,
    description: '5 key',
    label: '5',
  },
  '6': {
    value: 0x36,
    description: '6 key',
    label: '6',
  },
  '7': {
    value: 0x37,
    description: '7 key',
    label: '7',
  },
  '8': {
    value: 0x38,
    description: '8 key',
    label: '8',
  },
  '9': {
    value: 0x39,
    description: '9 key',
    label: '9',
  },
  VK_BACK: {
    value: 0x08,
    description: 'Backspace key',
    label: <FaDeleteLeft />,
  },
  VK_TAB: {
    value: 0x09,
    description: 'Tab key',
    label: <FaArrowRightArrowLeft />,
  },
  VK_RETURN: {
    value: 0x0d,
    description: 'Enter key',
    label: (
      <Icon transform="rotate(90deg)">
        <FaArrowTurnDown />
      </Icon>
    ),
  },
  VK_CAPITAL: {
    value: 0x14,
    description: 'Caps lock key',
    label: 'Caps Lock',
  },
  VK_ESCAPE: {
    value: 0x1b,
    description: 'Esc key',
    label: 'Esc',
  },
  VK_SPACE: {
    value: 0x20,
    description: 'Spacebar key',
    label: 'Space',
  },
  VK_PRIOR: {
    value: 0x21,
    description: 'Page up key',
    label: 'PU',
  },
  VK_NEXT: {
    value: 0x22,
    description: 'Page down key',
    label: 'PD',
  },
  VK_END: {
    value: 0x23,
    description: 'End key',
    label: 'END',
  },
  VK_HOME: {
    value: 0x24,
    description: 'Home key',
    label: 'HM',
  },
  VK_LEFT: {
    value: 0x25,
    description: 'Left arrow key',
    label: <FaArrowLeft />,
  },
  VK_UP: {
    value: 0x26,
    description: 'Up arrow key',
    label: <FaArrowUp />,
  },
  VK_RIGHT: {
    value: 0x27,
    description: 'Right arrow key',
    label: <FaArrowRight />,
  },
  VK_DOWN: {
    value: 0x28,
    description: 'Down arrow key',
    label: <FaArrowDown />,
  },
  VK_SNAPSHOT: {
    value: 0x2c,
    description: 'Print screen key',
    label: 'PS',
  },
  VK_INSERT: {
    value: 0x2d,
    description: 'Insert key',
    label: 'INS',
  },
  VK_DELETE: {
    value: 0x2e,
    description: 'Delete key',
    label: 'DEL',
  },
  A: {
    value: 0x41,
    description: 'A key',
    label: 'A',
  },
  B: {
    value: 0x42,
    description: 'B key',
    label: 'B',
  },
  C: {
    value: 0x43,
    description: 'C key',
    label: 'C',
  },
  D: {
    value: 0x44,
    description: 'D key',
    label: 'D',
  },
  E: {
    value: 0x45,
    description: 'E key',
    label: 'E',
  },
  F: {
    value: 0x46,
    description: 'F key',
    label: 'F',
  },
  G: {
    value: 0x47,
    description: 'G key',
    label: 'G',
  },
  H: {
    value: 0x48,
    description: 'H key',
    label: 'H',
  },
  I: {
    value: 0x49,
    description: 'I key',
    label: 'I',
  },
  J: {
    value: 0x4a,
    description: 'J key',
    label: 'J',
  },
  K: {
    value: 0x4b,
    description: 'K key',
    label: 'K',
  },
  L: {
    value: 0x4c,
    description: 'L key',
    label: 'L',
  },
  M: {
    value: 0x4d,
    description: 'M key',
    label: 'M',
  },
  N: {
    value: 0x4e,
    description: 'N key',
    label: 'N',
  },
  O: {
    value: 0x4f,
    description: 'O key',
    label: 'O',
  },
  P: {
    value: 0x50,
    description: 'P key',
    label: 'P',
  },
  Q: {
    value: 0x51,
    description: 'Q key',
    label: 'Q',
  },
  R: {
    value: 0x52,
    description: 'R key',
    label: 'R',
  },
  S: {
    value: 0x53,
    description: 'S key',
    label: 'S',
  },
  T: {
    value: 0x54,
    description: 'T key',
    label: 'T',
  },
  U: {
    value: 0x55,
    description: 'U key',
    label: 'U',
  },
  V: {
    value: 0x56,
    description: 'V key',
    label: 'V',
  },
  W: {
    value: 0x57,
    description: 'W key',
    label: 'W',
  },
  X: {
    value: 0x58,
    description: 'X key',
    label: 'X',
  },
  Y: {
    value: 0x59,
    description: 'Y key',
    label: 'Y',
  },
  Z: {
    value: 0x5a,
    description: 'Z key',
    label: 'Z',
  },
  VK_LWIN: {
    value: 0x5b,
    description: 'Left Windows logo key',
    label: <FaWindows />,
  },
  VK_RWIN: {
    value: 0x5c,
    description: 'Right Windows logo key',
    label: <FaWindows />,
  },
  VK_APPS: {
    value: 0x5d,
    description: 'Application key',
    label: <FaTableList />,
  },
  VK_NUMPAD0: {
    value: 0x60,
    description: 'Numeric keypad 0 key',
    label: 'N0',
  },
  VK_NUMPAD1: {
    value: 0x61,
    description: 'Numeric keypad 1 key',
    label: 'N1',
  },
  VK_NUMPAD2: {
    value: 0x62,
    description: 'Numeric keypad 2 key',
    label: 'N2',
  },
  VK_NUMPAD3: {
    value: 0x63,
    description: 'Numeric keypad 3 key',
    label: 'N3',
  },
  VK_NUMPAD4: {
    value: 0x64,
    description: 'Numeric keypad 4 key',
    label: 'N4',
  },
  VK_NUMPAD5: {
    value: 0x65,
    description: 'Numeric keypad 5 key',
    label: 'N5',
  },
  VK_NUMPAD6: {
    value: 0x66,
    description: 'Numeric keypad 6 key',
    label: 'N6',
  },
  VK_NUMPAD7: {
    value: 0x67,
    description: 'Numeric keypad 7 key',
    label: 'N7',
  },
  VK_NUMPAD8: {
    value: 0x68,
    description: 'Numeric keypad 8 key',
    label: 'N8',
  },
  VK_NUMPAD9: {
    value: 0x69,
    description: 'Numeric keypad 9 key',
    label: 'N9',
  },
  VK_MULTIPLY: {
    value: 0x6a,
    description: 'Multiply key',
    label: '*',
  },
  VK_ADD: {
    value: 0x6b,
    description: 'Add key',
    label: '+',
  },
  VK_SEPARATOR: {
    value: 0x6c,
    description: 'Separator key',
    label: '.',
  },
  VK_SUBTRACT: {
    value: 0x6d,
    description: 'Subtract key',
    label: '-',
  },
  VK_DECIMAL: {
    value: 0x6e,
    description: 'Decimal key',
    label: '.',
  },
  VK_DIVIDE: {
    value: 0x6f,
    description: 'Divide key',
    label: '/',
  },
  VK_F1: {
    value: 0x70,
    description: 'F1 key',
    label: 'F1',
  },
  VK_F2: {
    value: 0x71,
    description: 'F2 key',
    label: 'F2',
  },
  VK_F3: {
    value: 0x72,
    description: 'F3 key',
    label: 'F3',
  },
  VK_F4: {
    value: 0x73,
    description: 'F4 key',
    label: 'F4',
  },
  VK_F5: {
    value: 0x74,
    description: 'F5 key',
    label: 'F5',
  },
  VK_F6: {
    value: 0x75,
    description: 'F6 key',
    label: 'F6',
  },
  VK_F7: {
    value: 0x76,
    description: 'F7 key',
    label: 'F7',
  },
  VK_F8: {
    value: 0x77,
    description: 'F8 key',
    label: 'F8',
  },
  VK_F9: {
    value: 0x78,
    description: 'F9 key',
    label: 'F9',
  },
  VK_F10: {
    value: 0x79,
    description: 'F10 key',
    label: 'F10',
  },
  VK_F11: {
    value: 0x7a,
    description: 'F11 key',
    label: 'F11',
  },
  VK_F12: {
    value: 0x7b,
    description: 'F12 key',
    label: 'F12',
  },
  VK_F13: {
    value: 0x7c,
    description: 'F13 key',
    label: 'F13',
  },
  VK_F14: {
    value: 0x7d,
    description: 'F14 key',
    label: 'F14',
  },
  VK_F15: {
    value: 0x7e,
    description: 'F15 key',
    label: 'F15',
  },
  VK_F16: {
    value: 0x7f,
    description: 'F16 key',
    label: 'F16',
  },
  VK_F17: {
    value: 0x80,
    description: 'F17 key',
    label: 'F17',
  },
  VK_F18: {
    value: 0x81,
    description: 'F18 key',
    label: 'F18',
  },
  VK_F19: {
    value: 0x82,
    description: 'F19 key',
    label: 'F19',
  },
  VK_F20: {
    value: 0x83,
    description: 'F20 key',
    label: 'F20',
  },
  VK_F21: {
    value: 0x84,
    description: 'F21 key',
    label: 'F21',
  },
  VK_F22: {
    value: 0x85,
    description: 'F22 key',
    label: 'F22',
  },
  VK_F23: {
    value: 0x86,
    description: 'F23 key',
    label: 'F23',
  },
  VK_F24: {
    value: 0x87,
    description: 'F24 key',
    label: 'F24',
  },
  VK_NUMLOCK: {
    value: 0x90,
    description: 'Num lock key',
    label: 'NL',
  },
  VK_SCROLL: {
    value: 0x91,
    description: 'Scroll lock key',
    label: 'SL',
  },
  VK_LSHIFT: {
    value: 0xa0,
    description: 'Left Shift key',
    label: 'L Shift',
  },
  VK_RSHIFT: {
    value: 0xa1,
    description: 'Right Shift key',
    label: 'R Shift',
  },
  VK_LCONTROL: {
    value: 0xa2,
    description: 'Left Ctrl key',
    label: 'L Ctrl',
  },
  VK_RCONTROL: {
    value: 0xa3,
    description: 'Right Ctrl key',
    label: 'R Ctrl',
  },
  VK_LMENU: {
    value: 0xa4,
    description: 'Left Alt key',
    label: 'L Alt',
  },
  VK_RMENU: {
    value: 0xa5,
    description: 'Right Alt key',
    label: 'R Alt',
  },
  VK_BROWSER_BACK: {
    value: 0xa6,
    description: 'Browser Back key',
    label: <FaArrowLeftLong />,
  },
  VK_BROWSER_FORWARD: {
    value: 0xa7,
    description: 'Browser Forward key',
    label: <FaArrowRightLong />,
  },
  VK_BROWSER_REFRESH: {
    value: 0xa8,
    description: 'Browser Refresh key',
    label: <FaArrowRotateLeft />,
  },
  VK_VOLUME_MUTE: {
    value: 0xad,
    description: 'Volume Mute key',
    label: <FaVolumeXmark />,
  },
  VK_VOLUME_DOWN: {
    value: 0xae,
    description: 'Volume Down key',
    label: <FaVolumeLow />,
  },
  VK_VOLUME_UP: {
    value: 0xaf,
    description: 'Volume Up key',
    label: <FaVolumeHigh />,
  },
  VK_MEDIA_NEXT_TRACK: {
    value: 0xb0,
    description: 'Next Track key',
    label: <FaForward />,
  },
  VK_MEDIA_PREV_TRACK: {
    value: 0xb1,
    description: 'Previous Track key',
    label: <FaBackward />,
  },
  VK_MEDIA_STOP: {
    value: 0xb2,
    description: 'Stop Media key',
    label: <FaStop />,
  },
  VK_MEDIA_PLAY_PAUSE: {
    value: 0xb3,
    description: 'Play/Pause Media key',
    label: <FaForwardStep />,
  },
  VK_OEM_1: {
    value: 0xba,
    description: 'It can vary by keyboard. For the US ANSI keyboard , the Semiсolon and Colon key',
    label: ';',
  },
  VK_OEM_PLUS: {
    value: 0xbb,
    description: 'For any country/region, the Equals and Plus key',
    label: '=',
  },
  VK_OEM_COMMA: {
    value: 0xbc,
    description: 'For any country/region, the Comma and Less Than key',
    label: ',',
  },
  VK_OEM_MINUS: {
    value: 0xbd,
    description: 'For any country/region, the Dash and Underscore key',
    label: '-',
  },
  VK_OEM_PERIOD: {
    value: 0xbe,
    description: 'For any country/region, the Period and Greater Than key',
    label: '.',
  },
  VK_OEM_2: {
    value: 0xbf,
    description: 'It can vary by keyboard. For the US ANSI keyboard, the Forward Slash and Question Mark key',
    label: '/',
  },
  VK_OEM_3: {
    value: 0xc0,
    description: 'It can vary by keyboard. For the US ANSI keyboard, the Grave Accent and Tilde key',
    label: '`',
  },
  VK_OEM_4: {
    value: 0xdb,
    description: 'It can vary by keyboard. For the US ANSI keyboard, the Left Brace key',
    label: '[',
  },
  VK_OEM_5: {
    value: 0xdc,
    description: 'It can vary by keyboard. For the US ANSI keyboard, the Backslash and Pipe key',
    label: '\\',
  },
  VK_OEM_6: {
    value: 0xdd,
    description: 'It can vary by keyboard. For the US ANSI keyboard, the Right Brace key',
    label: ']',
  },
  VK_OEM_7: {
    value: 0xde,
    description: 'It can vary by keyboard. For the US ANSI keyboard, the Apostrophe and Double Quotation Mark key',
    label: "'",
  },
};

export default VIRTUAL_KEYCODES;
