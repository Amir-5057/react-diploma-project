import React, { useState, useEffect } from 'react';
import {  useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import "../assets/profile.scss";

const ProfilePage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  
  const [profilePicture, setProfilePicture] = useState(user?.profileImageUrl || '');

  useEffect(() => {
    if (!isLoaded || !user) {
      navigate('/'); 
    }
  }, [isLoaded, user, navigate]);

  return (
    <div className="profile-page">
      <h1>Мой Профиль</h1>
      <div className="profile-info">
        <img 
          src={profilePicture || 'htts:p//encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQYG9Qkim6qjrKV89wXOT4XDSS6kvS7r6MliDDAVUIvPBUQgBvF'} 
          alt="Profile"
          className="profile-picture" 
        />
        <div className="profile-details">
          <p>Имя: {user?.firstName}</p>
          <button onClick={() => navigate('/main')}>Вернуться назад</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
