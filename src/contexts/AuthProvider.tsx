import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { LocalStorageHelper } from "src/utils/LocalStorageHelper";
import { LoginResponseDto } from "src/pages/auth/dtos/login-response.dto";
import { api } from "src/app/axios";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggedIn, setLoggedIn] = useState<boolean>(
    Boolean(LocalStorageHelper.getItem("token")),
  );

  const [user, setUser] = useState<LoginResponseDto["user"] | null>(null);

  const login = (response: LoginResponseDto) => {
    setLoggedIn(true);

    setUser(response.user);

    LocalStorageHelper.setItem("token", response.token);

    api.defaults.headers.post.Authorization = `Bearer ${response.token}`;
  };

  const logout = () => {
    setLoggedIn(false);

    setUser(null);

    LocalStorageHelper.removeItem("token");

    api.defaults.headers.delete.Authorization = null;
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
