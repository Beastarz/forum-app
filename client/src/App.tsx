import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Thread from "./pages/thread";
import NewThread from "./pages/newThread";
import { AuthProvider, ProtectedRoute } from "./contexts/AuthContext";
import Login from "./pages/login";
import Register from "./pages/register";
import MyThreads from "./pages/myThreads";
import SearchResults from "./pages/searchResults";

export const BASE_URL = "https://forum-app-s4ee.onrender.com/api";

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/thread/:id"
              element={
                <ProtectedRoute>
                  <Thread />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-thread"
              element={
                <ProtectedRoute>
                  <NewThread />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-threads/:id"
              element={
                <ProtectedRoute>
                  <MyThreads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
