import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { getAuthFromRequest } from '@/lib/auth';

// GET - Get notifications for authenticated user
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unread') === 'true';
    
    let query: any = { userId: auth.userId };
    if (unreadOnly) {
      query.isRead = false;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return NextResponse.json({
      success: true,
      notifications
    });
    
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create notification
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
    
    const notificationData = await request.json();
    
    const notification = await Notification.create({
      ...notificationData,
      userId: auth.userId
    });
    
    return NextResponse.json({
      success: true,
      notification
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}