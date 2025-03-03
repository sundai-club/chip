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

	const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

	if (!apiKey) {
		console.error('GIPHY API key is missing');
		return NextResponse.json(
			{ error: 'Server configuration error' },
			{ status: 500 }
		);
	}

	try {
		console.log(
			`Searching Giphy for: "${query}" with API key: ${apiKey.substring(
				0,
				5
			)}...`
		);

		const response = await fetch(
			`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(
				query
			)}&limit=9&rating=g`
		);

		if (!response.ok) {
			console.error(
				`Giphy API error: ${response.status} ${response.statusText}`
			);
			const errorText = await response.text();
			console.error(`Error details: ${errorText}`);
			return NextResponse.json(
				{ error: 'Failed to fetch from Giphy API' },
				{ status: response.status }
			);
		}

		const data = await response.json();
		console.log(`Giphy returned ${data.data?.length || 0} results`);

		return NextResponse.json(data);
	} catch (error) {
		console.error('Error fetching from Giphy:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch from Giphy API' },
			{ status: 500 }
		);
	}
}
