import { useEffect, useState, ChangeEvent } from "react";
import { useLocation } from "react-router-dom";
import Button from "../../atoms/Button/Button";
import { CloseSvg } from "../../atoms/Icons";
import "./ModalCopyLinkContent.scss";

export const copyToClipboard = async (textToCopy: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    return true;
  } catch (err) {
    console.error("Error al copiar el texto: ", err);
    return false;
  }
};

interface ModalCopyLinkContentProps {
  toggleModalLink: () => void;
}

const ModalCopyLinkContent: React.FC<ModalCopyLinkContentProps> = ({
  toggleModalLink,
}) => {
  const [url, setUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    setUrl(window.location.origin + location.pathname);
  }, [location.pathname]);

  const handleClick = async () => {
    if (await copyToClipboard(url)) {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 500);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  return (
    <>
      <header className="m-modal__header">
        <p>Invitar jugadores</p>
        <Button onClick={toggleModalLink}>
          <CloseSvg />
        </Button>
      </header>
      <div className="m-modal__content">
        <input type="text" value={url} onChange={handleInputChange} />

        <Button className={"m-modal__content__copy-link"} onClick={handleClick}>
          {isCopied ? "Copiado" : "Copiar link"}
        </Button>
      </div>
    </>
  );
};

export default ModalCopyLinkContent;
