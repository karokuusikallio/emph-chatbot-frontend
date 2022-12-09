import Image from "next/image";
import { playfairDisplay } from "../pages/_app";

const Header = () => {
  return (
    <div className="buddyHeader">
      <h1
        className={`${playfairDisplay.className} buddyTitle buddyTitleHeader`}
      >
        Meet
      </h1>
      <Image
        alt="good-boi"
        src="/good-boi.png"
        className={"buddyBotIconHeader"}
        height={100}
        width={100}
        priority={true}
      />
      <h1
        className={`${playfairDisplay.className} buddyTitle buddyTitleHeader`}
      >
        Buddy
      </h1>
    </div>
  );
};

export default Header;
