import { connect } from '@/utils/config/dbConfig';
import User from '@/utils/models/auth';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST (req: NextRequest) {
    await connect();

    try {
        const { name, email, password } = await req.json();

        const ifUserExists = await User.findOne({ email, name });
        if (ifUserExists) {
            return NextResponse.json(
                { error: 'User already exists' }, 
                { status: 400 }
            );
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const savedUser = await new User({
            name, email, password: hashedPassword
        }).save();

        return NextResponse.json({
            message: 'User created successfully',
            success: true,
            savedUser
        })
        
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })       
    }
}