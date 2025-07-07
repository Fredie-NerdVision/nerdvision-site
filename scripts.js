// --- Mobile Menu Functionality ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Only apply smooth scroll for on-page links.
        // This prevents interference with links going to other pages.
        if (window.location.pathname === this.pathname || this.pathname === '/') {
             e.preventDefault();
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// --- Hero Canvas Animation ---
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const hexSize = 20;
    const hexHeight = hexSize * Math.sqrt(3);
    const vertDist = hexHeight;
    const horizDist = hexSize * 2 * 3 / 4;

    let wave = { 
        radius: 0, 
        speed: 1.5, 
        maxRadius: Math.max(canvas.width, canvas.height) * 1.2 
    };

    function drawHex(x, y, opacity) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle_rad = Math.PI / 180 * (60 * i - 30);
            ctx.lineTo(x + hexSize * Math.cos(angle_rad), y + hexSize * Math.sin(angle_rad));
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(74, 68, 63, ${opacity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        wave.radius += wave.speed;
        if (wave.radius > wave.maxRadius) {
            wave.radius = 0;
        }

        const originX = canvas.width;
        const originY = 0;

        for (let row = 0; row < canvas.height / vertDist + 1; row++) {
            for (let col = 0; col < canvas.width / horizDist + 1; col++) {
                const x = col * horizDist;
                const y = row * vertDist + ((col % 2) * (vertDist / 2));
                const distance = Math.sqrt(Math.pow(x - originX, 2) + Math.pow(y - originY, 2));
                const opacity = Math.max(0, (250 - Math.abs(distance - wave.radius)) / 250);
                
                if (opacity > 0) {
                    drawHex(x, y, opacity);
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        wave.maxRadius = Math.max(canvas.width, canvas.height) * 1.2;
    });

    animate();
}

// --- HUD Code Simulation ---
const hudContainer = document.getElementById('hud-container');
if (hudContainer) {
    const codeSnippets = [
        `<span class="code-tag">&lt;div</span> <span class="code-attr">class=</span><span class="code-string">"card"</span><span class="code-tag">&gt;</span>`,
        `&nbsp;&nbsp;<span class="code-tag">&lt;h2&gt;</span>Welcome!<span class="code-tag">&lt;/h2&gt;</span>`,
        `&nbsp;&nbsp;<span class="code-tag">&lt;p&gt;</span>Your site is live.<span class="code-tag">&lt;/p&gt;</span>`,
        `<span class="code-tag">&lt;/div&gt;</span>`,
        `<span class="code-keyword">const</span> <span class="code-function">launchSite</span> = () <span class="code-keyword">=></span> {`,
        `&nbsp;&nbsp;<span class="code-function">console</span>.log(<span class="code-string">'Systems online.'</span>);`,
        `&nbsp;&nbsp;<span class="code-keyword">return</span> <span class="code-attr">true</span>;`,
        `}`,
    ];
    let lineCounter = 0;

    function createHudElement() {
        const el = document.createElement('div');
        el.innerHTML = codeSnippets[lineCounter % codeSnippets.length];
        lineCounter++;
        el.className = 'opacity-0 transition-opacity duration-500';
        hudContainer.appendChild(el);
        setTimeout(() => el.classList.remove('opacity-0'), 100);

        if (hudContainer.children.length > 8) {
            hudContainer.children[0].classList.add('opacity-0');
            setTimeout(() => hudContainer.children[0].remove(), 500);
        }
    }
    setInterval(createHudElement, 1200);
}

// --- Service Page Feature Explorer ---
const featureList = document.getElementById('feature-list');
if (featureList) {
    const featureDisplay = document.getElementById('feature-display');
    let features = [];
    const pageTitle = document.title;

    if (pageTitle.includes('Launchpad')) {
        features = [
            { id: 'custom-design', icon: '🎨', title: 'Custom Design', description: "A unique, single-page design tailored to your brand. We don't use generic templates." },
            { id: 'responsive', icon: '📱', title: 'Fully Responsive', description: 'Your site will look and work perfectly on desktops, tablets, and mobile phones.' },
            { id: 'contact-form', icon: '📝', title: 'Contact Form', description: 'A secure, easy-to-use contact form so your customers can reach you anytime.' },
            { id: 'seo', icon: '🚀', title: 'SEO Foundation', description: 'We build your site with SEO best practices to help you get found on Google.' },
            { id: 'hosting', icon: '🛡️', title: 'Secure Hosting Setup', description: "We'll get your site launched on fast, secure hosting with an SSL certificate." },
            { id: 'ownership', icon: '🔑', title: 'Full Ownership', description: "You own 100% of your website, with no monthly fees or strings attached." }
        ];
    } else if (pageTitle.includes('Supernova')) {
        features = [
            { id: 'ecommerce-store', icon: '🛍️', title: 'Full E-commerce Store', description: "We'll build a complete online store to sell your products, with inventory management, shipping, and taxes." },
            { id: 'customer-accounts', icon: '🔐', title: 'Customer Accounts', description: 'Allow your customers to create accounts to view their order history and save payment information.' },
            { id: 'client-vault', icon: 'Vault', title: 'NerdVision Client Vault', description: 'A secure portal for you to manage your site. Update products, view sales analytics, and get support.' },
            { id: 'advanced-analytics', icon: '📊', title: 'Advanced Analytics', description: 'Go beyond basic traffic. We integrate e-commerce analytics to track sales and customer behavior.' }
        ];
    }
    
    function renderFeatureList() {
        featureList.innerHTML = '';
        features.forEach(feature => {
            const item = document.createElement('li');
            item.innerHTML = `
                <button data-id="${feature.id}" class="feature-item w-full text-left flex items-center gap-4 p-3 rounded-lg font-bold text-gray-300">
                    <span class="feature-icon flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg text-xl transition-colors">${feature.icon}</span>
                    <span>${feature.title}</span>
                </button>
            `;
            featureList.appendChild(item);
        });
    }

    function displayFeature(id) {
        const feature = features.find(f => f.id === id);
        if (!feature || !featureDisplay) return;
        featureDisplay.style.opacity = 0;
        setTimeout(() => {
            featureDisplay.innerHTML = `
                <div class="text-6xl mb-6">${feature.icon}</div>
                <h3 class="font-display text-2xl font-bold text-white mb-2">${feature.title}</h3>
                <p class="text-gray-400">${feature.description}</p>
            `;
            featureDisplay.style.opacity = 1;
        }, 300);
        document.querySelectorAll('.feature-item').forEach(item => {
            item.classList.toggle('active', item.dataset.id === id);
        });
    }

    featureList.addEventListener('click', (e) => {
        const button = e.target.closest('.feature-item');
        if (button) displayFeature(button.dataset.id);
    });

    if (features.length > 0) {
        renderFeatureList();
        displayFeature(features[0].id);
    }
}

// --- Accelerator Page: Interactive Menu ---
const menuItemsContainer = document.getElementById('menu-items');
if (menuItemsContainer) {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const menuData=[{id:1,name:"Carne Asada Taco",description:"Grilled steak, onions, cilantro.",price:5.5},{id:2,name:"Al Pastor Burrito",description:"Marinated pork, pineapple, rice, beans.",price:12},{id:3,name:"Chips & Guacamole",description:"Freshly made, serves two.",price:7},{id:4,name:"Horchata",description:"Sweet rice milk drink.",price:3.5}];
    let cart=[];
    
    const updateCart = (itemId, change) => {
        let existingCartItem = cart.find(item => item.id === itemId);
        if (existingCartItem) {
            existingCartItem.quantity += change;
            if (existingCartItem.quantity <= 0) {
                cart = cart.filter(item => item.id !== itemId);
            }
        } else if (change > 0) {
            const menuItem = menuData.find(item => item.id === itemId);
            cart.push({ ...menuItem, quantity: 1 });
        }
        renderCart();
    };

    function renderMenu(){menuItemsContainer.innerHTML="",menuData.forEach(t=>{const e=document.createElement("div");e.className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center",e.innerHTML=`<div><h4 class="font-bold text-white">${t.name}</h4><p class="text-sm text-gray-400">${t.description}</p><p class="text-sm font-bold text-yellow-400 mt-1">$${t.price.toFixed(2)}</p></div><button data-id="${t.id}" class="add-btn menu-item-add-btn h-10 w-10 rounded-full font-bold text-lg">+</button>`,menuItemsContainer.appendChild(e)})}
    
    function renderCart(){
        if(cart.length === 0){
            cartItemsContainer.innerHTML='<p class="text-sm text-gray-400">Your cart is empty.</p>';
            cartTotalEl.textContent="$0.00";
            return;
        }
        cartItemsContainer.innerHTML="";
        let total=0;
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className="flex justify-between items-center text-sm";
            itemEl.innerHTML = `
                <div>
                    <p class="text-white font-bold">${item.name}</p>
                    <p class="text-gray-400">$${item.price.toFixed(2)} each</p>
                </div>
                <div class="flex items-center gap-2">
                    <button data-id="${item.id}" class="subtract-btn h-6 w-6 rounded-md bg-gray-600 text-white font-bold">-</button>
                    <span class="text-white w-4 text-center">${item.quantity}</span>
                    <button data-id="${item.id}" class="add-btn h-6 w-6 rounded-md bg-gray-600 text-white font-bold">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
            total += item.price * item.quantity;
        });
        cartTotalEl.textContent=`$${total.toFixed(2)}`;
    }

    menuItemsContainer.addEventListener("click", e => {
        if(e.target.classList.contains('add-btn')){
            updateCart(parseInt(e.target.dataset.id), 1);
        }
    });

    cartItemsContainer.addEventListener("click", e => {
        if(e.target.classList.contains('add-btn')){
            updateCart(parseInt(e.target.dataset.id), 1);
        }
        if(e.target.classList.contains('subtract-btn')){
            updateCart(parseInt(e.target.dataset.id), -1);
        }
    });

    renderMenu();
}

// --- Supernova Page: E-commerce & Analytics ---
const productGrid = document.getElementById('product-grid');
if (productGrid) {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const productData=[{id:1,name:"NerdVision Tee",emoji:"👕",price:25},{id:2,name:"NerdVision Mug",emoji:"☕",price:15},{id:3,name:"NerdVision Sticker Pack",emoji:"✨",price:10},{id:4,name:"Supernova Hoodie",emoji:"🧥",price:55}];
    let cart=[];

    const updateProductCart = (productId, change) => {
        let existingCartItem = cart.find(item => item.id === productId);
        if (existingCartItem) {
            existingCartItem.quantity += change;
            if (existingCartItem.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
        } else if (change > 0) {
            const product = productData.find(item => item.id === productId);
            cart.push({ ...product, quantity: 1 });
        }
        renderProductCart();
    };

    function renderProducts(){productGrid.innerHTML="",productData.forEach(t=>{const e=document.createElement("div");e.className="bg-gray-700/50 p-4 rounded-lg text-center",e.innerHTML=`<div class="text-5xl mb-4">${t.emoji}</div><h4 class="font-bold text-white">${t.name}</h4><p class="text-sm font-bold text-yellow-400 mt-1">$${t.price.toFixed(2)}</p><button data-id="${t.id}" class="add-btn w-full mt-4 menu-item-add-btn py-2 px-4 rounded-full font-bold text-sm">Add to Cart</button>`,productGrid.appendChild(e)})}
    
    function renderProductCart(){
        if(cart.length === 0){
            cartItemsContainer.innerHTML='<p class="text-sm text-gray-400">Your cart is empty.</p>';
            cartTotalEl.textContent="$0.00";
            return;
        }
        cartItemsContainer.innerHTML="";
        let total=0;
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className="flex justify-between items-center text-sm";
            itemEl.innerHTML = `
                <div>
                    <p class="text-white font-bold">${item.name}</p>
                    <p class="text-gray-400">$${item.price.toFixed(2)} each</p>
                </div>
                <div class="flex items-center gap-2">
                    <button data-id="${item.id}" class="subtract-btn h-6 w-6 rounded-md bg-gray-600 text-white font-bold">-</button>
                    <span class="text-white w-4 text-center">${item.quantity}</span>
                    <button data-id="${item.id}" class="add-btn h-6 w-6 rounded-md bg-gray-600 text-white font-bold">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
            total += item.price * item.quantity;
        });
        cartTotalEl.textContent=`$${total.toFixed(2)}`;
    }

    productGrid.addEventListener("click", e => {
        if(e.target.classList.contains('add-btn')){
            updateProductCart(parseInt(e.target.dataset.id), 1);
        }
    });

    cartItemsContainer.addEventListener("click", e => {
        if(e.target.classList.contains('add-btn')){
            updateProductCart(parseInt(e.target.dataset.id), 1);
        }
        if(e.target.classList.contains('subtract-btn')){
            updateProductCart(parseInt(e.target.dataset.id), -1);
        }
    });

    renderProducts();

    const salesChartCanvas = document.getElementById('salesChart');
    if (salesChartCanvas) {
        const ctx = salesChartCanvas.getContext('2d');
        let salesChart;
        const salesData={"7":{labels:["Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","Day 7"],data:[50,60,80,75,90,110,130]},30:{labels:["Week 1","Week 2","Week 3","Week 4"],data:[450,500,650,800]},90:{labels:["Month 1","Month 2","Month 3"],data:[2100,2500,3100]}};
        function createChart(t){salesChart&&salesChart.destroy();const e=salesData[t];salesChart=new Chart(ctx,{type:"line",data:{labels:e.labels,datasets:[{label:"Sales ($)",data:e.data,borderColor:"rgba(77, 208, 225, 1)",backgroundColor:"rgba(77, 208, 225, 0.2)",fill:!0,tension:.4}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{y:{beginAtZero:!0}}}})}
        const chartControls=document.getElementById("chart-controls");
        chartControls.addEventListener("click",t=>{if("BUTTON"===t.target.tagName){const e=t.target.dataset.range;chartControls.querySelector(".active").classList.remove("active"),t.target.classList.add("active"),createChart(e)}});
        createChart('30');
    }
}


// --- Pre-select service from URL parameter ---
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    
    if (service) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            serviceSelect.value = service;
        }
    }

    const hash = window.location.hash;
    if (hash) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView();
                
                // --- CORRECTED LOGIC ---
                // Only focus on the name input if the hash is #contact
                if (hash === '#contact') {
                    const nameInput = document.getElementById('name');
                    if (nameInput) {
                        nameInput.focus();
                    }
                }
            }, 100);
        }
    }
});
