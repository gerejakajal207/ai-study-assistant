// MODULES //
import { BrowserRouter, Routes, Route } from "react-router-dom";

// STYLES //
import { ThemeProvider } from "./ThemeContext";

// COMPONENTS //
import Navbar from "./components/Navbar";

// OTHERS //
import ChatWithNotes from "./pages/ChatWithNotes";
import TopicPractice from "./pages/TopicPractice";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import NotesUpload from "./pages/NotesUpload";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/topic-practice" element={<TopicPractice />} />
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/notes-upload" element={<NotesUpload />} />
          <Route path="/chat" element={<ChatWithNotes />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
