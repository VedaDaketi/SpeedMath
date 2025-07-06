import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, HelpCircle, Trophy, Activity, Calendar, Settings, Search,
  Edit, Trash2, Plus, Eye, MoreHorizontal, Filter, UserCheck, UserX, Shield,
  ShieldOff,Layers,User, Mail, Target, Flame, CheckCircle, Award, X
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [units, setUnits] = useState([]); // ✅ Needed for Unit management and lesson modal
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLessons: 0,
    totalQuestions: 0,
    totalQuizzes: 0,
    activeUsersToday: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editQuizData, setEditQuizData] = useState(null);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editQuestionData, setEditQuestionData] = useState(null);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [showEditUnitModal, setShowEditUnitModal] = useState(false);
  const [editUnitData, setEditUnitData] = useState(null);
  const [viewUnitLessons, setViewUnitLessons] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

 const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, lessonsData, questionsData, unitsData , quizzesData] = await Promise.all([
        apiCall('/api/admin/stats'),
        apiCall('/api/admin/users'),
        apiCall('/api/admin/lessons'),
        apiCall('/api/admin/questions'),
        apiCall('/api/admin/units'),
        apiCall('/api/admin/quizzes')
      ]);

      setStats(statsData);
      setUsers(usersData.users || []);
      setLessons(lessonsData.lessons || []);
      setQuestions(questionsData.questions || []);
      setUnits(unitsData.units || []);
      setQuizzes(quizzesData.quizzes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  const toggleUserStatus = async (userId) => {
  try {
    await apiCall(`/api/admin/users/${userId}/toggle-status`, { method: 'POST' });
    fetchData();
  } catch (error) {
    console.error('Failed to toggle user status:', error);
    alert(error);
  }
};

const changeUserRole = async (userId, currentRole) => {
  const newRole = currentRole === 'admin' ? 'learner' : 'admin';
  try {
    await apiCall(`/api/admin/users/${userId}/change-role`, {
      method: 'POST',
      body: JSON.stringify({ role: newRole }),
    });
    fetchData();
  } catch (error) {
    console.error('Failed to change user role:', error);
    alert('Error changing user role');
  }
};

 
  useEffect(() => {
    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard icon={Users} title="Total Users" value={stats.totalUsers} color="blue" />
        <StatCard icon={BookOpen} title="Total Lessons" value={stats.totalLessons} color="green" />
        <StatCard icon={HelpCircle} title="Total Questions" value={stats.totalQuestions} color="purple" />
        <StatCard icon={Trophy} title="Total Quizzes" value={stats.totalQuizzes} color="orange" />
        <StatCard icon={Activity} title="Active Today" value={stats.activeUsersToday} color="red" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowAddLessonModal(true)}
            className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex flex-col items-center space-y-2"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Add Lesson</span>
          </button>
          <button 
            onClick={() => setShowAddQuestionModal(true)}
            className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex flex-col items-center space-y-2"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Add Question</span>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex flex-col items-center space-y-2"
          >
            <Users className="w-6 h-6" />
            <span className="text-sm font-medium">Manage Users</span>
          </button>
          <button onClick={() => setShowAddUnitModal(true)} className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex flex-col items-center space-y-2">
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Add Unit</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Recent activity will appear here</p>
          </div>
        )}
      </div>
    </div>
  );

