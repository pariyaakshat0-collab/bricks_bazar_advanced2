const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bbms_advanced';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('suppliers').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('messages').deleteMany({});
    await db.collection('notifications').deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const buyer = await db.collection('users').insertOne({
      email: 'buyer@example.com',
      password: hashedPassword,
      name: 'John Construction',
      phone: '+1234567890',
      role: 'BUYER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const supplier1 = await db.collection('users').insertOne({
      email: 'supplier1@example.com',
      password: hashedPassword,
      name: 'BuildMart Supplies',
      phone: '+1234567891',
      role: 'SUPPLIER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const supplier2 = await db.collection('users').insertOne({
      email: 'supplier2@example.com',
      password: hashedPassword,
      name: 'Local Brick Co.',
      phone: '+1234567892',
      role: 'SUPPLIER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Created users');

    // Create sample suppliers
    const supplierProfile1 = await db.collection('suppliers').insertOne({
      userId: supplier1.insertedId,
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
      website: 'www.buildmart.com',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const supplierProfile2 = await db.collection('suppliers').insertOne({
      userId: supplier2.insertedId,
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
      website: 'www.localbrickco.com',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Created suppliers');

    // Create sample orders
    const order1 = await db.collection('orders').insertOne({
      userId: buyer.insertedId,
      supplierId: supplierProfile1.insertedId,
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
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const order2 = await db.collection('orders').insertOne({
      userId: buyer.insertedId,
      supplierId: supplierProfile2.insertedId,
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
      deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const order3 = await db.collection('orders').insertOne({
      userId: buyer.insertedId,
      supplierId: supplierProfile1.insertedId,
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
      deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Created orders');

    // Create sample notifications
    await db.collection('notifications').insertMany([
      {
        userId: buyer.insertedId,
        title: 'Order Status Update',
        content: 'Your cement order ORD-2024-001 is in transit',
        type: 'ORDER_UPDATE',
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: buyer.insertedId,
        title: 'New Supplier Available',
        content: 'Steel Works Ltd. is now available in your area with competitive pricing',
        type: 'SUPPLIER_ALERT',
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Created notifications');

    // Create sample messages
    await db.collection('messages').insertMany([
      {
        senderId: supplier1.insertedId,
        receiverId: buyer.insertedId,
        content: 'Your cement order has been dispatched and will arrive tomorrow.',
        orderId: order1.insertedId,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        senderId: buyer.insertedId,
        receiverId: supplier2.insertedId,
        content: 'Can you provide a quote for 10,000 fly ash bricks?',
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Created messages');

    console.log('Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Buyer - buyer@example.com / password123');
    console.log('Supplier 1 - supplier1@example.com / password123');
    console.log('Supplier 2 - supplier2@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seed script
if (require.main === module) {
  seedDatabase();
}