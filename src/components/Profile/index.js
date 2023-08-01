import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Navbar from "../Navbar";
import AddTransactions from "../AddTransactions";
import "./index.css";

const Profile = () => {
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
        id: eachDetails.id,
        name: eachDetails.name,
        email: eachDetails.email,
        country: eachDetails.country,
        dateOfBirth: eachDetails.date_of_birth,
        city: eachDetails.city,
        permanentAddress: eachDetails.permanent_address,
        postalCode: eachDetails.postal_code,
        presentAddress: eachDetails.present_address,
      }));
      setProfileDetails(responseData[0]);
    };
    getProfileDetails();
  }, [userId]);

  return (
    <div className="dashboard-main-container">
      <Navbar />
      <div>
        <nav className="add-transactions-container">
          <h1 className="add-transactions-heading-accounts">Profile</h1>
          <AddTransactions />
        </nav>
        <div className="profile-details-container">
          <div>
            <img
              src="https://res.cloudinary.com/dzscdp79g/image/upload/v1690732234/image_1_an7idj.png"
              alt="profile"
              className="profile-details-img"
            />
          </div>
          <div className="profile-details-name-container">
            <p className="profile-details-your-name">Your Name</p>
            <div className="profile-details-your-name-container">
              <p className="profile-details-description">
                {profileDetails.name}
              </p>
            </div>
            <p className="profile-details-your-name">Email</p>
            <div className="profile-details-your-name-container">
              <p className="profile-details-description">
                {profileDetails.email}
              </p>
            </div>
            <p className="profile-details-your-name">Date of Birth</p>
            <div className="profile-details-your-name-container">
              <p className="profile-details-description">
                {profileDetails.dateOfBirth}
              </p>
            </div>
            <p className="profile-details-your-name">Permanent Address</p>
            <div className="profile-details-your-name-container">
              <p className="profile-details-description">
                {profileDetails.permanentAddress}
              </p>
            </div>
            <p className="profile-details-your-name">Postal Code</p>
            <div className="profile-details-your-name-container">
              <p className="profile-details-description">
                {profileDetails.postalCode}
              </p>
            </div>
          </div>
          <div className="profile-details-name-container">
            <p className="profile-details-your-name">User Name</p>
            <div className="profile-details-your-name-container">
              <p className="profile-details-description">
                {profileDetails.name}
              </p>
            </div>
            <p className="profile-details-your-name">Password</p>
            <div className="profile-details-your-name-container">
              <p className="profile-details-description">*********</p>
            </div>
            <p className="profile-details-your-name">Present Address</p>
            <div className="profile-details-your-name-container">
              <p className="profile-details-description">
                {profileDetails.presentAddress}
              </p>
            </div>
            <p className="profile-details-your-name">City</p>
            <div className="profile-details-your-name-container">
              <p className="profile-details-description">
                {profileDetails.city}
              </p>
            </div>
            <p className="profile-details-your-name">Country</p>
            <div className="profile-details-your-name-container">
              <p className="profile-details-description">
                {profileDetails.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
