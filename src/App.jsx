import Dashboard from "./components/dashboard/Dashboard";
import Saisie from "./components/saisie/Saisie";
import Messages from "./components/messages/Messages";

export default function App() {
  const path = window.location.pathname;
  if (path === "/saisie") return <Saisie />;
  if (path === "/messages") return <Messages />;
  return <Dashboard />;
}
