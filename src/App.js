import "./fancy-button.css";

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from "amazon-cognito-identity-js";

import { useState } from "react";

const poolData = {
  UserPoolId: "us-west-2_c1Dq5T2lY", // Your user pool id here
  ClientId: "6oohg5pvj0cgphsu3at9nq7bol", // Your client id here
};
const userPool = new CognitoUserPool(poolData);

const dataEmail = {
  Name: "email",
  Value: "email@mydomain.com",
};
const dataPhoneNumber = {
  Name: "phone_number",
  Value: "+16024108498",
};

const attributeList = [];
const attributeEmail = new CognitoUserAttribute(dataEmail);
const attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
attributeList.push(attributeEmail);
attributeList.push(attributePhoneNumber);

function App() {
  const [user, setUser] = useState(null);
  const [signUpResult, setSignUpResult] = useState(null);

  const signUp = () => {
    const username = `user-${Date.now()}`;
    userPool.signUp(
      username,
      "password",
      attributeList,
      null,
      (err, result) => {
        if (err) {
          console.error(err.message || JSON.stringify(err));
          setSignUpResult({
            error: `Something went wrong: ${err.message}`,
          });
          return;
        }

        console.log({ result });
        setSignUpResult(result);
        setUser(result.user);
      }
    );
  };

  const confirmSignUp = (user) => {
    const userData = {
      Username: user.username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration("123456", true, (err, result) => {
      if (err) {
        console.error(
          "confirmRegistration error: ",
          err.message || JSON.stringify(err)
        );
        return;
      }
      console.log("confirmRegistration result: " + result);
    });
  };

  const resendConfirmationCode = (user) => {
    var userData = {
      Username: user.username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        console.error(
          "resendConfirmationCode error: ",
          err.message || JSON.stringify(err)
        );
        return;
      }
      console.log("resendConfirmationCode result: ", result);
    });
  };

  return (
    <div className="App">
      <div className="app-info">
        {signUpResult && (
          <>
            <h3>Sign up result:</h3>
            <p>
              {signUpResult.error
                ? signUpResult.error
                : `Great success! ${user.username} is now signed up.`}
            </p>
            {!signUpResult.userConfirmed && user && (
              <>
                <button onClick={() => confirmSignUp(user)}>
                  Confirm sign up
                </button>
                <button onClick={() => resendConfirmationCode(user)}>
                  Resend Confirmation Code
                </button>
              </>
            )}
            <div className="separator"></div>
          </>
        )}
      </div>
      <button onClick={signUp}>
        {user ? "Sign Up Another User" : "Sign Up"}
      </button>
    </div>
  );
}

export default App;
