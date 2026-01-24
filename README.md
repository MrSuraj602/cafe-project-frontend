# PassTime Café - React UserInterface

## Overview
The UserInterface has been completely rewritten as a modern React application using Vite. It now integrates seamlessly with the AdminBackend, automatically syncing all menu changes in real-time.

## Project Structure

```
UserInterface/
├── src/
│   ├── components/           # React components
│   │   ├── Header.jsx
│   │   ├── CategoryGrid.jsx
│   │   ├── MenuModal.jsx
│   │   ├── CartButton.jsx
│   │   ├── BillModal.jsx
│   │   └── Footer.jsx
│   ├── styles/               # Component-specific CSS
│   │   ├── Header.css
│   │   ├── CategoryGrid.css
│   │   ├── MenuModal.css
│   │   ├── CartButton.css
│   │   ├── BillModal.css
│   │   └── Footer.css
│   ├── api/
│   │   └── api.js           # API service for AdminBackend
│   ├── App.jsx              # Main app component
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Features

### ✅ Real-Time Menu Sync
- Automatically fetches menu data from AdminBackend
- Auto-refreshes every 5 seconds
- Changes made in AdminFrontend appear instantly

### ✅ Interactive Menu
- Browse categories with beautiful cards
- Click category to see items
- Add items to cart with quantity controls
- Remove items from cart

### ✅ Shopping Cart
- Floating cart button with item count
- View final bill with itemized breakdown
- Modify quantities in bill view
- Total calculation with price validation

### ✅ Responsive Design
- Mobile-friendly interface
- Works on all screen sizes
- Touch-friendly buttons

### ✅ Security
- Server-side price validation
- Prices fetched from AdminBackend (not editable on client)

## Getting Started

### Installation

1. Navigate to UserInterface directory:
```bash
cd UserInterface
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

**Development Mode:**
```bash
npm run dev
```
Opens at `http://localhost:5174`

**Production Build:**
```bash
npm run build
```

**Preview Production Build:**
```bash
npm run preview
```

## Component Architecture

### Header
- Displays café logo and tagline
- Styled with gradient background

### CategoryGrid
- Fetches categories from AdminBackend
- Displays category cards with images
- Click to open menu modal

### MenuModal
- Shows items for selected category
- Displays item name, description, price
- Quantity controls for selecting items
- "Add to Cart" button

### CartButton
- Floating button showing cart count
- Changes emoji based on cart status
- Click to view final bill

### BillModal
- Lists all items in cart
- Shows individual prices and subtotals
- Calculate total amount
- Remove items from cart

### Footer
- Copyright and developer info
- Link to Google reviews

## API Integration

### Endpoints Used

```javascript
GET  /admin/category              // Get all categories
GET  /admin/food                  // Get all food items
GET  /admin/food/category/{id}    // Get items by category
```

### API Service (`src/api/api.js`)

```javascript
fetchCategories()        // Get all categories
fetchFoodItems()         // Get all food items
fetchFoodItemsByCategory(categoryId)  // Get items by category
```

## Real-Time Sync Mechanism

The app implements auto-refresh every 5 seconds:

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    loadMenuData()
  }, 5000)
  
  return () => clearInterval(interval)
}, [])
```

This ensures:
- New categories appear automatically
- Price changes sync instantly
- Deleted items are removed
- New items are added to menu

## State Management

Uses React Hooks:
- `useState` - Managing component state
- `useEffect` - Fetching data and side effects

Main App states:
- `categories` - Available categories
- `foodItems` - All food items
- `filteredItems` - Items for selected category
- `order` - Current shopping cart
- `tempOrder` - Items selected in modal
- `priceDatabase` - Server-validated prices

## Styling

Modular CSS structure:
- Each component has its own CSS file
- Responsive design with media queries
- Gradient backgrounds
- Smooth transitions and hover effects

### Color Scheme
- Primary: `#667eea` (Purple-blue)
- Secondary: `#764ba2` (Deep purple)
- Background: `#f5f5f5` (Light gray)
- Text: `#333` (Dark gray)

## Key Differences from HTML Version

| Aspect | HTML Version | React Version |
|--------|--------------|---------------|
| Architecture | Static HTML + JS | React Components |
| State Management | Object variables | React Hooks |
| Data Fetching | Hardcoded + API | Dynamic API calls |
| Updates | Manual polling | Auto-refresh with cleanup |
| Styling | Single CSS file | Modular CSS per component |
| Bundle | Simple files | Vite optimized |
| Performance | Good | Better (component optimization) |

## Development Workflow

1. **Start AdminBackend** (port 8080):
```bash
cd AdminBackend
mvn spring-boot:run
```

2. **Start AdminFrontend** (port 5173):
```bash
cd AdminFrontend/cafe-admin-ui
npm run dev
```

3. **Start React UserInterface** (port 5174):
```bash
cd UserInterface
npm run dev
```

4. **Test Integration**:
   - Go to AdminFrontend → Add/Edit items
   - Watch changes appear in UserInterface automatically!

## Debugging

### Check API Connection
Open browser DevTools (F12) → Console to see:
- API fetch calls
- Data loaded from AdminBackend
- Auto-refresh logs

### Common Issues

**"No items appearing"**
- Check if AdminBackend is running on port 8080
- Verify categories exist in database
- Check browser console for fetch errors

**"Prices not updating"**
- Hard refresh browser (Ctrl+Shift+R)
- Check AdminFrontend has saved items to database

**"Modal not closing"**
- Press Escape key
- Click outside modal

## Performance Optimizations

1. **Auto-refresh**: Only refreshes when needed (every 5 seconds)
2. **Component structure**: Prevents unnecessary re-renders
3. **Lazy loading**: Categories and items loaded on demand
4. **CSS modules**: Scoped styling prevents conflicts

## Future Enhancements

- [ ] WebSocket for real-time updates (instead of polling)
- [ ] Search functionality
- [ ] Favorites/Wishlist
- [ ] Order history
- [ ] Multiple language support
- [ ] Dark mode
- [ ] Payment integration
- [ ] Animations with Framer Motion

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Host
The `dist/` folder can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Azure Static Web Apps

### Environment Variables
Configure API URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/admin
```

## Support & Troubleshooting

1. **Check Node.js version**: `node --version` (requires 14+)
2. **Clear node_modules**: `rm -rf node_modules && npm install`
3. **Check port conflicts**: `netstat -ano | findstr 5174`
4. **View server logs**: Check console output in terminal

## Team

- **Developers**: Suraj, Om, Sanskar
- **Year**: 2026

---

**Status**: ✅ Production Ready  
**Last Updated**: January 17, 2026