const LessonManagement = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // View Lesson Handler
  const handleViewLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowViewModal(true);
  };

  // Edit Lesson Handler
  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setEditFormData({
      title: lesson.title,
      unit_id: lesson.unit_id,
      description: lesson.description,
      content: JSON.stringify(lesson.content_json, null, 2),
      difficulty: lesson.difficulty,
      order_index: lesson.order,
      xp_reward: lesson.xp_reward,
      learning_objectives: lesson.learning_objectives?.join(', ') || '',
      vedic_sutras: lesson.vedic_sutras?.join(', ') || ''
    });
    setShowEditModal(true);
  };

  // Delete Lesson Handler
  const handleDeleteLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDeleteLesson = async () => {
    try {
      await apiCall(`/api/admin/lessons/${selectedLesson.id}`, {
        method: 'DELETE'
      });
      setShowDeleteModal(false);
      setSelectedLesson(null);
      fetchData(); // Refresh the lesson list
    } catch (error) {
      console.error('Failed to delete lesson:', error);
      alert('Error: Failed to delete lesson');
    }
  };

  // Unified function for adding and editing lessons
  const handleSubmitLesson = async (e, isEdit = false) => {
    e.preventDefault();
    const form = e.target;

    try {
      const lessonData = {
        title: form.title.value,
        unit_id: parseInt(form.unit.value),
        description: form.description.value,
        content_json: JSON.parse(form.content.value),
        difficulty: form.difficulty.value.toLowerCase(),
        order_index: parseInt(form.order_index.value),
        xp_reward: parseInt(form.xp_reward.value),
        learning_objectives: form.learning_objectives.value.split(',').map(s => s.trim()).filter(s => s),
        vedic_sutras: form.vedic_sutras.value.split(',').map(s => s.trim()).filter(s => s)
      };

      const url = isEdit ? `/api/admin/lessons/${selectedLesson.id}` : '/api/admin/lessons';
      const method = isEdit ? 'PUT' : 'POST';

      await apiCall(url, {
        method: method,
        body: JSON.stringify(lessonData)
      });

      // Close appropriate modal
      if (isEdit) {
        setShowEditModal(false);
        setSelectedLesson(null);
      } else {
        setShowAddLessonModal(false);
      }
      
      fetchData(); // Refresh the lesson list
    } catch (error) {
      console.error(`Failed to ${isEdit ? 'update' : 'add'} lesson:`, error);
      alert(`Error: Invalid content JSON or missing fields`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lesson Management</h2>
        <button onClick={() => setShowAddLessonModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Lesson</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search lessons..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>All Difficulties</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sutra</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lesson.vedic_sutras}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lesson.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lesson.order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lesson.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewLesson(lesson)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Lesson"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditLesson(lesson)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        title="Edit Lesson"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLesson(lesson)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete Lesson"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Lesson Modal */}
      {showViewModal && (
        <ViewLessonModal 
          lesson={selectedLesson} 
          onClose={() => {
            setShowViewModal(false);
            setSelectedLesson(null);
          }} 
        />
      )}

      {/* Edit Lesson Modal */}
      {showEditModal && (
        <LessonModal 
          lesson={selectedLesson}
          formData={editFormData}
          isEdit={true}
          onSubmit={(e) => handleSubmitLesson(e, true)}
          onClose={() => {
            setShowEditModal(false);
            setSelectedLesson(null);
          }}
        />
      )}

      {/* Add Lesson Modal */}
      {showAddLessonModal && (
        <LessonModal 
          isEdit={false}
          onSubmit={(e) => handleSubmitLesson(e, false)}
          onClose={() => setShowAddLessonModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal 
          lesson={selectedLesson}
          onConfirm={confirmDeleteLesson}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedLesson(null);
          }}
        />
      )}
    </div>
  );
};

