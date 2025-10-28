// ** CONSTANTES DE ECUADOR **
const IVA_RATE = 0.12; // 12% de IVA


const availableProducts = [
    // Gaming
    { id: 1, name: "Teclado Mecánico RGB", price: 85.00, icon: "fas fa-keyboard", image: "img/teclado_mecanico.jpg", stock: 15, category: "Gaming" },
    { id: 2, name: "Mouse Inalámbrico Pro", price: 45.50, icon: "fas fa-mouse", image: "img/mouse_pro.jpg", stock: 3, category: "Gaming" },
    { id: 3, name: "Monitor Curvo 27''", price: 320.00, icon: "fas fa-desktop", image: "img/monitor_curvo.jpg", stock: 0, category: "Gaming" },
    { id: 4, name: "Headset Gaming 7.1", price: 110.00, icon: "fas fa-headset", image: "img/headset_gaming.jpg", stock: 8, category: "Gaming" },
    { id: 5, name: "Mando Inalambrico", price: 125.50, icon: "fas fa-mando", image: "img/mando.jpg", stock: 17, category: "Gaming" },
    // Móvil
    { id: 5, name: "Audífonos", price: 99.99, icon: "fas fa-headphones", image: "img/audifonos_inalambricos.jpg", stock: 12, category: "Móvil" },
    { id: 6, name: "Cargador Rápido ", price: 25.00, icon: "fas fa-plug", image: "img/cargador_rapido.jpg", stock: 45, category: "Móvil" },
    { id: 7, name: "Smartwatch Deportivo", price: 150.00, icon: "fas fa-watch", image: "img/smartwatch.jpg", stock: 7, category: "Móvil" },
    { id: 8, name: "Batería Externa ", price: 35.00, icon: "fas fa-battery-full", image: "img/bateria_externa.jpg", stock: 25, category: "Móvil" },
    // Software
    { id: 9, name: "Licencia Editor de Video", price: 249.99, icon: "fas fa-film", image: "img/editor_video.jpg", stock: 99, category: "Software" },
    { id: 10, name: "Antivirus Pro (1 año)", price: 49.99, icon: "fas fa-shield-alt", image: "img/antivirus_pro.jpg", stock: 50, category: "Software" },
    // Componentes
    { id: 11, name: "Memoria RAM 16GB DDR4", price: 65.00, icon: "fas fa-microchip", image: "img/memoria_ram.jpg", stock: 10, category: "Componentes" },
    { id: 12, name: "SSD NVMe 1TB", price: 110.00, icon: "fas fa-hdd", image: "img/ssd_nvme.jpg", stock: 5, category: "Componentes" },
    { id: 13, name: "GitHub Andrade", price: 17.50, icon: "fas fa-keyboard", image: "img/prueba.jpg", stock: 1, category: "Software" }
    // Verificación commit GitHub Andrade

];

let cart = [];
let activeCategory = 'Todo'; 

// ----------------------------------------------------
// LÓGICA DE CATEGORÍAS Y BÚSQUEDA 
// ----------------------------------------------------
function getUniqueCategories() {
    const categories = new Set(['Todo']);
    availableProducts.forEach(p => categories.add(p.category));
    return Array.from(categories);
}

function renderCategoryButtons() {
    const container = document.getElementById('categoryButtons');
    container.innerHTML = '';
    
    getUniqueCategories().forEach(cat => {
        const button = document.createElement('button');
        button.textContent = cat;
        button.classList.add('category-btn');
        if (cat === activeCategory) {
            button.classList.add('active');
        }
        button.onclick = () => filterByCategory(cat);
        container.appendChild(button);
    });
}

function filterByCategory(category) {
    activeCategory = category;
    
    document.querySelectorAll('.category-buttons button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.category-buttons button').forEach(btn => {
        if (btn.textContent === category) {
            btn.classList.add('active');
        }
    });

    filterProducts(); 
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredByCategory = availableProducts.filter(product => 
        activeCategory === 'Todo' || product.category === activeCategory
    );

    const finalFiltered = filteredByCategory.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );
    
    loadProducts(finalFiltered);
}
function loadProducts(productsToRender = availableProducts) {
    const listContainer = document.getElementById('productsList');
    listContainer.innerHTML = ''; 
    
    if (productsToRender.length === 0) {
        listContainer.innerHTML = '<p class="empty-cart-msg">No se encontraron productos que coincidan con los filtros.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        let stockClass = 'in-stock';
        let stockText = 'Disponible';
        let isAvailable = true;
        
        if (product.stock === 0) {
            stockClass = 'out-of-stock';
            stockText = 'AGOTADO';
            isAvailable = false;
        } else if (product.stock <= 5) {
            stockClass = 'low-stock';
            stockText = `Pocas Unidades (${product.stock})`;
        }
        
        const imageContent = product.image 
            ? `<img src="${product.image}" alt="${product.name}">` 
            : `<i class="${product.icon}"></i>`;

        productCard.innerHTML = `
            <div class="product-image">${imageContent}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <p class="stock-status ${stockClass}">${stockText}</p>
                <button 
                    class="add-to-cart-btn"
                    data-id="${product.id}" 
                    ${!isAvailable ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> Añadir
                </button>
            </div>
        `;
        listContainer.appendChild(productCard);
    });
}

