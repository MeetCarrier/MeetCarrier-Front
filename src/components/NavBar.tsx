import { useNavigate, useLocation } from "react-router-dom";
import navbg from "../assets/img/nav_bg.webp";
import icon1 from "../assets/img/icons/NavIcon/tap_1.svg";
import icon2 from "../assets/img/icons/NavIcon/tap_2.svg";
import icon3 from "../assets/img/icons/NavIcon/tap_3.svg";
import icon4 from "../assets/img/icons/NavIcon/tap_4.svg";
import icon1_hover from "../assets/img/icons/NavIcon/tap_1_clicked.svg";
import icon2_hover from "../assets/img/icons/NavIcon/tap_2_clicked.svg";
import icon3_hover from "../assets/img/icons/NavIcon/tap_3_clicked.svg";
import icon4_hover from "../assets/img/icons/NavIcon/tap_4_clicked.svg";

const navIcons = [
  { default: icon1, hover: icon1_hover, path: "/main" },
  { default: icon2, hover: icon2_hover, path: "/chat" },
  { default: icon3, hover: icon3_hover, path: "/calendar" },
  { default: icon4, hover: icon4_hover, path: "/profile" },
];

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="w-full h-[82px]"
      style={{ backgroundImage: `url(${navbg})` }}
    >
      <div className="h-full flex justify-around items-center px-4">
        {navIcons.map((icon, idx) => {
          const isActive = location.pathname === icon.path;

          return (
            <button
              key={idx}
              onClick={() => navigate(icon.path)}
              className="relative w-[30px] h-[30px] cursor-pointer"
            >
              <img
                src={icon.default}
                alt={`nav-icon-${idx}`}
                className={`absolute inset-0 w-full h-full transition-opacity 
          ${isActive ? "opacity-0" : "opacity-100 hover:opacity-0"}`}
              />
              <img
                src={icon.hover}
                alt={`nav-icon-hover-${idx}`}
                className={`absolute inset-0 w-full h-full transition-opacity 
          ${isActive ? "opacity-100" : "opacity-0 hover:opacity-100"}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default NavBar;
