import ArrowIcon from "../assets/images/arrow-down.svg";

const Profile = ({
  userData,
  dropdownOpen,
  setDropdownOpen,
  profileRef,
  dropdownRef,
}: {
  userData: any;
  dropdownOpen: boolean;
  setDropdownOpen: any;
  profileRef: any;
  dropdownRef: any;
}) => {
  return (
    <div
      className="profile"
      onClick={() => {
        setDropdownOpen(!dropdownOpen);
      }}
      ref={profileRef}
    >
      <img src={userData.picture} alt="profile" referrerPolicy="no-referrer" />
      <p>{userData.firstName}</p>
      <img src={ArrowIcon} alt="arrow icon" />
    </div>
  );
};

export default Profile;
