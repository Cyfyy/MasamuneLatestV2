import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { axieId } = await request.json(); // Expect axieId from client

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api-gateway.skymavis.com/origin/v2/community/users/${axieId}/battle-logs`,
      headers: {
        'Accept': 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_API_KEY,
      },
    };

    const response = await axios.request(config);
    console.log('Mao ni Battle Logs ni Unggoy:', JSON.stringify(response.data, null, 2)); // Updated to use response.data
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching battle logs' });
  }
}
