import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropdown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (error) {
        console.error("Could not fetch Categories.", error);
        setSubLinks([]);
      }
      setLoading(false);
    })();
  }, []);

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);

  return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] ${location.pathname !== "/" ? "bg-richblack-800" : ""} transition-all duration-200`}>
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="group relative flex cursor-pointer items-center gap-1">
                    <p>{link.title}</p>
                    <BsChevronDown />
                    <div className="absolute left-[50%] top-full z-[1000] w-[200px] rounded-lg bg-richblack-5 p-4 text-richblack-900 transition-opacity duration-150 group-hover:opacity-100">
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks.length > 0 ? (
                        subLinks.filter(s => s?.courses?.length > 0).map((subLink, i) => (
                          <Link key={i} to={`/catalog/${subLink.name.toLowerCase().replace(/\s+/g, '-')}`} className="block rounded-lg py-2 pl-4 hover:bg-richblack-50">
                            {subLink.name}
                          </Link>
                        ))
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link.path}>
                    <p>{link.title}</p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden md:flex items-center gap-x-4">
          {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl" />
              {totalItems > 0 && <span className="absolute -bottom-2 -right-2 h-5 w-5 text-xs font-bold">{totalItems}</span>}
            </Link>
          )}
          {!token ? (
            <>
              <Link to="/login"><button className="px-4 py-2 border">Log in</button></Link>
              <Link to="/signup"><button className="px-4 py-2 border">Sign up</button></Link>
            </>
          ) : (
            <ProfileDropdown />
          )}
        </div>
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
