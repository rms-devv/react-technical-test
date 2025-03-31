// src/store/userStore.ts
import { create } from 'zustand';

interface User {
  login: string;
  avatar_url: string;
  messageCount: number;
}

interface UsersState {
  users: Record<string, User>;
  hiddenUsers: Set<string>; // Utilisateurs dont les messages sont masqués
  addUser: (login: string, avatar_url: string) => void;
  incrementMessageCount: (login: string) => void;
  resetUsers: () => void;
  toggleUserVisibility: (login: string) => void;
  showAllUsers: () => void;
  hideAllUsers: () => void;
  isUserHidden: (login: string) => boolean;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: {},
  hiddenUsers: new Set<string>(),

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
  resetUsers: () => set({ users: {}, hiddenUsers: new Set<string>() }),

  // Gère la visibilité d'un utilisateur
  toggleUserVisibility: (login) => set((state) => {
    const newHiddenUsers = new Set(state.hiddenUsers);
    if (newHiddenUsers.has(login)) {
      newHiddenUsers.delete(login);
    } else {
      newHiddenUsers.add(login);
    }
    return { hiddenUsers: newHiddenUsers };
  }),

  // Affiche tous les utilisateurs
  showAllUsers: () => set({ hiddenUsers: new Set<string>() }),

  // Cacher tous les utilisateurs
  hideAllUsers: () => set((state) => {
    const allUsers = new Set(Object.keys(state.users));
    return { hiddenUsers: allUsers };
  }),

  // Fonction qui me permet si un utilisateur est caché
  isUserHidden: (login) => get().hiddenUsers.has(login),
}));
