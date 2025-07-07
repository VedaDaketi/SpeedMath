// ProfileTab.js
import React from 'react';
import {
  Edit, Save, X, Camera, Mail, Phone, MapPin, Calendar as CalendarIcon,
  Medal
} from 'lucide-react';

export default function ProfileTab({
  user,
  editedUser,
  isEditingProfile,
  setEditedUser,
  setIsEditingProfile,
  updateUserProfile
}) {
  return (
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
                {['username', 'email', 'phone', 'location', 'bio'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    {field === 'bio' ? (
                      <textarea
                        value={editedUser?.bio || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <input
                        type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                        value={editedUser?.[field] || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, [field]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
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
                {[
                  { icon: Mail, label: 'Email', value: user?.email },
                  { icon: Phone, label: 'Phone', value: user?.phone },
                  { icon: MapPin, label: 'Location', value: user?.location },
                  { icon: CalendarIcon, label: 'Member Since', value: user?.joinDate },
                ].map(({ icon: Icon, label, value }) => (
                  <div className="flex items-center space-x-3" key={label}>
                    <Icon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">{label}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  </div>
                ))}
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
    </div>
  );
}
