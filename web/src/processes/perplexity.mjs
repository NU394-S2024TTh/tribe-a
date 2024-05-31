const API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const MODEL = 'llama-3-sonar-small-32k-online';
const MAX_RETRIES = 5;

export async function getReviewsWithPerplexity(showName) {
	const API_ENDPOINT = 'https://api.perplexity.ai/chat/completions';

	const CONTENT = `You are an AI assistant specializing in gathering reviews and information about TV shows. Provide recent reviews and feedback.`;

	const PROMPT = `I represent the show "${showName}". Provide five recent reviews and audience feedback from social media, review sites, and news articles in JSON format with fields: date_posted, title, source, content, and rating. Ensure JSON is error-free.`;

	// Ensure the API key is set
	if (!API_KEY) {
		console.error('API key is missing.');
		return;
	}

	const options = {
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
			// console.log(response);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			const completion = data.choices[0].message.content.trim();

			// console.log(completion);

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
			if (attempt === MAX_RETRIES) {
				console.error('Max retries reached. Unable to get recent reviews.');
				throw new Error('Max retries reached. Unable to get valid JSON response.');
			}
		}
	}
}

function validateJSONFormat(data) {
	if (Array.isArray(data)) {
		return data.every(
			(item) =>
				(item.date_posted || item.datePosted) &&
				item.source &&
				item.content &&
				item.title &&
				item.rating,
		);
	}
	return false;
}
