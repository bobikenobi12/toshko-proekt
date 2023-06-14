import { apiSlice } from "../../app/api/apiSlice";

export interface HighScore {
	highScore: number;
}

export interface SubmitScoreRequest {
	score: number;
}

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getHighScore: builder.query<HighScore, void>({
			query: (body) => ({
				url: `/getHighScore`,
				method: "GET",
				body,
			}),
		}),
		submitScore: builder.mutation<HighScore, SubmitScoreRequest>({
			query: (body) => ({
				url: `/submitScore`,
				method: "POST",
				body,
			}),
		}),
	}),
});

export const { useGetHighScoreQuery, useSubmitScoreMutation } = authApi;
