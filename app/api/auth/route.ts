import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword, hashPassword, validatePassword, generateTokens, refreshAccessToken } from '@/lib/auth';
import { User as UserType } from '@/lib/auth-context';

export async function POST(request: NextRequest) {
  try {
    const { email, password, action, name, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    switch (action) {
      case 'login':
        return await handleLogin(email, password);
      
      case 'register':
        if (!name || !role) {
          return NextResponse.json(
            { error: 'Name and role are required for registration' },
            { status: 400 }
          );
        }
        return await handleRegister(email, password, name, role);
      
      case 'refresh':
        return await handleRefreshToken(request);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleLogin(email: string, password: string) {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const userData: UserType = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role.toLowerCase() as any,
      verified: user.isActive,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    const tokens = generateTokens(userData);

    // Set secure HTTP-only cookies
    const response = NextResponse.json({
      user: userData,
      accessToken: tokens.accessToken,
    });

    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

async function handleRegister(
  email: string,
  password: string,
  name: string,
  role: string
) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Password validation failed', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user using Mongoose
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role: role.toUpperCase(),
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
    });

    const savedUser = await newUser.save();

    const userData: UserType = {
      id: savedUser._id.toString(),
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role.toLowerCase() as any,
      verified: savedUser.isActive,
      avatar: savedUser.avatar,
      createdAt: savedUser.createdAt,
    };

    const tokens = generateTokens(userData);

    const response = NextResponse.json({
      user: userData,
      accessToken: tokens.accessToken,
    });

    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}

async function handleRefreshToken(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    const result = refreshAccessToken(refreshToken);
    
    return NextResponse.json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid refresh token' },
      { status: 401 }
    );
  }
}