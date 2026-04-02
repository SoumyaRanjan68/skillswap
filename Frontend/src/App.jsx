import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cursor         from './components/Cursor';
import Navbar         from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Dashboard      from './pages/Dashboard';
import Matches        from './pages/Matches';
import Requests       from './pages/Requests';
import Chat           from './pages/Chat';
import Explore from './pages/Explore'
import './styles/globals.css';

export default function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <Navbar />
      <Routes>
        <Route path="/"          element={<Home />}     />
        <Route path="/login"     element={<Login />}    />
        <Route path="/register"  element={<Register />} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/matches"   element={<ProtectedRoute><Matches /></ProtectedRoute>}   />
        <Route path="/requests"  element={<ProtectedRoute><Requests /></ProtectedRoute>}  />
        <Route path="/chat"      element={<ProtectedRoute><Chat /></ProtectedRoute>}      />
      </Routes>
    </BrowserRouter>
  );
}

