import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Хук для навигации между страницами
import { useAuth } from '@clerk/clerk-react'; // Хук для получения информации об авторизации
import "../assets/favourite.scss"; // Импорт стилей для страницы избранного

const FavouritesPage: React.FC = () => {
  const navigate = useNavigate(); // Инициализация хука навигации
  const { userId, isSignedIn } = useAuth(); // Получаем ID пользователя и статус авторизации
  const [favourites, setFavourites] = React.useState<string[]>([]); // Состояние для хранения избранных песен

  // Эффект для загрузки избранных песен из localStorage
  useEffect(() => {
    if (isSignedIn && userId) { // Проверка, авторизован ли пользователь
      const savedFavourites = localStorage.getItem(`favourites_${userId}`); // Получаем избранные песни из localStorage
      if (savedFavourites) {
        setFavourites(JSON.parse(savedFavourites)); // Устанавливаем избранные песни в состояние
      }
    }
  }, [userId, isSignedIn]); // Зависимости: userId и isSignedIn

  // Функция для удаления песни из избранного
  const handleDeleteFavourite = (favouriteToDelete: string) => {
    const updatedFavourites = favourites.filter(fav => fav !== favouriteToDelete); // Обновляем список избранных
    setFavourites(updatedFavourites); // Обновляем состояние
    if (userId) {
      localStorage.setItem(`favourites_${userId}`, JSON.stringify(updatedFavourites)); // Сохраняем обновленный список в localStorage
    }
    alert('Вы успешно удалили музыку из избранного'); // Уведомление об успешном удалении
  };

  // Эффект для обновления localStorage при изменении избранных
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`favourites_${userId}`, JSON.stringify(favourites)); // Сохраняем избранные песни в localStorage
    }
  }, [favourites, userId]); // Зависимости: favourites и userId

  return (
    <div>
      <h1>Избранные песни</h1>
      {favourites.length > 0 ? ( // Проверяем, есть ли избранные песни
        <ul>
          {favourites.map((favourite, index) => ( // Отображаем список избранных
            <li key={index}>
              {favourite}
              <button 
                className="delete-button" 
                onClick={() => handleDeleteFavourite(favourite)} // Удаляем песню при нажатии
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Избранные песни пусты</p> // Сообщение, если избранные пусты
      )}
      <button onClick={() => navigate('/main')}>Назад</button> {/* Кнопка для возврата на главную страницу */}
    </div>
  );
};

export default FavouritesPage;
