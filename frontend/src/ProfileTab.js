// ProfileTab.js
import React, { useState, useEffect } from 'react';
import {
  Edit, Save, X, Camera, Mail, Phone, MapPin, Calendar as CalendarIcon,
  Medal, GraduationCap, Clock, Check, AlertCircle, LogOut, Trash2
} from 'lucide-react';

export default function ProfileTab({
  user,
  editedUser,
  isEditingProfile,
  setEditedUser,
  setIsEditingProfile,
  updateUserProfile,
  checkUsernameAvailability,
  handleLogout,
  handleDeleteAccount
}) {
  const [usernameStatus, setUsernameStatus] = useState({
    isChecking: false,
    isAvailable: null,
    message: ''
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Check username availability with debouncing
  useEffect(() => {
    if (!isEditingProfile || !editedUser?.username) {
      setUsernameStatus({ isChecking: false, isAvailable: null, message: '' });
      return;
    }

    // Don't check if username hasn't changed
    if (editedUser.username === user?.username) {
      setUsernameStatus({ isChecking: false, isAvailable: true, message: 'Current username' });
      return;
    }

    // Debounce username checking
    const timeoutId = setTimeout(async () => {
      setUsernameStatus({ isChecking: true, isAvailable: null, message: 'Checking...' });
      
      try {
        const isAvailable = await checkUsernameAvailability(editedUser.username);
        setUsernameStatus({
          isChecking: false,
          isAvailable,
          message: isAvailable ? 'Username available' : 'Username already taken'
        });
      } catch (error) {
        setUsernameStatus({
          isChecking: false,
          isAvailable: null,
          message: 'Error checking username'
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [editedUser?.username, user?.username, isEditingProfile, checkUsernameAvailability]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    handleLogout();
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteConfirm(true);
    setDeleteConfirmText('');
  };

  const confirmDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
      handleDeleteAccount();
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
          </button>
          <button
            onClick={handleLogoutClick}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.username?.charAt(0)
              )}
            </div>
            {isEditingProfile && (
              <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1 mx-auto">
                <Camera className="w-4 h-4" />
                <span>Change Photo</span>
              </button>
            )}
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

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            {isEditingProfile ? (
              <div className="space-y-4">
                {['username', 'email', 'date_of_birth', 'grade_qualification'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field === 'date_of_birth' ? 'Date of Birth' : 
                       field === 'grade_qualification' ? 'Grade/Qualification' :
                       field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <div className="relative">
                      <input
                        type={field === 'email' ? 'email' : field === 'date_of_birth' ? 'date' : 'text'}
                        value={editedUser?.[field] || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, [field]: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          field === 'username' && usernameStatus.isAvailable === false 
                            ? 'border-red-300 focus:ring-red-500' 
                            : field === 'username' && usernameStatus.isAvailable === true
                            ? 'border-green-300 focus:ring-green-500'
                            : 'border-gray-300'
                        }`}
                      />
                      {field === 'username' && editedUser?.username && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {usernameStatus.isChecking ? (
                            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          ) : usernameStatus.isAvailable === true ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : usernameStatus.isAvailable === false ? (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </div>
                    {field === 'username' && usernameStatus.message && (
                      <p className={`text-sm mt-1 ${
                        usernameStatus.isAvailable === true ? 'text-green-600' :
                        usernameStatus.isAvailable === false ? 'text-red-600' :
                        'text-gray-500'
                      }`}>
                        {usernameStatus.message}
                      </p>
                    )}
                  </div>
                ))}
                <div className="flex space-x-3">
                  <button
                    onClick={() => updateUserProfile(editedUser)}
                    disabled={usernameStatus.isAvailable === false || usernameStatus.isChecking}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      usernameStatus.isAvailable === false || usernameStatus.isChecking
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      setEditedUser(user);
                      setUsernameStatus({ isChecking: false, isAvailable: null, message: '' });
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
                {[
                  { icon: Mail, label: 'Email', value: user?.email },
                  { icon: CalendarIcon, label: 'Date of Birth', value: user?.date_of_birth },
                  { icon: GraduationCap, label: 'Grade/Qualification', value: user?.grade_qualification },
                  { icon: CalendarIcon, label: 'Member Since', value: user?.joinDate },
                  { icon: Clock, label: 'Last Login', value: user?.lastLogin },
                ].map(({ icon: Icon, label, value }) => (
                  <div className="flex items-center space-x-3" key={label}>
                    <Icon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{user?.totalLessonsCompleted}</p>
            <p className="text-sm text-gray-600">Lessons Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{user?.totalChallengesCompleted}</p>
            <p className="text-sm text-gray-600">Challenges Won</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{Math.floor(user?.totalTimeSpent / 60)}h</p>
            <p className="text-sm text-gray-600">Time Spent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{user?.averageScore}%</p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
        <div className="flex justify-end">
          <button
            onClick={handleDeleteAccountClick}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. This will permanently delete your account and remove all your data.
            </p>
            <p className="text-gray-800 font-medium mb-2">
              Type <span className="font-bold text-red-600">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-6"
              placeholder="Type DELETE here"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  deleteConfirmText === 'DELETE'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}