import React from "react";
import Alert from "react-bootstrap/Alert";

const CheckMail = () => {
  return (
    <>
      {["danger"].map(() => (
        <Alert key={variant} variant={variant}>
          Please check your email to verify your account.
        </Alert>
      ))}
    </>
  );
};

export default CheckMail;
