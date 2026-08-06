import { HashRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import CreateGameScreen from "./pages/CreateGameScreen/CreateGameScreen";
import GameTableScreen from "./pages/GameTableScreen/GameTableScreen";
import Toast from "./components/molecules/Toast/Toast";

function App() {
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);

  return (
    <>
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={
              showSplashScreen ? (
                <SplashScreen
                  showSplashScreen={showSplashScreen}
                  setShowSplashScreen={setShowSplashScreen}
                />
              ) : (
                <CreateGameScreen />
              )
            }
          />
          <Route path="/game/:roomId" element={<GameTableScreen />} />
        </Routes>
        <Toast />
      </HashRouter>
    </>
  );
}

export default App;
