import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "home"
  | "compass"
  | "plus"
  | "heart"
  | "comment"
  | "send"
  | "bookmark"
  | "grid"
  | "search"
  | "user"
  | "users"
  | "logout"
  | "more"
  | "smile"
  | "mapPin"
  | "camera"
  | "settings"
  | "trash"
  | "link"
  | "close"
  | "arrowLeft"
  | "arrowRight"
  | "bell"
  | "check"
  | "sparkles"
  | "image"
  | "menu"
  | "lock"
  | "globe"
  | "message";

const shapes: Record<IconName, ReactNode> = {
  home: <path d="M3.5 10.6 12 3.5l8.5 7.1V20a.9.9 0 0 1-.9.9h-4.6v-6.5H9V20.9H4.4a.9.9 0 0 1-.9-.9z" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="m15.4 8.6-2.1 5-4.7 2 2-4.9z" />
    </>
  ),
  plus: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4.8" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  heart: (
    <path d="M12 20.4s-8-4.9-8-10.2A4.6 4.6 0 0 1 12 7.2a4.6 4.6 0 0 1 8 3c0 5.3-8 10.2-8 10.2z" />
  ),
  comment: <path d="M20.7 11.6a8.4 8.4 0 0 1-12.2 7.5L3.6 20.7l1.7-4.9a8.4 8.4 0 1 1 15.4-4.2z" />,
  send: (
    <>
      <path d="m21.5 2.5-7.3 19-3.4-8.3-8.3-3.4z" />
      <path d="M21.5 2.5 10.8 13.2" />
    </>
  ),
  bookmark: <path d="M6.3 3.4h11.4a.9.9 0 0 1 .9.9v16.1l-6.6-4-6.6 4V4.3a.9.9 0 0 1 .9-.9z" />,
  grid: (
    <>
      <rect x="3.4" y="3.4" width="7" height="7" rx="1.2" />
      <rect x="13.6" y="3.4" width="7" height="7" rx="1.2" />
      <rect x="3.4" y="13.6" width="7" height="7" rx="1.2" />
      <rect x="13.6" y="13.6" width="7" height="7" rx="1.2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7.2" />
      <path d="m16.4 16.4 4.2 4.2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.1" r="3.9" />
      <path d="M4.7 20.4a7.5 7.5 0 0 1 14.6 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9.2" cy="8.4" r="3.4" />
      <path d="M2.8 20a6.6 6.6 0 0 1 12.8 0" />
      <path d="M16.4 5.4a3.4 3.4 0 0 1 0 6.6M18 20a6.7 6.7 0 0 0-1.6-4.3 5.5 5.5 0 0 1 4.8 4.3" />
    </>
  ),
  logout: (
    <>
      <path d="M9.5 21H5.4A1.9 1.9 0 0 1 3.5 19V5a1.9 1.9 0 0 1 1.9-1.9h4.1" />
      <path d="m16 16.5 4.5-4.5L16 7.5M20.5 12H9.2" />
    </>
  ),
  more: (
    <>
      <circle cx="5.2" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18.8" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M8.6 14.2a4.1 4.1 0 0 0 6.8 0" />
      <path d="M9.2 9.6h.01M14.8 9.6h.01" strokeWidth="2.2" />
    </>
  ),
  mapPin: (
    <>
      <path d="M19 10.2c0 5.1-7 11.3-7 11.3s-7-6.2-7-11.3a7 7 0 0 1 14 0z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  camera: (
    <>
      <path d="M3.5 8.6A1.9 1.9 0 0 1 5.4 6.7h2.2l1.5-2.3h5.8l1.5 2.3h2.2a1.9 1.9 0 0 1 1.9 1.9v9a1.9 1.9 0 0 1-1.9 1.9H5.4a1.9 1.9 0 0 1-1.9-1.9z" />
      <circle cx="12" cy="12.8" r="3.3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 14.5a1.7 1.7 0 0 0 .3 1.9l.1.1a1.9 1.9 0 0 1-2.7 2.7l-.1-.1a1.7 1.7 0 0 0-2.8 1.2v.2a1.9 1.9 0 0 1-3.8 0v-.1a1.7 1.7 0 0 0-2.8-1.3l-.1.1a1.9 1.9 0 0 1-2.7-2.7l.1-.1a1.7 1.7 0 0 0-1.2-2.8H3.4a1.9 1.9 0 0 1 0-3.8h.2a1.7 1.7 0 0 0 1.2-2.8l-.1-.1a1.9 1.9 0 0 1 2.7-2.7l.1.1a1.7 1.7 0 0 0 2.8-1.2V3.4a1.9 1.9 0 0 1 3.8 0v.2a1.7 1.7 0 0 0 2.8 1.2l.1-.1a1.9 1.9 0 0 1 2.7 2.7l-.1.1a1.7 1.7 0 0 0 1.2 2.8h.2a1.9 1.9 0 0 1 0 3.8h-.2a1.7 1.7 0 0 0-1.6 1.1z" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 6.8h15M9.5 6.8V4.6h5v2.2M6.5 6.8l.9 13a1 1 0 0 0 1 .9h7.2a1 1 0 0 0 1-.9l.9-13" />
      <path d="M10.3 10.8v5.6M13.7 10.8v5.6" />
    </>
  ),
  link: (
    <>
      <path d="M10.4 13.6a3.9 3.9 0 0 0 5.6 0l2.6-2.6a3.9 3.9 0 0 0-5.5-5.5L11.6 7" />
      <path d="M13.6 10.4a3.9 3.9 0 0 0-5.6 0L5.4 13a3.9 3.9 0 0 0 5.5 5.5L12.4 17" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  arrowLeft: <path d="M19 12H5m6-7-7 7 7 7" />,
  arrowRight: <path d="M5 12h14m-6-7 7 7-7 7" />,
  bell: (
    <>
      <path d="M18 9.4a6 6 0 1 0-12 0c0 5-2.2 6.4-2.2 6.4h16.4S18 14.4 18 9.4z" />
      <path d="M10.3 19.6a2 2 0 0 0 3.4 0" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  sparkles: (
    <>
      <path d="M12 3.5l1.8 4.7 4.7 1.8-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8z" />
      <path d="M18.5 16.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
    </>
  ),
  image: (
    <>
      <rect x="3.4" y="4.4" width="17.2" height="15.2" rx="3" />
      <circle cx="8.8" cy="9.6" r="1.6" />
      <path d="m4.5 17.5 4.5-4.4 3.4 3.2 3.1-2.9 4.1 4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  lock: (
    <>
      <rect x="4.5" y="10.4" width="15" height="10.2" rx="2.6" />
      <path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M3.4 12h17.2M12 3.3c2.4 2.4 3.6 5.4 3.6 8.7s-1.2 6.3-3.6 8.7c-2.4-2.4-3.6-5.4-3.6-8.7S9.6 5.7 12 3.3z" />
    </>
  ),
  message: (
    <>
      <path d="M20.5 12.4a7.9 7.9 0 0 1-11.6 7L4 21l1.6-4.6a7.9 7.9 0 1 1 14.9-4z" />
      <path d="M8.6 11.6h.01M12 11.6h.01M15.4 11.6h.01" strokeWidth="2.2" />
    </>
  ),
};

type Props = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  filled?: boolean;
};

export function Icon({ name, size = 22, filled = false, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {shapes[name]}
    </svg>
  );
}
