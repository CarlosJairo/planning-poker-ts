import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validInputCreatePartida } from "../../../utils";
import { useForm } from "../../../hooks/useForm";
import Label from "../../atoms/Label/Label";
import ButtonSubmit from "../../atoms/ButtonSubmit/ButtonSubmit";
import InputRadio from "../../atoms/InputRadio/InputRadio";
import { setCurrentUser } from "../../../reducers/user/userSlice";
import { addPlayer, createGame } from "../../../reducers/game/gameSlice";
import { RootState } from "../../../app/store";
import "./FormUser.scss";

interface UserFormValues {
  name: string;
}

const resolver = (values: UserFormValues) => {
  const errors: Record<keyof UserFormValues, string> = {} as Record<
    keyof UserFormValues,
    string
  >;

  if (values.name == "") return;

  if (!validInputCreatePartida(values.name)) {
    errors.name = "Invalid name";
  }

  if (Object.keys(errors).length > 0) {
    return Promise.reject(errors);
  }

  return Promise.resolve();
};

const UserForm: React.FC<{
  toggleModalUserForm: () => void;
}> = ({ toggleModalUserForm }) => {
  const { formValue, handleChange, messageError, isError } = useForm({
    defaultValues: { name: "" },
    resolver,
  });

  const { name } = formValue;
  const { gameName } = useParams();
  const [rol, setRol] = useState<string>("player");

  const dispatch = useDispatch();
  const { rolCurrentUser } = useSelector((state: RootState) => state.user);

  // Verificar si tiene el rol de propietario
  const isOwner = rolCurrentUser.includes("owner");

  const generateUniqueId = () => new Date().getTime().toString();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toggleModalUserForm();

    const currentUser = {
      id: generateUniqueId(),
      name,
      rol: isOwner ? [...rolCurrentUser, rol] : [rol],
      voted: false,
    };
    const gameInfo = {
      gameName,
      player: currentUser,
    };

    dispatch(setCurrentUser(currentUser));
    isOwner ? dispatch(createGame(gameInfo)) : dispatch(addPlayer(currentUser));
  };

  return (
    <form className="o-user-form" onSubmit={handleSubmit}>
      <div className="o-user-form__form-group">
        <Label htmlFor={"name"}>Tu nombre</Label>
        <input
          type="text"
          id="name"
          name="name"
          value={formValue.name}
          onChange={handleChange}
        />
        {isError && messageError.name && (
          <p className="o-user-form__error">{messageError.name}</p>
        )}
        <div className="o-user-form__roles-container">
          <InputRadio
            name="rol"
            value="player"
            checked={rol === "player"}
            onChange={() => setRol("player")}
          />
          <Label htmlFor={"player"}>
            Jugador
            <span className="o-user-form__radio-button"></span>
          </Label>
          <InputRadio
            name="rol"
            value="viewer"
            checked={rol === "viewer"}
            onChange={() => setRol("viewer")}
          />
          <Label htmlFor={"viewer"}>
            Espectador
            <span className="o-user-form__radio-button"></span>
          </Label>
        </div>
      </div>
      <ButtonSubmit disabled={!isError && name.length > 0 ? false : true}>
        Continuar
      </ButtonSubmit>
    </form>
  );
};

export default UserForm;
