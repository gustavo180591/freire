import { writable } from 'svelte/store';

export interface User {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	dni: string;
	roles: string[];
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true
	});

	return {
		subscribe,
		
		login: (user: User) => {
			set({
				user,
				isAuthenticated: true,
				isLoading: false
			});
		},

		logout: () => {
			set({
				user: null,
				isAuthenticated: false,
				isLoading: false
			});
		},

		setLoading: (loading: boolean) => {
			update(state => ({
				...state,
				isLoading: loading
			}));
		},

		updateUser: (userData: Partial<User>) => {
			update(state => ({
				...state,
				user: state.user ? { ...state.user, ...userData } : null
			}));
		}
	};
}

export const authStore = createAuthStore();
