import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router";
import { Button, Message, toaster } from "rsuite";
import {
  ref as dbRef,
  off,
  onValue,
  query,
  orderByChild,
  equalTo,
  runTransaction,
  update,
  limitToLast,
} from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { auth, database, storage } from "../../../misc/firebase.config";
import { groupBy, transformToArrWithId } from "../../../misc/helpers";
import MessageItem from "./MessageItem";

const PAGE_SIZE = 15;
const messagesRef = dbRef(database, "/messages");

function shouldScrollToBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return percentage > threshold;
}

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = useCallback(
    (limitToUse) => {
      const node = selfRef.current;

      off(messagesRef);
      const currentUserId = auth.currentUser.uid;
      const query1 = query(
        messagesRef,
        orderByChild("toUserId"),
        equalTo(`${chatId}`),
        limitToLast(limitToUse || PAGE_SIZE)
      );
      onValue(query1, (snap) => {
        let data1 = transformToArrWithId(snap.val());
        data1 = data1.filter((msg) => msg.author.uid === currentUserId);
        const query2 = query(
          messagesRef,
          orderByChild("toUserId"),
          equalTo(`${currentUserId}`),
          limitToLast(limitToUse || PAGE_SIZE)
        );
        onValue(query2, (snap) => {
          let data = transformToArrWithId(snap.val());
          data = data.filter((msg) => msg.author.uid === chatId);
          const combinedMessages = [...data1, ...data].sort(
            (a, b) => a.createdAt - b.createdAt
          );

          setMessages(combinedMessages);

          if (shouldScrollToBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        });
      });

      setLimit((p) => p + PAGE_SIZE);
    },
    [chatId]
  );

  useEffect(() => {
    if (messages) {
      messages.forEach((msg) => {
        if (msg.status === "sent") {
          markMessageAsDelivered(msg.id);
        }
      });
    }
  }, [messages]);

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMessages(limit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 200);
  }, [loadMessages, limit]);

  useEffect(() => {
    const node = selfRef.current;

    loadMessages();

    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 200);

    return () => {
      off(messagesRef);
    };
  }, [loadMessages]);

  const handleAdmin = useCallback(
    async (uid) => {
      let alertMsg;
      await runTransaction(dbRef(database, `/users/admins`), (admins) => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = "Admin permission removed";
          } else {
            admins[uid] = true;
            alertMsg = "Admin permission granted";
          }
        }
        return admins;
      });

      toaster.push(
        <Message type="info" closable duration={4000}>
          {alertMsg}
        </Message>
      );
    },
    [chatId]
  );

  const markMessageAsDelivered = (messageId) => {
    const messageRef = dbRef(database, `/messages/${messageId}`);
    update(messageRef, { status: "delivered" });
  };

  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm("Delete this message?")) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;

      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/users/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/users/${chatId}/lastMessage`] = null;
      }

      try {
        await update(dbRef(database), updates);

        toaster.push(
          <Message type="info" closable duration={4000}>
            Message has been deleted
          </Message>
        );
      } catch (err) {
        return toaster.push(
          <Message type="error" closable duration={4000}>
            {err.message}
          </Message>
        );
      }

      if (file) {
        try {
          const fileRef = storageRef(storage, file.url);
          await deleteObject(fileRef);
        } catch (err) {
          toaster.push(
            <Message type="error" closable duration={4000}>
              {err.message}
            </Message>
          );
        }
      }
    },
    [chatId, messages]
  );

  const renderMessages = () => {
    const groups = groupBy(messages, (item) =>
      new Date(item.createdAt).toDateString()
    );

    const items = [];

    Object.keys(groups).forEach((date) => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );

      const msgs = groups[date].map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleDelete={handleDelete}
        />
      ));

      items.push(...msgs);
    });

    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="green" appearance="primary">
            Load more
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default Messages;