// View Lesson Modal Component
const ViewLessonModal = ({ lesson, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">View Lesson Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Plus className="w-6 h-6 transform rotate-45" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="text-sm text-gray-900">{lesson.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {lesson.difficulty}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Order</label>
                <p className="text-sm text-gray-900">{lesson.order}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">XP Reward</label>
                <p className="text-sm text-gray-900">{lesson.xp_reward}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{lesson.description}</p>
          </div>

          {/* Learning Objectives */}
          {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives</label>
              <ul className="list-disc pl-5 space-y-1">
                {lesson.learning_objectives.map((objective, index) => (
                  <li key={index} className="text-sm text-gray-900">{objective}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Vedic Sutras */}
          {lesson.vedic_sutras && lesson.vedic_sutras.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vedic Sutras</label>
              <div className="flex flex-wrap gap-2">
                {lesson.vedic_sutras.map((sutra, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {sutra}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content Structure</label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <pre className="text-sm text-gray-900 whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(lesson.content_json, null, 2)}
              </pre>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Metadata</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Created</label>
                <p className="text-sm text-gray-900">{formatDate(lesson.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                <p className="text-sm text-gray-900">{formatDate(lesson.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Unified Lesson Modal Component (for both Add and Edit)
const LessonModal = ({ lesson, formData, isEdit = false, onSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {isEdit ? 'Edit Lesson' : 'Add New Lesson'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Plus className="w-6 h-6 transform rotate-45" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
              <input
                name="title"
                type="text"
                defaultValue={isEdit ? formData?.title : ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter lesson title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select 
                name="unit" 
                defaultValue={isEdit ? formData?.unit_id : ''} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Unit</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>{unit.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={isEdit ? formData?.description : ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter lesson description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content (JSON)
              <span className="text-xs text-gray-500 ml-2">Structure your lesson content as JSON</span>
            </label>
            <textarea
              name="content"
              rows={6}
              defaultValue={isEdit ? formData?.content : ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder={isEdit ? '' : `{
  "sections": [
    {
      "type": "introduction",
      "title": "Introduction",
      "content": "Welcome to this lesson..."
    },
    {
      "type": "concept",
      "title": "Core Concept",
      "content": "The main concept is...",
      "examples": ["Example 1", "Example 2"]
    },
    {
      "type": "practice",
      "title": "Practice Problems",
      "problems": [
        {
          "question": "Problem statement",
          "solution": "Step by step solution"
        }
      ]
    }
  ],
  "resources": ["Resource 1", "Resource 2"]
}`}
              required
            />
            {!isEdit && (
              <div className="mt-2 text-xs text-gray-600">
                <p><strong>Tip:</strong> Use valid JSON format. Common structure includes sections with types like "introduction", "concept", "example", "practice", etc.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select 
                name="difficulty" 
                defaultValue={isEdit ? formData?.difficulty : 'beginner'} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Index</label>
              <input
                name="order_index"
                type="number"
                defaultValue={isEdit ? formData?.order_index : ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">XP Reward</label>
              <input
                name="xp_reward"
                type="number"
                defaultValue={isEdit ? formData?.xp_reward : '50'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives (comma-separated)</label>
            <input
              name="learning_objectives"
              type="text"
              defaultValue={isEdit ? formData?.learning_objectives : ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Objective 1, Objective 2, Objective 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vedic Sutras (comma-separated)</label>
            <input
              name="vedic_sutras"
              type="text"
              defaultValue={isEdit ? formData?.vedic_sutras : ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Sutra 1, Sutra 2"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEdit ? 'Update Lesson' : 'Create Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ lesson, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">Delete Lesson</h3>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete "<strong>{lesson.title}</strong>"? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};



const QuestionManagement = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">Question Management</h2>
      <div className="flex space-x-3">
        <button onClick={() => setShowAddQuizModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Quiz</span>
        </button>
        <button onClick={() => setShowAddQuestionModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>
    </div>

    {/* Quiz Table */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Quiz Management</h3>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search quizzes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Limit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Attempts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passing Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">XP Reward</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{quiz.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz.time_limit} min</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz.max_attempts}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz.passing_score}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz.xp_reward} XP</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex space-x-2">
    <button
      className="text-indigo-600 hover:text-indigo-900"
      onClick={() => {
        setEditQuizData(quiz);
        setShowQuizModal(true);
      }}
      title="Edit Quiz"
    >
      <Edit className="w-4 h-4" />
    </button>
    <button
      className="text-red-600 hover:text-red-900"
      onClick={async () => {
        if (window.confirm('Delete this quiz?')) {
          await apiCall(`/api/admin/quizzes/${quiz.id}`, { method: 'DELETE' });
          fetchData();
        }
      }}
      title="Delete Quiz"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Quiz Questions Table */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Quiz Questions</h3>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option>All Quizzes</option>
              {quizzes.map(quiz => (
                <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
              ))}
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
              <option>All Types</option>
              <option>Multiple Choice</option>
              <option>True/False</option>
              <option>Fill in the Blank</option>
              <option>Numerical</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question) => (
              <tr key={question.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{question.question}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{question.quiz_title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    question.question_type === 'multiple_choice' ? 'bg-blue-100 text-blue-800' : 
                    question.question_type === 'true_false' ? 'bg-green-100 text-green-800' :
                    question.question_type === 'fill_blank' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {question.question_type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.points}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.order_index}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                      onClick={() => {
                        setEditQuestionData(question);  // pre-fill modal
                        setShowQuestionModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>

    <button
      className="text-red-600 hover:text-red-800"
      title="Delete"
      onClick={async () => {
        if (window.confirm('Are you sure you want to delete this question?')) {
          try {
            await apiCall(`/api/admin/quiz-questions/${question.id}`, {
              method: 'DELETE'
            });
            fetchData();
            alert('Question deleted.');
          } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete question.');
          }
        }
      }}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const AddEditQuizModal = ({
  isEdit = false,
  initialData = {},
  lessons = [],
  setShowModal,
  fetchData
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const quizData = {
      lesson_id: form.lesson_id.value ? parseInt(form.lesson_id.value) : null,
      title: form.title.value,
      description: form.description.value,
      time_limit: parseInt(form.time_limit.value),
      max_attempts: parseInt(form.max_attempts.value) || 3,
      passing_score: parseInt(form.passing_score.value) || 70,
      xp_reward: parseInt(form.xp_reward.value) || 100
    };

    try {
      const endpoint = isEdit
        ? `/api/admin/quizzes/${initialData.id}`
        : `/api/admin/quizzes`;
      const method = isEdit ? 'PUT' : 'POST';

      const result = await apiCall(endpoint, {
        method,
        body: JSON.stringify(quizData)
      });

      alert(`Quiz ${isEdit ? 'updated' : 'created'} successfully!`);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert(error.message || 'Failed to submit quiz. Please check your input.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {isEdit ? 'Edit Quiz' : 'Add New Quiz'}
          </h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Plus className="w-6 h-6 transform rotate-45" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
            <input
              name="title"
              type="text"
              defaultValue={initialData.title || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={initialData.description || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Associate with Lesson (Optional)</label>
            <select
              name="lesson_id"
              defaultValue={initialData.lesson_id || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No lesson association</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <input
                name="time_limit"
                type="number"
                min="1"
                defaultValue={initialData.time_limit || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
              <input
                name="max_attempts"
                type="number"
                min="1"
                defaultValue={initialData.max_attempts || 3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
              <input
                name="passing_score"
                type="number"
                min="1"
                max="100"
                defaultValue={initialData.passing_score || 70}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="70"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">XP Reward</label>
              <input
                name="xp_reward"
                type="number"
                min="1"
                defaultValue={initialData.xp_reward || 100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEdit ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const AddEditQuestionModal = ({
  isEdit = false,
  initialData = {},
  lessons = [],
  quizzes = [],
  setShowModal,
  fetchData
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const questionData = {
      quiz_id: parseInt(form.quiz_id.value),
      question: form.question.value,
      question_type: form.question_type.value,
      correct_answer: form.correct_answer.value,
      explanation: form.explanation.value,
      options: form.options.value
        ? form.options.value.split('\n').filter(opt => opt.trim())
        : [],
      points: parseInt(form.points.value) || 10,
      order_index: parseInt(form.order_index.value) || 1
    };

    try {
      const endpoint = isEdit
        ? `/api/admin/quiz-questions/${initialData.id}`
        : '/api/admin/quiz-questions';
      const method = isEdit ? 'PUT' : 'POST';

      await apiCall(endpoint, {
        method,
        body: JSON.stringify(questionData)
      });

      alert(`Question ${isEdit ? 'updated' : 'added'} successfully!`);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question. Please check your input.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {isEdit ? 'Edit Question' : 'Add New Question'}
          </h3>
          <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
            <Plus className="w-6 h-6 transform rotate-45" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Lesson</label>
            <select
              name="lesson_id"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
              defaultValue={initialData.lesson_id || ''}
            >
              <option value="">Select a lesson</option>
              {lessons.map(lesson => (
                <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Quiz</label>
              <select
                name="quiz_id"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
                defaultValue={initialData.quiz_id || ''}
              >
                <option value="">Select a quiz</option>
                {quizzes.map(quiz => (
                  <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Index</label>
              <input
                name="order_index"
                type="number"
                min="1"
                defaultValue={initialData.order_index || 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <textarea
              name="question"
              rows={3}
              defaultValue={initialData.question || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
              <select
                name="question_type"
                defaultValue={initialData.question_type || 'multiple_choice'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True/False</option>
                <option value="fill_blank">Fill in the Blank</option>
                <option value="numerical">Numerical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
              <input
                name="points"
                type="number"
                min="1"
                defaultValue={initialData.points || 10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Options (one per line)</label>
            <textarea
              name="options"
              rows={4}
              defaultValue={initialData.options ? initialData.options.join('\n') : ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Option 1&#10;Option 2&#10;Option 3"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for non-multiple choice questions</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
            <input
              name="correct_answer"
              type="text"
              defaultValue={initialData.correct_answer || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
            <textarea
              name="explanation"
              rows={3}
              defaultValue={initialData.explanation || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {isEdit ? 'Update Question' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


 const UnitManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Unit Management</h2>
        <button 
          onClick={() => setShowAddUnitModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Unit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <div key={unit.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${unit.color_theme}-100`}>
                <BookOpen className={`w-6 h-6 text-${unit.color_theme}-600`} />
              </div>
              <div className="flex space-x-2">
                <button onClick={() => { setEditUnitData(unit); setShowEditUnitModal(true); }} className="text-indigo-600 hover:text-indigo-900">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={async () => {
                  if (window.confirm('Delete this unit?')) {
                    await apiCall(`/api/admin/units/${unit.id}`, { method: 'DELETE' });
                    fetchData();
                  }
                }} className="text-red-600 hover:text-red-900">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{unit.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{unit.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                unit.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                unit.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {unit.difficulty}
              </span>
              <span className="text-sm text-gray-500">{unit.lessons_count} lessons</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Order: {unit.order_index}</span>
                <button onClick={async () => {
                  const res = await apiCall(`/api/admin/units/${unit.id}/lessons`);
                  setViewUnitLessons({ unit, lessons: res.lessons });
                }} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Lessons
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfile(true);
  };

  // Add Unit Modal
 const AddEditUnitModal = ({ isEdit = false, initialData = {}, onClose }) => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const unitData = {
        title: form.title.value,
        description: form.description.value,
        order_index: parseInt(form.order_index.value),
        difficulty: form.difficulty.value.toUpperCase(),
        color_theme: form.color_theme.value,
        estimated_duration: parseInt(form.estimated_duration.value),
      };
      const endpoint = isEdit ? `/api/admin/units/${initialData.id}` : '/api/admin/units';
      await apiCall(endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(unitData)
      });
      onClose();
      fetchData();
    };
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {isEdit ? 'Edit Unit' : 'Add New Unit'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Plus className="w-6 h-6 transform rotate-45" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit Title</label>
            <input
              name="title"
              type="text"
              defaultValue={initialData.title || ''}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Enter unit title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={initialData.description || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Enter unit description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                name="difficulty"
                defaultValue={initialData.difficulty || 'BEGINNER'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order Index</label>
              <input
                name="order_index"
                type="number"
                defaultValue={initialData.order_index || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
              <select
                name="color_theme"
                defaultValue={initialData.color_theme || 'blue'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
                <option value="orange">Orange</option>
                <option value="red">Red</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Est. Duration (min)</label>
              <input
                name="estimated_duration"
                type="number"
                defaultValue={initialData.estimated_duration || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="60"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              {isEdit ? 'Save Changes' : 'Create Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


  const ViewUnitLessonsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Lessons in Unit: {viewUnitLessons.unit.title}
          </h3>
          <button onClick={() => setViewUnitLessons(null)} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <ul className="divide-y divide-gray-200">
          {viewUnitLessons.lessons.map((lesson) => (
            <li key={lesson.id} className="py-2 flex justify-between items-center">
              <span className="text-gray-800">{lesson.title}</span>
              <button onClick={async () => {
                await apiCall(`/api/admin/units/${viewUnitLessons.unit.id}/lessons/${lesson.id}/unlink`, { method: 'POST' });
                const res = await apiCall(`/api/admin/units/${viewUnitLessons.unit.id}/lessons`);
                setViewUnitLessons({ ...viewUnitLessons, lessons: res.lessons });
              }} className="text-red-600 hover:text-red-800">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Unit Management Component
 

  const UserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex space-x-2">
          <select 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.filter(user => 
                (filterStatus === 'all' || 
                 (filterStatus === 'active' && user.is_active) || 
                 (filterStatus === 'inactive' && !user.is_active)) &&
                (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 user.email.toLowerCase().includes(searchTerm.toLowerCase()))
              ).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{user.progress}%</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${user.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View Profile" onClick={() => handleViewProfile(user)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className={`${user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        onClick={() => toggleUserStatus(user.id)}
                        title={user.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      <button 
                        className="text-purple-600 hover:text-purple-900"
                        title={user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                        onClick={() => changeUserRole(user.id, user.role)}
                      >
                        {user.role === 'admin' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </button>
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ViewProfile = ({ isOpen, onClose, userData }) => {
  if (!isOpen || !userData) return null;

  const getRoleColor = (role) => {
    switch(role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'INSTRUCTOR': return 'bg-blue-100 text-blue-800';
      case 'LEARNER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'ADMIN': return <Shield size={16} />;
      case 'INSTRUCTOR': return <BookOpen size={16} />;
      case 'LEARNER': return <User size={16} />;
      default: return <User size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.username?.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{userData.username}</h2>
              <p className="text-lg text-gray-600 mb-2">{userData.email}</p>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(userData.role)}`}>
                  {getRoleIcon(userData.role)}
                  {userData.role}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {userData.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>

            {/* Level Badge */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2">
                {userData.current_level || 1}
              </div>
              <p className="text-sm text-gray-600">Level</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Trophy size={24} />
              <div>
                <p className="text-2xl font-bold">{userData.total_xp || 0}</p>
                <p className="text-sm opacity-90">Total XP</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Flame size={24} />
              <div>
                <p className="text-2xl font-bold">{userData.daily_streak || 0}</p>
                <p className="text-sm opacity-90">Day Streak</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-4">
            <div className="flex items-center gap-2">
              <BookOpen size={24} />
              <div>
                <p className="text-2xl font-bold">{userData.total_lessons_completed || 0}</p>
                <p className="text-sm opacity-90">Lessons</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle size={24} />
              <div>
                <p className="text-2xl font-bold">{userData.total_exercises_completed || 0}</p>
                <p className="text-sm opacity-90">Exercises</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">{userData.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{userData.date_of_birth ? new Date(userData.date_of_birth).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Grade/Qualification</p>
                <p className="font-medium">{userData.grade_qualification}</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="font-medium">{userData.last_login ? new Date(userData.last_login).toLocaleString() : 'Never'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{userData.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${userData.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {userData.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress & Achievements */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target size={20} />
              Progress & Level
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Points Today</p>
                <p className="font-medium">{userData.points_today || 0} XP</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Longest Streak</p>
                <p className="font-medium">{userData.longest_streak || 0} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Activity</p>
                <p className="font-medium">{userData.last_activity_date ? new Date(userData.last_activity_date).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Learning Statistics */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award size={20} />
              Learning Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lessons Completed</span>
                <span className="font-bold text-blue-600">{userData.total_lessons_completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Exercises Completed</span>
                <span className="font-bold text-green-600">{userData.total_exercises_completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Level</span>
                <span className="font-bold text-purple-600">{userData.current_level || 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Daily Streak</span>
                <span className="font-bold text-orange-600">{userData.daily_streak || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'lessons':
        return <LessonManagement />;
      case 'questions':
        return <QuestionManagement />;
      case 'users':
        return <UserManagement />;
      case 'units':
        return <UnitManagement />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Vedic Math Admin</h1>
                  <p className="text-sm text-gray-600">Learning Management Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {localStorage.getItem('username')?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="text-sm font-medium text-gray-700">{localStorage.getItem('username') || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'lessons', label: 'Lessons', icon: BookOpen },
              { id: 'questions', label: 'Questions', icon: HelpCircle },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'units', label: 'Units', icon: Layers },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
        {showQuestionModal && (
        <AddEditQuestionModal
          isEdit={!!editQuestionData}
          initialData={editQuestionData || {}}
          lessons={lessons}
          quizzes={quizzes}
          setShowModal={setShowQuestionModal}
          fetchData={fetchData} /> )}

        {showQuizModal && (
  <AddEditQuizModal
    isEdit={!!editQuizData}
    initialData={editQuizData || {}}
    lessons={lessons}
    setShowModal={setShowQuizModal}
    fetchData={fetchData}
  />
)}

        {showAddUnitModal && <AddEditUnitModal onClose={() => setShowAddUnitModal(false)} />}
      {showEditUnitModal && editUnitData && <AddEditUnitModal isEdit initialData={editUnitData} onClose={() => setShowEditUnitModal(false)} />}
      {viewUnitLessons && <ViewUnitLessonsModal />}
        <ViewProfile 
      isOpen={showProfile} 
      onClose={() => setShowProfile(false)} 
      userData={selectedUser} 
    />
      </main>
    </div>
  );
};

export default AdminDashboard;