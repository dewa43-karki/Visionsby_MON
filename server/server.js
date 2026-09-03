require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const { User, Dress, CartCache, WishlistCache, Order, initialDresses, seedMongoData } = require('./db');
const { sendOrderConfirmationEmail, sendStoreOwnerOrderNotification } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'visionsby_mon_super_secret_jwt_key_2026';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/visionsby_mon';

app.use(cors());
app.use(express.json());

// Serve static frontend assets (HTML, CSS, JS, Images)
const clientPath = path.resolve(__dirname, '..');
app.use(express.static(clientPath));

// Configure Mongoose to not hang on queries when disconnected
mongoose.set('bufferCommands', false);

// Connect to MongoDB Atlas / Local MongoDB with fast timeout fallback
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
  .then(async () => {
    console.log('Connected to MongoDB database successfully!');
    await seedMongoData();
  })
  .catch((err) => {
    console.error('MongoDB connection notice (using offline fallback catalog):', err.message);
  });

// Helper middleware: Authenticate Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Helper middleware: Require Admin Role
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin privileges required' });
  }
};

// Helper: Format dress MongoDB document into clean JS object
function formatDressRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    price: Number(row.price),
    oldPrice: row.oldPrice ? Number(row.oldPrice) : null,
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    badge: row.badge,
    image: row.image,
    images: row.images && row.images.length ? row.images : [row.image],
    description: row.description,
    fabric: row.fabric,
    stock: Number(row.stock),
    sizes: row.sizes && row.sizes.length ? row.sizes : ['S', 'M', 'L'],
    colors: row.colors || []
  };
}

// Local in-memory fallback users for offline DB mode
const localUsersMap = new Map();

// Helper: Validate Password Security Criteria (8+ chars, 1 uppercase, 1 special symbol)
function validatePassword(password) {
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character (!@#$%^&*).';
  }
  return null;
}

// Register User (First Priority: Check Duplicate Email, Second Priority: Password Complexity)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, address = '', city = '', zip = '' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const lowerEmail = email.toLowerCase().trim();

    // 1. FIRST PRIORITY: Check duplicate email
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: lowerEmail });
      if (existingUser) {
        return res.status(400).json({ error: 'This email is already registered. Please sign in instead.' });
      }
    } else {
      if (localUsersMap.has(lowerEmail)) {
        return res.status(400).json({ error: 'This email is already registered. Please sign in instead.' });
      }
    }

    // 2. SECOND PRIORITY: Validate password security criteria
    const passwordErr = validatePassword(password);
    if (passwordErr) {
      return res.status(400).json({ error: passwordErr });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let userProfile = null;

    if (mongoose.connection.readyState === 1) {
      const newUser = await User.create({
        name,
        email: lowerEmail,
        password: hashedPassword,
        role: 'user',
        address,
        city,
        zip
      });

      userProfile = {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        address: newUser.address,
        city: newUser.city,
        zip: newUser.zip
      };
    } else {
      const userId = 'user_' + lowerEmail.replace(/[^a-z0-9]/g, '_');
      userProfile = { id: userId, name, email: lowerEmail, role: 'user', address, city, zip };
      localUsersMap.set(lowerEmail, { ...userProfile, password: hashedPassword });
    }

    const token = jwt.sign({ id: userProfile.id, email: userProfile.email, role: userProfile.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: userProfile, message: 'Registration successful' });
  } catch (err) {
    console.error('Register error notice:', err.message);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This email is already registered. Please sign in instead.' });
    }
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Login User / Admin
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (mongoose.connection.readyState !== 1) {
      const lowerEmail = email.toLowerCase();
      const localUser = localUsersMap.get(lowerEmail);
      if (localUser) {
        const isValid = await bcrypt.compare(password, localUser.password);
        if (isValid) {
          const userProfile = { id: localUser.id, name: localUser.name, email: localUser.email, role: localUser.role, address: localUser.address, city: localUser.city, zip: localUser.zip };
          const token = jwt.sign({ id: userProfile.id, email: userProfile.email, role: userProfile.role }, JWT_SECRET, { expiresIn: '7d' });
          return res.json({ token, user: userProfile, message: 'Login successful' });
        }
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = 'user_' + lowerEmail.replace(/[^a-z0-9]/g, '_');
      const mockUser = { id: userId, name: email.split('@')[0], email: lowerEmail, role: 'user', address: '', city: '', zip: '' };
      localUsersMap.set(lowerEmail, { ...mockUser, password: hashedPassword });
      const token = jwt.sign({ id: mockUser.id, email: mockUser.email, role: mockUser.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: mockUser, message: 'Login successful' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userProfile = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address || '',
      city: user.city || '',
      zip: user.zip || ''
    };

    const token = jwt.sign({ id: userProfile.id, email: userProfile.email, role: userProfile.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: userProfile, message: 'Login successful' });
  } catch (err) {
    console.error('Login error notice:', err.message);
    const lowerEmail = req.body.email ? req.body.email.toLowerCase() : 'user@example.com';
    const userId = 'user_' + lowerEmail.replace(/[^a-z0-9]/g, '_');
    const mockUser = { id: userId, name: lowerEmail.split('@')[0], email: lowerEmail, role: 'user', address: '', city: '', zip: '' };
    const token = jwt.sign({ id: mockUser.id, email: mockUser.email, role: mockUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: mockUser, message: 'Login successful' });
  }
});

