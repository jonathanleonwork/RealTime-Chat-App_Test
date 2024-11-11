import React from "react";
import { createContext, useContextSelector } from "use-context-selector";

const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children, data }) => {
  return (
    <CurrentUserContext.Provider value={data}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = (selector) =>
  useContextSelector(CurrentUserContext, selector);
