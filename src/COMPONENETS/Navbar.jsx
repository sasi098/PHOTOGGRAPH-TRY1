import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const Container = ({ children }) => (
    <div className="md:w-11/12 w-full md:px-0 px-3 mx-auto">{children}</div>
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("refreshtoken");
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("username");

  return (
    <nav className="py-2 z-40">
      <Container>
        <div className="flex items-center justify-between h-16">
          <div className="flex gap-4 items-center">
            {/* Logo here if needed */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button className="hover:bg-button-primary px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </button>
                <button className="hover:bg-button-primary px-3 py-2 rounded-md text-sm font-medium">
                  Photographers
                </button>
                <button className="hover:bg-button-primary px-3 py-2 rounded-md text-sm font-medium">
                  About
                </button>
                <button className="hover:bg-button-primary px-3 py-2 rounded-md text-sm font-medium">
                  Membership
                </button>
                <button className="hover:bg-button-primary px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </button>
              </div>
            </div>
          </div>

          <div className="justify-end grid grid-cols-2 space-x-2">
            {isLoggedIn ? (
              <button
                className="hidden md:block hover:bg-button-primary px-4 py-1 rounded-xl"
                onClick={handleLogout}
              >
                Log Out
              </button>
            ) : (
              <>
                <button
                  className="hidden md:block hover:bg-button-primary px-4 py-1 rounded-xl"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </button>
                <button
                  className="hidden md:block hover:bg-button-primary px-4 py-1 rounded-xl"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden transition-all" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-black">
              <button className="hover:bg-button-primary block px-3 py-2 rounded-md text-base font-medium">
                Home
              </button>
              <button className="hover:bg-button-primary block px-3 py-2 rounded-md text-base font-medium">
                Funding
              </button>
              <button className="hover:bg-button-primary block px-3 py-2 rounded-md text-base font-medium">
                About
              </button>
              <button className="hover:bg-button-primary block px-3 py-2 rounded-md text-base font-medium">
                Membership
              </button>
              <button className="hover:bg-button-primary block px-3 py-2 rounded-md text-base font-medium">
                Contact
              </button>
              {isLoggedIn ? (
                <button
                  className="hover:bg-button-primary bg-button-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              ) : (
                <>
                  <button
                    className="hover:bg-button-primary bg-button-primary block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => navigate("/login")}
                  >
                    Log In
                  </button>
                  <button
                    className="hover:bg-button-primary bg-button-primary block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}

export default Navbar;
