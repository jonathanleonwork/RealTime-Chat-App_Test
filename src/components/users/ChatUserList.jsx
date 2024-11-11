import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Loader, Nav } from "rsuite";
import { useUsers } from "../../context/users.context";
import UserItem from "./users";

const ChatUserList = ({ aboveElHeight }) => {
  const users = useUsers();
  const location = useLocation();

  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll custom-scroll"
      style={{
        height: `calc(100% - ${aboveElHeight}px)`,
      }}
      activeKey={location.pathname}
    >
      {!users && (
        <Loader center vertical content="Loading" speed="slow" size="md" />
      )}
      {users &&
        users.length > 0 &&
        users.map((user) => (
          <Nav.Item eventKey={`/chat/${user.id}`} key={user.id}>
            <Link style={{ textDecoration: "none" }} to={`/chat/${user.id}`}>
              <UserItem user={user} />
            </Link>
          </Nav.Item>
        ))}
    </Nav>
  );
};

export default ChatUserList;
