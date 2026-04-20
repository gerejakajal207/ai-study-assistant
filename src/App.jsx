import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import TopicPractice from "./pages/TopicPractice";
import NotesUpload from "./pages/NotesUpload";
import ChatWithNotes from "./pages/ChatWithNotes";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/topic-practice" element={
            <ProtectedRoute><TopicPractice /></ProtectedRoute>
          } />
          <Route path="/notes-upload" element={
            <ProtectedRoute><NotesUpload /></ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute><ChatWithNotes /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}