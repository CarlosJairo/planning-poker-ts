import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { validateUserName } from "@planning-poker/shared";
import { useForm } from "../../../hooks/useForm";
import Label from "../../atoms/Label/Label";
import ButtonSubmit from "../../atoms/ButtonSubmit/ButtonSubmit";
import InputRadio from "../../atoms/InputRadio/InputRadio";
import { joinRoom, getCreatedRoomId } from "../../../services/socket";
import type { AckResponse } from "@planning-poker/shared";
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

  if (!validateUserName(values.name)) {
    errors.name = "Mín. 4 caracteres, sin espacios.";
  }

  if (Object.keys(errors).length > 0) {
    return Promise.reject(errors);
  }

  return Promise.resolve();
};

const UserForm: React.FC<{
  toggleModalUserForm: () => void;
  onRoomMissing?: () => void;
}> = ({ toggleModalUserForm, onRoomMissing }) => {
  const { formValue, handleChange, messageError, isError } = useForm({
    defaultValues: { name: "" },
    resolver,
  });

  const { name } = formValue;
  const { roomId } = useParams();
  const [rol, setRol] = useState<"player" | "viwer">("player");
  const [serverError, setServerError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError("");

    const response: AckResponse = await joinRoom({
      roomId: roomId ?? "",
      name,
      mode: rol,
      isOwner: getCreatedRoomId() === roomId,
    });

    if (response.ok) {
      toggleModalUserForm();
      return;
    }

    if (response.error && /no existe/i.test(response.error)) {
      onRoomMissing?.();
      return;
    }

    setServerError(response.error ?? "No se pudo unir a la partida");
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
        <p className="o-user-form__error">
          {isError && messageError.name
            ? messageError.name
            : serverError
              ? serverError
              : " "}
        </p>
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
            value="viwer"
            checked={rol === "viwer"}
            onChange={() => setRol("viwer")}
          />
          <Label htmlFor={"viwer"}>
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
