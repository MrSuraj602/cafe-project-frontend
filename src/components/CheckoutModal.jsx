import React, { useState } from 'react'
import '../styles/CheckoutModal.css'
import { submitOrder } from '../api/api'

export default function CheckoutModal({
  isOpen,
  order,
  priceDatabase,
  foodItems,
  onClose,
  onOrderSuccess,
  onAddItem,
  onRemoveItem
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [localOrder, setLocalOrder] = useState(order)

  if (!isOpen) return null

  let totalAmount = 0
  const orderItems = Object.entries(order).map(([itemName, quantity]) => {
    const price = priceDatabase[itemName] || 0
    const subtotal = price * quantity
    totalAmount += subtotal
    return { itemName, quantity, price, subtotal }
  })

  const handleQuantityChange = (itemName, change) => {
    const newQuantity = (order[itemName] || 0) + change
    if (newQuantity <= 0) {
      onRemoveItem(itemName)
    } else if (newQuantity > (order[itemName] || 0)) {
      onAddItem(itemName, 1)
    } else {
      onRemoveItem(itemName)
    }
  }

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      setError('Please enter your name')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerEmail: 'customer@cafe.local',
        customerPhone: '0000000000',
        customerAddress: 'Restaurant Pickup',
        notes: '',
        items: orderItems.map(item => ({
          foodId: foodItems.find(fi => fi.foodName === item.itemName)?.id || 0,
          foodName: item.itemName,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal
        })),
        totalPrice: totalAmount,
        status: 'PENDING'
      }

      const response = await submitOrder(orderPayload)
      
      if (response) {
        alert(`✅ Order placed successfully!\nOrder ID: ${response.id}`)
        setCustomerName('')
        onOrderSuccess()
        onClose()
      }
    } catch (err) {
      setError('Failed to place order. Please try again.')
      console.error('Order submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📦 Order Summary</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="bill-body">
          {orderItems.length === 0 ? (
            <p className="empty-bill">Your cart is empty</p>
          ) : (
            <>
              {orderItems.map(({ itemName, quantity, price, subtotal }, idx) => (
                <div key={idx} className="bill-item">
                  <div className="item-details">
                    <h4>{itemName}</h4>
                    <span className="item-price">₹{price.toFixed(2)} each</span>
                  </div>
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(itemName, -1)}
                      title="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(itemName, 1)}
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="subtotal">₹{subtotal.toFixed(2)}</span>
                </div>
              ))}
              
              <div className="total-bill">
                Total: <span>₹{totalAmount.toFixed(2)}</span>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', color: '#1e293b', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb'
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? '⏳ Placing Order...' : '✓ Place Order'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
