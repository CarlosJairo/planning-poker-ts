import { HashRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import SplashScreen from "./components/pages/SplashScreen/SplashScreen";
import CreateGameScreen from "./components/pages/CreateGameScreen/CreateGameScreen";
import GameTableScreen from "./components/pages/GameTableScreen/GameTableScreen";

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
          <Route path="/game/:gameName" element={<GameTableScreen />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
