import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react'; 
import { fetchLyrics } from '../store/api/lyricsApi';
import Dropdown from '../UI/Dropdown/Dropdown'; 
import "../assets/main.scss";

const MainPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<{ text: string; userName: string; userId: string; id: number }[]>([]);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [favourites, setFavourites] = useState<string[]>([]);

  const navigate = useNavigate(); 
  const { user } = useUser(); 

  useEffect(() => {
    if (selectedArtist && selectedSong) {
      const savedComments = localStorage.getItem(`comments_${selectedArtist.toLowerCase()}_${selectedSong.toLowerCase()}`);
      setComments(savedComments ? JSON.parse(savedComments) : []);
    }
  }, [selectedArtist, selectedSong]);

  useEffect(() => {
    if (user) {
      const savedFavourites = localStorage.getItem(`favourites_${user.id}`);
      setFavourites(savedFavourites ? JSON.parse(savedFavourites) : []);
    }
  }, [user]);

  const performSearch = async () => {
    setError(null);
    setLyrics(null);
    setSelectedSong(null);
    setSelectedArtist(null);
    if (artist && title) {
      try {
        const data = await fetchLyrics(artist, title);
        setLyrics(data.lyrics);
        setSelectedSong(title);
        setSelectedArtist(artist);
      } catch (err) {
        setError('Не удалось получить текст песни. Попробуйте снова.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    const parts = value.split(' - ');
    if (parts.length === 2) {
      setArtist(parts[0].trim());
      setTitle(parts[1].trim());
    } else {
      setArtist('');
      setTitle('');
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim() && selectedSong && selectedArtist && user) {
      const newComment = {
        text: comment.trim(),
        userName: user.firstName || 'Аноним',
        userId: user.id,
        id: editCommentId !== null ? editCommentId : Date.now(), // Используем id для обновления
      };

      const updatedComments = editCommentId !== null
        ? comments.map(c => (c.id === editCommentId ? newComment : c))
        : [...comments, newComment];

      setComments(updatedComments);
      setComment('');
      setEditCommentId(null);

      localStorage.setItem(`comments_${selectedArtist.toLowerCase()}_${selectedSong.toLowerCase()}`, JSON.stringify(updatedComments));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  const handleAddToFavourites = () => {
    if (!user) {
      alert('Вы должны войти в систему для добавления песен в избранное.');
      return;
    }

    if (selectedSong && selectedArtist) {
      const newFavourite = `${selectedArtist} - ${selectedSong}`.toLowerCase(); // Приведение к нижнему регистру
      const savedFavourites = localStorage.getItem(`favourites_${user.id}`);
      const currentFavourites = savedFavourites ? JSON.parse(savedFavourites) : [];

      const isDuplicate = currentFavourites.some(fav => 
        fav.toLowerCase() === newFavourite
      );

      if (!isDuplicate) {
        const updatedFavourites = [...currentFavourites, newFavourite];
        setFavourites(updatedFavourites);
        localStorage.setItem(`favourites_${user.id}`, JSON.stringify(updatedFavourites));
        alert('Песня добавлена в избранное');
      } else {
        alert('Эта песня уже в избранном');
      }
    }
  };

  const handleEditComment = (id: number) => {
    const commentToEdit = comments.find(c => c.id === id && c.userId === user?.id);
    if (commentToEdit) {
      setEditCommentId(id);
      setComment(commentToEdit.text);
    }
  };

  const handleDeleteComment = (id: number) => {
    const commentToDelete = comments.find(c => c.id === id && c.userId === user?.id);
    if (commentToDelete) {
      const updatedComments = comments.filter(c => c.id !== id);
      setComments(updatedComments);

      if (selectedArtist && selectedSong) {
        localStorage.setItem(`comments_${selectedArtist.toLowerCase()}_${selectedSong.toLowerCase()}`, JSON.stringify(updatedComments));
      }
    }
  };

  useEffect(() => {
    if (artist && title) {
      performSearch();
    }
  }, [artist, title]);

  return (
    <div>
      <div className="main-header">
        <h1>Поиск текстов песен</h1>
        <Dropdown /> 
      </div>
      <input
        type="text"
        placeholder="Исполнитель - Название песни"
        value={input}
        onChange={handleInputChange}
      />
      {error && <p>{error}</p>}
      {selectedSong && selectedArtist && (
        <p>
          Вы выбрали песню: <strong>{selectedSong}</strong> от исполнителя: <strong>{selectedArtist}</strong>
        </p>
      )}
      {lyrics && (
        <div>
          <pre>{lyrics}</pre>
          <div className="comment-container">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Ваш комментарий..."
              onKeyDown={handleKeyDown}
            />
          </div>
          <div>
            <h2>Комментарии:</h2>
            <ul>
              {comments.map((c) => (
                <li key={c.id}>
                  <strong>{c.userName}:</strong> {c.text}
                  {user?.id === c.userId && ( 
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
