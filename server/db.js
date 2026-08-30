const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. User Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  zip: { type: String, default: '' },
  cart: [{
    id: String,
    title: String,
    price: Number,
    image: String,
    selectedSize: String,
    selectedColor: String,
    quantity: Number,
    maxStock: Number
  }],
  wishlist: [{
    id: String,
    title: String,
    price: Number,
    oldPrice: Number,
    image: String,
    category: String,
    badge: String,
    rating: Number,
    reviews: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

// 2. Dress Schema & Model (Catalog & Inventory Stock)
const dressSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  rating: { type: Number, default: 5.0 },
  reviews: { type: Number, default: 0 },
  badge: { type: String, default: '' },
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, default: '' },
  fabric: { type: String, default: '' },
  stock: { type: Number, required: true, default: 10 },
  sizes: [{ type: String }],
  colors: [{
    name: String,
    hex: String
  }],
  createdAt: { type: Date, default: Date.now }
});

// 3. Cart Cache Schema & Model (MongoDB Cart Database Caching)
const cartCacheSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  cart: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now }
});

// 4. Order Schema & Model
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, default: null },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  city: { type: String, required: true },
  zip: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'completed' },
  items: [{
    id: String,
    title: String,
    size: String,
    color: String,
    quantity: Number,
    price: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

const wishlistCacheSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [{
    id: String,
    title: String,
    price: Number,
    oldPrice: Number,
    image: String,
    category: String,
    badge: String,
    rating: Number,
    reviews: Number
  }],
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Dress = mongoose.model('Dress', dressSchema);
const CartCache = mongoose.model('CartCache', cartCacheSchema);
const WishlistCache = mongoose.model('WishlistCache', wishlistCacheSchema);
const Order = mongoose.model('Order', orderSchema);

const initialDresses = [
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

// Initial MongoDB Data Seed Function
async function seedMongoData() {
  // Seed Users
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const adminHash = await bcrypt.hash('admin123', 10);
    const customerHash = await bcrypt.hash('user123', 10);

    await User.create([
      {
        name: 'Admin Mon',
        email: 'admin@visionsbymon.com',
        password: adminHash,
        role: 'admin',
        address: '124 Fashion Boulevard',
        city: 'New York',
        zip: '10001'
      },
      {
        name: 'Jane Doe',
        email: 'customer@visionsbymon.com',
        password: customerHash,
        role: 'user',
        address: '124 Fashion Boulevard, Suite 400',
        city: 'New York',
        zip: '10001'
      }
    ]);
    console.log('MongoDB: Seeded default users (Admin & Customer)');
  }

  // Seed Dresses (12 Store Products)
  const mon1Exists = await Dress.findOne({ id: 'mon-01', title: 'Bootcut Pant' });
  if (!mon1Exists) {
    await Dress.deleteMany({});
    await Dress.insertMany(initialDresses);
    console.log('MongoDB: Seeded updated catalog with 12 new products');
  }
}

module.exports = {
  User,
  Dress,
  CartCache,
  WishlistCache,
  Order,
  initialDresses,
  seedMongoData
};
