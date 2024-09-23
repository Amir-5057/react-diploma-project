import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import { useNavigate } from "react-router-dom";

import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useLoginUserMutation } from "../store/api/authApi";

const schema = yup.object({
  email: yup
    .string()
    .email("Введите почту в правильном формате")
    .required("Обязательное поле"),
  password: yup
    .string()
    .required("Обязательное поле")
    .min(8, "Минимум 8 символов"),
});

interface ILoginForm {
  email: string;
  password: string;
}

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const [loginUser, { data: loginData }] = useLoginUserMutation();
  const { isSignedIn } = useUser();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (loginData?.message) {
      localStorage.removeItem("userId");
      alert(loginData.message);
    }
    if (loginData?.user_id) {
      localStorage.setItem("userId", JSON.stringify(loginData?.user_id));
      navigate("/main");
    }
    if (isSignedIn || userId) {
      navigate("/main");
    }
  }, [isSignedIn, loginData, userId]);
  



  const onSubmit: SubmitHandler<ILoginForm> = (data) => {
    loginUser({ email: data.email, password: data.password });
   
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            type={"text"}
            placeholder={"Почта"}
            isError={errors.email ? true : false}
            errorMessage={errors.email?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input
            type={"password"}
            placeholder={"Пароль"}
            isError={errors.password ? true : false}
            errorMessage={errors.password?.message}
            {...field}
          />
        )}
      />
      <Button text={"Войти"} type={"submit"} />
    </form>
  );
};

export default LoginForm;
