import Image from "next/image";
import getImagePath from '@/app/utils/getImagePath';

type ImageProps = {
  ID: string;
  BackscreenMode?: boolean;
};

const OutfitImage: React.FC<ImageProps> = ({ ID, BackscreenMode = false }) => {
  const imagePath = getImagePath(ID);

  return (
    <div
      className={`w-80 aspect-[80/115] rounded-3xl p-4 relative 
        ${BackscreenMode ? 'bg-[#859A93]/70' : ''}`}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        <Image
          src={imagePath}
          alt={`服装 ${ID}`}
          fill
          className="object-cover object-center"
        />
      </div>
    </div>
  );
};

export default OutfitImage;
