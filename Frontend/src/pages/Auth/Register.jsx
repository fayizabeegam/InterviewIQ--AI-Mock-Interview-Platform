import AuthLayout from "../../components/auth/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm"


function Register() {
  return (
    <AuthLayout variant="register">
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;