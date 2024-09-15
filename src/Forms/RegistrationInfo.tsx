import { Link } from "react-router-dom";

import { SignInButton } from "@clerk/clerk-react";
import Span from "../typography/Span/Span";
import Paragraph from "../typography/Paragraph/Paragraph";



interface IRegistrationInfo {
  linkText: string;
  hasAccountText: string;
  authWithText: string;
  navigatePath: string;
}

const RegistrationInfo = ({
  linkText,
  hasAccountText,
  authWithText,
  navigatePath,
}: IRegistrationInfo) => {


  return (
    <div className="registration">
      <Span>
        {hasAccountText} <Link to={navigatePath}>{linkText}</Link>
      </Span>
      <Paragraph>{authWithText}</Paragraph>
      <div className="icons-wrapper">
        <SignInButton
          children={
            <Link className="reg__link google-link" to="/">
              <img src="..assets/img/google.svg" alt="Google" />
            </Link>
          }
        />
      
      </div>
    </div>
  );
};

export default RegistrationInfo;
