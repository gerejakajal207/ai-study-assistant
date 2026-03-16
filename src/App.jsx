import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Navbar from "./components/Navbar";
import TopicPractice from "./pages/TopicPractice";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/topic-practice" element={<TopicPractice />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}