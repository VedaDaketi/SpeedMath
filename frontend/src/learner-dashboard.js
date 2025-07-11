import React, { useState, useEffect } from 'react';
import {
  User, BookOpen, Trophy, TrendingUp, Home, Bell, Brain
} from 'lucide-react';
import DashboardTab from './DashboardTab';
import LessonsTab from './LessonsTab';
import ChallengesTab from './ChallengesTab';
import ProgressTab from './ProgressTab';
import ProfileTab from './ProfileTab';
import VedicLessonPage from './LessonPage'; 
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5000${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export default function LearnerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathTab = location.pathname.split('/')[2] || 'dashboard';
  const [activeTab, setActiveTab] = useState(pathTab);

  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [units, setUnits] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, unitsRes, lessonsRes, challengesRes, statsRes, notifsRes] = await Promise.all([
          apiCall('/api/user/me'),
          apiCall('/api/units'),
          apiCall('/api/lessons'),
          apiCall('/api/challenges'),
          apiCall('/api/user/stats')
        ]);

        setUser(userRes);
        setEditedUser(userRes);
        setUnits(unitsRes);
        setLessons(lessonsRes);
        setChallenges(challengesRes);
        setStats(statsRes);
        setNotifications(notifsRes);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setActiveTab(pathTab);
  }, [pathTab]);

  const updateUserProfile = async (updatedData) => {
    try {
      const res = await apiCall(`/api/user/me`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });
      setUser(res);
      setEditedUser(res);
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Update failed. Please try again.');
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await apiCall(`/api/user/check-username/${encodeURIComponent(username)}`);
      return response.available;
    } catch (error) {
      console.error('Error checking username availability:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API if your backend has one
      await apiCall('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local storage and redirect regardless of API call success
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await apiCall('/api/user/delete-account', { method: 'DELETE' });
      localStorage.removeItem('token');
      navigate('/');
      alert('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleTabChange = (tabId) => {
    navigate(`/learner-dashboard/${tabId}`);
  };

  const renderActiveTab = () => {
    const isLessonView = pathTab === 'lesson';
  const lessonParams = location.pathname.split('/'); // e.g. /learner-dashboard/lesson/unit-1/0

  if (isLessonView && lessonParams.length === 5) {
    const unitId = lessonParams[3];
    const lessonIndex = lessonParams[4];
    return <VedicLessonPage unitId={unitId} lessonIndex={lessonIndex} units={units} />;
  }
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab user={user} units={units} stats={stats} setActiveTab={handleTabChange} />;
      case 'lessons':
        return <LessonsTab units={units} />;
      case 'challenges':
        return <ChallengesTab challenges={challenges} />;
      case 'progress':
        return <ProgressTab user={user} stats={stats} />;
      case 'profile':
        return (
          <ProfileTab
            user={user}
            editedUser={editedUser}
            isEditingProfile={isEditingProfile}
            setEditedUser={setEditedUser}
            setIsEditingProfile={setIsEditingProfile}
            updateUserProfile={updateUserProfile}
            checkUsernameAvailability={checkUsernameAvailability}
            handleLogout={handleLogout}
            handleDeleteAccount={handleDeleteAccount}
          />
        );
      default:
        return <DashboardTab user={user} units={units} stats={stats} setActiveTab={handleTabChange} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">MathMaster</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user?.username?.charAt(0)
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500">Level {user?.level}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Home },
                  { id: 'lessons', label: 'Lessons', icon: BookOpen },
                  { id: 'challenges', label: 'Challenges', icon: Trophy },
                  { id: 'progress', label: 'Progress', icon: TrendingUp },
                  { id: 'profile', label: 'Profile', icon: User }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600 border-blue-200 border'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Active Tab Content */}
          <div className="flex-1">{renderActiveTab()}</div>
        </div>
      </div>
    </div>
  );
}