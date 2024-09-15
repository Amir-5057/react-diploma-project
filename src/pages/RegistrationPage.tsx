import "../assets/login.scss"
import { Link } from "react-router-dom";
import Heading from "../typography/Heading/Heading";
import RegistrationForm from "../Forms/RegostrationForm";
import RegistrationInfo from "../Forms/RegistrationInfo";



export const RegistrationPage = () => {
  return (
    <div className="registration">
      <Heading variant={"h1"} text={"Регистрация"} />
      <RegistrationForm/>
      <Link to="/registration">Забыли пароль ?</Link>
      <RegistrationInfo
        navigatePath="/"
        linkText={"Войти"}
        hasAccountText={" У вас уже есть аккаунт ?"}
        authWithText={"Зарегестрироваться с помощью"}
      />
    </div>
  );
};
