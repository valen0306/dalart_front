import { Chewy } from "next/font/google";

const chewy = Chewy({
  weight: "400", 
  subsets: ["latin"],
});

const Header = () => (
  <header className="z-[1000] flex h-16 items-center justify-center bg-transparent">
    <p className={`${chewy.className} text-[#544739] font-normal text-[25px] relative top-2.5`}>
      DaLert
    </p>
  </header>
);

export default Header;

