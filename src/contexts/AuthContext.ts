import { createContext, useContext } from "react";
import type { LoginResponseDto } from "src/pages/auth/dtos/login-response.dto";

export type AuthContextType = {
  loggedIn: boolean;
  login: (response: Omit<LoginResponseDto, "message">) => void;
  logout: () => void;
  user: LoginResponseDto["user"] | null;
  setUser?: (user: LoginResponseDto["user"] | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  login: () => {},
  logout: () => {},
  user: null,
  setUser: () => {},
});

export const useAuthContext = () => useContext(AuthContext);
