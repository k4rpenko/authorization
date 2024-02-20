import { NextResponse, NextRequest } from "next/server";
import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const { email, password } =  await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const client = new db.Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    await client.connect();
    const result = await client.query('SELECT email FROM public.users WHERE email = $1;', [email]);
    if (result.rows.length > 0) {
      await client.end();
      return NextResponse.json({ message: "Error" }, { status: 401 });
    }
    else {
      await client.query('INSERT INTO public.users (email, password) VALUES ($1, $2);', [email, hashedPassword]);
      await client.end();
      return NextResponse.json({ message: "Created" }, { status: 200 });
    }
  } catch (error) {
    console.error('Error checking email availability:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}