import { GoogleAuthProvider, linkWithPopup, unlink } from "firebase/auth";
import React, { useState } from "react";
import { Button, Message, Tag, toaster } from "rsuite";
import { auth } from "../../misc/firebase.config";
import GoogleOfficialIcon from "@rsuite/icons/legacy/Google";

const ProviderBlock = () => {
  const [isConnected, setIsConnected] = useState({
    "google.com": auth.currentUser.providerData.some(
      (data) => data.providerId === "google.com"
    ),
  });

  const updateIsConnected = (providerId, value) => {
    setIsConnected((p) => {
      return {
        ...p,
        [providerId]: value,
      };
    });
  };

  const unlinkProvider = async (providerId) => {
    try {
      if (auth.currentUser.providerData.length === 1) {
        throw new Error(`You can not disconnect from ${providerId}`);
      }

      await unlink(auth.currentUser, providerId);
      updateIsConnected(providerId, false);
      toaster.push(
        <Message type="info" closable duration={4000}>
          {`Disconnected from ${providerId}`}
        </Message>
      );
    } catch (err) {
      toaster.push(
        <Message type="error" closable duration={4000}>
          {err.message}
        </Message>
      );
    }
  };

  const unlinkGoogle = () => {
    unlinkProvider("google.com");
  };

  const linkProvider = async (provider) => {
    try {
      await linkWithPopup(auth.currentUser, provider);
      toaster.push(
        <Message type="info" closable duration={4000}>
          {`Linked to ${provider.providerId}`}
        </Message>
      );
      updateIsConnected(provider.providerId, true);
    } catch (err) {
      toaster.push(
        <Message type="error" closable duration={4000}>
          {err.message}
        </Message>
      );
    }
  };

  const linkGoogle = () => {
    linkProvider(new GoogleAuthProvider());
  };

  return (
    <div>
      {isConnected["google.com"] && (
        <Tag color="green" closable onClose={unlinkGoogle} appearance="primary">
          <GoogleOfficialIcon /> Connected
        </Tag>
      )}

      <div className="mt-2">
        {!isConnected["google.com"] && (
          <Button block color="green" onClick={linkGoogle} appearance="primary">
            <GoogleOfficialIcon /> Link to Google
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