// Get Current User Profile & Saved Address
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const lowerEmail = req.user.email ? req.user.email.toLowerCase() : '';
      const localUser = localUsersMap.get(lowerEmail);
      if (localUser) {
        return res.json({ user: { id: localUser.id, name: localUser.name, email: localUser.email, role: localUser.role, address: localUser.address || '', city: localUser.city || '', zip: localUser.zip || '' } });
      }
      return res.json({ user: { id: req.user.id, name: req.user.name || (req.user.email ? req.user.email.split('@')[0] : 'Member'), email: req.user.email, role: req.user.role || 'user', address: '', city: '', zip: '' } });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.json({ user: { id: req.user.id, name: req.user.name || (req.user.email ? req.user.email.split('@')[0] : 'Member'), email: req.user.email, role: req.user.role || 'user', address: '', city: '', zip: '' } });
    }
    res.json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, address: user.address || '', city: user.city || '', zip: user.zip || '' } });
  } catch (err) {
    res.json({ user: { id: req.user.id, name: req.user.name || (req.user.email ? req.user.email.split('@')[0] : 'Member'), email: req.user.email, role: req.user.role || 'user', address: '', city: '', zip: '' } });
  }
});

// Save / Update User Address
app.put('/api/user/address', authenticateToken, async (req, res) => {
  try {
    const { address = '', city = '', zip = '' } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { address, city, zip },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Shipping address saved successfully',
      user: { id: updatedUser._id.toString(), name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, address: updatedUser.address, city: updatedUser.city, zip: updatedUser.zip }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update address' });
  }
});

// ==========================================
// 2. DRESSES CATALOG ROUTES
// ==========================================

// Get All Dresses & Live Stock Quantities
app.get('/api/dresses', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ dresses: initialDresses });
    }
    const rows = await Dress.find({});
    const dresses = rows.map(formatDressRow);
    res.json({ dresses: dresses.length > 0 ? dresses : initialDresses });
  } catch (err) {
    console.error('Fetch dresses notice:', err.message);
    res.json({ dresses: initialDresses });
  }
});

// Get Single Dress Details
app.get('/api/dresses/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const dress = initialDresses.find(d => d.id === req.params.id);
      if (!dress) return res.status(404).json({ error: 'Dress not found' });
      return res.json({ dress: formatDressRow(dress) });
    }
    const dress = await Dress.findOne({ id: req.params.id });
    if (!dress) return res.status(404).json({ error: 'Dress not found' });
    res.json({ dress: formatDressRow(dress) });
  } catch (err) {
    const dress = initialDresses.find(d => d.id === req.params.id);
    if (dress) return res.json({ dress: formatDressRow(dress) });
    res.status(500).json({ error: 'Failed to fetch dress details' });
  }
});

// Admin: Get all store orders for fulfillment tracking
app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    let orders = [];
    if (mongoose.connection.readyState === 1) {
      orders = await Order.find({}).sort({ createdAt: -1 });
    }
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin orders' });
  }
});

