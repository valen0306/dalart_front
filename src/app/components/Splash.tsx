'use client';

import React, { useEffect } from 'react';
import { Chewy } from "next/font/google";
import Image from "next/image";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
});

type Props = {
  onFinish: () => void;
};

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="relative w-full h-screen bg-[#FFFCF7] flex items-center justify-center">
      <p
        className={`${chewy.className} text-[#544739] font-normal text-[70px] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-180%] z-10`}
      >
        DaLert
      </p>

      <div className="absolute bottom-0 left-0 w-full h-[7%] bg-[#859A93] z-0" />

      <div className="absolute left-1/2 bottom-[7%] translate-x-[-100%] z-10">
        <Image
          src="/splashimage-woman.svg"
          alt="スプラッシュ女性画像"
          width={105}
          height={105}
        />
      </div>

      <div className="absolute left-1/2 bottom-[7%] translate-x-[10%] z-10">
        <Image
          src="/splashimage-man.svg"
          alt="スプラッシュ男性画像"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
};

export default SplashScreen;


