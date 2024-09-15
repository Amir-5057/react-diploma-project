import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import { useLoginUserMutation } from "../store/api/authApi";


const schema = yup.object({
  name: yup.string().required("Обязательное поле"),
  email: yup
    .string()
    .email("Введите почту в правильном формате")
    .required("Обязательное поле"),
  phoneNumber: yup.string().required("Обязательное поле"),
  password: yup
    .string()
    .required("Обязательное поле")
    .min(8, "Минимум 8 символов"),
  userCity: yup.string().required("Обязательное поле"),
});

interface IRegistrationForm {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  userCity: string;
}

const RegistrationForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phoneNumber: "",
      userCity: "",
    },
  });

  const navigate = useNavigate();
  const [registerUser, { data: loginData }] = useLoginUserMutation();
  const { isSignedIn } = useUser();
  const userId = localStorage.getItem("userId");


  useEffect(() => {
    if(loginData?.message){
      localStorage.removeItem("userId");
      alert(loginData.message)
    }
    if(loginData?.user_id){
      localStorage.setItem("userId", JSON.stringify(loginData?.user_id))
      navigate("/main");
    }
    if (isSignedIn || userId){
        navigate("/main")  
    }
    console.log(isSignedIn);
    


  }, [isSignedIn, loginData, userId]);

  const onSubmit: SubmitHandler<IRegistrationForm> = (data) => {
    registerUser({
      email: data.email,
      password: data.password,
      user_city: data.userCity,
      name: data.name,
      phone_number: data.phoneNumber,
    });

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
        name="name"
        render={({ field }) => (
          <Input
            type={"text"}
            placeholder={"Имя"}
            isError={errors.name ? true : false}
            errorMessage={errors.name?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="userCity"
        render={({ field }) => (
          <Input
            type={"text"}
            placeholder={"Город"}
            isError={errors.userCity ? true : false}
            errorMessage={errors.userCity?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <Input
            type={"text"}
            placeholder={"Номер телефона"}
            isError={errors.phoneNumber ? true : false}
            errorMessage={errors.phoneNumber?.message}
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

export default RegistrationForm;
