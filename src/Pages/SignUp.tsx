import { useForm } from "react-hook-form";
import { NavBar } from "../components/NavBar";
import { get, isEmpty } from "lodash";
import { auth } from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const SignUp = () => {
  const registerForm = useForm({ mode: "onBlur" });

  const onSubmit = () => {
    registerForm.trigger();

    console.log(registerForm.formState.isValid);

    if (registerForm.formState.isValid) {
      createUserWithEmailAndPassword(
        auth,
        registerForm.getValues().firstName,
        registerForm.getValues().password
      )
        .then((userCredential) => {
          const user = userCredential.user;
          sessionStorage.setItem("user", JSON.stringify(user));
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
  };

  return (
    <>
      <NavBar />
      <br />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 text-white">Register</h1>
        <div className="flex flex-col items-center bg-gray-800 rounded-lg shadow-lg p-8 w-80">
          <input
            {...registerForm.register("firstName", {
              required: "Este campo es requerido.",
              pattern: {
                value: /^[A-Za-z]+$/i,
                message: "Porfavor solo ingresa letras.",
              },
            })}
            className="w-full h-10 text-lg mb-4 px-2 py-1 border border-gray-300 rounded"
            type="text"
            placeholder="Ingrese Nombre"
          />
          {!isEmpty(registerForm.formState.errors) && (
            <p className="text-red-500 mb-4">
              {
                get(
                  registerForm,
                  "formState.errors.firstName.message",
                  ""
                ) as string
              }
            </p>
          )}
          <input
            {...registerForm.register("password", {
              required: "Este campo es requerido.",
              minLength: {
                value: 8,
                message: "La contrasenia debe tener al menos 8 caracteres.",
              },
            })}
            className="w-full h-10 text-lg mb-4 px-2 py-1 border border-gray-300 rounded"
            type="password"
            placeholder="Ingrese contrasenia"
          />
          {!isEmpty(registerForm.formState.errors) && (
            <p className="text-red-500 mb-4">
              {
                get(
                  registerForm,
                  "formState.errors.password.message",
                  ""
                ) as string
              }
            </p>
          )}
          <div className="flex justify-center">
            <button
              className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={onSubmit}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};