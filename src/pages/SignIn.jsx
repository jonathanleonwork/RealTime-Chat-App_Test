import React from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from "firebase/auth";
import GoogleOfficialIcon from "@rsuite/icons/legacy/Google";
import {
  Button,
  Col,
  Container,
  Grid,
  Message,
  Panel,
  Row,
  toaster,
} from "rsuite";
import { ref, serverTimestamp, set } from "firebase/database";
import { auth, database } from "../misc/firebase.config.js";

const SignIn = () => {
  const signInWithProvider = async (provider) => {
    try {
      const credential = await signInWithPopup(auth, provider);
      const userMeta = getAdditionalUserInfo(credential);

      if (userMeta.isNewUser) {
        await set(ref(database, "users/" + credential.user.uid), {
          name: credential.user.displayName,
          createdAt: serverTimestamp(),
        });
      }

      toaster.push(
        <Message type="success" closable duration={4000}>
          Signed In
        </Message>
      );
    } catch (error) {
      toaster.push(
        <Message type="error" closable duration={4000}>
          {error.message}
        </Message>
      );
    }
  };

  const onGoogleSignIn = () => {
    signInWithProvider(new GoogleAuthProvider());
  };

  return (
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col x={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h2>Welcome to Chat</h2>
                <br />
              </div>

              <div className="mt-3">
                <Button
                  block
                  color="green"
                  appearance="primary"
                  onClick={onGoogleSignIn}
                >
                  <GoogleOfficialIcon /> Continue with Google
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default SignIn;
