import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

function Login() {
  return (
    <AuthLayout variant="login">
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;