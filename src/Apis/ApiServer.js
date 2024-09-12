// src/apiService.js
const API_URL = 'https://dummyjson.com/recipes';

export const fetchRecipes = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    return data.recipes; // Adjust based on API response structure
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};
