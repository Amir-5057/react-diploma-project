import axios from 'axios';

const BASE_URL = 'https://api.lyrics.ovh/v1';

export const fetchLyrics = async (artist: string, title: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/${artist}/${title}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    throw error;
  }
};
