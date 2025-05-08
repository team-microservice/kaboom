import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  username: null,
  login: () => {},
  logout: () => {},
  checkAuth: () => {},
});

export default AuthContext;

export function AuthProvider(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      return true;
    } else {
      setIsAuthenticated(false);
      setUsername(null);
      return false;
    }
  };

  const login = (username) => {
    localStorage.setItem("username", username);
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        logout,
        checkAuth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}