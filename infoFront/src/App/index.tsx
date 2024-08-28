import { RouterProvider } from "react-router-dom";
import { router } from "./Router";
import { SettingsProvider } from "./Context/SettingContext";

export const App = () => {
  return (
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  );
};
