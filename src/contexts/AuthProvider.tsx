import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { LocalStorageHelper } from "@/shared/utils";
import { LoginResponseDto } from "@/features/auth/dtos/login-response.dto";
import { setAuthToken } from "@/lib/api";

const USER_KEY = "user";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggedIn, setLoggedIn] = useState<boolean>(
    Boolean(LocalStorageHelper.getItem("token")),
  );

  const [user, setUser] = useState<LoginResponseDto["user"] | null>(() => {
    const parsed = LocalStorageHelper.safeParsedGetItem(USER_KEY);

    return parsed && typeof parsed === "object" ? parsed : null;
  });

  const login = (response: Omit<LoginResponseDto, "message">) => {
    setLoggedIn(true);

    setUser(response.user);

    LocalStorageHelper.setItem("token", response.token);

    LocalStorageHelper.setItem(USER_KEY, JSON.stringify(response.user));

    setAuthToken(response.token);
  };

  const logout = () => {
    setLoggedIn(false);

    setUser(null);

    LocalStorageHelper.removeItem("token");

    LocalStorageHelper.removeItem(USER_KEY);

    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
