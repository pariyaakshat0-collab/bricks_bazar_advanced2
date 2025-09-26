import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Supplier from '@/models/Supplier';
import { getAuthFromRequest } from '@/lib/auth';

// GET - Get all suppliers with filters
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
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const material = searchParams.get('material');
    const verified = searchParams.get('verified');
    
    let query: any = { isActive: true };
    
    if (city) query.city = { $regex: city, $options: 'i' };
    if (state) query.state = { $regex: state, $options: 'i' };
    if (material) query.materials = { $in: [material] };
    if (verified === 'true') query.isVerified = true;
    
    const suppliers = await Supplier.find(query)
      .select('-password')
      .sort({ rating: -1 })
      .limit(20);
    
    return NextResponse.json({
      success: true,
      suppliers
    });
    
  } catch (error) {
    console.error('Get suppliers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new supplier (for suppliers)
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
    
    const supplierData = await request.json();
    
    // Check if supplier already exists for this user
    const existingSupplier = await Supplier.findOne({ userId: auth.userId });
    
    if (existingSupplier) {
      return NextResponse.json(
        { error: 'Supplier profile already exists' },
        { status: 409 }
      );
    }
    
    const supplier = await Supplier.create({
      ...supplierData,
      userId: auth.userId
    });
    
    return NextResponse.json({
      success: true,
      supplier
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create supplier error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}