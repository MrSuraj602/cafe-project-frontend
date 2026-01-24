import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/admin'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchCategories = async () => {
  try {
    const response = await api.get('/category')
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const fetchFoodItems = async () => {
  try {
    const response = await api.get('/food')
    return response.data
  } catch (error) {
    console.error('Error fetching food items:', error)
    return []
  }
}

export const fetchFoodItemsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/food/category/${categoryId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching items by category:', error)
    return []
  }
}

export const fetchFoodItemById = async (itemId) => {
  try {
    const response = await api.get(`/food/${itemId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching food item:', error)
    return null
  }
}

export const submitOrder = async (orderData) => {
  try {
    const response = await api.post('/order', orderData)
    return response.data
  } catch (error) {
    console.error('Error submitting order:', error)
    throw error
  }
}

export default api
