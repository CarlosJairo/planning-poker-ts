import React from "react";
import { validInputCreatePartida } from "../../../utils";
import { useForm } from "../../../hooks/useForm";
import Label from "../../atoms/Label/Label";
import ButtonSubmit from "../../atoms/ButtonSubmit/ButtonSubmit";
import "./CreateGameForm.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { setOwerRol } from "../../../reducers/user/userSlice";
import { useNavigate } from "react-router-dom";

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
    errors.name = "Invalid game name";
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
    <form className="create-game-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <Label htmlFor={"nombre-partida"}>Nombra la partida</Label>
        <input
          type="text"
          id="nombre-partida"
          name="name"
          value={formValue.name}
          onChange={handleChange}
        />
      </div>

      <p className="error">
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

// import React from "react";
// import useForm from "../../hooks/useForm";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import "../../styles/organisms/CreateGameForm.css";
// import Label from "../../atoms/Label/Label";
// import InputText from "../../atoms/InputText/InputText";
// import ButtonSubmit from "../../atoms/ButtonSubmit/ButtonSubmit";
// import { setOwerRol } from "../../../reducers/user/userSlice";

// // Definición de tipos para los valores de useForm
// interface UseFormValues {
//   name: string;
//   setName: (value: string) => void;
//   error: string;
//   handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
// }

// const CreateGameForm: React.FC = () => {
//   // Usa el hook useForm con los valores definidos
//   const { name, setName, error, handleSubmit }: UseFormValues = useForm({
//     onSubmit,
//   });

//   let navigate = useNavigate();
//   let dispatch = useDispatch();

//   function onSubmit(name: string) {
//     dispatch(setOwerRol());
//     navigate(`/game/${name}`);
//   }

//   return (
//     <form className="create-game-form" onSubmit={handleSubmit}>
//       <div className="form-group">
//         <Label htmlFor={"nombre-partida"}>Nombra la partida</Label>

//         <InputText
//           id={"nombre-partida"}
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//       </div>
//       {error && <p className="error">{error}</p>}
//       <ButtonSubmit disabled={name.length > 0 ? false : true}>
//         Crear partida
//       </ButtonSubmit>
//     </form>
//   );
// };

// export default CreateGameForm;
