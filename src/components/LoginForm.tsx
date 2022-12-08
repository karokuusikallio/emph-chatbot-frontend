import { useState, FormEvent } from "react";

interface LoginFormProps {
  handleLogin: (
    username: string,
    password: string,
    e: FormEvent<HTMLFormElement>
  ) => Promise<void>;
}

const LoginForm = (props: LoginFormProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="buddyLoginForm">
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
