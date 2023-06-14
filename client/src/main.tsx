import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { ChakraProvider } from "@chakra-ui/react";

import { Provider } from "react-redux";
import { store } from "./app/store";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import App from "./App";

import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider>
			<Provider store={store}>
				<Router>
					<Routes>
						<Route element={<App />} />
						<Route path="*" element={<h1>404</h1>} />
					</Routes>
				</Router>
			</Provider>
		</ChakraProvider>
	</React.StrictMode>
);
