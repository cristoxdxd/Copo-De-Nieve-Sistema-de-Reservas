import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SnowFlakeLogo from "../assets/snowflake_nav.svg";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { auth } from "../Firebase";

export const NavBar = () => {
  const isLoggedIn = !!auth.currentUser;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [signUpFailed, setSignUpFailed] = useState(false);
  const loginModalRef = useRef<HTMLDivElement>(null);
  const signUpModalRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginFailed(false);
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
    setSignUpFailed(false);
  };

  const handleClickOutsideModal = (event: MouseEvent) => {
    if (
      (loginModalRef.current &&
        !loginModalRef.current.contains(event.target as Node)) ||
      (signUpModalRef.current &&
        !signUpModalRef.current.contains(event.target as Node))
    ) {
      closeLoginModal();
      closeSignUpModal();
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  return (
    <nav className="bg-gray-800 w-full top-0 z-10 sticky">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <Link to={"/"}>
                <span>
                  <img
                    className="block lg:hidden h-20 w-auto"
                    src={SnowFlakeLogo}
                    alt="SnowFlake"
                  />
                  <img
                    className="hidden lg:block h-12 w-auto"
                    src={SnowFlakeLogo}
                    alt="SnowFlake"
                  />
                </span>
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex">
                <Link
                  className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                  to={"/"}
                >
                  Home
                </Link>
                <Link
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  to={"/about"}
                >
                  About
                </Link>
                {isLoggedIn ? (
                  <>
                    <Link
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      to={"/profile"}
                    >
                      History
                    </Link>
                    <button
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      onClick={openLoginModal}
                    >
                      Login
                    </button>
                    <button
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      onClick={openSignUpModal}
                    >
                      Sign Up
                    </button>
                  </>
                )}
                {isLoginModalOpen && (
                  <div className="bg-black fixed inset-0 flex items-center justify-center z-50 bg-opacity-55">
                    <div className=" p-4 rounded-md" ref={loginModalRef}>
                      {loginFailed ? (
                        <p className="text-white bg-red-500 p-2 rounded-md animate-pulse">
                          Login failed. Please try again.
                        </p>
                      ) : (
                        <Login
                          onSuccess={closeLoginModal}
                          onFailure={() => setLoginFailed(true)}
                        />
                      )}
                    </div>
                  </div>
                )}
                {isSignUpModalOpen && (
                  <div className="bg-black fixed inset-0 flex items-center justify-center z-50 bg-opacity-55">
                    <div className=" p-4 rounded-md" ref={signUpModalRef}>
                      {signUpFailed ? (
                        <p className="text-white bg-red-500 p-2 rounded-md animate-pulse">
                          Sign up failed. Please try again.
                        </p>
                      ) : (
                        <SignUp
                          onSuccess={closeSignUpModal}
                          onFailure={() => setSignUpFailed(true)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="sm:hidden">
              <button
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                onClick={toggleMobileMenu}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {isMobileMenuOpen && (
            <>
              <Link
                className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                to={"/"}
              >
                Home
              </Link>
              <Link
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                to={"/about"}
              >
                About
              </Link>
              {isLoggedIn ? (
                <>
                  <button
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>

                  <Link
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    to={"/profile"}
                  >
                    <a>History</a>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={openLoginModal}
                  >
                    Login
                  </button>
                  <button
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={openSignUpModal}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
