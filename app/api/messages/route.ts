import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import { getAuthFromRequest } from '@/lib/auth';

// GET - Get messages for authenticated user
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
    const orderId = searchParams.get('orderId');
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let query: any = {
      $or: [
        { senderId: auth.userId },
        { receiverId: auth.userId }
      ]
    };
    
    if (orderId) {
      query.orderId = orderId;
    }
    
    if (unreadOnly) {
      query.receiverId = auth.userId;
      query.isRead = false;
    }
    
    const messages = await Message.find(query)
      .populate('senderId', 'name email avatar')
      .populate('receiverId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return NextResponse.json({
      success: true,
      messages
    });
    
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Send new message
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
    
    const messageData = await request.json();
    
    const message = await Message.create({
      ...messageData,
      senderId: auth.userId
    });
    
    // Populate sender and receiver info
    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email avatar')
      .populate('receiverId', 'name email avatar');
    
    return NextResponse.json({
      success: true,
      message: populatedMessage
    }, { status: 201 });
    
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}