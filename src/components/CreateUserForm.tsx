import { useState, FormEvent } from "react";

interface CreateNewUserProps {
  handleCreateNewUser: (
    username: string,
    password: string,
    e: FormEvent<HTMLFormElement>
  ) => Promise<void>;
}

const CreateUserForm = (props: CreateNewUserProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="buddyLoginForm">
      <h2>Create New User</h2>
      <form onSubmit={(e) => props.handleCreateNewUser(username, password, e)}>
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
          minLength={7}
        ></input>
        <button type="submit" className="buddyButton">
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
