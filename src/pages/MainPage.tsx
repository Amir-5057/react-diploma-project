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
  const [comments, setComments] = useState<{ text: string; userName: string }[]>([]);
  const [favourites, setFavourites] = useState<string[]>(() => {
    const savedFavourites = localStorage.getItem('favourites');
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });

  const navigate = useNavigate(); 
  const { user } = useUser(); 


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
    if (comment.trim() && user) {
      setComments([...comments, { text: comment.trim(), userName: user.firstName || 'Аноним' }]);
      setComment('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };


  const handleAddToFavourites = () => {
    if (selectedSong && selectedArtist) {
      const newFavourite = `${selectedArtist} - ${selectedSong}`;
      const updatedFavourites = [...favourites, newFavourite];
      setFavourites(updatedFavourites);
      localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
    }
  };

  useEffect(() => {
    performSearch();
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
              {comments.map((c, index) => (
                <li key={index}>
                  <strong>{c.userName}:</strong> {c.text}
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
