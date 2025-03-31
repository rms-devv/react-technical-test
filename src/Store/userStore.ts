import { create } from 'zustand';

interface User {
  login: string;
  avatar_url: string;
  messageCount: number;
}

interface UsersState {
  users: Record<string, User>;
  addUser: (login: string, avatar_url: string) => void;
  incrementMessageCount: (login: string) => void;
  resetUsers: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: {},

 // Permet d'ajouter un utilisateur si il n'existe pas déjà
 // J'évite les doublons en vérifiant si l'user existe déjà
  addUser: (login, avatar_url) => set((state) => {
    if (state.users[login]) {
      return state;
    }
    return {
      users: {
        ...state.users,
        [login]: {
          login,
          avatar_url,
          messageCount: 0
        }
      }
    };
  }),

 // Fonction qui permet d'incrémenter le compteur de messages d'un utilisateur si l'utilisateur existe
 // Je m'assure que l'user existe bien avant d'incrémenter
  incrementMessageCount: (login) => set((state) => {
    if (!state.users[login]) {
      return state;
    }
    return {
      users: {
        ...state.users,
        [login]: {
          ...state.users[login],
          messageCount: state.users[login].messageCount + 1
        }
      }
    };
  }),
  // Fonction qui me permet de réinitialiser la liste des utilisateurs, lorsque l'issue change
  resetUsers: () => set({ users: {} })
}));
