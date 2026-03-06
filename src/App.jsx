import Dashboard from "./components/dashboard/Dashboard";
import Saisie from "./components/saisie/Saisie";

export default function App() {
  const path = window.location.pathname;
  if (path === "/saisie") return <Saisie />;
  return <Dashboard />;
}
