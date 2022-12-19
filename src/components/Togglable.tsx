import { ReactNode } from "react";

interface TogglableProps {
  buttonLabel: string;
  buttonId: string;
  children?: ReactNode;
  visible: boolean;
  setVisibility: (visible: boolean) => void;
}

const Togglable = (props: TogglableProps) => {
  const hideWhenVisible = props.visible ? "notVisible" : "";
  const showWhenVisible = props.visible ? "" : "notVisible";

  return (
    <div>
      <div className={hideWhenVisible}>
        <button
          className="buddyButton"
          onClick={() => props.setVisibility(!props.visible)}
          id={props.buttonId}
        >
          {props.buttonLabel}
        </button>
      </div>
      <div className={`buddyCreateForm ${showWhenVisible}`}>
        {props.children}
        <button
          className="buddyButton"
          onClick={() => props.setVisibility(!props.visible)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Togglable;
