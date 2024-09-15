import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { theme } from "./theme/theme";
import { ThemeProvider } from "styled-components";
import { PUBLISHABLE_KEY } from "./utils/baseUrl";
import { store } from "./store/store";
import { shadesOfPurple } from "@clerk/themes";



ReactDOM.createRoot(document.getElementById("root")!).render(
  <ClerkProvider appearance={{ baseTheme: shadesOfPurple }} publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/main">
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <div className="App">
          <div className="container">
            <RouterProvider router={router} />
          </div>
        </div>
      </ThemeProvider>
    </Provider>
  </ClerkProvider>
);
