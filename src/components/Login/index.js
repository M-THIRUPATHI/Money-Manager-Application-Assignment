import { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const history = useHistory();

  const onSubmitSuccess = (id) => {
    setShowSubmitError(false);
    Cookies.set("jwt_token", id, {
      expires: 90,
      path: "/",
    });
    history.replace("/");
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { email, password };
    setEmail("");
    setPassword("");
    const url = "https://bursting-gelding-24.hasura.app/api/rest/get-user-id";

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret":
          "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
      },
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      if (data.get_user_id && data.get_user_id.length > 0) {
        onSubmitSuccess(data.get_user_id[0].id);
      } else {
        setShowSubmitError(true);
        setErrorMsg("invalid password");
      }
    } else {
      setShowSubmitError(true);
      setErrorMsg("invalid email and password");
    }
  };

  const renderPasswordField = () => {
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          placeholder="Password"
        />
      </>
    );
  };

  const renderUsernameField = () => {
    return (
      <>
        <label className="input-label" htmlFor="email">
          USERNAME
        </label>
        <input
          type="email"
          id="email"
          className="username-input-field"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          placeholder="Email"
        />
      </>
    );
  };

  const jwtToken = Cookies.get("jwt_token");

  if (jwtToken !== undefined) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login-form-container">
      <img
        src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690635617/Frame_507_pvta39.png"
        className="login-website-logo-mobile-image"
        alt="website logo"
      />
      <img
        src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690636475/2317669_z67x0q.jpg"
        className="login-image"
        alt="website login"
      />
      <form className="form-container" onSubmit={submitForm}>
        <img
          src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690635617/Frame_507_pvta39.png"
          className="login-website-logo-desktop-image"
          alt="website logo"
        />
        <div className="input-container">{renderUsernameField()}</div>
        <div className="input-container">{renderPasswordField()}</div>
        <button type="submit" className="login-button">
          Login
        </button>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
      </form>
    </div>
  );
};

export default Login;
