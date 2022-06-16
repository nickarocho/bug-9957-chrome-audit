import "./fancy-button.css";

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from "amazon-cognito-identity-js";

import { useEffect, useState } from "react";

const poolData = {
  UserPoolId: "us-west-2_c1Dq5T2lY", // Your user pool id here
  ClientId: "6oohg5pvj0cgphsu3at9nq7bol", // Your client id here
};
const userPool = new CognitoUserPool(poolData);

console.log({ userPool });

const attributeList = [];

const dataEmail = {
  Name: "email",
  Value: "email@mydomain.com",
};

const dataPhoneNumber = {
  Name: "phone_number",
  Value: "+16024108498",
};
const attributeEmail = new CognitoUserAttribute(dataEmail);
const attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);

attributeList.push(attributeEmail);
attributeList.push(attributePhoneNumber);

function App() {
  const [user, setUser] = useState({});
  const [signUpResult, setSignUpResult] = useState(null);

  const username = `user-${Date.now()}`;

  console.log({ username });

  const signUp = () => {
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
        // var cognitoUser = result.user;
        // console.log("user name is " + cognitoUser.getUsername());

        console.log({ result });
        setSignUpResult(result);
        setUser(result.user);
      }
    );
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
                : `Great success! ${signUpResult.user.username} is now signed up.`}
            </p>
          </>
        )}
      </div>
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
}

export default App;
