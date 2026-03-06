import Dashboard from "./components/dashboard/Dashboard";
import Saisie from "./components/saisie/Saisie";
import AdhesionsApp from "./components/adhesions/AdhesionsApp";

export default function App() {
  const path = window.location.pathname;
  if (path === "/saisie") return <Saisie />;
  if (path.startsWith("/adhesions")) return <AdhesionsApp />;
  return <Dashboard />;
}
