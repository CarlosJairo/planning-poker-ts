import { FichaPoker } from "../../atoms/Icons";
import "./HeaderHome.css";
const HeaderHome: React.FC = () => {
  return (
    <header className="header-home">
      <div className="logo-subtitulo-ctn">
        <FichaPoker className={"chip-poker"} />
        <h2>Crear partida</h2>
      </div>
    </header>
  );
};

export default HeaderHome;
