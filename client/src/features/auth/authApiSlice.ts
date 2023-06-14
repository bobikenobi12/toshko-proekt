import { apiSlice } from "../../app/api/apiSlice";

export interface User {
	username: string;
}

export interface RegisterRequest {
	username: string;
	password: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface AuthResponse {
	user: User;
	token: string;
	refreshToken: string;
}

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation<AuthResponse, RegisterRequest>({
			query: (body) => ({
				url: `/auth/register`,
				method: "POST",
				body,
			}),
		}),
		login: builder.mutation<AuthResponse, LoginRequest>({
			query: (body) => ({
				url: `/auth/login`,
				method: "POST",
				body,
			}),
		}),
		logout: builder.mutation<void, void>({
			query: () => ({
				url: `/auth/logout`,
				method: "POST",
				body: {
					refreshToken: localStorage.getItem("refreshToken"),
				},
			}),
		}),
		refreshToken: builder.mutation<{ accessToken: string }, void>({
			query: () => ({
				url: `/refreshAccessToken`,
				method: "POST",
				body: {
					refreshToken: localStorage.getItem("refreshToken"),
				},
			}),
		}),
	}),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } =
	authApi;
