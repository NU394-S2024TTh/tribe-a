const API_KEY = 'YOUR API KEY';
const MODEL = 'llama-3-sonar-small-32k-online';
const MAX_RETRIES = 5;

export async function getReviewsWithPerplexity(showName) {
	const API_ENDPOINT = 'https://api.perplexity.ai/chat/completions';

	const CONTENT = `You are an artificial intelligence assistant in the media industry specializing in gathering and analyzing reviews and information about TV shows. Your task is to engage in a helpful, detailed, and polite conversation with the user, ensuring thorough and accurate responses. You excel at extracting recent reviews, audience feedback, and sentiment analysis from various platforms, including social media, review sites, and news articles.`;

	const PROMPT = `I am representing the company producing the show "${showName}" I would like to understand the latest sentiment and public perception of the show. Please provide five recent reviews and audience feedback from various platforms, including social media, review sites, and news articles. List these reviews with their full content (not a summary) in a JSON document. For each review, include the date posted, title (if applicable), source, content, and rating (if applicable).`;

	// Ensure the API key is set
	if (!API_KEY) {
		console.error(
			'API key is missing. Please set the PERPLEXITY_AI_API_KEY environment variable.',
		);
		return;
	}

	let options = {
		method: 'POST',
		headers: {
			'accept': 'application/json',
			'content-type': 'application/json',
			'authorization': `Bearer ${API_KEY}`,
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [
				{ role: 'system', content: CONTENT },
				{ role: 'user', content: PROMPT },
			],
		}),
	};

	// Retry if json is not formatted correctly
	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		try {
			const response = await fetch(API_ENDPOINT, options);
			console.log(response);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			const completion = data.choices[0].message.content.trim();

			console.log(completion);

			// Extract the JSON array from the response
			const jsonArrayMatch = completion.match(/\[([^\]]*)\]/);
			if (jsonArrayMatch) {
				const jsonArray = jsonArrayMatch[0];
				const parsedData = JSON.parse(jsonArray);

				if (validateJSONFormat(parsedData)) {
					return parsedData;
				} else {
					throw new Error('Invalid JSON format in the response.');
				}
			} else {
				throw new Error('No JSON array found in the response.');
			}
		} catch (err) {
			console.error(`Attempt ${attempt} - Error: ${err.message}`);
			if (attempt === MAX_RETRIES) {
				throw new Error('Max retries reached. Unable to get valid JSON response.');
			}
		}
	}
}

function validateJSONFormat(data) {
	if (Array.isArray(data)) {
		return data.every(
			(item) =>
				item.date_posted && item.source && item.content && item.title && item.rating,
		);
	}
	return false;
}
