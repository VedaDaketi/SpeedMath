import React, { useState, useEffect } from 'react';
import {
  User, BookOpen, Trophy, TrendingUp, Home, Bell, Brain
} from 'lucide-react';
import axios from 'axios';
import DashboardTab from './DashboardTab';
import LessonsTab from './LessonsTab';
import ChallengesTab from './ChallengesTab';
import ProgressTab from './ProgressTab';
import ProfileTab from './ProfileTab';

export default function LearnerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
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
          axios.get('/api/user/me'),
          axios.get('/api/units'),
          axios.get('/api/lessons'),
          axios.get('/api/challenges'),
          axios.get('/api/user/stats'),
          axios.get('/api/user/notifications')
        ]);

        setUser(userRes.data);
        setEditedUser(userRes.data);
        setUnits(unitsRes.data);
        setLessons(lessonsRes.data);
        setChallenges(challengesRes.data);
        setStats(statsRes.data);
        setNotifications(notifsRes.data);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateUserProfile = async (updatedData) => {
    try {
      const res = await axios.put(`/api/user/me`, updatedData);
      setUser(res.data);
      setEditedUser(res.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Update failed. Please try again.');
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab user={user} units={units} stats={stats} setActiveTab={setActiveTab} />;
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
          />
        );
      default:
        return <DashboardTab user={user} units={units} stats={stats} setActiveTab={setActiveTab} />;
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
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>
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
                    onClick={() => setActiveTab(item.id)}
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

          {/* Main Tab Content */}
          <div className="flex-1">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
