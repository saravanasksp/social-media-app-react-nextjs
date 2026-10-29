type Props = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  ring?: boolean;
};

export function Avatar({ src, alt, size = 40, className = "", ring = false }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-full bg-sand object-cover ${
        ring ? "ring-2 ring-white outline outline-1 outline-line" : ""
      } ${className}`}
    />
  );
}

export function AvatarRing({ src, alt, size = 66 }: Props) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-[conic-gradient(from_210deg,#d9663a,#e8b23f,#2f4a3f,#d9663a)] p-[2.5px]"
    >
      <span className="rounded-full bg-cream p-[2px]">
        <Avatar src={src} alt={alt} size={size} />
      </span>
    </span>
  );
}
