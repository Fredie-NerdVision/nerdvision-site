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
        e.preventDefault();
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
        // We only want the part of the href before the '?', which is the ID of the section.
        const targetID = this.getAttribute('href').split('?')[0];
        const targetElement = document.querySelector(targetID);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
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
    const hexWidth = hexSize * 2;
    const vertDist = hexHeight;
    const horizDist = hexWidth * 3 / 4;

    let wave = {
        radius: 0,
        speed: 1.5,
        maxRadius: Math.max(canvas.width, canvas.height) * 1.2
    };

    function drawHex(x, y, opacity) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle_deg = 60 * i - 30;
            const angle_rad = Math.PI / 180 * angle_deg;
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
                const dx = x - originX;
                const dy = y - originY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const waveWidth = 250;
                const opacity = Math.max(0, (waveWidth - Math.abs(distance - wave.radius)) / waveWidth);
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
        const codeLine = codeSnippets[lineCounter % codeSnippets.length];
        el.innerHTML = codeLine;
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
            { id: 'custom-design', icon: '�', title: 'Custom Design', description: "A unique, single-page design tailored to your brand. We don't use generic templates." },
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
            item.innerHTML = `<button data-id="${feature.id}" class="feature-item w-full text-left flex items-center gap-4 p-3 rounded-lg font-bold text-gray-300"><span class="feature-icon flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg text-xl transition-colors">${feature.icon}</span><span>${feature.title}</span></button>`;
            featureList.appendChild(item);
        });
    }

    function displayFeature(id) {
        const feature = features.find(f => f.id === id);
        if (!feature || !featureDisplay) return;
        featureDisplay.style.opacity = 0;
        setTimeout(() => {
            featureDisplay.innerHTML = `<div class="text-6xl mb-6">${feature.icon}</div><h3 class="font-display text-2xl font-bold text-white mb-2">${feature.title}</h3><p class="text-gray-400">${feature.description}</p>`;
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
    function renderMenu(){menuItemsContainer.innerHTML="",menuData.forEach(t=>{const e=document.createElement("div");e.className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center",e.innerHTML=`<div><h4 class="font-bold text-white">${t.name}</h4><p class="text-sm text-gray-400">${t.description}</p><p class="text-sm font-bold text-yellow-400 mt-1">$${t.price.toFixed(2)}</p></div><button data-id="${t.id}" class="menu-item-add-btn h-10 w-10 rounded-full font-bold text-lg">+</button>`,menuItemsContainer.appendChild(e)})}
    function renderCart(){if(0===cart.length)return cartItemsContainer.innerHTML='<p class="text-sm text-gray-400">Your cart is empty.</p>',void(cartTotalEl.textContent="$0.00");cartItemsContainer.innerHTML="";let t=0;cart.forEach(e=>{const o=document.createElement("div");o.className="flex justify-between items-center text-sm",o.innerHTML=`<div><p class="text-white font-bold">${e.name}</p><p class="text-gray-400">Qty: ${e.quantity}</p></div><p class="text-gray-300">$${(e.price*e.quantity).toFixed(2)}</p>`,cartItemsContainer.appendChild(o),t+=e.price*e.quantity}),cartTotalEl.textContent=`$${t.toFixed(2)}`}
    menuItemsContainer.addEventListener("click",t=>{if(t.target.classList.contains("menu-item-add-btn")){const e=parseInt(t.target.dataset.id),o=menuData.find(t=>t.id===e),n=cart.find(t=>t.id===e);n?n.quantity++:cart.push({...o,quantity:1}),renderCart()}});
    renderMenu();
}

// --- Supernova Page: E-commerce & Analytics ---
const productGrid = document.getElementById('product-grid');
if (productGrid) {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const productData=[{id:1,name:"NerdVision Tee",emoji:"👕",price:25},{id:2,name:"NerdVision Mug",emoji:"☕",price:15},{id:3,name:"NerdVision Sticker Pack",emoji:"✨",price:10},{id:4,name:"Supernova Hoodie",emoji:"🧥",price:55}];
    let cart=[];
    function renderProducts(){productGrid.innerHTML="",productData.forEach(t=>{const e=document.createElement("div");e.className="bg-gray-700/50 p-4 rounded-lg text-center",e.innerHTML=`<div class="text-5xl mb-4">${t.emoji}</div><h4 class="font-bold text-white">${t.name}</h4><p class="text-sm font-bold text-yellow-400 mt-1">$${t.price.toFixed(2)}</p><button data-id="${t.id}" class="w-full mt-4 menu-item-add-btn py-2 px-4 rounded-full font-bold text-sm">Add to Cart</button>`,productGrid.appendChild(e)})}
    function renderCart(){if(0===cart.length)return cartItemsContainer.innerHTML='<p class="text-sm text-gray-400">Your cart is empty.</p>',void(cartTotalEl.textContent="$0.00");cartItemsContainer.innerHTML="";let t=0;cart.forEach(e=>{const o=document.createElement("div");o.className="flex justify-between items-center text-sm",o.innerHTML=`<div><p class="text-white font-bold">${e.name}</p><p class="text-gray-400">Qty: ${e.quantity}</p></div><p class="text-gray-300">$${(e.price*e.quantity).toFixed(2)}</p>`,cartItemsContainer.appendChild(o),t+=e.price*e.quantity}),cartTotalEl.textContent=`$${t.toFixed(2)}`}
    productGrid.addEventListener("click",t=>{if(t.target.classList.contains("menu-item-add-btn")){const e=parseInt(t.target.dataset.id),o=productData.find(t=>t.id===e),n=cart.find(t=>t.id===e);n?n.quantity++:cart.push({...o,quantity:1}),renderCart()}});
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
// This function runs when any page loads to check the URL.
window.addEventListener('DOMContentLoaded', () => {
    // Check if the URL has a hash (#) and a query parameter (?).
    if (window.location.hash && window.location.hash.includes('?')) {
        const hashParts = window.location.hash.split('?');
        const hash = hashParts[0]; // This will be '#contact'
        const paramsString = hashParts[1]; // This will be 'service=Launchpad'
        
        const params = new URLSearchParams(paramsString);
        const service = params.get('service');

        // If we found a service parameter, set the dropdown value.
        if (service) {
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                serviceSelect.value = service;
            }
        }

        // Now, scroll to the correct section.
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            // A small timeout ensures the browser has finished loading before we scroll.
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});
