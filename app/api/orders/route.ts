import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getAuthFromRequest } from '@/lib/auth';

// GET - Get all orders for authenticated user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Build query based on user role
    let query: any = {};
    if (auth.role === 'buyer') {
      query.buyerId = auth.userId;
    } else if (auth.role === 'seller') {
      query.sellerId = auth.userId;
    } else if (auth.role === 'distributor') {
      query.distributorId = auth.userId;
    }
    // Admin can see all orders

    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('supplierId', 'name email phone city state')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return NextResponse.json({
      success: true,
      orders,
      total: orders.length
    });
    
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const orderData = await request.json();
    
    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(6, '0')}`;
    
    const order = await Order.create({
      ...orderData,
      orderNumber,
      userId: auth.userId,
      status: 'PENDING'
    });
    
    return NextResponse.json({
      success: true,
      order
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}