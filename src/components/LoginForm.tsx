import { useState, FormEvent } from "react";

interface LoginFormProps {
  handleLogin: (
    username: string,
    password: string,
    e: FormEvent<HTMLFormElement>
  ) => Promise<void>;
  visibility: boolean;
}

const LoginForm = (props: LoginFormProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const showWhenVisible = props.visibility ? "" : "notVisible";

  return (
    <div className={showWhenVisible}>
      <div className="buddyLoginForm">
        <h2>Login</h2>
        <form onSubmit={(e) => props.handleLogin(username, password, e)}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          ></input>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          ></input>
          <button type="submit" className="buddyButton">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
