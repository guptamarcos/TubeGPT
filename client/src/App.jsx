import { ToastContainer } from "react-toastify";

import YouTubeSummarizerPage from "./pages/YouTubeSummarizerPage.jsx";

function App() {
  return (
    <>
      <YouTubeSummarizerPage />
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick theme="light" />
    </>
  );
}

export default App;
