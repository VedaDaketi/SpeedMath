// Install React Router first:
// npm install react-router-dom

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './homepage';
import LearnerDashboard from './learner-dashboard';
import AdminDashboard from './admin-dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/learner-dashboard/*" element={<LearnerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;