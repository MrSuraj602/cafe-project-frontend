import React, { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import CategoryGrid from './components/CategoryGrid'
import MenuModal from './components/MenuModal'
import CartButton from './components/CartButton'
import CheckoutModal from './components/CheckoutModal'
import Footer from './components/Footer'
import { fetchCategories, fetchFoodItems, fetchFoodItemsByCategory } from './api/api'

export default function App() {
  const [categories, setCategories] = useState([])
  const [foodItems, setFoodItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [priceDatabase, setPriceDatabase] = useState({})
  
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [billModalOpen, setBillModalOpen] = useState(false)
  
  const [order, setOrder] = useState({})
  const [tempOrder, setTempOrder] = useState({})
  const [totalItems, setTotalItems] = useState(0)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  // Fetch initial data
  useEffect(() => {
    loadMenuData()
  }, [])

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadMenuData()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // Update total items count
  useEffect(() => {
    const total = Object.values(order).reduce((sum, qty) => sum + qty, 0)
    setTotalItems(total)
  }, [order])

  const loadMenuData = async () => {
    try {
      const [categoriesData, itemsData] = await Promise.all([
        fetchCategories(),
        fetchFoodItems()
      ])

      setCategories(categoriesData)
      setFoodItems(itemsData)

      // Build price database
      const priceDb = {}
      itemsData.forEach(item => {
        priceDb[item.foodName] = item.price
      })
      setPriceDatabase(priceDb)

      console.log('Menu data loaded:', { categories: categoriesData, items: itemsData })
    } catch (error) {
      console.error('Error loading menu data:', error)
    }
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    
    // Filter items by category
    const items = foodItems.filter(item => 
      item.category && item.category.id === category.id
    )
    
    setFilteredItems(items)
    setTempOrder({})
    setMenuModalOpen(true)
  }

  const handleAddItemToTemp = (itemName, quantity) => {
    setTempOrder(prev => {
      const current = prev[itemName] || 0
      return {
        ...prev,
        [itemName]: current + quantity
      }
    })
  }

  const handleRemoveItemFromTemp = (itemName) => {
    setTempOrder(prev => {
      if (!prev[itemName] || prev[itemName] <= 0) return prev
      return {
        ...prev,
        [itemName]: prev[itemName] - 1
      }
    })
  }

  const handleAddItemToOrder = (itemName, quantity) => {
    setOrder(prev => {
      const current = prev[itemName] || 0
      return {
        ...prev,
        [itemName]: current + quantity
      }
    })
    showToastMessage('✅ Item Added to cart Successfully')
  }

  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const handleRemoveItemFromOrder = (itemName) => {
    setOrder(prev => {
      if (!prev[itemName] || prev[itemName] <= 0) return prev
      return {
        ...prev,
        [itemName]: prev[itemName] - 1
      }
    })
  }

  const handleShowBill = () => {
    if (totalItems === 0) {
      showToastMessage('🛒 Cart Is Empty, Please Select the Item First')
      return
    }
    setBillModalOpen(true)
  }

  const handleOrderSuccess = () => {
    setOrder({})
    setTotalItems(0)
  }

  return (
    <div className="app">
      <Header />
      
      <CategoryGrid 
        categories={categories}
        onCategoryClick={handleCategoryClick}
      />

      <MenuModal
        isOpen={menuModalOpen}
        categoryName={selectedCategory?.categoryName}
        items={filteredItems}
        onClose={() => setMenuModalOpen(false)}
        onAddItem={handleAddItemToTemp}
        onRemoveItem={handleRemoveItemFromTemp}
        tempOrder={tempOrder}
        onConfirmOrder={handleAddItemToOrder}
      />

      <CartButton 
        totalItems={totalItems}
        totalAmount={Object.entries(order).reduce((sum, [item, qty]) => 
          sum + (priceDatabase[item] * qty || 0), 0
        )}
        onClick={handleShowBill}
      />

      <CheckoutModal
        isOpen={billModalOpen}
        order={order}
        priceDatabase={priceDatabase}
        foodItems={foodItems}
        onClose={() => setBillModalOpen(false)}
        onOrderSuccess={handleOrderSuccess}
        onAddItem={handleAddItemToOrder}
        onRemoveItem={handleRemoveItemFromOrder}
      />

      <Footer />

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
    </div>
  )
}

