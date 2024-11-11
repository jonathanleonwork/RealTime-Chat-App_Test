import React from "react";
import TimeAgo from "timeago-react";
import ProfileAvatar from "../ProfileAvatar";

const UserItem = ({ user }) => {
  const { createdAt, name } = user;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-disappear">{name}</h3>
      </div>
    </div>
  );
};

export default UserItem;