// ----------------------------------------------------
// GESTIÓN DE CARRITO (SE MANTIENE IGUAL)
// ----------------------------------------------------
function addToCart(productId) {
    const product = availableProducts.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem && existingItem.quantity >= product.stock) {
        showNotification(`Límite de Stock: Solo quedan ${product.stock} de ${product.name}.`, 'error');
        return;
    }
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartDisplay(); 
    showNotification(`¡${product.name} añadido!`, 'success'); 
}

function updateCartQuantity(productId, action) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    const product = availableProducts.find(p => p.id === productId);

    if (action === 'increase') {
        if (item.quantity < product.stock) {
            item.quantity += 1;
        } else {
            showNotification(`Límite de Stock alcanzado para ${product.name}.`, 'error');
        }
    } else if (action === 'decrease') {
        item.quantity -= 1;
    }

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId); 
        showNotification(`Item "${product.name}" eliminado.`, 'info');
    }
    
    updateCartDisplay();
}

// ----------------------------------------------------
// CÁLCULOS Y RENDERIZADO DEL CARRITO (SE MANTIENE IGUAL)
// ----------------------------------------------------
function updateCartDisplay() {
    const cartContainer = document.getElementById('cartItemsContainer');
    let subtotal = 0;
    
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-msg">Aún no hay productos.</p>';
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItemHTML = document.createElement('div');
        cartItemHTML.classList.add('cart-item');
        cartItemHTML.innerHTML = `
            <span>${item.name}</span>
            <div class="cart-item-controls">
                <button onclick="updateCartQuantity(${item.id}, 'decrease')">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartQuantity(${item.id}, 'increase')">+</button>
                <span style="font-weight: bold;">$${itemTotal.toFixed(2)}</span>
            </div>
        `;
        cartContainer.appendChild(cartItemHTML);
    });

    const taxAmount = subtotal * IVA_RATE; 
    const finalTotal = subtotal + taxAmount;
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${taxAmount.toFixed(2)}`;
    document.getElementById('total').textContent = `$${finalTotal.toFixed(2)}`;
    document.getElementById('cartCount').textContent = totalItems;
}

// ----------------------------------------------------
// LÓGICA DE NOTIFICACIONES Y MODAL (SE MANTIENE IGUAL)
// ----------------------------------------------------
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.classList.add(type);

    let icon = (type === 'success') ? 'fas fa-check-circle' : 'fas fa-info-circle';
    if (type === 'error') icon = 'fas fa-times-circle';

    notification.innerHTML = `<i class="${icon}"></i> ${message}`; 

    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10); 

    setTimeout(() => {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 4000);
}

function finishCheckout() {
    if (cart.length === 0) {
        showNotification("Tu carrito está vacío. Agrega productos para comprar.", 'error');
        return;
    }

    let subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxAmount = subtotal * IVA_RATE;
    const finalTotal = subtotal + taxAmount;

    document.getElementById('finalPaidTotal').textContent = `$${finalTotal.toFixed(2)}`;
    
    const overlay = document.getElementById('checkoutModalOverlay');
    overlay.style.display = 'flex';
    setTimeout(() => {
        document.getElementById('checkoutModalContent').classList.add('show');
    }, 10);
    
    cart = [];
    updateCartDisplay();
    showNotification("¡Transacción completada con éxito!", 'success');
}

function closeModal() {
    const overlay = document.getElementById('checkoutModalOverlay');
    document.getElementById('checkoutModalContent').classList.remove('show');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

// ----------------------------------------------------
// INICIALIZACIÓN (SE MANTIENE IGUAL)
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    renderCategoryButtons();
    loadProducts(); 
    updateCartDisplay();
    
    document.getElementById('productsList').addEventListener('click', (event) => {
        const target = event.target.closest('.add-to-cart-btn');
        if (target) {
            const productId = parseInt(target.getAttribute('data-id'));
            addToCart(productId);
        }
    });

    document.querySelector('.checkout-btn').addEventListener('click', finishCheckout);
});
