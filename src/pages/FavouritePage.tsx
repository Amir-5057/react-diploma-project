import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react'; // Подключаем Clerk
import "../assets/favourite.scss";

const FavouritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, isSignedIn } = useAuth(); 
  const [favourites, setFavourites] = React.useState<string[]>([]);

  

  useEffect(() => {
    if (isSignedIn && userId) {
      const savedFavourites = localStorage.getItem(`favourites_${userId}`);
      if (savedFavourites) {
        setFavourites(JSON.parse(savedFavourites));
      }
    }
  }, [userId, isSignedIn]);

  const handleDeleteFavourite = (favouriteToDelete: string) => {
    const updatedFavourites = favourites.filter(fav => fav !== favouriteToDelete);
    setFavourites(updatedFavourites);
    if (userId) {
      localStorage.setItem(`favourites_${userId}`, JSON.stringify(updatedFavourites));
    }
    alert('Вы успешно удалили музыку из избранного');
  };


  useEffect(() => {
    if (userId) {
      localStorage.setItem(`favourites_${userId}`, JSON.stringify(favourites));
    }
  }, [favourites, userId]);

  return (
    <div>
      <h1>Избранные песни</h1>
      {favourites.length > 0 ? (
        <ul>
          {favourites.map((favourite, index) => (
            <li key={index}>
              {favourite}
              <button 
                className="delete-button" 
                onClick={() => handleDeleteFavourite(favourite)}
              >
                Удалить
              </button>
            </li>
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
