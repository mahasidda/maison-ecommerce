const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...');

  // Only reset products, keep users safe
  await Product.deleteMany();

  // Delete only admin user and recreate
  await User.deleteOne({ email: 'mahalakshmisidda50@gmail.com' });
  await User.deleteOne({ email: 'testuser@maison.com' });

  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass = await bcrypt.hash('user123', 10);

  await User.create([
    { name: 'Admin', email: 'mahalakshmisidda50@gmail.com', password: adminPass, role: 'admin' },
    { name: 'Test User', email: 'testuser@maison.com', password: userPass, role: 'user' },
  ]);

  const products = [
    {
      name: 'Linen Oversized Blazer', brand: 'Maison Studio',
      description: 'A relaxed linen blazer with a modern oversized silhouette. Perfect for both casual and semi-formal occasions.',
      price: 8499, originalPrice: null, category: 'women', subCategory: 'outerwear',
      sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Beige', 'Black', 'Sage'],
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
        'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&q=80',
        'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80',
      ],
      stock: 45, rating: 4.5, numReviews: 28, isNew: true, isFeatured: true,
    },
    {
      name: 'Tailored Wide-Leg Trouser', brand: 'Noir Edit',
      description: 'High-waisted wide-leg trousers with a tailored finish. Made from premium stretch fabric for all-day comfort.',
      price: 4960, originalPrice: 6200, category: 'women', subCategory: 'bottoms',
      sizes: ['XS', 'S', 'M', 'L'], colors: ['Black', 'Ivory', 'Camel'],
      images: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=600&q=80',
        'https://images.unsplash.com/photo-1532453288672-3a17979702b3?w=600&q=80',
      ],
      stock: 60, rating: 4.3, numReviews: 42, isNew: false, isFeatured: true,
    },
    {
      name: 'Silk Wrap Midi Dress', brand: 'Soft Studio',
      description: 'Elegant wrap dress in 100% silk. The midi length and fluid drape make it effortlessly chic.',
      price: 11200, originalPrice: null, category: 'women', subCategory: 'dresses',
      sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Dusty Rose', 'Sage Green', 'Ivory'],
      images: [
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
        'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
      ],
      stock: 30, rating: 4.8, numReviews: 19, isNew: true, isFeatured: true,
    },
    {
      name: 'Cotton Poplin Shirt', brand: 'Maison Studio',
      description: 'Classic poplin shirt with a relaxed fit. Versatile enough for the office or a weekend outing.',
      price: 3899, originalPrice: null, category: 'men', subCategory: 'tops',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Light Blue', 'Ecru'],
      images: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80',
        'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80',
      ],
      stock: 80, rating: 4.2, numReviews: 55, isNew: false, isFeatured: false,
    },
    {
      name: 'Cashmere Knit Pullover', brand: 'Everyday Edit',
      description: 'Luxuriously soft cashmere pullover with ribbed cuffs and hem. A wardrobe essential.',
      price: 9750, originalPrice: null, category: 'women', subCategory: 'tops',
      sizes: ['XS', 'S', 'M', 'L'], colors: ['Oatmeal', 'Charcoal', 'Dusty Blue'],
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
        'https://images.unsplash.com/photo-1511401139252-f158d3209c17?w=600&q=80',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
      ],
      stock: 35, rating: 4.7, numReviews: 31, isNew: true, isFeatured: true,
    },
    {
      name: 'Structured Leather Tote', brand: 'Noir Edit',
      description: 'Full-grain leather tote with gold hardware. Spacious enough for work essentials.',
      price: 10150, originalPrice: 14500, category: 'accessories', subCategory: 'bags',
      sizes: ['One Size'], colors: ['Black', 'Tan', 'Burgundy'],
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
        'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80',
      ],
      stock: 20, rating: 4.9, numReviews: 14, isNew: false, isFeatured: true,
    },
    {
      name: 'Relaxed Linen Trousers', brand: 'Everyday Edit',
      description: 'Breathable linen trousers with an elasticated waist and side pockets.',
      price: 4650, originalPrice: null, category: 'men', subCategory: 'bottoms',
      sizes: ['S', 'M', 'L', 'XL'], colors: ['Natural', 'Navy', 'Olive'],
      images: [
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
        'https://images.unsplash.com/photo-1594938374182-a57d796b71d8?w=600&q=80',
      ],
      stock: 55, rating: 4.1, numReviews: 22, isNew: true, isFeatured: false,
    },
    {
      name: 'Ribbed Knit Midi Skirt', brand: 'Soft Studio',
      description: 'Stretchy ribbed knit skirt in a flattering midi length.',
      price: 5200, originalPrice: null, category: 'women', subCategory: 'bottoms',
      sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Cream', 'Black', 'Mauve'],
      images: [
        'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=600&q=80',
        'https://images.unsplash.com/photo-1583496661160-fb5218e5f672?w=600&q=80',
        'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80',
      ],
      stock: 40, rating: 4.4, numReviews: 36, isNew: false, isFeatured: false,
    },
    {
      name: 'Slim Fit Chinos', brand: 'Maison Studio',
      description: 'Clean-cut slim chinos in stretch cotton. Timeless and versatile.',
      price: 3299, originalPrice: null, category: 'men', subCategory: 'bottoms',
      sizes: ['28', '30', '32', '34', '36'], colors: ['Khaki', 'Navy', 'Olive', 'Stone'],
      images: [
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
        'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=600&q=80',
        'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&q=80',
      ],
      stock: 70, rating: 4.0, numReviews: 48, isNew: false, isFeatured: false,
    },
    {
      name: 'Minimal Leather Belt', brand: 'Noir Edit',
      description: 'Full-grain leather belt with a brushed gold buckle.',
      price: 2499, originalPrice: null, category: 'accessories', subCategory: 'belts',
      sizes: ['S', 'M', 'L'], colors: ['Black', 'Tan'],
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
        'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80',
      ],
      stock: 90, rating: 4.6, numReviews: 61, isNew: false, isFeatured: false,
    },
  ];

  await Product.insertMany(products);

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin: mahalakshmisidda50@gmail.com / admin123');
  console.log('👤 User:  testuser@maison.com / user123');
  process.exit();
};

seed().catch((err) => { console.error(err); process.exit(1); });