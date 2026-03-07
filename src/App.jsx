import Dashboard from "./components/dashboard/Dashboard";
import Saisie from "./components/saisie/Saisie";
// TODO: Réactiver quand DNS cari.qc.ca vérifié dans Resend
// import Messages from "./components/messages/Messages";

export default function App() {
  const path = window.location.pathname;
  if (path === "/saisie") return <Saisie />;
  // TODO: Réactiver quand DNS cari.qc.ca vérifié dans Resend
  // if (path === "/messages") return <Messages />;
  return <Dashboard />;
}
