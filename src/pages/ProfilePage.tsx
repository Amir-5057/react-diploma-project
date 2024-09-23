import React, { useState} from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import "../assets/profile.scss";

const ProfilePage: React.FC = () => {
  const { user,  } = useUser();
  const navigate = useNavigate();
  
  const [profilePicture, ] = useState(user?.profileImageUrl || '');
  const [name, ] = useState(user?.firstName || '');



  

  return (
    <div className="profile-page">
      <h1>Мой Профиль</h1>
      <div className="profile-info">
        <img 
          src={profilePicture || 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQYG9Qkim6qjrKV89wXOT4XDSS6kvS7r6MliDDAVUIvPBUQgBvF'} 
          alt="Profile"
          className="profile-picture" 
        />
        <div className="profile-details">
          <p>Имя: {name}</p>
          <button onClick={() => navigate('/main')}>Вернуться назад</button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
