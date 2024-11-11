import React from "react";
import { Avatar, Whisper, Tooltip, Badge } from "rsuite";
import { getNameInitials } from "../misc/helpers";
import { usePresence } from "../misc/custom-hooks";

const getColor = (presence) => {
  if (!presence) {
    return "gray";
  }

  switch (presence.state) {
    case "online":
      return "green";
    case "offline":
      return "red";
    default:
      return "gray";
  }
};

const getText = (presence) => {
  if (!presence) {
    return "Unknown state";
  }

  return presence.state === "online"
    ? "Online"
    : `Last online ${new Date(presence.last_changed).toLocaleDateString()}`;
};

const ProfileAvatar = ({ uid, name, ...avatarProps }) => {
  const presence = usePresence(uid);
  return (
    <div style={{ position: "relative" }}>
      {presence !== null && (
        <Whisper
          placement="top"
          trigger="hover"
          speaker={<Tooltip>{getText(presence)}</Tooltip>}
        >
          <Badge
            className="cursor-pointer"
            style={{
              backgroundColor: getColor(presence),
              position: "absolute",
              top: "1px",
              left: "1px",
              zIndex: 100,
            }}
          />
        </Whisper>
      )}
      <Avatar circle {...avatarProps} style={{ position: "relative" }}>
        {getNameInitials(name)}
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
