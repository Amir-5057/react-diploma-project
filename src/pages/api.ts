export const updateUser = async (updates: { firstName: string }) => {

    const response = await fetch('/api/updateUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
  
    if (!response.ok) {
      throw new Error('Ошибка при обновлении пользователя');
    }
  };
  