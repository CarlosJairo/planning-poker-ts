import React, { useState } from "react";
import { validateGameName } from "@planning-poker/shared";
import { useForm } from "../../../hooks/useForm";
import Label from "../../atoms/Label/Label";
import ButtonSubmit from "../../atoms/ButtonSubmit/ButtonSubmit";
import { createRoom } from "../../../services/socket";
import { useNavigate } from "react-router-dom";
import "./CreateGameForm.scss";

interface CreateGameFormProps {
  name: string;
}

interface CreateGameFormValues {
  name: string;
}

const resolver = (values: CreateGameFormValues) => {
  const errors: Record<keyof CreateGameFormValues, string> = {} as Record<
    keyof CreateGameFormValues,
    string
  >;

  if (values.name === "") return;

  if (!validateGameName(values.name)) {
    errors.name = "4 a 20 caracteres, sin espacios.";
  }

  if (Object.keys(errors).length > 0) {
    return Promise.reject(errors);
  }

  return Promise.resolve();
};

const CreateGameForm: React.FC = () => {
  const { formValue, isError, messageError, handleChange } =
    useForm<CreateGameFormProps>({
      defaultValues: { name: "" },
      resolver,
    });

  const [serverError, setServerError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError("");

    const response = await createRoom(formValue.name);
    if (response.ok && response.roomId) {
      navigate(`/game/${response.roomId}`);
    } else {
      setServerError(response.error ?? "No se pudo crear la partida");
    }
  };

  return (
    <form className="o-create-game-form" onSubmit={handleSubmit}>
      <div className="o-create-game-form__form-group">
        <Label htmlFor={"nombre-partida"}>Nombra la partida</Label>
        <input
          type="text"
          id="nombre-partida"
          name="name"
          value={formValue.name}
          onChange={handleChange}
        />
      </div>

      <p className="o-create-game-form__error">
        {isError && messageError.name
          ? messageError.name
          : serverError
            ? serverError
            : " "}
      </p>

      <ButtonSubmit
        disabled={!isError && formValue.name.length > 0 ? false : true}
      >
        Crear partida
      </ButtonSubmit>
    </form>
  );
};

export default CreateGameForm;
