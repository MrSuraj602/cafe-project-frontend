import React from 'react'
import '../styles/BillModal.css'

export default function BillModal({ 
  isOpen, 
  order, 
  priceDatabase,
  onClose, 
  onRemoveItem 
}) {
  if (!isOpen) return null

  let totalAmount = 0
  const orderItems = Object.entries(order).map(([itemName, quantity]) => {
    const price = priceDatabase[itemName] || 0
    const subtotal = price * quantity
    totalAmount += subtotal
    return { itemName, quantity, price, subtotal }
  })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Your Final Order</h2>
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
                  <div className="bill-actions">
                    <span className="quantity">Qty: {quantity}</span>
                    <button 
                      className="remove-btn"
                      onClick={() => onRemoveItem(itemName)}
                    >
                      −
                    </button>
                  </div>
                  <span className="subtotal">₹{subtotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="total-bill">
                Total: <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
