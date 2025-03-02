import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get('q');

	if (!query) {
		return NextResponse.json(
			{ error: 'Query parameter is required' },
			{ status: 400 }
		);
	}

	try {
		const apiKey = process.env.GIPHY_API_KEY;

		const response = await fetch(
			`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=9&rating=g`,
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
		console.error('Error fetching from Giphy:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch from Giphy API' },
			{ status: 500 }
		);
	}
}
