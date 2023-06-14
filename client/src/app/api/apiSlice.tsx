import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setToken, selectToken } from "../../features/auth/authSlice";
import { authApi } from "../../features/auth/authApiSlice";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
	baseUrl: "http://localhost:3000",
	prepareHeaders: (headers, { getState }) => {
		const token = selectToken(getState() as RootState);
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
	const result = await baseQuery(args, api, extraOptions);

	if (result.error?.status === 403) {
		const refreshResult = (await api.dispatch(
			authApi.endpoints.refreshToken.initiate(undefined)
		)) as any;
		if (refreshResult.error) {
			api.dispatch(logOut());
			return result;
		}
		const token = refreshResult.data.accessToken;
		api.dispatch(setToken(token));
		return baseQuery(args, api, extraOptions);
	}
	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Volunteers"],
	endpoints: () => ({}),
});
