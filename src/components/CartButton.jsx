import React from 'react'
import '../styles/CartButton.css'

export default function CartButton({ totalItems, totalAmount, onClick }) {
  return (
    <button className="cart-button" onClick={onClick}>
      <span className="cart-emoji">{totalItems === 0 ? '🍽️' : '🥗'}</span>
      Your Total Bill
      <span className="cart-count">{totalItems}</span>
    </button>
  )
}