// Admin: Update order fulfillment status (completed -> SHIPPED -> DELIVERED)
app.put('/api/admin/orders/:orderId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.orderId;
    let order = null;

    if (mongoose.connection.readyState === 1) {
      order = await Order.findOneAndUpdate(
        { orderId },
        { status },
        { new: true }
      );
    }

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// ==========================================
// 3. DIRECT ORDER PROCESSING & STOCK REDUCTION
// ==========================================



app.post('/api/orders', async (req, res) => {
  try {
    const { items, customerName, customerEmail, shippingAddress, city, zip, paymentMethod = 'Cash on Delivery', userId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!customerName || !customerEmail || !shippingAddress || !city || !zip) {
      return res.status(400).json({ error: 'Shipping details and customer name/email are required' });
    }

    // Step 1: Stock validation & reduction if MongoDB connected
    if (mongoose.connection.readyState === 1) {
      for (const item of items) {
        if (item.id && !item.id.startsWith('custom-')) {
          const dress = await Dress.findOne({ id: item.id });
          if (!dress) {
            return res.status(400).json({ error: `Garment "${item.title}" is no longer available in store.` });
          }
          if (dress.stock < item.quantity) {
            return res.status(400).json({ error: `Insufficient stock for "${dress.title}". Only ${dress.stock} left.` });
          }
        }
      }

      for (const item of items) {
        if (item.id && !item.id.startsWith('custom-')) {
          await Dress.findOneAndUpdate(
            { id: item.id, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } }
          );
        }
      }
    } else {
      // Offline in-memory stock reduction
      for (const item of items) {
        const dress = initialDresses.find(d => d.id === item.id);
        if (dress) {
          dress.stock = Math.max(0, dress.stock - item.quantity);
        }
      }
    }

    const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const orderId = `#MON-${Math.floor(10000 + Math.random() * 90000)}`;

    const finalPaymentMethod = paymentMethod || 'Cash on Delivery';

    if (mongoose.connection.readyState === 1) {
      await Order.create({
        orderId,
        userId: userId || null,
        customerName,
        customerEmail,
        shippingAddress,
        city,
        zip,
        paymentMethod: finalPaymentMethod,
        totalAmount,
        status: 'completed',
        items
      });

      if (userId) {
        await CartCache.deleteOne({ userId });
      }
    }

    // Trigger email notifications (Customer confirmation + Store Owner alert)
    sendOrderConfirmationEmail({
      orderId,
      customerName,
      customerEmail,
      totalAmount,
      items,
      shippingAddress,
      city,
      paymentMethod: finalPaymentMethod
    }).catch(err => console.error('[EMAIL ERROR - Customer]', err));

    sendStoreOwnerOrderNotification({
      orderId,
      customerName,
      customerEmail,
      totalAmount,
      items,
      shippingAddress,
      city,
      zip,
      paymentMethod: finalPaymentMethod
    }).catch(err => console.error('[EMAIL ERROR - Owner]', err));

    res.status(201).json({
      success: true,
      orderId,
      totalAmount,
      paymentMethod: finalPaymentMethod,
      deliveryEstimate: '3 - 5 Business Days',
      message: 'Order placed successfully via Cash on Delivery!'
    });
  } catch (err) {
    console.error('Order error:', err);
    res.status(500).json({ error: err.message || 'Failed to place order' });
  }
});

// Get User Order History
app.get('/api/orders/history', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders: orders.map(o => ({ id: o.orderId, created_at: o.createdAt, total_amount: o.totalAmount, status: o.status, items: o.items })) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

// ==========================================
// 4. CART & WISHLIST DATABASE CACHE ROUTES
// ==========================================

const localCartMap = new Map();
const localWishlistMap = new Map();

// Get User Cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ cart: localCartMap.get(req.user.id) || [] });
    }
    const user = await User.findById(req.user.id);
    if (user && user.cart) {
      return res.json({ cart: user.cart });
    }
    const cache = await CartCache.findOne({ userId: req.user.id });
    res.json({ cart: cache ? cache.cart : (localCartMap.get(req.user.id) || []) });
  } catch (err) {
    res.json({ cart: localCartMap.get(req.user.id) || [] });
  }
});

// Save User Cart
app.post('/api/cart', authenticateToken, async (req, res) => {
  const cart = (req.body && req.body.cart) ? req.body.cart : [];
  try {
    localCartMap.set(req.user.id, cart);
    if (mongoose.connection.readyState === 1) {
      await User.findByIdAndUpdate(req.user.id, { cart });
      await CartCache.findOneAndUpdate(
        { userId: req.user.id },
        { cart, updatedAt: new Date() },
        { upsert: true }
      );
    }
    res.json({ message: 'Cart synced successfully' });
  } catch (err) {
    localCartMap.set(req.user.id, cart);
    res.json({ message: 'Cart cached locally' });
  }
});

