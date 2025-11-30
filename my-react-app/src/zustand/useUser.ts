import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


type User ={
    token: string;
    permissions: string[];
    is_admin: boolean;
}

type Store = {
    user: User;
    setUser: (_user: User) => void;
  };

export const USER_INIT_STATE: User = {
    token: '',
    permissions: [],
    is_admin: false,
  };

  const useUser = create<Store>()(
    persist(
      (set) => ({
        user: USER_INIT_STATE,
        setUser: (user) => set({ user }),
      }),
      {
        name: 'user',
        storage: createJSONStorage(() => localStorage as Storage),
      }
    )
  );
export default useUser;