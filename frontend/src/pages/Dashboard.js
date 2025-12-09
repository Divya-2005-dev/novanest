import React, { useState, useEffect } from 'react';
import { getProfile } from '../api_profile';

function Dashboard({ onNavigate, userRole }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data && !data.error) {
          setProfile(data);
          setError('');
        } else {
          setError(data?.error || 'Failed to load profile');
          setProfile(null);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
        setProfile(null);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userRole === 'student') {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [userRole]);

  return (
    <div className="card">
      <h2>Welcome to NovaNest</h2>
      {loading && <p>Loading dashboard...</p>}
      {error && <div className="msg error">{error}</div>}

      {userRole === 'student' && profile && (
        <>
          {profile && profile.full_name ? (
            <div className="dashboard-grid">
          <div className="dashboard-section">
            <h3>📋 Profile Information</h3>
                <p><strong>Name:</strong> {profile.full_name || 'Not set'}</p>
                <p><strong>Register Number:</strong> {profile.user?.register_number || 'N/A'}</p>
                <p><strong>Department:</strong> {profile.department || 'Not set'}</p>
                <p><strong>Current CGPA:</strong> {profile.current_cgpa || 'Not set'}</p>
                <p><strong>Semester:</strong> {profile.semester || 'Not set'}</p>
            <button onClick={() => onNavigate('profile')}>Edit Profile →</button>
          </div>

          <div className="dashboard-section">
            <h3>🎓 Academic Details</h3>
                <p><strong>10th School:</strong> {profile.tenth_school || 'Not set'}</p>
                <p><strong>10th Marks:</strong> {profile.tenth_marks ? profile.tenth_marks + '%' : 'Not set'}</p>
                <p><strong>12th School:</strong> {profile.twelfth_school || 'Not set'}</p>
                <p><strong>12th Marks:</strong> {profile.twelfth_marks ? profile.twelfth_marks + '%' : 'Not set'}</p>
                <p><strong>Blood Group:</strong> {profile.blood_group || 'Not set'}</p>
                <p><strong>DOB:</strong> {profile.dob || 'Not set'}</p>
          </div>
            </div>
          ) : (
            <div className="dashboard-grid">
              <div className="dashboard-section">
                <h3>👤 Complete Your Profile</h3>
                <p>Your profile is incomplete. Please complete all required fields to get started.</p>
                <button onClick={() => onNavigate('profile')}>Complete Profile →</button>
              </div>
            </div>
          )}
        </>
      )}

      {userRole === 'admin' && (
        <div className="dashboard-grid">
          <div className="dashboard-section">
            <h3>🏢 Company Management</h3>
            <p>Manage companies and view company details registered on the platform.</p>
            <button onClick={() => onNavigate('admin')}>Go to Admin Panel →</button>
          </div>

          <div className="dashboard-section">
            <h3>💼 Job Postings</h3>
            <p>Create and manage job postings with skill requirements and matches.</p>
            <button onClick={() => onNavigate('admin')}>Manage Jobs →</button>
          </div>

          <div className="dashboard-section">
            <h3>📊 Analytics</h3>
            <p>View job applications and student job matching statistics.</p>
            <button onClick={() => onNavigate('admin')}>View Analytics →</button>
          </div>
        </div>
      )}

      <div className="dashboard-quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          {userRole === 'student' && (
            <>
              <button className="action-btn" onClick={() => onNavigate('profile')}>
                👤 Profile
              </button>
              <button className="action-btn" onClick={() => onNavigate('resume')}>
                📄 Resume
              </button>
              <button className="action-btn" onClick={() => onNavigate('jobs')}>
                💼 Browse Jobs
              </button>
            </>
          )}
          {userRole === 'admin' && (
            <>
              <button className="action-btn" onClick={() => onNavigate('admin')}>
                ⚙️ Admin Panel
              </button>
              <button className="action-btn" onClick={() => onNavigate('admin')}>
                📈 Statistics
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
