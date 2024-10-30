function SignupValidation(values) {
  let errors = {};

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  // Field names to validate
  const requiredFields = ['name', 'legalID', 'dob', 'email', 'password', 'confirmPassword'];

  // Validate required fields
  requiredFields.forEach(field => {
      if (!values[field]) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
  });

  // Email validation
  if (values.email && !email_pattern.test(values.email)) {
      errors.email = "Enter a valid email address";
  }

  // Password validation
  if (values.password && !password_pattern.test(values.password)) {
      errors.password = "Password must be at least 8 characters long, contain a digit, an uppercase and a lowercase letter";
  }

  // Confirm Password validation
  if (values.confirmPassword && values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export default SignupValidation;
