import { Link, withRouter, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { AiOutlineClose } from "react-icons/ai";
import Cookies from "js-cookie";

import "./index.css";

const Navbar = () => {
  const [profileDetails, setProfileDetails] = useState([]);

  const userId = Cookies.get("jwt_token");

  useEffect(() => {
    const getProfileDetails = async () => {
      const apiUrl = "https://bursting-gelding-24.hasura.app/api/rest/profile";

      const options = {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "x-hasura-admin-secret":
            "g08A3qQy00y8yFDq3y6N1ZQnhOPOa4msdie5EtKS1hFStar01JzPKrtKEzYY2BtF",
          "x-hasura-role": "user",
          "x-hasura-user-id": `${userId}`,
        },
      };

      const fetchedData = await fetch(apiUrl, options);
      const response = await fetchedData.json();
      const responseData = response.users.map((eachDetails) => ({
        name: eachDetails.name,
        email: eachDetails.email,
      }));
      setProfileDetails(responseData[0]);
    };
    getProfileDetails();
  }, [userId]);

  const history = useHistory();

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    history.replace("/login");
  };

  return (
    <nav className="navbar-container">
      <div className="money-matter-logo-container">
        <img
          src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690635617/Frame_507_pvta39.png"
          alt="website-logo"
          className="money-matter-logo-img"
        />
        <li className="nav-list-items">
          <Link to="/" className="nav-link ">
            <img
              src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690805088/Vector_stnrzr.png"
              alt="home-icon"
              className="nav-icons nav-hover"
            />
            <p className="route-name nav-hover">Dashboard</p>
          </Link>
        </li>
        <li className="nav-list-items">
          <Link to="/transactions" className="nav-link "> 
            <img
              src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690657597/Glyph_nfrj7p.png"
              alt="transaction-icon"
              className="nav-icons nav-hover"
            />
            <p className="route-name nav-hover">Transactions</p>
          </Link>
        </li>
        <li className="nav-list-items">
          <Link to="/profile" className="nav-link">
            <img
              src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690657609/user_3_1_rk0yab.png"
              alt="profle-icon"
              className="nav-icons nav-hover"
            />
            <p className="route-name nav-hover">Profile</p>
          </Link>
        </li>
      </div>
      <div className="nav-profile-container">
        <img
          src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690735571/Avatar_i0ayu4.png"
          alt="profile-log"
          className="nav-profile-img"
        />

        <div className="nav-profile-name-container">
          <p className="nav-profile-name">{profileDetails.name}</p>
          <p className="nav-profile-last">{profileDetails.email}</p>
        </div>

        <div className="popup-container">
          <Popup
            modal
            trigger={
              <button type="button" className="nav-profile-button">
                <img
                  src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690658722/log-out-01_bmorlu.png"
                  alt="logout-log"
                  className="nav-profile-button-icon"
                />
              </button>
            }
          >
            {(close) => (
              <div className="popup-logout-container">
                <img
                  src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690736126/Group_848_jncvqw.png"
                  alt="logout-button"
                  className="popup-logout-log"
                />
                <div className="popup-logout-description-container">
                  <p className="popup-logout-description">
                    Are you sure you want to Logout?
                  </p>
                  <p className="popup-logout-content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  </p>
                  <button className="popup-logout" onClick={onClickLogout}>
                    Yes, Logout
                  </button>
                  <button className="popup-calcel" onClick={() => close()}>
                    Cancel
                  </button>
                </div>
                <button
                  type="button"
                  className="trigger-button"
                  onClick={() => close()}
                >
                  <AiOutlineClose className="popup-close-icon" />
                </button>
              </div>
            )}
          </Popup>
        </div>
      </div>
    </nav>
  );
};
export default withRouter(Navbar);
