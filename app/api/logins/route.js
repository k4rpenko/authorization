import { NextResponse, NextRequest } from "next/server";
import { db } from '@vercel/postgres';
import bcrypt from 'bcrypt';


export async function POST(req) {
  const { email, password } =  await req.json();
  const client = new db.Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    const result = await client.query('SELECT email, password FROM public.users WHERE email = $1;', [email]);
    if (result.rows.length > 0) { 
      const dbPassword = result.rows[0].password;
      const passwordMatch = await bcrypt.compare(password, dbPassword);
      if (!passwordMatch) {
        await client.end();
        return NextResponse.json({ message: "Error" }, { status: 401 });
      }
      await client.end();
      return NextResponse.json({ message: "Login" }, { status: 200 });
    } 
    else if(result.rows.length < 0){
      await client.end();
      return NextResponse.json({ status: 404  });
    }
  } catch (error) {
    console.error('Error checking email availability:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}