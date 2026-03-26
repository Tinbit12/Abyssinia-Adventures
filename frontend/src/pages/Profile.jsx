// Profile Page Component
// Displays user info, change password, delete account, and logout. Protected route (logged-in only).

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword, deleteAccount, getToken } from '../api';
import './Profile.css';

// Same strong password rule as Auth page: 8+ chars, letters, numbers, symbols
const isStrongPassword = (value) => {
  if (!value) return false;
  const strongRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}_+\-=:;'",.<>/?`~|]).{8,}$/;
  return strongRegex.test(value);
};

function Profile({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordMessageType, setPasswordMessageType] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // User data from props
  const userName = currentUser?.name || 'User';
  const userEmail = currentUser?.email || '';

  const isPasswordFormValid = useMemo(() => {
    return (
      passwordForm.currentPassword &&
      passwordForm.newPassword &&
      passwordForm.confirmNewPassword &&
      isStrongPassword(passwordForm.newPassword) &&
      passwordForm.newPassword === passwordForm.confirmNewPassword
    );
  }, [
    passwordForm.currentPassword,
    passwordForm.newPassword,
    passwordForm.confirmNewPassword,
  ]);

  const passwordMismatch =
    passwordForm.confirmNewPassword &&
    passwordForm.newPassword !== passwordForm.confirmNewPassword;

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordMessage('');
    setPasswordMessageType('');
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordMessageType('');

    if (!passwordForm.currentPassword) {
      setPasswordMessageType('error');
      setPasswordMessage('Please enter your current password.');
      return;
    }

    if (!isStrongPassword(passwordForm.newPassword)) {
      setPasswordMessageType('error');
      setPasswordMessage(
        'New password must be at least 8 characters and include letters, numbers, and symbols.'
      );
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMessageType('error');
      setPasswordMessage('New password and confirm password must match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = getToken();
      await changePassword(
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        token
      );

      setPasswordMessageType('success');
      setPasswordMessage('Password changed successfully.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      setPasswordMessageType('error');
      setPasswordMessage(err?.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ✅ FIX: Delete account handler (this was missing)
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setDeleteMessage('Please type DELETE to confirm.');
      return;
    }

    const confirmed = window.confirm(
      'This action is permanent. Do you really want to delete your account?'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteMessage('');

    try {
      const token = getToken();
      await deleteAccount(token);

      if (typeof setCurrentUser === 'function') {
        setCurrentUser(null);
      }

      localStorage.removeItem('abyssinia_user');
      localStorage.removeItem('abyssinia_token');

      navigate('/auth', { replace: true });
    } catch (err) {
      setDeleteMessage(err?.message || 'Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    if (typeof setCurrentUser === 'function') {
      setCurrentUser(null);
    }
    localStorage.removeItem('abyssinia_user');
    localStorage.removeItem('abyssinia_token');
    navigate('/auth', { replace: true });
  };

  return (
    <div className="profile-page">
      <section className="profile-hero section">
        <div className="container">
          <h1>My Profile</h1>
          <p>Manage your account and password</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="profile-card">
            {/* User info */}
            <div className="profile-info">
              <h2>Account Details</h2>
              <div className="profile-avatar" aria-hidden="true">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="profile-details">
                <div className="profile-detail-row">
                  <span className="profile-label">Name</span>
                  <span className="profile-value">{userName}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-label">Email</span>
                  <span className="profile-value">{userEmail}</span>
                </div>
              </div>
            </div>

            {/* Change password */}
            <div className="profile-section">
              <h2>Change Password</h2>
              {passwordMessage && (
                <div className={`profile-message ${passwordMessageType}`} role="alert">
                  {passwordMessage}
                </div>
              )}
              <form
                className="profile-form"
                onSubmit={handleChangePasswordSubmit}
                noValidate
              >
                <div className="profile-field">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="confirmNewPassword">Confirm New Password</label>
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordChange}
                    className={passwordMismatch ? 'invalid' : ''}
                  />
                </div>

                <button
                  type="submit"
                  className="profile-btn"
                  disabled={!isPasswordFormValid || isChangingPassword}
                >
                  {isChangingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>

            {/* Delete account */}
            <div className="profile-section profile-danger">
              <h2>Delete Account</h2>
              <p className="profile-hint">
                This cannot be undone. All your data and bookings will be removed.
              </p>

              {deleteMessage && (
                <div className="profile-message error" role="alert">
                  {deleteMessage}
                </div>
              )}

              <div className="profile-field">
                <label htmlFor="deleteConfirm">Type DELETE to confirm</label>
                <input
                  id="deleteConfirm"
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className={
                    deleteConfirm && deleteConfirm !== 'DELETE' ? 'invalid' : ''
                  }
                />
              </div>

              <button
                type="button"
                className="profile-btn profile-btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete my account'}
              </button>
            </div>

            {/* Logout */}
            <div className="profile-actions">
              <button
                type="button"
                className="profile-btn profile-btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
