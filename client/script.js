/**
 * Visionsby_MON - Main Application Logic & Backend Integration
 * High-End Clothing Store Online Boutique with MongoDB Backend
 */

document.addEventListener('DOMContentLoaded', () => {
  // Dynamically target backend API port 5000 regardless of client dev server port (e.g. 3000, 8080, 5500)
  const API_BASE = window.location.port === '5000' ? '' : 'http://localhost:5000';

  // ==========================================
  // 1. DATA & STATE MANAGEMENT
  // ==========================================
  const defaultProducts = [
    {
      id: 'mon-01',
      title: 'Bootcut Pant',
      category: 'pants',
      price: 2000,
      oldPrice: 2400,
      rating: 4.9,
      reviews: 18,
      badge: 'Trending',
      image: 'images/1.jpeg',
      images: ['images/1.jpeg', 'images/boot2.jpeg', 'images/boott3.jpeg'],
      description: 'High-waisted bootcut trousers crafted with premium stretch fabric for a sleek and flattering fit.',
      fabric: '95% Cotton, 5% Elastane',
      stock: 5,
      sizes: ['L', 'XL'],
      colors: [
        { name: 'Classic Black', hex: '#222222' }
      ]
    },
    {
      id: 'mon-02',
      title: 'Bow-Tie Top',
      category: 'shirt',
      price: 1450,
      oldPrice: 1800,
      rating: 4.8,
      reviews: 24,
      badge: 'New Arrival',
      image: 'images/bow-tietop1.jpeg',
      images: ['images/bow-tietop1.jpeg', 'images/bow-tietop2.jpeg', 'images/bow-tietop3.jpeg'],
      description: 'Chic bow-tie front accent blouse designed with lightweight breathable fabric.',
      fabric: '100% Soft Rayon',
      stock: 3,
      sizes: ['S', 'M', 'L'],
      colors: [
        { name: 'Soft Pink', hex: '#F8DCE6' },
        { name: 'Cream White', hex: '#FFFFFF' }
      ]
    },
    {
      id: 'mon-03',
      title: 'Bow Top',
      category: 'shirt',
      price: 1550,
      oldPrice: 1900,
      rating: 5.0,
      reviews: 31,
      badge: 'Bestseller',
      image: 'images/bowtop.jpeg',
      images: ['images/bowtop.jpeg', 'images/bowtop2.jpeg', 'images/bowtop3.jpeg'],
      description: 'Elegant sleeveless bow detailed top, versatile for casual outings and evening looks.',
      fabric: '100% Premium Satin-Finish Polyester',
      stock: 5,
      sizes: ['Free Size'],
      colors: [
        { name: 'Ivory White', hex: '#FFFFFF' }
      ]
    },
    {
      id: 'mon-04',
      title: 'Heart Top',
      category: 'shirt',
      price: 1550,
      oldPrice: 1900,
      rating: 4.9,
      reviews: 42,
      badge: 'In Stock',
      image: 'images/hearttop.jpeg',
      images: ['images/hearttop.jpeg', 'images/hearttop1.jpeg', 'images/hearttop2.jpeg'],
      description: 'Feminine sweetheart silhouette top featuring a delicate heart neckline detail.',
      fabric: '90% Cotton, 10% Spandex',
      stock: 7,
      sizes: ['S', 'M', 'L'],
      colors: [
        { name: 'Rose Quartz', hex: '#e5b7c9' },
        { name: 'Obsidian Black', hex: '#222222' }
      ]
    },
    {
      id: 'mon-05',
      title: 'Mesh Lace Wrap',
      category: 'shirt',
      price: 800,
      oldPrice: 1100,
      rating: 4.7,
      reviews: 15,
      badge: 'In Stock',
      image: 'images/meshlesh.jpeg',
      images: ['images/meshlesh.jpeg', 'images/meshlesh1.jpeg', 'images/meshlesh2.jpeg', 'images/meshlesh4.jpeg'],
      description: 'Delicate semi-sheer mesh lace wrap top with elegant self-tie side straps.',
      fabric: '100% Sheer Floral Lace Mesh',
      stock: 16,
      sizes: ['Free Size'],
      colors: [
        { name: 'Black Lace', hex: '#222222' }
      ]
    },
    {
      id: 'mon-06',
      title: 'Sleeveless Ruffle',
      category: 'shirt',
      price: 1550,
      oldPrice: 1950,
      rating: 4.8,
      reviews: 29,
      badge: 'In Stock',
      image: 'images/sleevee4.jpeg',
      images: ['images/sleevee4.jpeg', 'images/sleevee.jpeg', 'images/sleevee5.jpeg'],
      description: 'Romantic sleeveless top enhanced with tiered ruffle accents along the shoulder and hem.',
      fabric: '100% Lightweight Chiffon',
      stock: 4,
      sizes: ['S', 'M', 'L'],
      colors: [
        { name: 'Crisp White', hex: '#FFFFFF' }
      ]
    },
    {
      id: 'mon-07',
      title: 'White Dress',
      category: 'dress',
      price: 1450,
      oldPrice: 1850,
      rating: 5.0,
      reviews: 53,
      badge: 'Bestseller',
      image: 'images/whitedress.jpeg',
      images: ['images/whitedress.jpeg', 'images/whitedress1.jpeg', 'images/whitedress2.jpeg', 'images/whitedress3.jpeg'],
      description: 'Classic ethereal white dress with a flowing silhouette and soft inner lining.',
      fabric: '100% Organic Linen Blend',
      stock: 5,
      sizes: ['M', 'L', 'XL'],
      colors: [
        { name: 'Pure White', hex: '#FFFFFF' }
      ]
    },
    {
      id: 'mon-08',
      title: 'Butter Yellow Midi',
      category: 'dress',
      price: 1650,
      oldPrice: 2100,
      rating: 4.9,
      reviews: 37,
      badge: 'New Arrival',
      image: 'images/butter.png',
      images: ['images/butter.png', 'images/buttwe4.png', 'images/butter2.png'],
      description: 'Stunning pastel butter yellow midi dress with subtle side slit and adjustable straps.',
      fabric: '100% Mulberry Satin',
      stock: 3,
      sizes: ['S', 'M'],
      colors: [
        { name: 'Butter Yellow', hex: '#FFF2B2' }
      ]
    },
    {
      id: 'mon-09',
      title: 'Flower Top',
      category: 'shirt',
      price: 1200,
      oldPrice: 1500,
      rating: 4.6,
      reviews: 21,
      badge: 'In Stock',
      image: 'images/flow1.png',
      images: ['images/flow1.png', 'images/flow2.png'],
      description: 'Vibrant floral embroidered summer top crafted from ultra-soft cotton fabric.',
      fabric: '100% Breathable Cotton',
      stock: 5,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Floral Pink', hex: '#F8DCE6' }
      ]
    },
    {
      id: 'mon-10',
      title: 'Leggings',
      category: 'pants',
      price: 450,
      oldPrice: 650,
      rating: 4.8,
      reviews: 84,
      badge: 'Essentials',
      image: 'images/leg.png',
      images: ['images/leg.png', 'images/leg1.png', 'images/leg2.png', 'images/leg4.png'],
      description: 'Ultra-stretch comfortable everyday leggings with a smooth high-waist band.',
      fabric: '85% Polyamide, 15% Elastane',
      stock: 5,
      sizes: ['Free Size'],
      colors: [
        { name: 'Midnight Black', hex: '#222222' }
      ]
    },
    {
      id: 'mon-11',
      title: 'Astro Top',
      category: 'shirt',
      price: 1200,
      oldPrice: 1550,
      rating: 4.9,
      reviews: 39,
      badge: 'Trending',
      image: 'images/ast3.png',
      images: ['images/ast3.png', 'images/astro.png', 'images/astro1.png', 'images/ASTRO3.png'],
      description: 'Modern celestial graphic top with relaxed drop-shoulder tailoring.',
      fabric: '95% Combed Cotton, 5% Spandex',
      stock: 10,
      sizes: ['M', 'L', 'XL'],
      colors: [
        { name: 'Obsidian Black', hex: '#222222' }
      ]
    },
    {
      id: 'mon-12',
      title: 'Ruffle Top',
      category: 'shirt',
      price: 1650,
      oldPrice: 2000,
      rating: 5.0,
      reviews: 68,
      badge: 'Bestseller',
      image: 'images/ruffle.png',
      images: ['images/ruffle.png', 'images/ruffle3.png'],
      description: 'Statement ruffle collar top with tailored cuffs and elegant pearl button closures.',
      fabric: '100% Silk Touch Rayon',
      stock: 25,
      sizes: ['M'],
      colors: [
        { name: 'Soft Cream', hex: '#FDFBF7' }
      ]
    }
  ];

  let catalogProducts = [...defaultProducts];
  let currentUser = null;
  let authToken = localStorage.getItem('visions_mon_token');

  function formatPrice(amount) {
    if (amount == null || isNaN(amount)) return 'Rs 0';
    return `Rs ${Number(amount).toLocaleString('en-IN')}`;
  }

  const comingSoonProducts = [
    {
      id: 'cs-01',
      title: 'Structured Velvet Blazer Dress',
      category: 'dress',
      price: 1850,
      oldPrice: 2200,
      releaseDate: 'October 15, 2026',
      badge: 'Pre-Order',
      image: 'images/whitedress.jpeg',
      description: 'Double-breasted deep ruby velvet blazer dress with satin lapels and tailored waist.'
    },
    {
      id: 'cs-02',
      title: 'Oversized Distressed Knit Sweater',
      category: 'hoodie',
      price: 1100,
      oldPrice: 1400,
      releaseDate: 'November 1, 2026',
      badge: 'Drop #04',
      image: 'images/ast3.png',
      description: 'Heavy gauge mohair-wool blend knit with raw edges and signature oversized fit.'
    }
  ];

  const lookbookItems = [
    {
      id: 'lb-01',
      title: 'Minimalist Soft Chic',
      tag: 'Fall Capsule 2026',
      desc: 'Subtle pastel rose hues paired with effortless relaxed tailoring.',
      image: 'images/hero.png'
    },
    {
      id: 'lb-02',
      title: 'Streetwear Luxury',
      tag: 'Urban Edit',
      desc: 'Heavyweight oversized hoodies combined with structured pleat trousers.',
      image: 'images/ruffle.png'
    },
    {
      id: 'lb-03',
      title: 'Silk Evening Grace',
      tag: 'Red Carpet Look',
      desc: 'Mulberry silk dresses draped with precision and effortless elegance.',
      image: 'images/butter.png'
    }
  ];

  function requireAuth(actionName = 'add items to your bag') {
    if (!currentUser) {
      showToast(`Please sign in or create an account to ${actionName}`, 'fa-solid fa-lock');
      openAuthModal();
      return false;
    }
    return true;
  }

  // SVG Silhouettes for Customizer Studio
  const svgPathMap = {
    hoodie: {
      body: "M80,60 Q150,40 220,60 L270,110 L230,140 L210,120 L210,270 L90,270 L90,120 L70,140 L30,110 Z",
      details: "M120,50 Q150,80 180,50 M125,120 Q150,140 175,120 L175,220 Q150,220 125,220 Z"
    },
    tee: {
      body: "M75,50 Q150,40 225,50 L275,90 L240,120 L215,100 L215,260 L85,260 L85,100 L60,120 L25,90 Z",
      details: "M120,48 Q150,75 180,48"
    },
    jacket: {
      body: "M80,50 Q150,45 220,50 L270,95 L235,125 L210,105 L210,270 L90,270 L90,105 L65,125 L30,95 Z",
      details: "M150,50 L150,270 M110,90 L135,90 L135,115 L110,115 Z M165,90 L190,90 L190,115 L165,115 Z"
    },
    sweatpants: {
      body: "M90,40 L210,40 L220,270 L160,270 L150,130 L140,270 L80,270 Z",
      details: "M90,60 L210,60 M120,40 L120,60"
    }
  };

  let state = {
    cart: [],
    wishlist: [],
    orders: [],
    activeTab: 'instock',
    categoryFilter: 'all',
    search: '',
    sort: 'featured',
    currentProduct: null,
    currentSlide: 0,
    appliedPromo: null,
    discountPercent: 0,
    customizer: {
      garment: 'hoodie',
      color: '#F8DCE6',
      text: 'VISIONS BY MON',
      font: "'Inter', sans-serif",
      textColor: '#222222',
      size: 'M',
      price: 1500
    }
  };

  // ==========================================
  // 2. TOAST NOTIFICATIONS
  // ==========================================
  function showToast(message, icon = 'fa-solid fa-check-circle') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================
  // 3. BACKEND API CALLS & SYNC
  // ==========================================

  // Fetch Catalog & Quantities from Database
  async function fetchDressesFromDB() {
    try {
      const res = await fetch(`${API_BASE}/api/dresses`);
      const data = await res.json();
      if (res.ok && data.dresses && data.dresses.length > 0) {
        catalogProducts = data.dresses;
      } else {
        catalogProducts = [...defaultProducts];
      }
    } catch (err) {
      console.error('Error fetching dresses from backend:', err);
      catalogProducts = [...defaultProducts];
    } finally {
      renderInStockGrid();
      renderAdminInventoryTable();
    }
  }

  // Load User Profile & Saved Address from DB
  async function loadUserProfile() {
    authToken = localStorage.getItem('visions_mon_token');
    const savedUserStr = localStorage.getItem('visions_mon_user');

    if (!authToken) {
      currentUser = null;
      state.cart = [];
      state.wishlist = [];
      updateAuthUI();
      return;
    }

    if (savedUserStr) {
      try {
        currentUser = JSON.parse(savedUserStr);
        const userWish = localStorage.getItem(`mon_wishlist_${currentUser.id}`);
        const userCart = localStorage.getItem(`mon_cart_${currentUser.id}`);
        if (userWish) state.wishlist = JSON.parse(userWish);
        if (userCart) state.cart = JSON.parse(userCart);
        updateCounters();
        updateAuthUI();
        renderInStockGrid();
      } catch (e) { }
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok && data.user) {
        currentUser = data.user;
        localStorage.setItem('visions_mon_user', JSON.stringify(data.user));
        updateAuthUI();
        await fetchCartFromDBCache();
        await fetchWishlistFromDBCache();
        await fetchUserOrderHistory();
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
      }
    } catch (err) {
      console.log('Using active offline session profile');
    }
  }

  // Update UI according to User Auth State
  function updateAuthUI() {
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const userRoleBadge = document.getElementById('userRoleBadge');
    const authActionBox = document.getElementById('authActionBox');
    const loggedInContent = document.getElementById('loggedInContent');
    const accountNavText = document.getElementById('accountNavText');
    const adminNavBtn = document.getElementById('adminNavBtn');
    const drawerAdminBtn = document.getElementById('drawerAdminBtn');

    const directLoginNavText = document.getElementById('directLoginNavText');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');

    if (currentUser) {
      if (userNameDisplay) userNameDisplay.textContent = currentUser.name;
      if (userEmailDisplay) userEmailDisplay.textContent = currentUser.email;
      if (accountNavText) accountNavText.textContent = currentUser.name.split(' ')[0];
      if (directLoginNavText) directLoginNavText.textContent = 'My Profile';
      if (mobileLoginBtn) mobileLoginBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> ${currentUser.name.split(' ')[0]}`;

      if (userRoleBadge) {
        if (currentUser.role === 'admin') {
          userRoleBadge.className = 'badge admin-badge';
          userRoleBadge.innerHTML = '<i class="fa-solid fa-shield-halved"></i> STORE ADMIN';
        } else {
          userRoleBadge.className = 'badge vip-badge';
          userRoleBadge.innerHTML = '<i class="fa-solid fa-crown"></i> MON VIP Member';
        }
      }

      authActionBox?.classList.add('hidden');
      loggedInContent?.classList.remove('hidden');

      // Admin button visibility (Strictly restricted to admin@visionsbymon.com)
      if (currentUser.role === 'admin' && currentUser.email && currentUser.email.toLowerCase() === 'admin@visionsbymon.com') {
        adminNavBtn?.classList.remove('hidden');
        drawerAdminBtn?.classList.remove('hidden');
      } else {
        adminNavBtn?.classList.add('hidden');
        drawerAdminBtn?.classList.add('hidden');
      }

      // Fill saved address inputs
      const savedStreetAddress = document.getElementById('savedStreetAddress');
      const savedCity = document.getElementById('savedCity');
      const savedZip = document.getElementById('savedZip');
      if (savedStreetAddress) savedStreetAddress.value = currentUser.address || '';
      if (savedCity) savedCity.value = currentUser.city || '';
      if (savedZip) savedZip.value = currentUser.zip || '';

      // Pre-fill Checkout form inputs
      const checkoutName = document.getElementById('checkoutName');
      const checkoutEmail = document.getElementById('checkoutEmail');
      const checkoutAddress = document.getElementById('checkoutAddress');
      const checkoutCity = document.getElementById('checkoutCity');
      const checkoutZip = document.getElementById('checkoutZip');

      if (checkoutName) checkoutName.value = currentUser.name || '';
      if (checkoutEmail) checkoutEmail.value = currentUser.email || '';
      if (checkoutAddress) checkoutAddress.value = currentUser.address || '';
      if (checkoutCity) checkoutCity.value = currentUser.city || '';
      if (checkoutZip) checkoutZip.value = currentUser.zip || '';

    } else {
      if (userNameDisplay) userNameDisplay.textContent = 'Guest Visitor';
      if (userEmailDisplay) userEmailDisplay.textContent = 'Sign in to access saved address & order history';
      if (accountNavText) accountNavText.textContent = 'Account';
      if (directLoginNavText) directLoginNavText.textContent = 'Sign In';
      if (mobileLoginBtn) mobileLoginBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Sign In`;

      if (userRoleBadge) {
        userRoleBadge.className = 'badge vip-badge';
        userRoleBadge.innerHTML = '<i class="fa-solid fa-sparkles"></i> Guest';
      }

      authActionBox?.classList.remove('hidden');
      loggedInContent?.classList.add('hidden');
      adminNavBtn?.classList.add('hidden');
      drawerAdminBtn?.classList.add('hidden');

      const checkoutName = document.getElementById('checkoutName');
      const checkoutEmail = document.getElementById('checkoutEmail');
      const checkoutAddress = document.getElementById('checkoutAddress');
      const checkoutCity = document.getElementById('checkoutCity');
      const checkoutZip = document.getElementById('checkoutZip');

      if (checkoutName) checkoutName.value = '';
      if (checkoutEmail) checkoutEmail.value = '';
      if (checkoutAddress) checkoutAddress.value = '';
      if (checkoutCity) checkoutCity.value = '';
      if (checkoutZip) checkoutZip.value = '';

      state.cart = [];
      state.wishlist = [];
      updateCounters();
      renderInStockGrid();
    }
  }

  // Cart & Wishlist Database Caching Operations
  async function syncCartWithDBCache() {
    if (!currentUser || !authToken) return;
    try {
      await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ cart: state.cart })
      });
    } catch (err) {
      console.error('Failed to sync cart cache to DB:', err);
    }
  }

  async function fetchCartFromDBCache() {
    if (!currentUser || !authToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok && data.cart && Array.isArray(data.cart)) {
        if (data.cart.length > 0) {
          state.cart = data.cart;
        } else {
          const localCart = localStorage.getItem(`mon_cart_${currentUser.id}`);
          if (localCart) {
            state.cart = JSON.parse(localCart);
            syncCartWithDBCache();
          }
        }
        saveState();
        renderCart();
      }
    } catch (err) {
      console.error('Failed to load cart cache from DB:', err);
    }
  }

  async function syncWishlistWithDBCache() {
    if (!currentUser || !authToken) return;
    try {
      await fetch(`${API_BASE}/api/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ wishlist: state.wishlist })
      });
    } catch (err) {
      console.error('Failed to sync wishlist cache to DB:', err);
    }
  }

  async function fetchWishlistFromDBCache() {
    if (!currentUser || !authToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/wishlist`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok && data.wishlist && Array.isArray(data.wishlist)) {
        if (data.wishlist.length > 0) {
          state.wishlist = data.wishlist;
        } else {
          const localWish = localStorage.getItem(`mon_wishlist_${currentUser.id}`);
          if (localWish) {
            state.wishlist = JSON.parse(localWish);
            syncWishlistWithDBCache();
          }
        }
        saveState();
        renderInStockGrid();
        renderWishlist();
      }
    } catch (err) {
      console.error('Failed to load wishlist cache from DB:', err);
    }
  }

  // Fetch Order History from DB
  async function fetchUserOrderHistory() {
    if (!currentUser || !authToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/orders/history`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok && data.orders) {
        state.orders = data.orders;
        renderOrderHistory();
      }
    } catch (err) {
      console.error('Failed to load orders from DB:', err);
    }
  }

  // ==========================================
  // 4. AUTHENTICATION & HANDLERS
  // ==========================================
  function validatePasswordClient(password) {
    const hasLength = password.length >= 8;
    const hasCaps = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    return { hasLength, hasCaps, hasNumber, hasSymbol, isValid: hasLength && hasCaps && hasNumber && hasSymbol };
  }

  function updatePasswordChecklistUI(password) {
    const { hasLength, hasCaps, hasNumber, hasSymbol } = validatePasswordClient(password);

    const updateRule = (elemId, isValid) => {
      const el = document.getElementById(elemId);
      if (!el) return;
      if (isValid) {
        el.classList.add('valid');
        const icon = el.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-circle-check';
      } else {
        el.classList.remove('valid');
        const icon = el.querySelector('i');
        if (icon) icon.className = 'fa-regular fa-circle';
      }
    };

    updateRule('ruleLength', hasLength);
    updateRule('ruleCaps', hasCaps);
    updateRule('ruleNumber', hasNumber);
    updateRule('ruleSymbol', hasSymbol);
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('visions_mon_token', data.token);
        localStorage.setItem('visions_mon_user', JSON.stringify(data.user));
        currentUser = data.user;
        authToken = data.token;

        // Reset state before loading current user's DB table data
        state.cart = [];
        state.wishlist = [];
        updateAuthUI();

        // Restore user-bound cart & wishlist state immediately
        const userWish = localStorage.getItem(`mon_wishlist_${currentUser.id}`);
        const userCart = localStorage.getItem(`mon_cart_${currentUser.id}`);
        if (userWish) state.wishlist = JSON.parse(userWish);
        if (userCart) state.cart = JSON.parse(userCart);

        await fetchCartFromDBCache();
        await fetchWishlistFromDBCache();
        await fetchUserOrderHistory();

        updateCounters();
        renderInStockGrid();
        renderCart();
        renderWishlist();

        closeAuthModal();
        showToast(`Welcome back, ${currentUser.name}!`, 'fa-solid fa-user-check');
      } else {
        const errorMsg = data.error || 'Invalid credentials';
        showToast(errorMsg, 'fa-solid fa-circle-exclamation');
        if (errorMsg.includes('not registered')) {
          setTimeout(() => {
            switchAuthTab('register');
            const regEmailField = document.getElementById('regEmail');
            if (regEmailField) {
              regEmailField.value = email;
              document.getElementById('regName')?.focus();
            }
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Login submit error:', err);
      showToast('Authentication server offline', 'fa-solid fa-triangle-exclamation');
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const address = document.getElementById('regAddress').value.trim();
    const city = document.getElementById('regCity').value.trim();
    const zip = document.getElementById('regZip').value.trim();

    // Client-side strong password validation check
    const pwdStatus = validatePasswordClient(password);
    if (!pwdStatus.isValid) {
      const missing = [];
      if (!pwdStatus.hasLength) missing.push('8+ characters');
      if (!pwdStatus.hasCaps) missing.push('1 capital letter (A-Z)');
      if (!pwdStatus.hasNumber) missing.push('1 numerical digit (0-9)');
      if (!pwdStatus.hasSymbol) missing.push('1 special symbol (!@#$)');
      showToast(`Password requires: ${missing.join(', ')}`, 'fa-solid fa-triangle-exclamation');
      document.getElementById('regPassword')?.focus();
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, address, city, zip })
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('visions_mon_token', data.token);
        localStorage.setItem('visions_mon_user', JSON.stringify(data.user));
        currentUser = data.user;
        authToken = data.token;

        // Reset state before loading current user's DB table data
        state.cart = [];
        state.wishlist = [];
        updateAuthUI();

        await fetchCartFromDBCache();
        await fetchWishlistFromDBCache();
        await fetchUserOrderHistory();

        updateCounters();
        renderInStockGrid();
        renderCart();
        renderWishlist();

        closeAuthModal();
        showToast(`Account created successfully! Welcome, ${currentUser.name}.`, 'fa-solid fa-sparkles');
      } else {
        const errorMsg = data.error || 'Registration failed';
        showToast(errorMsg, 'fa-solid fa-circle-exclamation');
        if (errorMsg.includes('already registered') || errorMsg.includes('already exists')) {
          setTimeout(() => {
            switchAuthTab('login');
            const loginEmailField = document.getElementById('loginEmail');
            if (loginEmailField) {
              loginEmailField.value = email;
              document.getElementById('loginPassword')?.focus();
            }
          }, 1200);
        }
      }
    } catch (err) {
      showToast('Network error during registration', 'fa-solid fa-triangle-exclamation');
    }
  }

  async function handleSaveAddressSubmit(e) {
    e.preventDefault();
    if (!currentUser || !authToken) return;

    const address = document.getElementById('savedStreetAddress').value.trim();
    const city = document.getElementById('savedCity').value.trim();
    const zip = document.getElementById('savedZip').value.trim();

    try {
      const res = await fetch(`${API_BASE}/api/user/address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ address, city, zip })
      });
      const data = await res.json();

      if (res.ok && data.user) {
        currentUser = data.user;
        updateAuthUI();
        showToast('Shipping address saved to database!', 'fa-solid fa-floppy-disk');
      } else {
        showToast(data.error || 'Failed to save address', 'fa-solid fa-circle-exclamation');
      }
    } catch (err) {
      showToast('Error updating address', 'fa-solid fa-triangle-exclamation');
    }
  }

  function clearAuthFields() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();

    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const regName = document.getElementById('regName');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');

    if (loginEmail) loginEmail.value = '';
    if (loginPassword) loginPassword.value = '';
    if (regName) regName.value = '';
    if (regEmail) regEmail.value = '';
    if (regPassword) regPassword.value = '';

    updatePasswordChecklistUI('');
  }

  function handleLogout() {
    localStorage.removeItem('visions_mon_token');
    localStorage.removeItem('visions_mon_user');
    currentUser = null;
    authToken = null;
    state.cart = [];
    state.wishlist = [];
    clearAuthFields();
    updateAuthUI();
    closeDrawer('accountDrawer');
    renderInStockGrid();
    showToast('Signed out of account', 'fa-solid fa-right-from-bracket');
  }

  // ==========================================
  // 5. INITIALIZATION & STATE PERSISTENCE
  // ==========================================
  async function init() {
    setupEventListeners();
    updateCounters();
    renderComingSoonGrid();
    renderExploreGrid();

    // Fetch live catalog from DB
    await fetchDressesFromDB();
    // Load logged in user profile if token exists
    await loadUserProfile();
  }

  function saveState() {
    updateCounters();
    if (currentUser && authToken) {
      localStorage.setItem(`mon_cart_${currentUser.id}`, JSON.stringify(state.cart));
      localStorage.setItem(`mon_wishlist_${currentUser.id}`, JSON.stringify(state.wishlist));
      syncCartWithDBCache();
      syncWishlistWithDBCache();
    } else {
      state.cart = [];
      state.wishlist = [];
    }
  }

  function updateCounters() {
    const totalCartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalCartCount);
    document.querySelectorAll('.wishlist-count').forEach(el => el.textContent = state.wishlist.length);
  }

  // ==========================================
  // 6. IN-STOCK PRODUCT RENDERING & STOCK BADGES
  // ==========================================
  function renderInStockGrid() {
    const grid = document.getElementById('instockGrid');
    if (!grid) return;

    let filtered = catalogProducts.filter(item => {
      const matchCat = state.categoryFilter === 'all' ||
        item.category === state.categoryFilter ||
        (state.categoryFilter === 'shirt' && (item.category === 'top' || item.category === 'shirt')) ||
        (state.categoryFilter === 'pants' && (item.category === 'pant' || item.category === 'pants'));
      const matchSearch = item.title.toLowerCase().includes(state.search.toLowerCase()) ||
        item.description.toLowerCase().includes(state.search.toLowerCase());
      return matchCat && matchSearch;
    });

    if (state.sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    const activeFilterBar = document.getElementById('activeFilterBar');
    const filterSummaryText = document.getElementById('filterSummaryText');
    if (state.categoryFilter !== 'all' || state.search !== '') {
      activeFilterBar?.classList.remove('hidden');
      if (filterSummaryText) filterSummaryText.textContent = `Showing ${filtered.length} garments ${state.categoryFilter !== 'all' ? `in category '${state.categoryFilter}'` : ''} ${state.search ? `matching "${state.search}"` : ''}`;
    } else {
      activeFilterBar?.classList.add('hidden');
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; background: #fff; border-radius: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 42px; color: #ccc; margin-bottom: 12px;"></i>
          <h3 style="font-size: 18px; margin-bottom: 6px;">No garments found</h3>
          <p style="color: #666; font-size: 14px; margin-bottom: 16px;">Try adjusting your category filter or search keywords.</p>
          <button class="hero-btn primary" onclick="resetAllFilters()" style="background: #222; color: #fff; margin: 0 auto;">Clear All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => {
      const isWishlisted = state.wishlist.some(w => w.id === item.id);

      // Compute stock badge
      let stockBadgeHtml = '';
      if (item.stock > 5) {
        stockBadgeHtml = `<span class="stock-badge high-stock"><i class="fa-solid fa-check"></i> ${item.stock} in stock</span>`;
      } else if (item.stock > 0) {
        stockBadgeHtml = `<span class="stock-badge low-stock"><i class="fa-solid fa-triangle-exclamation"></i> Only ${item.stock} left!</span>`;
      } else {
        stockBadgeHtml = `<span class="stock-badge out-of-stock"><i class="fa-solid fa-xmark"></i> OUT OF STOCK</span>`;
      }

      const isOutOfStock = item.stock <= 0;

      return `
        <div class="product-card ${isOutOfStock ? 'card-out-of-stock' : ''}" data-id="${item.id}">
          <div class="card-image-wrap" onclick="openProductModal('${item.id}')">
            <span class="product-badge">${item.badge}</span>
            <button class="wishlist-btn-corner ${isWishlisted ? 'active' : ''}" 
                    onclick="event.stopPropagation(); toggleWishlist('${item.id}')" 
                    title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}">
              <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </div>
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span class="card-cat">${item.category}</span>
              ${stockBadgeHtml}
            </div>
            <h3 class="card-title" onclick="openProductModal('${item.id}')">${item.title}</h3>
            <div class="card-rating">
              <i class="fa-solid fa-star"></i>
              <span>${item.rating}</span>
              <span class="review-count">(${item.reviews})</span>
            </div>
            <div class="card-price-row">
              <div class="price-wrap">
                <span class="current-price">${formatPrice(item.price)}</span>
                ${item.oldPrice ? `<span class="old-price">${formatPrice(item.oldPrice)}</span>` : ''}
              </div>
              <button class="quick-add-btn ${isOutOfStock ? 'btn-disabled' : ''}" 
                      ${isOutOfStock ? 'disabled' : ''} 
                      onclick="quickAddToCart('${item.id}')">
                ${isOutOfStock ? 'Sold Out' : '+ Add'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  window.handlePreOrder = function (title, releaseDate) {
    if (!requireAuth('pre-order items')) return;
    showToast(`Pre-order registered for "${title}"! Dispatch alert set for ${releaseDate}.`, 'fa-solid fa-calendar-check');
  };

  function renderComingSoonGrid() {
    const grid = document.getElementById('comingsoonGrid');
    if (!grid) return;

    grid.innerHTML = comingSoonProducts.map(item => `
      <div class="product-card">
        <div class="card-image-wrap">
          <span class="product-badge pre-order">${item.badge}</span>
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="card-body">
          <span class="card-cat"><i class="fa-regular fa-calendar"></i> Dispatches ${item.releaseDate}</span>
          <h3 class="card-title">${item.title}</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 12px;">${item.description}</p>
          <div class="card-price-row">
            <div class="price-wrap">
              <span class="current-price">${formatPrice(item.price)}</span>
              <span class="old-price">${formatPrice(item.oldPrice)}</span>
            </div>
            <button class="hero-btn primary" style="font-size: 12px; padding: 8px 14px;" onclick="handlePreOrder('${item.title.replace(/'/g, "\\'")}', '${item.releaseDate}')">
              Pre-Order Now
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderExploreGrid() {
    const grid = document.getElementById('exploreGrid');
    if (!grid) return;

    grid.innerHTML = lookbookItems.map(item => `
      <div class="lookbook-card">
        <img src="${item.image}" alt="${item.title}" class="lookbook-img">
        <div class="lookbook-content">
          <span class="lookbook-tag">${item.tag}</span>
          <h3 class="lookbook-title">${item.title}</h3>
          <p class="lookbook-desc">${item.desc}</p>
          <button class="hero-btn secondary" style="color: #222; border-color: #222;" onclick="switchTab('instock')">
            Explore Collection <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // 7. PRODUCT DETAIL MODAL (#dis-box)
  // ==========================================
  window.openProductModal = function (productId) {
    const product = catalogProducts.find(p => p.id === productId);
    if (!product) return;

    state.currentProduct = product;
    state.currentSlide = 0;

    document.getElementById('modalCategory').textContent = product.category.toUpperCase();
    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalRatingText').textContent = `${product.rating} (${product.reviews} reviews)`;
    document.getElementById('modalPrice').textContent = formatPrice(product.price);
    document.getElementById('modalOldPrice').textContent = product.oldPrice ? formatPrice(product.oldPrice) : '';
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalFabricText').textContent = product.fabric;
    document.getElementById('qtyInput').value = 1;

    // Stock Status inside modal
    const stockStatusEl = document.getElementById('modalStockStatus');
    const addToCartBtn = document.getElementById('modalAddToCartBtn');
    const buyNowBtn = document.getElementById('modalBuyNowBtn');

    if (product.stock > 0) {
      stockStatusEl.className = 'stock-status in-stock';
      stockStatusEl.innerHTML = `<i class="fa-solid fa-check-circle"></i> In Stock (${product.stock} available)`;
      addToCartBtn.classList.remove('btn-disabled');
      addToCartBtn.removeAttribute('disabled');
      addToCartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Add to Bag`;
      buyNowBtn.classList.remove('btn-disabled');
      buyNowBtn.removeAttribute('disabled');
    } else {
      stockStatusEl.className = 'stock-status out-of-stock';
      stockStatusEl.style.color = '#dc2626';
      stockStatusEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Out of Stock`;
      addToCartBtn.classList.add('btn-disabled');
      addToCartBtn.setAttribute('disabled', 'true');
      addToCartBtn.innerHTML = `Out of Stock`;
      buyNowBtn.classList.add('btn-disabled');
      buyNowBtn.setAttribute('disabled', 'true');
    }

    // Color Swatches
    const colorsContainer = document.getElementById('modalColors');
    colorsContainer.innerHTML = product.colors.map((c, idx) => `
      <div class="modal-swatch ${idx === 0 ? 'active' : ''}" 
           style="background-color: ${c.hex};" 
           data-color="${c.name}"
           title="${c.name}"
           onclick="selectModalColor(this, '${c.name}')"></div>
    `).join('');
    document.getElementById('selectedColorName').textContent = product.colors[0]?.name || 'Standard';

    // Sizes
    const sizesContainer = document.getElementById('modalSizes');
    sizesContainer.innerHTML = product.sizes.map((s, idx) => `
      <button class="modal-size-btn ${idx === 0 ? 'active' : ''}" 
              data-size="${s}" 
              onclick="selectModalSize(this, '${s}')">${s}</button>
    `).join('');
    document.getElementById('selectedSizeName').textContent = product.sizes[0] || 'M';

    // Carousel
    const track = document.getElementById('carouselTrack');
    const thumbs = document.getElementById('carouselThumbs');

    track.innerHTML = product.images.map(img => `
      <div class="carousel-slide">
        <img src="${img}" alt="${product.title}">
      </div>
    `).join('');

    thumbs.innerHTML = product.images.map((img, idx) => `
      <img src="${img}" class="thumb-img ${idx === 0 ? 'active' : ''}" 
           onclick="setCarouselSlide(${idx})" alt="Thumb ${idx + 1}">
    `).join('');

    updateCarousel();

    const isWishlisted = state.wishlist.some(w => w.id === product.id);
    const wishBtn = document.getElementById('modalWishlistBtn');
    wishBtn.innerHTML = `<i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart" style="color: ${isWishlisted ? '#e53e3e' : '#222'};"></i>`;

    const modal = document.getElementById('dis-box');
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
  };

  function closeProductModal() {
    const modal = document.getElementById('dis-box');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }

  window.selectModalColor = function (el, name) {
    document.querySelectorAll('.modal-swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('selectedColorName').textContent = name;
  };

  window.selectModalSize = function (el, size) {
    document.querySelectorAll('.modal-size-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('selectedSizeName').textContent = size;
  };

  window.setCarouselSlide = function (index) {
    state.currentSlide = index;
    updateCarousel();
  };

  function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    track.style.transform = `translateX(-${state.currentSlide * 100}%)`;

    document.querySelectorAll('.thumb-img').forEach((t, i) => {
      t.classList.toggle('active', i === state.currentSlide);
    });
  }

  document.getElementById('prevImg')?.addEventListener('click', () => {
    if (!state.currentProduct) return;
    state.currentSlide = (state.currentSlide - 1 + state.currentProduct.images.length) % state.currentProduct.images.length;
    updateCarousel();
  });

  document.getElementById('nextImg')?.addEventListener('click', () => {
    if (!state.currentProduct) return;
    state.currentSlide = (state.currentSlide + 1) % state.currentProduct.images.length;
    updateCarousel();
  });

  document.getElementById('dis-Close')?.addEventListener('click', closeProductModal);

  // ==========================================
  // 8. SHOPPING BAG & WISHLIST LOGIC
  // ==========================================
  window.quickAddToCart = function (productId) {
    if (!requireAuth('add items to your bag')) return;
    const product = catalogProducts.find(p => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
      showToast(`Sorry, "${product.title}" is out of stock!`, 'fa-solid fa-circle-exclamation');
      return;
    }

    addToCart(product, 1, product.sizes[0] || 'M', product.colors[0]?.name || 'Standard');
  };

  function addToCart(product, qty = 1, size = 'M', color = 'Standard') {
    if (!requireAuth('add items to your bag')) return;
    if (product.stock < qty) {
      showToast(`Only ${product.stock} items available in stock!`, 'fa-solid fa-circle-exclamation');
      return;
    }

    const existingIndex = state.cart.findIndex(item =>
      item.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingIndex > -1) {
      if (state.cart[existingIndex].quantity + qty > product.stock) {
        showToast(`Cannot add more than remaining stock (${product.stock})`, 'fa-solid fa-circle-exclamation');
        return;
      }
      state.cart[existingIndex].quantity += qty;
    } else {
      state.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        selectedSize: size,
        selectedColor: color,
        quantity: qty,
        maxStock: product.stock
      });
    }

    saveState();
    showToast(`Added "${product.title}" to bag`, 'fa-solid fa-bag-shopping');
  }

  document.getElementById('modalAddToCartBtn')?.addEventListener('click', () => {
    if (!state.currentProduct) return;
    if (!requireAuth('add items to your bag')) return;
    const qty = parseInt(document.getElementById('qtyInput').value) || 1;
    const color = document.getElementById('selectedColorName').textContent;
    const size = document.getElementById('selectedSizeName').textContent;

    addToCart(state.currentProduct, qty, size, color);
    closeProductModal();
  });

  document.getElementById('modalBuyNowBtn')?.addEventListener('click', () => {
    if (!state.currentProduct) return;
    if (!requireAuth('proceed to buy')) return;
    const qty = parseInt(document.getElementById('qtyInput').value) || 1;
    const color = document.getElementById('selectedColorName').textContent;
    const size = document.getElementById('selectedSizeName').textContent;

    addToCart(state.currentProduct, qty, size, color);
    closeProductModal();
    openCheckoutModal();
  });

  function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    if (state.cart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <i class="fa-solid fa-basket-shopping" style="font-size: 48px; color: #ddd; margin-bottom: 14px;"></i>
          <h4 style="font-size: 16px; margin-bottom: 6px;">Your Shopping Bag is empty</h4>
          <p style="font-size: 13px; color: #888; margin-bottom: 20px;">Explore luxury garments and add items to your bag.</p>
          <button class="hero-btn primary" onclick="closeDrawer('cartDrawer'); switchTab('instock');" style="margin: 0 auto; background: #222; color: #fff !important; display: inline-flex; align-items: center; justify-content: center; padding: 12px 24px; border-radius: 30px; font-weight: 600;">
            <i class="fa-solid fa-bag-shopping" style="margin-right: 8px;"></i> Explore Collection
          </button>
        </div>
      `;
      document.getElementById('cartFooter').style.display = 'none';
      return;
    }

    document.getElementById('cartFooter').style.display = 'block';

    let subtotal = 0;
    container.innerHTML = state.cart.map((item, idx) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-meta">Size: ${item.selectedSize} | Color: ${item.selectedColor}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-qty-row">
              <div class="qty-picker mini">
                <button class="qty-btn" onclick="updateCartQty(${idx}, -1)">-</button>
                <input type="number" value="${item.quantity}" readonly>
                <button class="qty-btn" onclick="updateCartQty(${idx}, 1)">+</button>
              </div>
              <button class="remove-cart-item" onclick="removeCartItem(${idx})">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const discountAmount = subtotal * (state.discountPercent / 100);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('cartTotal').textContent = formatPrice(finalTotal);

    if (state.discountPercent > 0) {
      document.getElementById('discountRow').style.display = 'flex';
      document.getElementById('cartDiscount').textContent = `-${formatPrice(discountAmount)}`;
    } else {
      document.getElementById('discountRow').style.display = 'none';
    }
  }

  window.updateCartQty = function (index, change) {
    if (!state.cart[index]) return;
    const newQty = state.cart[index].quantity + change;

    if (newQty <= 0) {
      state.cart.splice(index, 1);
    } else {
      state.cart[index].quantity = newQty;
    }

    saveState();
    renderCart();
  };

  window.removeCartItem = function (index) {
    state.cart.splice(index, 1);
    saveState();
    renderCart();
  };

  // Wishlist
  window.toggleWishlist = function (productId) {
    if (!requireAuth('save items to your wishlist')) return;
    const product = catalogProducts.find(p => p.id === productId);
    if (!product) return;

    const index = state.wishlist.findIndex(w => w.id === productId);
    if (index > -1) {
      state.wishlist.splice(index, 1);
      showToast(`Removed "${product.title}" from Wishlist`, 'fa-regular fa-heart');
    } else {
      state.wishlist.push(product);
      showToast(`Saved "${product.title}" to Wishlist`, 'fa-solid fa-heart');
    }

    saveState();
    renderInStockGrid();
    renderWishlist();
    if (state.currentProduct && state.currentProduct.id === productId) {
      const wishBtn = document.getElementById('modalWishlistBtn');
      const isWish = state.wishlist.some(w => w.id === productId);
      if (wishBtn) wishBtn.innerHTML = `<i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart" style="color: ${isWish ? '#e53e3e' : '#222'};"></i>`;
    }
  };

  function renderWishlist() {
    const container = document.getElementById('wishlistItemsContainer');
    if (!container) return;

    if (state.wishlist.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <i class="fa-regular fa-heart" style="font-size: 48px; color: #ddd; margin-bottom: 14px;"></i>
          <h4 style="font-size: 16px; margin-bottom: 6px;">Your Wishlist is empty</h4>
          <p style="font-size: 13px; color: #888;">Heart items while browsing to save them for later.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = state.wishlist.map(item => `
      <div class="wishlist-item">
        <img src="${item.image}" alt="${item.title}" class="wishlist-img">
        <div class="wishlist-details">
          <h4 class="wishlist-title">${item.title}</h4>
          <div class="wishlist-price">${formatPrice(item.price)}</div>
          <div class="wishlist-actions">
            <button class="secondary-sm-btn" onclick="quickAddToCart('${item.id}')">Move to Bag</button>
            <button class="remove-cart-item" onclick="toggleWishlist('${item.id}')">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Promo Code
  document.getElementById('applyPromoBtn')?.addEventListener('click', () => {
    const code = document.getElementById('promoInput')?.value.trim().toUpperCase();
    const msg = document.getElementById('promoMessage');

    if (code === 'MON10') {
      state.appliedPromo = 'MON10';
      state.discountPercent = 10;
      if (msg) { msg.textContent = '10% Exclusive discount applied!'; msg.className = 'promo-success'; }
      showToast('Promo code MON10 applied!', 'fa-solid fa-tag');
    } else if (code === 'VIP20') {
      state.appliedPromo = 'VIP20';
      state.discountPercent = 20;
      if (msg) { msg.textContent = '20% VIP Member discount applied!'; msg.className = 'promo-success'; }
      showToast('20% VIP discount applied!', 'fa-solid fa-crown');
    } else {
      if (msg) { msg.textContent = 'Invalid promo code. Use code MON10 or VIP20.'; msg.className = 'promo-error'; }
    }
    renderCart();
  });

  // ==========================================
  // 9. CHECKOUT & ORDER SUBMISSION (SQL STOCK REDUCTION)
  // ==========================================
  function openCheckoutModal() {
    if (state.cart.length === 0) {
      showToast('Your bag is empty!', 'fa-solid fa-circle-exclamation');
      return;
    }

    closeDrawer('cartDrawer');
    renderCheckoutSummary();

    // Auto fill address if user is logged in
    updateAuthUI();

    document.getElementById('checkoutBackdrop').classList.add('active');
  }

  function closeCheckoutModal() {
    document.getElementById('checkoutBackdrop').classList.remove('active');
  }

  function renderCheckoutSummary() {
    const summaryContainer = document.getElementById('checkoutSummaryItems');
    if (!summaryContainer) return;

    let subtotal = 0;
    summaryContainer.innerHTML = state.cart.map(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      return `
        <div class="checkout-item-row">
          <span>${item.title} (x${item.quantity}) - ${item.selectedSize}</span>
          <strong>${formatPrice(itemTotal)}</strong>
        </div>
      `;
    }).join('');

    const discountAmount = subtotal * (state.discountPercent / 100);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    document.getElementById('coSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('coTotal').textContent = formatPrice(finalTotal);
  }

  document.getElementById('cartCheckoutBtn')?.addEventListener('click', openCheckoutModal);
  document.getElementById('checkoutCloseBtn')?.addEventListener('click', closeCheckoutModal);

  let appliedCoupon = null;

  document.getElementById('applyCouponBtn')?.addEventListener('click', async () => {
    const couponInput = document.getElementById('checkoutCouponCode');
    const code = couponInput ? couponInput.value.trim() : '';
    if (!code) {
      showToast('Please enter a coupon code', 'fa-solid fa-circle-exclamation');
      return;
    }

    let subtotal = state.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    try {
      const res = await fetch(`${API_BASE}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        appliedCoupon = data;
        document.getElementById('couponDiscountRow').classList.remove('hidden');
        document.getElementById('couponCodeLabel').textContent = data.code;
        document.getElementById('coDiscount').textContent = `-₹${data.discountAmount}`;
        const finalTotal = Math.max(0, subtotal - data.discountAmount);
        document.getElementById('coTotal').textContent = formatPrice(finalTotal);
        showToast(`Coupon "${data.code}" applied! Saved ₹${data.discountAmount}`, 'fa-solid fa-tag');
      } else {
        showToast(data.error || 'Invalid coupon code', 'fa-solid fa-circle-exclamation');
      }
    } catch (err) {
      showToast('Failed to validate coupon code', 'fa-solid fa-triangle-exclamation');
    }
  });
  // Submit Order Form to API -> Executes order placement & stock reduction directly
  document.getElementById('checkoutForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (state.cart.length === 0) {
      showToast('Your shopping bag is empty!', 'fa-solid fa-circle-exclamation');
      return;
    }

    const customerName = document.getElementById('checkoutName').value.trim();
    const customerEmail = document.getElementById('checkoutEmail').value.trim();
    const shippingAddress = document.getElementById('checkoutAddress').value.trim();
    const city = document.getElementById('checkoutCity').value.trim();
    const zip = document.getElementById('checkoutZip').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'Cash on Delivery';

    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Placing Order...`;
    }

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: state.cart,
          customerName,
          customerEmail,
          shippingAddress,
          city,
          zip,
          paymentMethod,
          userId: currentUser ? currentUser.id : null
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        state.cart = [];
        saveState();
        closeCheckoutModal();

        document.getElementById('confOrderId').textContent = data.orderId;
        document.getElementById('confDeliveryDate').textContent = data.deliveryEstimate || '3 - 5 Business Days';
        document.getElementById('confTotalAmount').textContent = formatPrice(data.totalAmount);

        await fetchDressesFromDB();
        if (currentUser) await fetchUserOrderHistory();

        document.getElementById('confirmationBackdrop').classList.add('active');
        showToast('Order confirmed! Stock updated in database.', 'fa-solid fa-circle-check');
      } else {
        showToast(data.error || 'Failed to place order', 'fa-solid fa-circle-exclamation');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      showToast('Network error during checkout', 'fa-solid fa-triangle-exclamation');
    } finally {
      if (placeOrderBtn) {
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = `<i class="fa-solid fa-truck-ramp-box"></i> Place Order (Cash on Delivery)`;
      }
    }
  });



  document.getElementById('continueShoppingBtn')?.addEventListener('click', () => {
    document.getElementById('confirmationBackdrop').classList.remove('active');
    switchTab('instock');
  });

  document.getElementById('viewOrdersBtn')?.addEventListener('click', () => {
    document.getElementById('confirmationBackdrop').classList.remove('active');
    openDrawer('accountDrawer');
  });

  function renderOrderHistory() {
    const container = document.getElementById('orderHistoryContainer');
    if (!container) return;

    if (!state.orders || state.orders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #888;">
          <i class="fa-solid fa-clock-rotate-left" style="font-size: 36px; color: #ccc; margin-bottom: 10px;"></i>
          <p style="font-size: 14px;">No order history found for this account.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = state.orders.map(order => `
      <div class="order-card" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 6px;">
          <span>${order.id}</span>
          <span style="color: #16a34a;"><i class="fa-solid fa-circle-check"></i> ${order.status.toUpperCase()}</span>
        </div>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">
          Placed on: ${new Date(order.created_at || Date.now()).toLocaleDateString()} | Paid: ${formatPrice(order.total_amount)}
        </div>
        <div style="font-size: 12px; border-top: 1px dashed #cbd5e1; padding-top: 8px;">
          ${(order.items || []).map(i => `<div>• ${i.title} (${i.size}) x${i.quantity} - ${formatPrice(i.price * i.quantity)}</div>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // 10. ADMIN INVENTORY DASHBOARD CONTROLS
  // ==========================================
  function renderAdminInventoryTable() {
    const tableBody = document.getElementById('adminInventoryTableBody');
    const totalDisplay = document.getElementById('adminTotalCountDisplay');
    if (!tableBody) return;

    const lowStockCount = catalogProducts.filter(p => p.stock <= 5).length;
    if (totalDisplay) {
      totalDisplay.innerHTML = `Total Catalog Garments: <strong>${catalogProducts.length}</strong> | <span style="color: #d97706;">Low/Out Stock Alert: ${lowStockCount} items</span>`;
    }

    tableBody.innerHTML = catalogProducts.map(p => {
      let badgeClass = 'high-stock';
      let statusText = 'Optimal Stock';
      if (p.stock === 0) {
        badgeClass = 'out-of-stock';
        statusText = 'OUT OF STOCK';
      } else if (p.stock <= 5) {
        badgeClass = 'low-stock';
        statusText = 'Low Stock Alert';
      }

      return `
        <tr>
          <td><img src="${p.image}" alt="${p.title}" class="admin-item-thumb"></td>
          <td>
            <strong>${p.title}</strong>
            <div style="font-size: 11px; color: #64748b;">ID: ${p.id} | Category: ${p.category}</div>
          </td>
          <td><strong>${formatPrice(p.price)}</strong></td>
          <td><strong style="font-size: 16px;">${p.stock}</strong></td>
          <td><span class="stock-badge ${badgeClass}">${statusText}</span></td>
          <td>
            <div class="stock-control-group">
              <button class="stock-add-btn" onclick="replenishDressStock('${p.id}', 1)">+1 Qty</button>
              <button class="stock-add-btn" onclick="replenishDressStock('${p.id}', 5)">+5 Qty</button>
              <button class="stock-add-btn" onclick="replenishDressStock('${p.id}', 10)">+10 Qty</button>
              <button class="action-icon-btn edit-btn" onclick="openEditDressModal('${p.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="action-icon-btn delete-btn" onclick="deleteDressItem('${p.id}')" title="Delete Garment"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.replenishDressStock = async function (dressId, addQuantity) {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/dresses/${dressId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ addQuantity })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Stock updated! Added +${addQuantity} to ${data.dress.title}`, 'fa-solid fa-boxes-stacked');
        await fetchDressesFromDB();
      } else {
        showToast(data.error || 'Failed to update stock', 'fa-solid fa-circle-exclamation');
      }
    } catch (err) {
      showToast('Error updating inventory', 'fa-solid fa-triangle-exclamation');
    }
  };

  // Open & Populate Edit Dress Modal
  window.openEditDressModal = function (dressId) {
    const dress = catalogProducts.find(p => p.id === dressId);
    if (!dress) return;

    document.getElementById('editDressId').value = dress.id;
    document.getElementById('editDressTitle').value = dress.title;
    document.getElementById('editDressCategory').value = dress.category;
    document.getElementById('editDressPrice').value = dress.price;
    document.getElementById('editDressStock').value = dress.stock;
    document.getElementById('editDressImage').value = dress.image;
    document.getElementById('editDressImagePreview').src = dress.image;
    document.getElementById('editDressFabric').value = dress.fabric || '';
    document.getElementById('editDressBadge').value = dress.badge || '';
    document.getElementById('editDressDesc').value = dress.description || '';

    document.getElementById('editDressBackdrop').classList.add('active');
  };

  function closeEditDressModal() {
    document.getElementById('editDressBackdrop')?.classList.remove('active');
  }

  // Handle Edit Dress Form Submission
  document.getElementById('editDressForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!authToken) return;

    const id = document.getElementById('editDressId').value;
    const title = document.getElementById('editDressTitle').value.trim();
    const category = document.getElementById('editDressCategory').value;
    const price = parseFloat(document.getElementById('editDressPrice').value);
    const stock = parseInt(document.getElementById('editDressStock').value);
    const image = document.getElementById('editDressImage').value.trim();
    const fabric = document.getElementById('editDressFabric').value.trim();
    const badge = document.getElementById('editDressBadge').value.trim();
    const description = document.getElementById('editDressDesc').value.trim();

    try {
      const res = await fetch(`${API_BASE}/api/admin/dresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ title, category, price, stock, image, fabric, badge, description })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Updated "${title}" in MongoDB Atlas!`, 'fa-solid fa-check-circle');
        closeEditDressModal();
        await fetchDressesFromDB();
      } else {
        showToast(data.error || 'Failed to update item', 'fa-solid fa-circle-exclamation');
      }
    } catch (err) {
      showToast('Error updating item in database', 'fa-solid fa-triangle-exclamation');
    }
  });

  // Handle Delete Dress Item
  window.deleteDressItem = async function (dressId) {
    if (!authToken) return;
    const dress = catalogProducts.find(p => p.id === dressId);
    if (!confirm(`Are you sure you want to delete "${dress ? dress.title : dressId}" from MongoDB Atlas catalog?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/dresses/${dressId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();

      if (res.ok) {
        showToast(`Garment deleted from catalog`, 'fa-solid fa-trash');
        await fetchDressesFromDB();
      } else {
        showToast(data.error || 'Failed to delete dress', 'fa-solid fa-circle-exclamation');
      }
    } catch (err) {
      showToast('Error deleting dress from database', 'fa-solid fa-triangle-exclamation');
    }
  };

  // Photo File Uploader & Live Preview Handlers
  document.getElementById('newDressImageFile')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        document.getElementById('newDressImage').value = evt.target.result;
        document.getElementById('newDressImagePreview').src = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('newDressImage')?.addEventListener('input', (e) => {
    document.getElementById('newDressImagePreview').src = e.target.value || 'images/whitedress.jpeg';
  });

  document.getElementById('editDressImageFile')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        document.getElementById('editDressImage').value = evt.target.result;
        document.getElementById('editDressImagePreview').src = evt.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('editDressImage')?.addEventListener('input', (e) => {
    document.getElementById('editDressImagePreview').src = e.target.value;
  });

  document.getElementById('editDressCloseBtn')?.addEventListener('click', closeEditDressModal);

  // Add New Dress Form submission
  document.getElementById('addDressForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!authToken) return;

    const title = document.getElementById('newDressTitle').value.trim();
    const category = document.getElementById('newDressCategory').value;
    const price = parseFloat(document.getElementById('newDressPrice').value);
    const stock = parseInt(document.getElementById('newDressStock').value) || 10;
    const image = document.getElementById('newDressImage').value.trim() || 'images/whitedress.jpeg';
    const fabric = document.getElementById('newDressFabric')?.value.trim() || '';
    const badge = document.getElementById('newDressBadge')?.value.trim() || 'New Arrival';
    const description = document.getElementById('newDressDesc').value.trim();

    try {
      const res = await fetch(`${API_BASE}/api/admin/dresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ title, category, price, stock, image, fabric, badge, description })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`Garment "${title}" & photos saved to MongoDB Atlas!`, 'fa-solid fa-sparkles');
        document.getElementById('addDressForm').reset();
        document.getElementById('newDressImagePreview').src = 'images/whitedress.jpeg';
        await fetchDressesFromDB();

        // Switch to inventory tab
        document.querySelectorAll('.admin-nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('.admin-nav-tab[data-admin-tab="inventory"]')?.classList.add('active');
        document.getElementById('adminTabInventory')?.classList.remove('hidden');
        document.getElementById('adminTabAddDress')?.classList.add('hidden');
      } else {
        showToast(data.error || 'Failed to add dress', 'fa-solid fa-circle-exclamation');
      }
    } catch (err) {
      showToast('Error saving dress to database', 'fa-solid fa-triangle-exclamation');
    }
  });

  // ==========================================
  // 10B. ADMIN DASHBOARD STATS & BULK GARMENT IMPORT
  // ==========================================
  let adminOrdersList = [];

  function updateAdminStatsDashboard() {
    const totalItems = catalogProducts.length;
    const lowStock = catalogProducts.filter(p => p.stock <= 5).length;
    const totalStock = catalogProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalOrders = adminOrdersList.length;

    const elItems = document.getElementById('statTotalItems');
    const elLow = document.getElementById('statLowStock');
    const elStock = document.getElementById('statTotalStock');
    const elOrders = document.getElementById('statTotalOrders');

    if (elItems) elItems.textContent = totalItems;
    if (elLow) elLow.textContent = lowStock;
    if (elStock) elStock.textContent = totalStock;
    if (elOrders) elOrders.textContent = totalOrders;
  }

  async function fetchAdminOrders() {
    if (!authToken || !currentUser || currentUser.role !== 'admin') return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok && data.orders) {
        adminOrdersList = data.orders;
        renderAdminOrdersTable();
        updateAdminStatsDashboard();
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    }
  }

  function renderAdminOrdersTable() {
    const tableBody = document.getElementById('adminOrdersTableBody');
    const countDisplay = document.getElementById('adminOrderCountDisplay');
    if (!tableBody) return;

    if (countDisplay) {
      countDisplay.innerHTML = `Total Store Orders: <strong>${adminOrdersList.length}</strong>`;
    }

    if (adminOrdersList.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #64748b;">No customer orders placed yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = adminOrdersList.map(o => {
      const itemsSummary = (o.items || []).map(i => `${i.title} (${i.quantity}x)`).join(', ');
      const status = o.status || 'completed';
      const orderId = o.orderId || o.id;

      return `
        <tr>
          <td><strong>${orderId}</strong></td>
          <td>
            <strong>${o.customerName}</strong>
            <div style="font-size: 11px; color: #64748b;">${o.customerEmail}</div>
          </td>
          <td style="max-width: 200px; font-size: 12px; color: #334155;">${itemsSummary}</td>
          <td><strong>${formatPrice(o.totalAmount)}</strong></td>
          <td><span class="badge" style="font-size: 11px;">${o.paymentMethod || 'COD'}</span></td>
          <td>
            <select class="status-select" onchange="updateOrderStatus('${orderId}', this.value)">
              <option value="completed" ${status.toLowerCase() === 'completed' ? 'selected' : ''}>Completed</option>
              <option value="SHIPPED" ${status === 'SHIPPED' ? 'selected' : ''}>Shipped</option>
              <option value="DELIVERED" ${status === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.updateOrderStatus = async function (orderId, newStatus) {
    if (!authToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Order ${orderId} status set to "${newStatus}"`, 'fa-solid fa-truck-ramp-box');
        await fetchAdminOrders();
      } else {
        showToast(data.error || 'Failed to update order status', 'fa-solid fa-circle-exclamation');
      }
    } catch (err) {
      showToast('Error updating order status', 'fa-solid fa-triangle-exclamation');
    }
  };

  // Bulk Import Handlers
  function getSampleGarmentsPayload() {
    return [
      {
        "title": "Vintage Silk Corset Top",
        "category": "shirt",
        "price": 1450,
        "stock": 10,
        "badge": "New Arrival",
        "image": "images/bowtop.jpeg",
        "fabric": "100% Silk Satin",
        "description": "Exquisite handcrafted silk corset top with delicate lace trimming."
      },
      {
        "title": "Pastel Pleated Skirt",
        "category": "dress",
        "price": 1650,
        "stock": 8,
        "badge": "Bestseller",
        "image": "images/butter.png",
        "fabric": "Chiffon & Rayon",
        "description": "High-waisted lightweight pleated midi skirt."
      }
    ];
  }

  function downloadSampleJsonTemplate() {
    const sampleData = JSON.stringify(getSampleGarmentsPayload(), null, 2);
    const blob = new Blob([sampleData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_garments_import.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded sample JSON template', 'fa-solid fa-download');
  }

  function parseAndValidateBulkPayload() {
    const textarea = document.getElementById('bulkJsonTextarea');
    const statusText = document.getElementById('bulkStatusText');
    if (!textarea || !statusText) return null;

    const rawText = textarea.value.trim();
    if (!rawText) {
      statusText.innerHTML = `<i class="fa-solid fa-circle-info"></i> Please paste JSON data or choose a file to parse.`;
      return null;
    }

    try {
      const parsed = JSON.parse(rawText);
      const items = Array.isArray(parsed) ? parsed : (parsed.dresses || [parsed]);
      const validItems = items.filter(item => item && item.title && item.category && item.price && item.image);

      if (validItems.length === 0) {
        statusText.innerHTML = `<span style="color: #dc2626;"><i class="fa-solid fa-triangle-exclamation"></i> Invalid payload. Each garment must include title, category, price, and image.</span>`;
        return null;
      }

      statusText.innerHTML = `<span style="color: #16a34a; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Valid Payload: Ready to import <strong>${validItems.length}</strong> garment item(s)!</span>`;
      return validItems;
    } catch (e) {
      statusText.innerHTML = `<span style="color: #dc2626;"><i class="fa-solid fa-triangle-exclamation"></i> Syntax Error in JSON: ${e.message}</span>`;
      return null;
    }
  }

  async function handleBulkImportSubmit() {
    if (!authToken) {
      showToast('Admin token required', 'fa-solid fa-lock');
      return;
    }

    const itemsToImport = parseAndValidateBulkPayload();
    if (!itemsToImport) {
      showToast('Please validate a valid JSON payload before submitting', 'fa-solid fa-triangle-exclamation');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/dresses/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ dresses: itemsToImport })
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message || `Successfully imported ${data.insertedCount} garments!`, 'fa-solid fa-sparkles');
        document.getElementById('bulkJsonTextarea').value = '';
        document.getElementById('bulkJsonFileInput').value = '';
        document.getElementById('bulkStatusText').innerHTML = `<i class="fa-solid fa-circle-info"></i> Ready for next bulk payload.`;

        await fetchDressesFromDB();

        document.querySelectorAll('.admin-nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('.admin-nav-tab[data-admin-tab="inventory"]')?.classList.add('active');
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById('adminTabInventory')?.classList.remove('hidden');
        renderAdminInventoryTable();
      } else {
        showToast(data.error || 'Bulk import failed', 'fa-solid fa-circle-exclamation');
      }
    } catch (err) {
      showToast('Network error during bulk import', 'fa-solid fa-triangle-exclamation');
    }
  }

  // ==========================================
  // 11. CUSTOMIZER STUDIO
  // ==========================================
  function updateCustomizerPreview() {
    const svgBody = document.getElementById('svgGarmentBody');
    const svgDetails = document.getElementById('svgGarmentDetails');
    const textDisplay = document.getElementById('customTextDisplay');
    const customPrice = document.getElementById('customPrice');
    const btnCustomPrice = document.getElementById('btnCustomPrice');

    if (svgPathMap[state.customizer.garment]) {
      if (svgBody) svgBody.setAttribute('d', svgPathMap[state.customizer.garment].body);
      if (svgDetails) svgDetails.setAttribute('d', svgPathMap[state.customizer.garment].details);
    }

    if (svgBody) svgBody.setAttribute('fill', state.customizer.color);

    if (textDisplay) {
      textDisplay.textContent = state.customizer.text || '';
      textDisplay.style.fontFamily = state.customizer.font;
      textDisplay.style.color = state.customizer.textColor;
    }

    if (customPrice) customPrice.textContent = formatPrice(state.customizer.price);
    if (btnCustomPrice) btnCustomPrice.textContent = formatPrice(state.customizer.price);
  }

  document.querySelectorAll('.garment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.garment-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.customizer.garment = e.currentTarget.dataset.garment;
      state.customizer.price = parseFloat(e.currentTarget.dataset.price);
      updateCustomizerPreview();
    });
  });

  document.querySelectorAll('#customColorOptions .color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#customColorOptions .color-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.customizer.color = e.currentTarget.dataset.color;
      updateCustomizerPreview();
    });
  });

  document.getElementById('customTextInput')?.addEventListener('input', (e) => {
    state.customizer.text = e.target.value;
    updateCustomizerPreview();
  });

  document.getElementById('customFontSelect')?.addEventListener('change', (e) => {
    state.customizer.font = e.target.value;
    updateCustomizerPreview();
  });

  document.getElementById('customTextColor')?.addEventListener('input', (e) => {
    state.customizer.textColor = e.target.value;
    updateCustomizerPreview();
  });

  document.querySelectorAll('#customSizeOptions .size-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('#customSizeOptions .size-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.customizer.size = e.currentTarget.dataset.size;
    });
  });

  document.getElementById('addCustomToCartBtn')?.addEventListener('click', () => {
    const customItem = {
      id: `custom-${Date.now()}`,
      title: `Custom Couture ${state.customizer.garment.toUpperCase()} ("${state.customizer.text}")`,
      price: state.customizer.price,
      image: state.customizer.garment === 'hoodie' ? 'images/hoodie_1.png' :
        state.customizer.garment === 'jacket' ? 'images/jacket_1.png' : 'images/1.jpeg',
      selectedSize: state.customizer.size,
      selectedColor: `Custom (${state.customizer.color})`,
      quantity: 1,
      maxStock: 99
    };

    state.cart.push(customItem);
    saveState();
    showToast('Custom bespoke design added to your Shopping Bag!', 'fa-solid fa-wand-magic-sparkles');
    openDrawer('cartDrawer');
  });

  // ==========================================
  // 12. NAVIGATION & MODAL LISTENERS
  // ==========================================
  window.resetAllFilters = function () {
    state.categoryFilter = 'all';
    state.search = '';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    document.getElementById('clearSearch')?.classList.add('hidden');
    document.querySelectorAll('.cat-link').forEach(l => l.classList.remove('active'));
    document.querySelector('.cat-link[data-cat="all"]')?.classList.add('active');
    renderInStockGrid();
  };

  function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.currentTarget.dataset.tab;
        switchTab(target);
      });
    });

    // Home sidebar link
    document.getElementById('homeNavBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab('instock');
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.getElementById('homeNavBtn').classList.add('active');
    });

    // Category links
    document.querySelectorAll('.cat-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.cat-link').forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.categoryFilter = e.currentTarget.dataset.cat;
        switchTab('instock');
        renderInStockGrid();
      });
    });

    // Search bar
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');

    searchInput?.addEventListener('input', (e) => {
      state.search = e.target.value.trim();
      if (state.search) {
        clearSearch?.classList.remove('hidden');
      } else {
        clearSearch?.classList.add('hidden');
      }
      switchTab('instock');
      renderInStockGrid();
    });

    clearSearch?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      state.search = '';
      clearSearch.classList.add('hidden');
      renderInStockGrid();
    });

    document.getElementById('sortSelect')?.addEventListener('change', (e) => {
      state.sort = e.target.value;
      renderInStockGrid();
    });

    document.getElementById('resetFiltersBtn')?.addEventListener('click', resetAllFilters);

    // Mobile Menu
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
      document.getElementById('leftMenu').classList.toggle('active');
    });

    // Drawers
    document.getElementById('cartTrigger')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!requireAuth('view your shopping bag')) return;
      openDrawer('cartDrawer');
    });
    document.getElementById('mobileCartBtn')?.addEventListener('click', () => {
      if (!requireAuth('view your shopping bag')) return;
      openDrawer('cartDrawer');
    });
    document.getElementById('cartCloseBtn')?.addEventListener('click', () => { closeDrawer('cartDrawer'); });
    document.getElementById('cartBackdrop')?.addEventListener('click', () => { closeDrawer('cartDrawer'); });

    document.getElementById('wishlistTrigger')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!requireAuth('view your saved wishlist')) return;
      openDrawer('wishlistDrawer');
      renderWishlist();
    });
    document.getElementById('mobileWishlistBtn')?.addEventListener('click', () => {
      if (!requireAuth('view your saved wishlist')) return;
      openDrawer('wishlistDrawer');
      renderWishlist();
    });
    document.getElementById('wishlistCloseBtn')?.addEventListener('click', () => { closeDrawer('wishlistDrawer'); });
    document.getElementById('wishlistBackdrop')?.addEventListener('click', () => { closeDrawer('wishlistDrawer'); });

    document.getElementById('accountTrigger')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!requireAuth('access your member account')) return;
      openDrawer('accountDrawer');
    });
    document.getElementById('accountCloseBtn')?.addEventListener('click', () => { closeDrawer('accountDrawer'); });
    document.getElementById('accountBackdrop')?.addEventListener('click', () => { closeDrawer('accountDrawer'); });

    // Account Drawer Tab Switching (Order History vs Saved Address)
    document.querySelectorAll('.acc-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = tabBtn.dataset.accTab;
        document.querySelectorAll('.acc-tab').forEach(b => b.classList.remove('active'));
        tabBtn.classList.add('active');

        if (target === 'orders') {
          document.getElementById('accOrdersTab')?.classList.remove('hidden');
          document.getElementById('accAddressesTab')?.classList.add('hidden');
        } else if (target === 'addresses') {
          document.getElementById('accOrdersTab')?.classList.add('hidden');
          document.getElementById('accAddressesTab')?.classList.remove('hidden');
        }
      });
    });

    document.getElementById('checkoutBackdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'checkoutBackdrop') closeCheckoutModal();
    });

    // Direct Login Buttons
    document.getElementById('directLoginNavBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentUser) {
        openDrawer('accountDrawer');
      } else {
        openAuthModal();
      }
    });

    document.getElementById('mobileLoginBtn')?.addEventListener('click', () => {
      if (currentUser) {
        openDrawer('accountDrawer');
      } else {
        openAuthModal();
      }
    });

    // Auth Modal Handlers
    document.getElementById('openAuthModalBtn')?.addEventListener('click', openAuthModal);
    document.getElementById('authCloseBtn')?.addEventListener('click', closeAuthModal);
    document.getElementById('authBackdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'authBackdrop') closeAuthModal();
    });

    document.getElementById('authTabLogin')?.addEventListener('click', () => switchAuthTab('login'));
    document.getElementById('authTabRegister')?.addEventListener('click', () => switchAuthTab('register'));

    document.getElementById('loginForm')?.addEventListener('submit', handleLoginSubmit);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegisterSubmit);
    document.getElementById('regPassword')?.addEventListener('input', (e) => updatePasswordChecklistUI(e.target.value));
    document.getElementById('savedAddressForm')?.addEventListener('submit', handleSaveAddressSubmit);
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);

    // Quick Demo logins
    document.getElementById('demoCustomerBtn')?.addEventListener('click', () => {
      document.getElementById('loginEmail').value = 'customer@visionsbymon.com';
      document.getElementById('loginPassword').value = 'user123';
      switchAuthTab('login');
    });

    document.getElementById('demoAdminBtn')?.addEventListener('click', () => {
      document.getElementById('loginEmail').value = 'admin@visionsbymon.com';
      document.getElementById('loginPassword').value = 'admin123';
      switchAuthTab('login');
    });

    // Admin Modal Handlers
    document.getElementById('adminNavBtn')?.addEventListener('click', (e) => { e.preventDefault(); openAdminModal(); });
    document.getElementById('drawerAdminBtn')?.addEventListener('click', () => { closeDrawer('accountDrawer'); openAdminModal(); });
    document.getElementById('adminCloseBtn')?.addEventListener('click', closeAdminModal);
    document.getElementById('adminBackdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'adminBackdrop') closeAdminModal();
    });

    document.getElementById('refreshAdminStockBtn')?.addEventListener('click', async () => {
      await fetchDressesFromDB();
      showToast('Inventory synced with database', 'fa-solid fa-rotate');
    });

    document.querySelectorAll('.admin-nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.currentTarget.dataset.adminTab;
        document.querySelectorAll('.admin-nav-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');

        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.add('hidden'));

        if (target === 'inventory') {
          document.getElementById('adminTabInventory')?.classList.remove('hidden');
          renderAdminInventoryTable();
        } else if (target === 'add-dress') {
          document.getElementById('adminTabAddDress')?.classList.remove('hidden');
        } else if (target === 'bulk-add') {
          document.getElementById('adminTabBulkAdd')?.classList.remove('hidden');
        } else if (target === 'orders') {
          document.getElementById('adminTabOrders')?.classList.remove('hidden');
          fetchAdminOrders();
        }
      });
    });

    document.getElementById('downloadSampleJsonBtn')?.addEventListener('click', downloadSampleJsonTemplate);
    document.getElementById('validateBulkJsonBtn')?.addEventListener('click', parseAndValidateBulkPayload);
    document.getElementById('submitBulkImportBtn')?.addEventListener('click', handleBulkImportSubmit);
    document.getElementById('refreshAdminOrdersBtn')?.addEventListener('click', async () => {
      await fetchAdminOrders();
      showToast('Customer orders refreshed', 'fa-solid fa-rotate');
    });

    document.getElementById('bulkJsonFileInput')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          document.getElementById('bulkJsonTextarea').value = evt.target.result;
          parseAndValidateBulkPayload();
        };
        reader.readAsText(file);
      }
    });


    // Hero buttons
    document.getElementById('heroShopBtn')?.addEventListener('click', () => switchTab('instock'));

    // Size Guide modal
    document.getElementById('sizeGuideBtn')?.addEventListener('click', () => {
      document.getElementById('sizeGuideBackdrop').classList.add('active');
    });
    document.getElementById('sizeGuideCloseBtn')?.addEventListener('click', () => {
      document.getElementById('sizeGuideBackdrop').classList.remove('active');
    });

    // Quantity +/-
    document.getElementById('qtyMinus')?.addEventListener('click', () => {
      const input = document.getElementById('qtyInput');
      let val = parseInt(input.value) || 1;
      if (val > 1) input.value = val - 1;
    });

    document.getElementById('qtyPlus')?.addEventListener('click', () => {
      const input = document.getElementById('qtyInput');
      let val = parseInt(input.value) || 1;
      if (val < 10) input.value = val + 1;
    });

    // Modal Wishlist Button
    document.getElementById('modalWishlistBtn')?.addEventListener('click', () => {
      if (!state.currentProduct) return;
      toggleWishlist(state.currentProduct.id);
    });

    // ESC Key listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeProductModal();
        closeDrawer('cartDrawer');
        closeDrawer('wishlistDrawer');
        closeDrawer('accountDrawer');
        closeCheckoutModal();
        closeAuthModal();
        closeAdminModal();
        document.getElementById('sizeGuideBackdrop')?.classList.remove('active');
      }
    });
  }

  function openAuthModal() {
    closeProductModal();
    const dressModal = document.getElementById('dis-box');
    if (dressModal) {
      dressModal.classList.add('hidden');
      dressModal.setAttribute('aria-hidden', 'true');
    }
    closeDrawer('accountDrawer');
    closeDrawer('cartDrawer');
    closeDrawer('wishlistDrawer');
    closeCheckoutModal();
    clearAuthFields();
    document.getElementById('authBackdrop')?.classList.add('active');
  }

  function closeAuthModal() {
    clearAuthFields();
    document.getElementById('authBackdrop')?.classList.remove('active');
  }

  function switchAuthTab(tab) {
    if (tab === 'login') {
      document.getElementById('authTabLogin')?.classList.add('active');
      document.getElementById('authTabRegister')?.classList.remove('active');
      document.getElementById('loginForm')?.classList.remove('hidden');
      document.getElementById('registerForm')?.classList.add('hidden');
    } else {
      document.getElementById('authTabRegister')?.classList.add('active');
      document.getElementById('authTabLogin')?.classList.remove('active');
      document.getElementById('registerForm')?.classList.remove('hidden');
      document.getElementById('loginForm')?.classList.add('hidden');
    }
  }

  async function openAdminModal() {
    if (!currentUser || currentUser.role !== 'admin' || !currentUser.email || currentUser.email.toLowerCase() !== 'admin@visionsbymon.com') {
      showToast('Admin panel access is strictly restricted to administrator (admin@visionsbymon.com)', 'fa-solid fa-lock');
      return;
    }
    renderAdminInventoryTable();
    await fetchAdminOrders();
    updateAdminStatsDashboard();
    document.getElementById('adminBackdrop')?.classList.add('active');
  }

  function closeAdminModal() {
    document.getElementById('adminBackdrop')?.classList.remove('active');
  }

  window.switchTab = function (tabName) {
    state.activeTab = tabName;

    document.querySelectorAll('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === tabName);
    });

    document.querySelectorAll('.content-panel').forEach(p => {
      p.classList.toggle('hidden', p.id !== tabName);
    });
  };

  function openDrawer(drawerId) {
    const backdropId = drawerId.replace('Drawer', 'Backdrop');
    document.getElementById(drawerId)?.classList.add('active');
    document.getElementById(backdropId)?.classList.add('active');
    if (drawerId === 'cartDrawer') renderCart();
    if (drawerId === 'wishlistDrawer') renderWishlist();
  }

  function closeDrawer(drawerId) {
    const backdropId = drawerId.replace('Drawer', 'Backdrop');
    document.getElementById(drawerId)?.classList.remove('active');
    document.getElementById(backdropId)?.classList.remove('active');
  }

  init();
});
