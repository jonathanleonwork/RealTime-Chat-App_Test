import React from "react";
import { useParams } from "react-router";
import { Loader } from "rsuite";
import ChatBottom from "../../components/chat_window/bottom";
import Messages from "../../components/chat_window/messages";
import ChatTop from "../../components/chat_window/top";
import { CurrentUserProvider } from "../../context/current-user.context";
import { useUsers } from "../../context/users.context";
import { auth } from "../../misc/firebase.config";
import { transformToArr } from "../../misc/helpers";

const Chat = () => {
  const { chatId } = useParams();

  const users = useUsers();

  if (!users) {
    return <Loader center vertical size="md" content="Loading" speed="slow" />;
  }

  const currentUser = users.find((user) => user.id === chatId);

  if (!currentUser) {
    return <h6 className="text-center mt-page">Chat {chatId} not found</h6>;
  }

  const { name, description } = currentUser;

  const admins = transformToArr(currentUser.admins);
  const isAdmin = admins.includes(auth.currentUser.uid);

  const currentUserData = {
    name,
    description,
    admins,
    isAdmin,
  };

  return (
    <CurrentUserProvider data={currentUserData}>
      <div className="chat-top">
        <ChatTop />
      </div>

      <div className="chat-middle">
        <Messages />
      </div>

      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </CurrentUserProvider>
  );
};

export default Chat;
