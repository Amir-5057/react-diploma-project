import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react'; 
import { fetchLyrics } from '../store/api/lyricsApi';
import Dropdown from '../UI/Dropdown/Dropdown'; 
import "../assets/main.scss";

const MainPage: React.FC = () => {
  // Состояния для управления вводом и отображением данных
  const [input, setInput] = useState(''); // Ввод пользователя
  const [artist, setArtist] = useState(''); // Исполнитель
  const [title, setTitle] = useState(''); // Название песни
  const [lyrics, setLyrics] = useState<string | null>(null); // Текст песни
  const [error, setError] = useState<string | null>(null); // Ошибки
  const [selectedSong, setSelectedSong] = useState<string | null>(null); // Выбранная песня
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null); // Выбранный исполнитель
  const [comment, setComment] = useState(''); // Текст комментария
  const [comments, setComments] = useState<{ text: string; userName: string; userId: string; id: number }[]>([]); // Список комментариев
  const [editCommentId, setEditCommentId] = useState<number | null>(null); // ID комментария для редактирования
  const [, setFavourites] = useState<string[]>([]); // Избранные песни

  const { user } = useUser(); // Получаем информацию о текущем пользователе

  // Эффект для загрузки комментариев при выборе исполнителя и песни
  useEffect(() => {
    if (selectedArtist && selectedSong) {
      const savedComments = localStorage.getItem(`comments_${selectedArtist.toLowerCase()}_${selectedSong.toLowerCase()}`);
      setComments(savedComments ? JSON.parse(savedComments) : []); // Загружаем комментарии из localStorage
    }
  }, [selectedArtist, selectedSong]);

  // Эффект для загрузки избранных песен при авторизации пользователя
  useEffect(() => {
    if (user) {
      const savedFavourites = localStorage.getItem(`favourites_${user.id}`);
      setFavourites(savedFavourites ? JSON.parse(savedFavourites) : []); // Загружаем избранные песни из localStorage
    }
  }, [user]);

  // Функция для выполнения поиска текста песни
  const performSearch = async () => {
    setError(null); // Сбрасываем ошибки
    setLyrics(null); // Сбрасываем текст песни
    setSelectedSong(null); // Сбрасываем выбранную песню
    setSelectedArtist(null); // Сбрасываем выбранного исполнителя
    if (artist && title) {
      try {
        const data = await fetchLyrics(artist, title); // Запрос к API
        setLyrics(data.lyrics); // Устанавливаем текст песни
        setSelectedSong(title); // Устанавливаем выбранную песню
        setSelectedArtist(artist); // Устанавливаем выбранного исполнителя
      } catch (err) {
        setError('Не удалось получить текст песни. Попробуйте снова.'); // Обработка ошибок
      }
    }
  };

  // Обработка изменения ввода пользователя
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value); // Устанавливаем введенное значение

    // Разделяем ввод на исполнителя и название
    const parts = value.split(' - ');
    if (parts.length === 2) {
      setArtist(parts[0].trim()); // Устанавливаем исполнителя
      setTitle(parts[1].trim()); // Устанавливаем название
    } else {
      setArtist(''); // Сбрасываем исполнителя
      setTitle(''); // Сбрасываем название
    }
  };

  // Отправка комментария
  const handleCommentSubmit = () => {
    if (comment.trim() && selectedSong && selectedArtist && user) {
      const newComment = {
        text: comment.trim(),
        userName: user.firstName || 'Аноним', // Имя пользователя или "Аноним"
        userId: user.id, // ID пользователя
        id: editCommentId !== null ? editCommentId : Date.now(), // ID комментария
      };

      const updatedComments = editCommentId !== null
        ? comments.map(c => (c.id === editCommentId ? newComment : c)) // Обновляем существующий комментарий
        : [...comments, newComment]; // Добавляем новый комментарий

      setComments(updatedComments); // Обновляем состояние комментариев
      setComment(''); // Очищаем поле ввода
      setEditCommentId(null); // Сбрасываем ID редактируемого комментария

      // Сохраняем обновленные комментарии в localStorage
      localStorage.setItem(`comments_${selectedArtist.toLowerCase()}_${selectedSong.toLowerCase()}`, JSON.stringify(updatedComments));
    }
  };

  // Обработка нажатия клавиши "Enter" в поле ввода комментария
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Отменяем стандартное поведение
      handleCommentSubmit(); // Отправляем комментарий
    }
  };

  // Добавление песни в избранное
  const handleAddToFavourites = () => {
    if (!user) {
      alert('Вы должны войти в систему для добавления песен в избранное.'); // Проверка авторизации
      return;
    }
  
    if (selectedSong && selectedArtist) {
      const newFavourite: string = `${selectedArtist} - ${selectedSong}`.toLowerCase(); 
      const savedFavourites: string[] = localStorage.getItem(`favourites_${user.id}`) ? JSON.parse(localStorage.getItem(`favourites_${user.id}`)!) : [];
  
      const isDuplicate: boolean = savedFavourites.some((fav: string) => fav.toLowerCase() === newFavourite); // Проверка на дубликаты
  
      if (!isDuplicate) {
        const updatedFavourites: string[] = [...savedFavourites, newFavourite]; // Обновляем избранные песни
        setFavourites(updatedFavourites);
        localStorage.setItem(`favourites_${user.id}`, JSON.stringify(updatedFavourites)); // Сохраняем в localStorage
        alert('Песня добавлена в избранное'); // Подтверждение добавления
      } else {
        alert('Эта песня уже в избранном'); // Уведомление о дубликате
      }
    }
  };

  // Редактирование комментария
  const handleEditComment = (id: number) => {
    const commentToEdit = comments.find(c => c.id === id && c.userId === user?.id); // Находим комментарий для редактирования
    if (commentToEdit) {
      setEditCommentId(id); // Устанавливаем ID для редактирования
      setComment(commentToEdit.text); // Устанавливаем текст комментария в поле ввода
    }
  };

  // Удаление комментария
  const handleDeleteComment = (id: number) => {
    const commentToDelete = comments.find(c => c.id === id && c.userId === user?.id); // Находим комментарий для удаления
    if (commentToDelete) {
      const updatedComments = comments.filter(c => c.id !== id); // Удаляем комментарий из списка
      setComments(updatedComments); // Обновляем состояние комментариев

      // Сохраняем обновленные комментарии в localStorage
      if (selectedArtist && selectedSong) {
        localStorage.setItem(`comments_${selectedArtist.toLowerCase()}_${selectedSong.toLowerCase()}`, JSON.stringify(updatedComments));
      }
    }
  };

  // Эффект для выполнения поиска при изменении исполнителя или названия песни
  useEffect(() => {
    if (artist && title) {
      performSearch(); // Выполняем поиск
    }
  }, [artist, title]);

  return (
    <div>
      <div className="main-header">
        <h1>Поиск текстов песен</h1>
        <Dropdown /> {/* Выпадающий список (например, для выбора опций) */}
      </div>
      <input
        type="text"
        placeholder="Исполнитель - Название песни"
        value={input}
        onChange={handleInputChange} // Обрабатываем изменения ввода
      />
      {error && <p>{error}</p>} {/* Отображаем ошибку, если она есть */}
      {selectedSong && selectedArtist && (
        <p>
          Вы выбрали песню: <strong>{selectedSong}</strong> от исполнителя: <strong>{selectedArtist}</strong>
        </p>
      )}
      {lyrics && (
        <div>
          <pre>{lyrics}</pre> {/* Отображаем текст песни */}
          <div className="comment-container">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)} // Обрабатываем изменения комментария
              rows={4}
              placeholder="Ваш комментарий..."
              onKeyDown={handleKeyDown} // Обрабатываем нажатия клавиш
            />
          </div>
          <div>
            <h2>Комментарии:</h2>
            <ul>
              {comments.map((c) => (
                <li key={c.id}>
                  <strong>{c.userName}:</strong> {c.text}
                  {user?.id === c.userId && ( // Проверяем, является ли пользователь автором комментария
                    <>
                      <button className='delete-button' onClick={() => handleEditComment(c.id)}>Редактировать</button>
                      <button className='delete-button' onClick={() => handleDeleteComment(c.id)}>Удалить</button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={handleAddToFavourites} className="add-to-favourites-button">Добавить в избранное</button>
        </div>
      )}
    </div>
  );
};

export default MainPage;
