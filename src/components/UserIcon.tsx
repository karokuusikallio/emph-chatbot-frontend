import Image from "next/image";
import { playfairDisplay } from "../pages/_app";

interface UserIconProps {
  sender: string;
}

const UserIcon = (props: UserIconProps) => {
  if (props.sender === "BOT") {
    return (
      <div className="buddyIconContainer">
        <Image
          alt="good-boi"
          src="/good-boi.png"
          className={"buddyBotIcon"}
          height={65}
          width={65}
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
