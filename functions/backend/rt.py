import pandas as pd
import requests
import re
import time

headers = {
    'Referer': 'https://www.rottentomatoes.com/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest',
}
s = requests.Session()

def get_rotten_tomatoes_reviews(url, output_csv='rottentomatoes_reviews.csv'):
    """Fetch reviews from Rotten Tomatoes and save them to a CSV file.
    
    Args:
        url (str): The Rotten Tomatoes movie URL.
        output_csv (str): Name of the output CSV file.
        
    Returns:
        pd.DataFrame: DataFrame containing all the fetched reviews.
    """
    try:
        # Get the page content and extract movieId
        r = requests.get(url, headers=headers)
        r.raise_for_status()
        movie_id = re.search(r'(?<=movieId":")(.*?)(?=")', r.text).group(1)

        # Prepare API URL for fetching reviews
        api_url = f"https://www.rottentomatoes.com/napi/movie/{movie_id}/reviews"
        params = {
            'direction': 'next',
            'endCursor': '',
            'startCursor': '',
        }

        review_data = []

        # Fetch reviews in a loop until all pages are processed
        while True:
            response = s.get(api_url, headers=headers, params=params)
            data = response.json()

            if not data['pageInfo']['hasNextPage']:
                break

            params['endCursor'] = data['pageInfo']['endCursor']
            params['startCursor'] = data['pageInfo']['startCursor'] if data['pageInfo'].get('startCursor') else ''

            review_data.extend(data['reviews'])
            time.sleep(1)  # Delay to prevent rate limiting

        # Convert the data into a DataFrame and save it to CSV
        df = pd.json_normalize(review_data)
        df.to_csv(output_csv, index=False)
        print(f"Data successfully saved to {output_csv}")

        return df
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None

# Example usage:
url = 'https://www.rottentomatoes.com/m/interstellar_2014'
reviews_df = get_rotten_tomatoes_reviews(url, output_csv='interstellar_reviews.csv')
