import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitProblem from './pages/SubmitProblem';
import Experts from './pages/Experts';
import Signup from './pages/Signup';        // hum banayenge
import Login from './pages/Login';          // hum banayenge
import ForgotPassword from './pages/ForgotPassword';
import MySubmissions from './pages/MySubmissions';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ManageExperts from './pages/admin/ManageExperts';
import AddExpert from './pages/admin/AddExpert';
import AllProblems from './pages/admin/AllProblems';
import AdminUsers from './pages/admin/Users';
import ExpertRoute from './components/ExpertRoute';
import AvailableProblems from './pages/expert/AvailableProblems';
import SubmitQuote from './pages/expert/SubmitQuote';
import ProblemQuotes from './pages/user/ProblemQuotes';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>    {/* 👈 Wrap kiya */}
        <Navbar />
        <Routes>

        <Route path="/expert/problems" element={
  <ExpertRoute>
    <AvailableProblems />
  </ExpertRoute>
} />
<Route path="/expert/submit-quote/:problemId" element={
  <ExpertRoute>
    <SubmitQuote />
  </ExpertRoute>
} />
<Route path="/my-submissions/:problemId/quotes" element={<ProblemQuotes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<SubmitProblem />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/my-submissions" element={<MySubmissions />} />
          <Route path="/my-submissions/:problemId/quotes" element={<ProblemQuotes />} />
          <Route path="/admin" element={
  <AdminRoute>
    <AdminLayout />
  </AdminRoute>
}>
  <Route index element={<AdminDashboard />} />
  <Route path="problems" element={<AllProblems />} />
  <Route path="experts" element={<ManageExperts />} />
  <Route path="experts/add" element={<AddExpert />} />
  <Route path="experts/edit/:id" element={<AddExpert />} /> {/* Reuse same component */}
  <Route path="users" element={<AdminUsers />} />

</Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;