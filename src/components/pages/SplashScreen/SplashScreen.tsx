import { useEffect } from "react";
import { FichaPoker, Logo } from "../../atoms/Icons";
import "./SplashScreen.scss";

interface SplashScreenProps {
  showSplashScreen: boolean;
  setShowSplashScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  showSplashScreen,
  setShowSplashScreen,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplashScreen(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showSplashScreen, setShowSplashScreen]);

  return (
    <section className="logo-screen">
      <FichaPoker className="" />
      <Logo />
    </section>
  );
};

export default SplashScreen;
