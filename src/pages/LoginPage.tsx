
import { Link } from "react-router-dom";

import "../assets/login.scss"
import LoginForm from "../Forms/LoginForm";
import Heading from "../typography/Heading/Heading";
import RegistrationInfo from "../Forms/RegistrationInfo";



export const LoginPage = () => {
  return (
    <div className="login">
      <Heading variant={"h1"} text={"Авторизация"} />
      <LoginForm />
      <Link to="/">Забыли пароль ?</Link>
      <RegistrationInfo
        navigatePath="/registration"
        linkText={"Зарегистрироваться"}
        hasAccountText={" У вас нет аккаунта ?"}
        authWithText={"Войти с помощью"}
      />
    </div>
  );
};
