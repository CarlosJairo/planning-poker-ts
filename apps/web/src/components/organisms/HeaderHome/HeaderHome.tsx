import { FichaPoker } from "../../atoms/Icons";
import "./HeaderHome.scss";
const HeaderHome: React.FC = () => {
  return (
    <header className="o-header-home">
      <div className="o-header-home__logo-subtitulo-ctn">
        <FichaPoker className={"o-header-home__chip-poker"} />
        <h2>Crear partida</h2>
      </div>
    </header>
  );
};

export default HeaderHome;
