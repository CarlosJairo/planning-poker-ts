import React from "react";
import { validInputCreatePartida } from "../../../utils";
import { useForm } from "../../../hooks/useForm";
import Label from "../../atoms/Label/Label";
import ButtonSubmit from "../../atoms/ButtonSubmit/ButtonSubmit";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { setOwerRol } from "../../../reducers/user/userSlice";
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

  if (!validInputCreatePartida(values.name)) {
    errors.name = "Nombre no válido";
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

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(setOwerRol());
    navigate(`/game/${formValue.name}`);
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
        {isError && messageError.name ? messageError.name : " "}
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
