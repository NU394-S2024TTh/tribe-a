import logging
import pandas as pd
import requests
from bs4 import BeautifulSoup
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36'
}

def get_episode_urls(show_url):
    """Get the list of episode URLs from the show page."""
    episode_urls = []
    response = requests.get(show_url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find all episode links (updated selector based on IMDb structure)
    episode_links = soup.find_all('a', class_='btn-full')
    for link in episode_links:
        episode_urls.append('https://www.imdb.com' + link.get('href'))
    
    return episode_urls

def scrape_imdb_reviews(episode_url, episode_number, data):
    """Scrape reviews for a single episode."""
    url = episode_url + "reviews/_ajax?ref_=undefined&paginationKey={}"
    key = ""

    logging.info(f"Starting to scrape IMDb reviews for episode {episode_number}")

    while True:
        response = requests.get(url.format(key), headers=headers)
        soup = BeautifulSoup(response.content, "html.parser")

        # Find the pagination key
        pagination_key = soup.find("div", class_="load-more-data")
        if not pagination_key:
            logging.info("No more reviews to load.")
            break

        key = pagination_key["data-key"]

        reviews = soup.find_all(class_="review-container")
        if not reviews:
            logging.info("No reviews found on this page.")
            break

        for review in reviews:
            title = review.find(class_="title")
            text = review.find(class_="text show-more__control")
            rating = review.find(class_="rating-other-user-rating")
            date = review.find(class_="review-date")

            data["episode_number"].append(episode_number)
            data["title"].append(title.get_text(strip=True) if title else "")
            data["review"].append(text.get_text(strip=True) if text else "")
            data["rating"].append(rating.get_text(strip=True) if rating else "")
            data["date"].append(date.get_text(strip=True) if date else "")

        logging.info(f"Scraped {len(data['title'])} reviews so far for episode {episode_number}.")
        time.sleep(1)  # Delay to prevent being rate limited

    logging.info(f"Completed scraping reviews for episode {episode_number}.")

def scrape_show_reviews(show_url, output_csv):
    """Scrape reviews for all episodes of a show."""
    episode_urls = get_episode_urls(show_url)
    data = {"episode_number": [], "title": [], "review": [], "rating": [], "date": []}

    for i, episode_url in enumerate(episode_urls, start=1):
        scrape_imdb_reviews(episode_url, i, data)

    logging.info(f"Scraped a total of {len(data['title'])} reviews. Saving to {output_csv}")

    df = pd.DataFrame(data)
    df.to_csv(output_csv, index=False)

    logging.info("Scraping completed successfully")

# Example usage:
show_url = "https://www.imdb.com/title/tt0944947/episodes?season=1"  # URL of the season's episodes list
output_csv = "imdb_episode_reviews.csv"
scrape_show_reviews(show_url, output_csv)
