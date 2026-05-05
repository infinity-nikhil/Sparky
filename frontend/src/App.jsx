import { Route, Routes } from "react-router";
import CreateToken from "./pages/createToken";
import SignUpPage from "./pages/signUpPage";
import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./pages/HomePage";


function App() {
  const { authUser, login, isLoggedIn } = useAuthStore();

  console.log("auth user:",authUser);
  console.log("isLoading", isLoggedIn);

  return<HomePage/>
}

export default App;
