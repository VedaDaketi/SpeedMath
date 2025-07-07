import React, { useState, useEffect } from 'react';
import {
  User, BookOpen, Trophy, Target, Clock, Star, Calendar, TrendingUp,
  Play, Lock, CheckCircle, Award, Zap, Brain, Activity, Settings,
  LogOut, Home, Search, Filter, BarChart3, PieChart, Users,
  MessageSquare, Bell, ChevronRight, Plus, Edit, Eye, Download,
  GraduationCap, Medal, Flame, Timer, AlertCircle, Camera, Mail,
  Phone, MapPin, Calendar as CalendarIcon, Save, X
} from 'lucide-react';

import axios from 'axios';

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


  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'yellow' ? 'bg-yellow-100' : 'bg-purple-100'}`}>
            <Icon className={`w-6 h-6 ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`} />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className={`text-2xl font-bold ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`}>{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">+{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const DashboardTab = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h2>
            <p className="text-blue-100 text-lg">Ready to continue your math journey?</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="font-semibold">{user?.streak} day streak</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Level {user?.level}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-sm text-blue-100">XP Progress</p>
              <p className="text-2xl font-bold">{user?.xp}</p>
              <div className="w-32 bg-white/30 rounded-full h-2 mt-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(user?.xp / (user?.xp + user?.xpToNextLevel)) * 100}%` }}
                />
              </div>
              <p className="text-xs text-blue-100 mt-1">{user?.xpToNextLevel} XP to next level</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={BookOpen} 
          title="Lessons Completed" 
          value={user?.totalLessonsCompleted} 
          color="blue"
          trend={12}
        />
        <StatCard 
          icon={Trophy} 
          title="Challenges Won" 
          value={user?.totalChallengesCompleted} 
          color="yellow"
          trend={8}
        />
        <StatCard 
          icon={Target} 
          title="Average Score" 
          value={`${stats.averageScore}%`} 
          color="green"
          trend={5}
        />
        <StatCard 
          icon={Clock} 
          title="Time Spent" 
          value={`${Math.floor(stats.totalTimeSpent / 60)}h ${stats.totalTimeSpent % 60}m`} 
          color="purple"
          trend={15}
        />
      </div>

      {/* Continue Learning */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Continue Learning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.filter(unit => unit.isUnlocked && unit.progress < 100).map(unit => (
            <div key={unit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${unit.colorTheme === 'blue' ? 'bg-blue-100' : unit.colorTheme === 'green' ? 'bg-green-100' : 'bg-purple-100'}`}>
                  <BookOpen className={`w-5 h-5 ${unit.colorTheme === 'blue' ? 'text-blue-600' : unit.colorTheme === 'green' ? 'text-green-600' : 'text-purple-600'}`} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  unit.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  unit.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {unit.difficulty}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{unit.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{unit.description}</p>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{unit.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${unit.colorTheme === 'blue' ? 'bg-blue-500' : unit.colorTheme === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}
                    style={{ width: `${unit.progress}%` }}
                  />
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('lessons')}
                className={`w-full text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  unit.colorTheme === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                  unit.colorTheme === 'green' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>Continue</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Practice</h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>5-Minute Drill</span>
            </button>
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Mixed Practice</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {user?.achievements?.slice(0, 2).map(achievement => (
              <div key={achievement.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Medal className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const LessonsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Lessons</h2>
        <div className="flex space-x-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Units</option>
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map(unit => (
          <div key={unit.id} className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 ${!unit.isUnlocked ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${unit.colorTheme === 'blue' ? 'bg-blue-100' : unit.colorTheme === 'green' ? 'bg-green-100' : 'bg-purple-100'}`}>
                {unit.isUnlocked ? (
                  <BookOpen className={`w-6 h-6 ${unit.colorTheme === 'blue' ? 'text-blue-600' : unit.colorTheme === 'green' ? 'text-green-600' : 'text-purple-600'}`} />
                ) : (
                  <Lock className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                unit.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                unit.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {unit.difficulty}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">{unit.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{unit.description}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{unit.completedLessons}/{unit.lessons} lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${unit.colorTheme === 'blue' ? 'bg-blue-500' : unit.colorTheme === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}
                  style={{ width: `${unit.progress}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">+{unit.xpReward} XP</span>
              <button 
                disabled={!unit.isUnlocked}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  unit.isUnlocked 
                    ? `${unit.colorTheme === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : unit.colorTheme === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white` 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {unit.isUnlocked ? <Play className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{unit.isUnlocked ? 'Start' : 'Locked'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChallengesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Challenges</h2>
        <div className="flex space-x-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
            <option>All Difficulties</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      {/* Active Challenges */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Daily Challenge</h3>
            <p className="text-orange-100">Complete today's challenge to maintain your streak!</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg p-3">
              <Timer className="w-6 h-6 mx-auto mb-1" />
              <p className="text-sm">23:45:12</p>
              <p className="text-xs">remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map(challenge => (
          <div key={challenge.id} className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 ${!challenge.isUnlocked ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${challenge.isUnlocked ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  {challenge.isUnlocked ? (
                    <Trophy className="w-6 h-6 text-orange-600" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  challenge.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  challenge.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              {challenge.isCompleted && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">{challenge.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Participants</span>
                <span className="font-medium">{challenge.participants.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Time Limit</span>
                <span className="font-medium">{Math.floor(challenge.timeLimit / 60)} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">XP Reward</span>
                <span className="font-medium text-orange-600">+{challenge.xpReward}</span>
              </div>
            </div>
            
            <button 
              disabled={!challenge.isUnlocked}
              className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                challenge.isUnlocked 
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {challenge.isUnlocked ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Challenge</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Locked</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const ProgressTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Progress</h2>
        <div className="flex space-x-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Level</span>
              <span className="font-bold text-purple-600">{user?.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total XP</span>
              <span className="font-bold">{user?.xp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rank</span>
              <span className="font-bold text-yellow-600">{user?.rank}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Study Streak</h3>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-bold text-orange-600">{stats.currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Longest Streak</span>
              <span className="font-bold">{stats.longestStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">This Week</span>
              <span className="font-bold text-green-600">7/7 days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Performance</h3>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Score</span>
              <span className="font-bold text-blue-600">{stats.averageScore}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Problems Solved</span>
              <span className="font-bold">{stats.problemsSolved}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-bold text-green-600">92%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Activity</h3>
        <div className="flex items-end space-x-2 h-40">
          {stats.weeklyProgress?.map((score, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-purple-500 rounded-t-lg transition-all duration-300 hover:bg-purple-600"
                style={{ height: `${(score / 100) * 120}px` }}
              />
              <span className="text-xs text-gray-600 mt-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Achievements</h3>
        <div className="space-y-4">
          {user?.achievements?.map((achievement, index) => (
            <div key={achievement.id} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Medal className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <button 
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  user?.username?.charAt(0)
                )}
              </div>
              {isEditingProfile ? (
                <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1 mx-auto">
                  <Camera className="w-4 h-4" />
                  <span>Change Photo</span>
                </button>
              ) : null}
              <h3 className="text-xl font-bold text-gray-900 mt-2">{user?.username}</h3>
              <p className="text-gray-600">{user?.rank}</p>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{user?.level}</p>
                  <p className="text-xs text-gray-500">Level</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{user?.xp}</p>
                  <p className="text-xs text-gray-500">XP</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{user?.streak}</p>
                  <p className="text-xs text-gray-500">Streak</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={editedUser?.username || ''}
                    onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editedUser?.email || ''}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editedUser?.phone || ''}
                    onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editedUser?.location || ''}
                    onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editedUser?.bio || ''}
                    onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => updateUserProfile(editedUser)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      setEditedUser(user);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{user?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{user?.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">{user?.joinDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Bio</p>
                  <p className="text-gray-800">{user?.bio}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{user?.totalLessonsCompleted}</p>
            <p className="text-sm text-gray-600">Lessons Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{user?.totalChallengesCompleted}</p>
            <p className="text-sm text-gray-600">Challenges Won</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{Math.floor(stats.totalTimeSpent / 60)}h</p>
            <p className="text-sm text-gray-600">Time Spent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.averageScore}%</p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates about your progress</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Daily Reminders</p>
                <p className="text-sm text-gray-600">Get reminded to practice daily</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Challenge Alerts</p>
                <p className="text-sm text-gray-600">Get notified about new challenges</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Goal</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>10 minutes</option>
                <option>20 minutes</option>
                <option>30 minutes</option>
                <option>60 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Time</label>
              <input 
                type="time" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                defaultValue="19:00"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Reset Progress</p>
              <p className="text-sm text-gray-600">Clear all progress and start fresh</p>
            </div>
            <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors">
              Reset
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">Permanently delete your account</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'lessons':
        return <LessonsTab />;
      case 'challenges':
        return <ChallengesTab />;
      case 'progress':
        return <ProgressTab />;
      case 'profile':
        return <ProfileTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardTab />;
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
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'settings', label: 'Settings', icon: Settings }
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

          {/* Main Content */}
          <div className="flex-1">
            {renderActiveTab()}
          </div>
        </div>
      </div>
    </div>
  );
}