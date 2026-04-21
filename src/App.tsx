import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/giris" component={Login} />
        <Route path="/kayit" component={Register} />
        <Route component={NotFound} />
      </Switch>
    </AuthProvider>
  );
}
