import Image from "next/image";

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
};

const Avatar = ({
  src = "/npchamu-icon.svg",
  alt = "User Avatar",
  size = 40,
}: AvatarProps) => {
  const ringSize = 4;
  const outerSize = size + ringSize * 2;

  return (
    <div
      className="rounded-full ring-2 ring-[#54473980] flex items-center justify-center"
      style={{ width: outerSize, height: outerSize }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
        priority
      />
    </div>
  );
};

export default Avatar;
