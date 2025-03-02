import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const apiKey = process.env.GIPHY_API_KEY;

		const response = await fetch(
			`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=9&rating=g`,
			{
				headers: {
					Accept: 'application/json',
				},
				cache: 'no-store',
			}
		);

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error('Error fetching trending GIFs:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch trending GIFs from Giphy API' },
			{ status: 500 }
		);
	}
}
