interface IInputProps {
  type: string;
  placeholder: string;
  isError?: boolean;
  errorMessage?: string | undefined;
}

const Input = ({ type, placeholder, isError, errorMessage, ...props }: IInputProps) => {
  return (
    <>
      <input type={type} placeholder={placeholder} {...props} />
      {isError && (
        <span style={{ color: "red", fontWeight: 800 }}>{errorMessage}</span>
      )}
    </>
  );
};

export default Input;
