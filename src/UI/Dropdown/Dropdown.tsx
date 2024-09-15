import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import "./dropdown.scss";

const Dropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleFavouriteClick = () => {
    navigate('/favourite');
  };

  const handleLogoutClick = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="dropdown">
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        Меню
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={handleProfileClick}>Профиль</button>
          <button onClick={handleFavouriteClick}>Избранные</button>
          <button onClick={handleLogoutClick}>Выйти</button>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
