import errorImg from "./error.gif";

const ErrorMessage = () => {
  return (
    <img
      style={{
        display: "block",
        width: "250px",
        height: "250px",
        objectFit: "contain",
        margin: "0 auto"
      }}
      src={errorImg}
      alt='error'
    />
  );
  // return <img src={process.env.PUBLIC_URL + "/error.gif"} alt='error' />;
};

export default ErrorMessage