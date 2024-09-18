import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import "../assets/profile.scss";

const ProfilePage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { client } = useClerk();
  const navigate = useNavigate();
  
  const [profilePicture, setProfilePicture] = useState(user?.profileImageUrl || '');
  const [name, setName] = useState(user?.firstName || '');
  const [newProfilePicture, setNewProfilePicture] = useState<string>('');
  const [newName, setNewName] = useState<string>('');

  useEffect(() => {
    if (!isLoaded || !user) {
      navigate('/'); 
    } else {

      setProfilePicture(user.profileImageUrl || '');
      setName(user.firstName || '');
    }
  }, [isLoaded, user, navigate]);

  const handleSaveChanges = async () => {
    try {

      await client.updateUser({
        firstName: newName || name,
        profileImageUrl: newProfilePicture || profilePicture,
      });
      setName(newName || name);
      setProfilePicture(newProfilePicture || profilePicture);
      alert('Профиль обновлен!');
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      alert('Не удалось обновить профиль.');
    }
  };

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
};

export default ProfilePage;
