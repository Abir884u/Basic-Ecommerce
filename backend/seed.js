const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium sound quality with active noise cancellation. 30-hour battery life, comfortable over-ear design, and crystal-clear calls. Perfect for work from home or travel.',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Electronics',
    brand: 'SoundMaster',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    stock: 50,
    rating: 4.5,
    numReviews: 128,
    featured: true,
    tags: ['headphones', 'wireless', 'noise-canceling', 'audio']
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your health 24/7 with heart rate monitoring, sleep tracking, GPS, and 100+ workout modes. Water-resistant up to 50m. 7-day battery life.',
    price: 249.99,
    originalPrice: 329.99,
    category: 'Electronics',
    brand: 'FitTech',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500'
    ],
    stock: 35,
    rating: 4.3,
    numReviews: 89,
    featured: true,
    tags: ['smartwatch', 'fitness', 'health', 'GPS']
  },
  {
    name: 'Minimalist Leather Backpack',
    description: 'Crafted from genuine full-grain leather with a modern minimal aesthetic. Features a padded laptop compartment (up to 15"), hidden pockets, and brass hardware. Ages beautifully.',
    price: 189.99,
    originalPrice: 249.99,
    category: 'Clothing',
    brand: 'LeatherCraft Co.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'
    ],
    stock: 20,
    rating: 4.7,
    numReviews: 56,
    featured: true,
    tags: ['backpack', 'leather', 'laptop bag', 'travel']
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches, N-key rollover, and aluminum frame. Tactile and responsive for gaming and typing enthusiasts.',
    price: 149.99,
    originalPrice: 199.99,
    category: 'Electronics',
    brand: 'KeyMaster',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'
    ],
    stock: 45,
    rating: 4.6,
    numReviews: 203,
    featured: false,
    tags: ['keyboard', 'gaming', 'mechanical', 'RGB']
  },
  {
    name: 'Premium Yoga Mat',
    description: 'Non-slip, eco-friendly natural rubber yoga mat with alignment lines. 6mm thick for joint cushioning. Perfect for yoga, pilates, and home workouts.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Sports',
    brand: 'ZenFlex',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'
    ],
    stock: 80,
    rating: 4.4,
    numReviews: 167,
    featured: false,
    tags: ['yoga', 'fitness', 'mat', 'exercise']
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated bottle keeps drinks cold 24hrs and hot 12hrs. BPA-free, leak-proof, durable 18/8 stainless steel. Perfect for outdoor adventures.',
    price: 34.99,
    originalPrice: 44.99,
    category: 'Sports',
    brand: 'HydroFlow',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'
    ],
    stock: 120,
    rating: 4.8,
    numReviews: 342,
    featured: false,
    tags: ['water bottle', 'hydration', 'insulated', 'outdoor']
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360° surround sound with deep bass. Waterproof IPX7, 20-hour battery life. Connects two phones simultaneously. Perfect for outdoor gatherings.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Electronics',
    brand: 'SoundMaster',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'
    ],
    stock: 60,
    rating: 4.2,
    numReviews: 98,
    featured: true,
    tags: ['speaker', 'bluetooth', 'waterproof', 'audio']
  },
  {
    name: 'Organic Skincare Set',
    description: 'Complete 5-piece skincare routine with cleanser, toner, serum, moisturizer, and eye cream. Made with 95% organic ingredients. Suitable for all skin types.',
    price: 124.99,
    originalPrice: 159.99,
    category: 'Beauty',
    brand: 'GreenGlow',
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500'
    ],
    stock: 30,
    rating: 4.5,
    numReviews: 74,
    featured: false,
    tags: ['skincare', 'organic', 'beauty', 'face care']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopify.com',
      password: 'Admin@1234',
      role: 'admin'
    });

    // Create sample user
    const sampleUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'User@1234',
      role: 'user'
    });

    console.log('Created users:', adminUser.email, sampleUser.email);

    // Create products
    await Product.insertMany(sampleProducts);
    console.log(`Created ${sampleProducts.length} products`);

    console.log('\n✅ Seed complete!');
    console.log('Admin: admin@shopify.com / Admin@1234');
    console.log('User: john@example.com / User@1234');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
