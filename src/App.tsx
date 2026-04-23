import { Switch, Route } from "wouter";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Campaigns from "@/pages/Campaigns";
import ProductListing from "@/pages/ProductListing";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/katalog" component={ProductListing} />
        <Route path="/kampanyalar" component={Campaigns} />
        <Route path="/login" component={Login} />
        <Route path="/giris" component={Login} />
        <Route path="/kayit" component={Register} />
        <Route path="/register" component={Register} />
        <Route component={NotFound} />
      </Switch>
    </AuthProvider>
  );
}
