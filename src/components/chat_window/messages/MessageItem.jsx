import React, { memo, useEffect } from "react";
import { Button, Content } from "rsuite";
import TimeAgo from "timeago-react";
import { useCurrentUser } from "../../../context/current-user.context";
import { useHover, useMediaQuery } from "../../../misc/custom-hooks";
import ProfileAvatar from "../../ProfileAvatar";
import IconBtnControl from "./IconBtnControl";
import ProfileInfoBtnModal from "./ProfileInfoBtnModal";
import { update, ref as dbRef } from "firebase/database";
import { auth, database } from "../../../misc/firebase.config";
import { BiCheck, BiCheckDouble } from "react-icons/bi";

const renderStatus = (status) => {
  if (status === "sent") {
    return (
      <BiCheck
        style={{
          marginLeft: "6px",
          position: "absolute",
          right: "2px",
          bottom: "2px",
        }}
      />
    ); // Single tick
  }
  if (status === "delivered") {
    return (
      <BiCheckDouble
        style={{
          marginLeft: "6px",
          position: "absolute",
          right: "2px",
          bottom: "2px",
        }}
      />
    ); // Double tick
  }
  if (status === "read") {
    return (
      <BiCheckDouble
        className="tick-read"
        style={{
          marginLeft: "6px",
          position: "absolute",
          right: "2px",
          bottom: "2px",
        }}
      />
    ); // Blue double tick
  }
  return null;
};

const MessageItem = ({ message, handleAdmin, handleDelete }) => {
  const { status, author, createdAt, text } = message;

  const [selfRef, isHovered] = useHover();
  const isMobile = useMediaQuery("(max-width: 992px)");

  const isAdmin = useCurrentUser((v) => v.isAdmin);
  const admins = useCurrentUser((v) => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const canShowIcons = isMobile || isHovered;

  const messageClass = isAuthor ? "message-right" : "message-left";

  useEffect(() => {
    if (status !== "read" && !isAuthor) {
      const markMessageAsRead = async (msgId) => {
        const messageRef = dbRef(database, `/messages/${msgId}`);
        await update(messageRef, { status: "read" });
      };
      markMessageAsRead(message.id);
    }
  }, [message.id, status, author.uid]);

  return (
    <li
      className={`padded mb-1 cursor-pointer ${
        isHovered ? "bg-black-02" : ""
      } ${messageClass}`}
      ref={selfRef}
    >
      <div>
        <div className={`d-flex align-items-center font-bolder mb-1 `}>
          {!isAuthor && (
            <ProfileAvatar
              uid={author.uid}
              src={author.avatar}
              name={author.name}
              size="sm"
            />
          )}
          {!isAuthor && (
            <ProfileInfoBtnModal
              profile={author}
              appearance="link"
              className="p-0 ml-1 text-black"
            >
              {canGrantAdmin && (
                <Button
                  block
                  onClick={() => handleAdmin(author.uid)}
                  color="blue"
                  appearance="primary"
                >
                  {isMsgAuthorAdmin
                    ? "Remove admin permission"
                    : "Give admin in this user"}
                </Button>
              )}
            </ProfileInfoBtnModal>
          )}
          <TimeAgo
            datetime={createdAt}
            className={`font-normal text-black-45 ml-2 ${messageClass}`}
          />

          {isAuthor && (
            <IconBtnControl
              isVisible={canShowIcons}
              iconName="close"
              tooltip="Delete this message"
              onClick={() => handleDelete(message.id)}
            />
          )}
        </div>

        <div
          className={`${messageClass}`}
          style={{
            backgroundColor: !isAuthor ? "#ffffff" : "#d9fdd3",
            borderRadius: "5px",
            padding: "8px 8px",
            maxWidth: "70%",
            width: "fit-content",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            position: "relative",
            paddingRight: "20px",
          }}
        >
          <div>{text && <span className="word-break-all">{text}</span>}</div>
          {renderStatus(isAuthor ? status : null)} {/* Render the status */}
        </div>
      </div>
    </li>
  );
};

export default memo(MessageItem);
