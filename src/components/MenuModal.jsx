import React, { useState, useEffect } from 'react'
import '../styles/MenuModal.css'

export default function MenuModal({ 
  isOpen, 
  categoryName, 
  items, 
  onClose, 
  onAddItem, 
  onRemoveItem,
  tempOrder,
  onConfirmOrder
}) {
  if (!isOpen) return null

  const handleAddToCart = () => {
    if (Object.keys(tempOrder).length === 0) {
      alert('Please select items')
      return
    }
    
    // Transfer temp order items to main cart
    Object.entries(tempOrder).forEach(([itemName, quantity]) => {
      onConfirmOrder(itemName, quantity)
    })
    
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{categoryName}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {items.length === 0 ? (
            <p className="no-items">No items available</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="menu-item">
                {item.imageUrl && (
                  <div className="item-image">
                    <img src={item.imageUrl} alt={item.foodName} />
                  </div>
                )}
                <div className="item-info">
                  <h3>{item.foodName}</h3>
                  <p className="item-desc">{item.description}</p>
                  <span className="item-price">₹{item.price.toFixed(2)}</span>
                </div>
                <div className="quantity-controls">
                  <button 
                    className="qty-btn"
                    onClick={() => onRemoveItem(item.foodName)}
                  >
                    −
                  </button>
                  <span className="qty-display">
                    {tempOrder[item.foodName] || 0}
                  </span>
                  <button 
                    className="qty-btn"
                    onClick={() => onAddItem(item.foodName, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="modal-footer">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
