import { createContext, useContext, useState } from "react";

const Authcontext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  return (
    <Authcontext.Provider value={{ user, setUser }}>
      {children}
    </Authcontext.Provider>
  );
}

export function useAuth() {
  return useContext(Authcontext);
}
