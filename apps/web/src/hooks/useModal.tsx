import { useState } from "react";

const useModal = (initialState: boolean = false): [boolean, () => void] => {
  const [showModal, setShowModal] = useState<boolean>(initialState);

  const toggleShowModal = () => setShowModal(!showModal);

  return [showModal, toggleShowModal];
};

export default useModal;
