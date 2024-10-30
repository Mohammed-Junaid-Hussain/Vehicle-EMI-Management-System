function LoginValidation(values) {
  let errors = {};
  const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$/;

  if (!values || typeof values !== 'object') {
      throw new Error("Invalid input: values must be an object");
  }

  if (!values.email) {
      errors.email = "Email should not be empty";
  } else if (!email_pattern.test(values.email)) {
      errors.email = "Email format is invalid";
  }

  if (!values.password) {
      errors.password = "Password should not be empty";
  } else if (!password_pattern.test(values.password)) {
      errors.password =
          "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and a number";
  }

  return errors;
}

export default LoginValidation;
