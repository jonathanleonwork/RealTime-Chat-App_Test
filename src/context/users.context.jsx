import { off, onValue, ref } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { database, auth } from "../misc/firebase.config";
import { transformToArrWithId } from "../misc/helpers";

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState();

  useEffect(() => {
    const userListRef = ref(database, "users");

    // subscribe to realtime database
    onValue(userListRef, (snap) => {
      let data = transformToArrWithId(snap.val());
      const currentUser = auth.currentUser;
      if (currentUser) {
        data = data.filter((user) => user.id !== currentUser.uid);
      }
      setUsers(data);
    });

    // unsubscribe to realtime database
    return () => {
      off(userListRef);
    };
  }, []);

  return (
    <UsersContext.Provider value={users}>{children}</UsersContext.Provider>
  );
};

export const useUsers = () => useContext(UsersContext);
