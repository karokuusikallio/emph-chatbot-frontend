import Image from "next/image";
import { playfairDisplay } from "../pages/_app";

interface UserIconProps {
  sender: string;
  className?: string;
}

const UserIcon = (props: UserIconProps) => {
  if (props.sender === "BOT") {
    return (
      <div className="buddyIconContainer">
        <Image
          alt="good-boi"
          src="/../public/good-boi.png"
          className={props.className ? props.className : "buddyBotIcon"}
          fill
          objectFit="contain"
        />
      </div>
    );
  }

  return (
    <div className="buddyUserIcon">
      <p className={playfairDisplay.className}>
        {props.sender.substring(0, 1).toUpperCase()}
      </p>
    </div>
  );
};

export default UserIcon;
