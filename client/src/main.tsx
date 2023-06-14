import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { ChakraProvider } from "@chakra-ui/react";

import { Provider } from "react-redux";
import { store } from "./app/store";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import GameGuard from "./utils/GameGuard";
import Game from "./Game";

import AuthGuard from "./utils/AuthGuard";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider>
			<Provider store={store}>
				<Router>
					<Routes>
						<Route path="/" element={<GameGuard />}>
							<Route path="/game" element={<Game />} />
							<Route path="*" element={<h1>404</h1>} />
						</Route>
						<Route path="/" element={<AuthGuard />}>
							<Route path="/sign-up" element={<SignUpPage />} />
							<Route path="/sign-in" element={<SignInPage />} />
							<Route path="*" element={<h1>404</h1>} />
						</Route>
					</Routes>
				</Router>
			</Provider>
		</ChakraProvider>
	</React.StrictMode>
);
