// Install React Router first:
// npm install react-router-dom

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './homepage';
import LearnerDashboard from './learner-dashboard';
import AdminDashboard from './admin-dashboard';
import VedicLessonPage from './LessonPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/learner-dashboard/*" element={<LearnerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/learner-dashboard/lesson/:unitId/:lessonIndex" element={<VedicLessonPage />} />
      </Routes>
    </Router>
  );
}

export default App;