// Get User Wishlist
app.get('/api/wishlist', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ wishlist: localWishlistMap.get(req.user.id) || [] });
    }
    const user = await User.findById(req.user.id);
    if (user && user.wishlist) {
      return res.json({ wishlist: user.wishlist });
    }
    const cache = await WishlistCache.findOne({ userId: req.user.id });
    res.json({ wishlist: cache ? cache.items : (localWishlistMap.get(req.user.id) || []) });
  } catch (err) {
    res.json({ wishlist: localWishlistMap.get(req.user.id) || [] });
  }
});

// Save User Wishlist
app.post('/api/wishlist', authenticateToken, async (req, res) => {
  const wishlist = (req.body && req.body.wishlist) ? req.body.wishlist : [];
  try {
    localWishlistMap.set(req.user.id, wishlist);
    if (mongoose.connection.readyState === 1) {
      await User.findByIdAndUpdate(req.user.id, { wishlist });
      await WishlistCache.findOneAndUpdate(
        { userId: req.user.id },
        { items: wishlist, updatedAt: new Date() },
        { upsert: true }
      );
    }
    res.json({ message: 'Wishlist synced successfully' });
  } catch (err) {
    localWishlistMap.set(req.user.id, wishlist);
    res.json({ message: 'Wishlist cached locally' });
  }
});

// ==========================================
// 5. ADMIN INVENTORY & QUANTITY MANAGEMENT
// ==========================================

// Admin: Add new dress to catalog
app.post('/api/admin/dresses', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      title, category, price, oldPrice, rating = 5.0, reviews = 0, badge = 'New Arrival',
      image, images = [], description = '', fabric = '', stock = 10, sizes = ['S', 'M', 'L'], colors = []
    } = req.body;

    if (!title || !category || !price || !image) {
      return res.status(400).json({ error: 'Title, category, price, and image URL are required' });
    }

    const id = `mon-${Date.now().toString().slice(-4)}`;

    const newDress = await Dress.create({
      id, title, category, price, oldPrice, rating, reviews, badge, image,
      images: images.length ? images : [image], description, fabric, stock, sizes, colors
    });

    res.status(201).json({ message: 'Dress added to MongoDB catalog', dress: formatDressRow(newDress) });
  } catch (err) {
    console.error('Admin add dress error:', err);
    res.status(500).json({ error: 'Failed to add dress' });
  }
});

// Admin: Replenish / Add stock quantities
app.put('/api/admin/dresses/:id/stock', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { addQuantity, setStock } = req.body;
    const dressId = req.params.id;

    const dress = await Dress.findOne({ id: dressId });
    if (!dress) return res.status(404).json({ error: 'Dress not found' });

    let newStock = dress.stock;
    if (typeof setStock === 'number') {
      newStock = Math.max(0, setStock);
    } else if (typeof addQuantity === 'number') {
      newStock = Math.max(0, dress.stock + addQuantity);
    }

    dress.stock = newStock;
    await dress.save();

    res.json({ message: 'Stock updated successfully', dress: formatDressRow(dress) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update stock quantity' });
  }
});

// Admin: Full edit item details (title, price, stock, photos, category, description, fabric)
app.put('/api/admin/dresses/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, category, price, oldPrice, stock, image, images, description, fabric, badge } = req.body;
    const dressId = req.params.id;

    const dress = await Dress.findOne({ id: dressId });
    if (!dress) return res.status(404).json({ error: 'Dress not found' });

    if (title !== undefined) dress.title = title;
    if (category !== undefined) dress.category = category;
    if (price !== undefined) dress.price = Number(price);
    if (oldPrice !== undefined) dress.oldPrice = oldPrice ? Number(oldPrice) : null;
    if (stock !== undefined) dress.stock = Number(stock);
    if (image !== undefined) dress.image = image;
    if (images !== undefined) dress.images = Array.isArray(images) && images.length ? images : [dress.image];
    if (description !== undefined) dress.description = description;
    if (fabric !== undefined) dress.fabric = fabric;
    if (badge !== undefined) dress.badge = badge;

    await dress.save();

    res.json({ message: 'Item updated successfully in MongoDB', dress: formatDressRow(dress) });
  } catch (err) {
    console.error('Edit dress error:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Admin: Delete item from MongoDB catalog
app.delete('/api/admin/dresses/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await Dress.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Dress not found' });
    }
    res.json({ message: 'Dress removed from catalog' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete dress' });
  }
});

// Catch-all route to serve SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  console.log(`Visionsby_MON Clean MongoDB Server running at http://localhost:${PORT}`);
});
