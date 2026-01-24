import React from 'react'
import '../styles/Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 PassTime Café. All rights reserved.</p>
      <a href="https://www.google.com/search?q=passtime+cafe" 
         target="_blank" 
         rel="noopener noreferrer"
         className="review-link">
        ⭐ Rate Us & Add Photos Online
      </a>
    </footer>
  )
}
