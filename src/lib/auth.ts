import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { printErr } from './logError';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. Set it before starting the server.');
}

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    printErr(err);
    return null;
  }
};


// Middleware to check if the user is authenticated
export const authMiddleware = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ success: false,error:true, message: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ success: false, error:true, message: 'Invalid token' }, { status: 401 });
  }

  return decoded;
};



export interface DecodedToken {
  email: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

export const isAdminUser = (decoded: DecodedToken | null | undefined): boolean => {
  if (!decoded) return false;
  return decoded.role === 'admin';
};

