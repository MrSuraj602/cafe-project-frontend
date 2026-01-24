document.addEventListener('DOMContentLoaded', function () {
    const categoryCards = document.querySelectorAll('.category-card');
    const menuModal = document.getElementById('menu-modal');
    const menuModalTitle = document.getElementById('menu-modal-title');
    const menuModalBody = document.getElementById('menu-modal-body');
    const billModal = document.getElementById('bill-modal');
    const billModalTitle = document.getElementById('bill-modal-title');
    const billModalBody = document.getElementById('bill-modal-body');
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');
    const cartEmoji = document.getElementById('cart-emoji');

    let order = {};
    let tempMenuOrder = {};
    let allFoodItems = {};
    
    // --- SECURITY FEATURE: Price Database ---
    const priceDatabase = {};
    
    // API Configuration
    const API_BASE_URL = 'http://localhost:8080/admin';
    const REFRESH_INTERVAL = 5000; // Refresh every 5 seconds
    
    // Category mapping to standardize names
    const categoryMapping = {
        'burger': 'Burger',
        'sandwich': 'Sandwich',
        'pizza': 'Pizza',
        'pasta': 'Pasta',
        'momos': 'Momos',
        'fries': 'Fries',
        'maggie': 'Maggie',
        'wraps': 'Wraps & Toast',
        'shakes': 'Shakes & Mocktails',
        'coffee': 'Coffee & Tea'
    };

    // Fetch categories and food items from API
    async function fetchMenuData() {
        try {
            const categoriesResponse = await fetch(`${API_BASE_URL}/category`);
            const categories = await categoriesResponse.json();
            
            const itemsResponse = await fetch(`${API_BASE_URL}/food`);
            const items = await itemsResponse.json();
            
            // Update priceDatabase and allFoodItems
            priceDatabase = {};
            allFoodItems = {};
            
            items.forEach(item => {
                priceDatabase[item.foodName] = item.price;
                allFoodItems[item.foodName] = item;
            });
            
            console.log('Menu data updated from API:', { categories, items });
            return { categories, items };
        } catch (error) {
            console.warn('Failed to fetch from API, using fallback data:', error);
            loadFallbackData();
            return null;
        }
    }

    // Load fallback data from hidden content if API fails
    function loadFallbackData() {
        document.querySelectorAll('.hidden-content .menu-item').forEach(itemEl => {
            const name = itemEl.querySelector('.item-name').textContent;
            const priceString = itemEl.querySelector('.item-price').textContent;
            const price = parseFloat(priceString.replace('₹', ''));
            if (name && !isNaN(price)) {
                priceDatabase[name] = price;
            }
        });
    }

    // Setup auto-refresh
    let refreshTimeout;
    function setupAutoRefresh() {
        refreshTimeout = setInterval(async () => {
            await fetchMenuData();
            // If modal is open, refresh its content
            if (menuModal.classList.contains('show')) {
                const currentCategory = menuModalTitle.textContent.toLowerCase();
                const categoryKey = Object.keys(categoryMapping).find(key => 
                    categoryMapping[key] === menuModalTitle.textContent
                );
                if (categoryKey) {
                    updateMenuModalContent(categoryKey);
                }
            }
        }, REFRESH_INTERVAL);
    }

    // Update menu modal with live data from API
    function updateMenuModalContent(category) {
        let itemsHTML = '';
        let foundCount = 0;
        
        // Get items from API data
        for (const itemName in allFoodItems) {
            const item = allFoodItems[itemName];
            // Match category (you might need to adjust this based on your DB structure)
            if (item.category && item.category.categoryName && 
                item.category.categoryName.toLowerCase() === categoryMapping[category].toLowerCase()) {
                foundCount++;
                const quantity = (tempMenuOrder[itemName] && tempMenuOrder[itemName].quantity > 0) 
                    ? tempMenuOrder[itemName].quantity 
                    : 0;
                
                itemsHTML += `
                    <div class="menu-item">
                        <div class="item-content">
                            <div class="item-header">
                                <div class="item-name">${item.foodName}</div>
                                <div class="item-price">₹${item.price.toFixed(2)}</div>
                            </div>
                            <div class="item-desc">${item.description}</div>
                            <div class="quantity-controls">
                                <button class="quantity-btn minus-btn" data-item="${item.foodName}">−</button>
                                <div class="quantity-display">${quantity}</div>
                                <button class="quantity-btn plus-btn" data-item="${item.foodName}">+</button>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        
        // If no items found from API, fall back to hidden content
        if (foundCount === 0) {
            const sourceDiv = document.getElementById(`${category}-items`);
            if (sourceDiv) {
                const sourceItems = sourceDiv.querySelectorAll('.menu-item');
                sourceItems.forEach(item => {
                    const name = item.querySelector('.item-name').textContent;
                    const price = item.querySelector('.item-price').textContent;
                    const desc = item.querySelector('.item-desc').textContent;
                    const quantity = (tempMenuOrder[name] && tempMenuOrder[name].quantity > 0) ? tempMenuOrder[name].quantity : 0;
                    
                    itemsHTML += `
                        <div class="menu-item">
                            <div class="item-content">
                                <div class="item-header">
                                    <div class="item-name">${name}</div>
                                    <div class="item-price">${price}</div>
                                </div>
                                <div class="item-desc">${desc}</div>
                                <div class="quantity-controls">
                                    <button class="quantity-btn minus-btn" data-item="${name}">−</button>
                                    <div class="quantity-display">${quantity}</div>
                                    <button class="quantity-btn plus-btn" data-item="${name}">+</button>
                                </div>
                            </div>
                        </div>
                    `;
                });
            }
        }
        
        menuModalBody.innerHTML = itemsHTML + `<div class="modal-footer"><button class="add-to-cart-btn">Add to Cart</button></div>`;
    }

    function updateMenuView() {
        const visibleItems = menuModalBody.querySelectorAll('.menu-item');
        visibleItems.forEach(itemEl => {
            const name = itemEl.querySelector('.item-name').textContent;
            const quantityDisplay = itemEl.querySelector('.quantity-display');
            
            if (tempMenuOrder[name] && tempMenuOrder[name].quantity > 0) {
                itemEl.classList.add('in-cart');
                quantityDisplay.textContent = tempMenuOrder[name].quantity;
            } else {
                itemEl.classList.remove('in-cart');
                quantityDisplay.textContent = '0';
            }
        });
    }

    function openMenuModal(category) {
        // Set title from mapping
        const categoryTitle = categoryMapping[category] || category;
        menuModalTitle.textContent = categoryTitle;
        
        // Update content with API data
        updateMenuModalContent(category);
        
        updateMenuView();
        menuModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function addItemToOrder(itemName) {
        const price = priceDatabase[itemName];

        if (typeof price === 'undefined') {
            console.error(`Security Alert: Item "${itemName}" not found in price database.`);
            return;
        }

        if (tempMenuOrder[itemName]) {
            tempMenuOrder[itemName].quantity++;
        } else {
            tempMenuOrder[itemName] = { quantity: 1 };
        }
        updateMenuView();
    }

    function removeItemFromOrder(name) {
        if (tempMenuOrder[name]) {
            tempMenuOrder[name].quantity--;
            if (tempMenuOrder[name].quantity <= 0) {
                delete tempMenuOrder[name];
            }
        }
        updateMenuView();
    }

    function removeItemFromCart(name) {
        if (order[name]) {
            order[name].quantity--;
            if (order[name].quantity <= 0) {
                delete order[name];
            }
        }
        updateCartButton();
        updateBillDynamically();
    }

    function updateCartButton() {
        let totalItems = 0;
        for (const name in order) {
            totalItems += order[name].quantity;
        }
        cartCount.textContent = totalItems;
        cartEmoji.textContent = totalItems === 0 ? '🍽️' : '🥗';
    }

    // MODIFIED FUNCTION: Calculates total but does NOT show payment options
    function showFinalBill() {
        let totalItems = Object.keys(order).length;
        if (totalItems === 0) {
            billModal.classList.remove('show');
            if (!document.querySelector('.modal.show')) {
                document.body.style.overflow = 'auto';
            }
            alert("Your order is empty! Click on a dish to add it to your order.");
            return;
        }

        billModalTitle.textContent = "Your Final Order";
        let billHTML = '';
        let totalBillAmount = 0;

        for (const name in order) {
            const item = order[name];
            const price = priceDatabase[name];
            
            if (typeof price === 'undefined') {
                 console.error(`Security Alert: Item "${name}" in order but not in price database during billing.`);
                 continue;
            }
            
            const subtotal = price * item.quantity;
            totalBillAmount += subtotal;
            billHTML += `
                <div class="menu-item">
                    <div class="item-header">
                        <div class="bill-item-details">
                            <div class="item-name">${name}</div>
                            <div class="item-desc">₹${price.toFixed(2)} each</div>
                        </div>
                        <div class="bill-item-actions">
                            <span class="bill-item-quantity">Qty: ${item.quantity}</span>
                            <button class="remove-item-btn" data-name="${name}">-</button>
                        </div>
                        <div class="item-price">₹${subtotal.toFixed(2)}</div>
                    </div>
                </div>
            `;
        }
        
        billHTML += `<div class="total-bill">Total Bill: ₹${totalBillAmount.toFixed(2)}</div>`;
        
        // The payment section has been removed.
        // We just set the final HTML.
        billModalBody.innerHTML = billHTML;

        if (!billModal.classList.contains('show')) {
            billModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    function updateBillDynamically() {
        if (billModal.classList.contains('show')) {
            showFinalBill();
        }
    }

    function addMenuToCart() {
        // Check if user has selected any items
        if (Object.keys(tempMenuOrder).length === 0) {
            showErrorMessage("Please, Select the Items");
            return;
        }

        // Merge tempMenuOrder into main order
        for (const itemName in tempMenuOrder) {
            if (order[itemName]) {
                order[itemName].quantity += tempMenuOrder[itemName].quantity;
            } else {
                order[itemName] = { quantity: tempMenuOrder[itemName].quantity };
            }
        }
        
        // Clear temp order and close menu modal
        tempMenuOrder = {};
        menuModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Update cart
        updateCartButton();
        
        // Show success message
        showSuccessMessage("Item Added to the Cart Successfully!");
    }

    function showSuccessMessage(message) {
        // Remove any existing messages
        const existingMsg = document.querySelector('.success-message');
        if (existingMsg) existingMsg.remove();

        // Create success message element
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = message;
        document.body.appendChild(successMsg);
        
        // Trigger animation
        setTimeout(() => {
            successMsg.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successMsg.classList.remove('show');
            setTimeout(() => {
                successMsg.remove();
            }, 300);
        }, 3000);
    }

    function showErrorMessage(message) {
        // Remove any existing messages
        const existingMsg = document.querySelector('.error-message');
        if (existingMsg) existingMsg.remove();

        // Create error message element
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        document.body.appendChild(errorMsg);
        
        // Trigger animation
        setTimeout(() => {
            errorMsg.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            errorMsg.classList.remove('show');
            setTimeout(() => {
                errorMsg.remove();
            }, 300);
        }, 3000);
    }
        
    categoryCards.forEach(card => {
        card.addEventListener('click', () => openMenuModal(card.dataset.category));
    });

    menuModalBody.addEventListener('click', e => {
        if (e.target.classList.contains('plus-btn')) {
            const itemName = e.target.dataset.item;
            addItemToOrder(itemName);
        } else if (e.target.classList.contains('minus-btn')) {
            const itemName = e.target.dataset.item;
            removeItemFromOrder(itemName);
        } else if (e.target.classList.contains('add-to-cart-btn')) {
            addMenuToCart();
        }
    });
    
    billModalBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-item-btn')) {
            const itemName = event.target.dataset.name;
            removeItemFromCart(itemName);
        }
    });

    cartButton.addEventListener('click', showFinalBill);
    
    function setupModalClose(modal) {
        const closeModalBtn = modal.querySelector('.modal-close');
        function closeModal() {
            modal.classList.remove('show');
            if (!document.querySelector('.modal.show')) {
                document.body.style.overflow = 'auto';
            }
        }
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', e => {
            if(e.target === modal) closeModal();
        });
    }
    setupModalClose(menuModal);
    setupModalClose(billModal);

    // Initialize: Fetch menu data from API and setup auto-refresh
    fetchMenuData();
    setupAutoRefresh();

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => modal.classList.remove('show'));
            document.body.style.overflow = 'auto';
        }
    });
});
