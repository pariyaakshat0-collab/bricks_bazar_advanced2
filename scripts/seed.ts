import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Supplier from '@/models/Supplier';
import Order from '@/models/Order';
import Message from '@/models/Message';
import Notification from '@/models/Notification';
import { hashPassword } from '@/lib/auth';

async function seedDatabase() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Supplier.deleteMany({});
    await Order.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const hashedPassword = await hashPassword('password123');
    
    const buyer = await User.create({
      email: 'buyer@example.com',
      password: hashedPassword,
      name: 'John Construction',
      phone: '+1234567890',
      role: 'BUYER',
      isActive: true
    });

    const supplier1 = await User.create({
      email: 'supplier1@example.com',
      password: hashedPassword,
      name: 'BuildMart Supplies',
      phone: '+1234567891',
      role: 'SUPPLIER',
      isActive: true
    });

    const supplier2 = await User.create({
      email: 'supplier2@example.com',
      password: hashedPassword,
      name: 'Local Brick Co.',
      phone: '+1234567892',
      role: 'SUPPLIER',
      isActive: true
    });

    console.log('Created users');

    // Create sample suppliers
    const supplierProfile1 = await Supplier.create({
      userId: supplier1._id,
      name: 'BuildMart Supplies',
      email: 'supplier1@example.com',
      phone: '+1234567891',
      address: '123 Industrial Area',
      city: 'Mumbai',
      state: 'Maharashtra',
      rating: 4.6,
      isVerified: true,
      isActive: true,
      materials: ['Cement', 'Steel', 'Concrete Blocks'],
      description: 'Premium construction materials supplier with 10+ years experience',
      website: 'www.buildmart.com'
    });

    const supplierProfile2 = await Supplier.create({
      userId: supplier2._id,
      name: 'Local Brick Co.',
      email: 'supplier2@example.com',
      phone: '+1234567892',
      address: '456 Brick Lane',
      city: 'Pune',
      state: 'Maharashtra',
      rating: 4.8,
      isVerified: true,
      isActive: true,
      materials: ['Red Bricks', 'Fly Ash Bricks', 'Hollow Blocks'],
      description: 'Traditional brick manufacturer with modern quality standards',
      website: 'www.localbrickco.com'
    });

    console.log('Created suppliers');

    // Create sample orders
    const order1 = await Order.create({
      userId: buyer._id,
      supplierId: supplierProfile1._id,
      orderNumber: 'ORD-2024-001',
      title: 'Foundation Cement Order',
      description: 'High-grade cement for foundation work',
      materialType: 'Cement',
      quantity: 100,
      unit: 'bags',
      budget: 42000,
      location: 'Mumbai Construction Site',
      status: 'IN_TRANSIT',
      priority: 'HIGH',
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    const order2 = await Order.create({
      userId: buyer._id,
      supplierId: supplierProfile2._id,
      orderNumber: 'ORD-2024-002',
      title: 'Red Bricks for Walls',
      description: 'Premium quality red bricks for wall construction',
      materialType: 'Red Bricks',
      quantity: 5000,
      unit: 'pieces',
      budget: 40000,
      location: 'Mumbai Construction Site',
      status: 'DELIVERED',
      priority: 'MEDIUM',
      deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    });

    const order3 = await Order.create({
      userId: buyer._id,
      supplierId: supplierProfile1._id,
      orderNumber: 'ORD-2024-003',
      title: 'Steel Rods for Structure',
      description: 'TMT steel rods for structural work',
      materialType: 'Steel Rods',
      quantity: 2,
      unit: 'tons',
      budget: 130000,
      location: 'Mumbai Construction Site',
      status: 'PENDING',
      priority: 'HIGH',
      deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    });

    console.log('Created orders');

    // Create sample notifications
    await Notification.create({
      userId: buyer._id,
      title: 'Order Status Update',
      content: 'Your cement order ORD-2024-001 is in transit',
      type: 'ORDER_UPDATE',
      isRead: false
    });

    await Notification.create({
      userId: buyer._id,
      title: 'New Supplier Available',
      content: 'Steel Works Ltd. is now available in your area with competitive pricing',
      type: 'SUPPLIER_ALERT',
      isRead: false
    });

    console.log('Created notifications');

    // Create sample messages
    await Message.create({
      senderId: supplier1._id,
      receiverId: buyer._id,
      content: 'Your cement order has been dispatched and will arrive tomorrow.',
      orderId: order1._id,
      isRead: false
    });

    await Message.create({
      senderId: buyer._id,
      receiverId: supplier2._id,
      content: 'Can you provide a quote for 10,000 fly ash bricks?',
      isRead: false
    });

    console.log('Created messages');

    console.log('Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Buyer - buyer@example.com / password123');
    console.log('Supplier 1 - supplier1@example.com / password123');
    console.log('Supplier 2 - supplier2@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seed script
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;