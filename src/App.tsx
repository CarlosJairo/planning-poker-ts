import { HashRouter, Routes, Route } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./app/store";
import { useState } from "react";
import SplashScreen from "./components/pages/SplashScreen/SplashScreen";
import CreateGameScreen from "./components/pages/CreateGameScreen/CreateGameScreen";
import GameTableScreen from "./components/pages/GameTableScreen/GameTableScreen";
// import { decrement, setValue } from "./reducers/yourSlice/yourSlice";

function App() {
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);

  // const dispatch = useDispatch<AppDispatch>();
  // const value = useSelector((state: RootState) => state.yourState.value);
  // const user = useSelector((state: RootState) => state.user);
  // const game = useSelector((state: RootState) => state.game);
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
          {/* <Route path="/game/:gameName" element={<h1>Hola</h1>} /> */}
          <Route path="/game/:gameName" element={<GameTableScreen />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
