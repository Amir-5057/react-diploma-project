import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../assets/favourite.scss";

const FavouritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favourites, setFavourites] = React.useState<string[]>(() => {
    const savedFavourites = localStorage.getItem('favourites');
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });

  return (
    <div>
      <h1>Избранные песни</h1>
      {favourites.length > 0 ? (
        <ul>
          {favourites.map((favourite, index) => (
            <li key={index}>{favourite}</li>
          ))}
        </ul>
      ) : (
        <p>Избранные песни пусты</p>
      )}
      <button onClick={() => navigate('/main')}>Назад</button>
    </div>
  );
};

export default FavouritesPage;
