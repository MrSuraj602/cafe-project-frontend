import React from 'react'
import '../styles/CategoryGrid.css'

export default function CategoryGrid({ categories, onCategoryClick }) {
  return (
    <div className="category-section">
      <h1 className="menu-title">Menu</h1>
      <div className="menu-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => onCategoryClick(category)}
          >
            <div
              className="card-background"
              style={{
                backgroundImage: category.imageUrl ? `url('${category.imageUrl}')` : 'none',
                backgroundColor: '#f0f0f0',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <h2 className="category-title">{category.categoryName}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}
