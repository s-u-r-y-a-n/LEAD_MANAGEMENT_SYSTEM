// import { FetchUsers } from "./Fetch Users/FetchUsers";
// import { CreateUser } from "./Create User/CreateUser";

import { CreateUser } from "./CreateUser/CreateUser.jsx";
import { FetchUsers } from "./Fetch Users/FetchUsers.jsx";

export const Users = () => {
  return (
    <div>
      <FetchUsers />
      <CreateUser />
    </div>
  );
};
