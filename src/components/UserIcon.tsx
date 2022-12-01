import Image from "next/image";
import { playfairDisplay } from "../pages/_app";

interface UserIconProps {
  sender: string;
}

const UserIcon = (props: UserIconProps) => {
  if (props.sender === "Buddy") {
    return (
      <div>
        <Image
          alt="good-boi"
          src="/../public/good-boi.png"
          style={{ borderRadius: "50%", marginLeft: "1rem" }}
          width="80"
          height="80"
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
