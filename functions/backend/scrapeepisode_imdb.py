import logging
import requests
from bs4 import BeautifulSoup
import json

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def get_episode_urls(show_url):
    logging.info(f"Fetching episode list from {show_url}")
    
    response = requests.get(show_url)
    soup = BeautifulSoup(response.content, "html.parser")
    
    episode_urls = []
    episode_containers = soup.find_all("div", class_="info")
    
    for container in episode_containers:
        link = container.find("a", href=True)
        if link:
            episode_url = "https://www.imdb.com" + link['href']
            episode_urls.append(episode_url)
            logging.info(f"Found episode URL: {episode_url}")

    logging.info(f"Total {len(episode_urls)} episode URLs found.")
    return episode_urls

def scrape_imdb_reviews(episode_url):
    logging.info(f"Scraping reviews from {episode_url}")
    
    response = requests.get(episode_url)
    soup = BeautifulSoup(response.content, "html.parser")
    
    reviews = []
    review_containers = soup.find_all("div", class_="text show-more__control")
    
    for container in review_containers:
        review_text = container.get_text(strip=True)
        review_date = container.find_next("span", class_="review-date").get_text(strip=True)
        rating = container.find_previous("span", class_="rating-other-user-rating")
        review_rating = rating.span.get_text(strip=True) if rating else None
        author = container.find_previous("span", class_="display-name-link").a.get_text(strip=True)
        
        reviews.append({
            "review_content": review_text,
            "time_published": review_date,
            "rating": review_rating,
            "user_demographic_data": {
                "author": author
            }
        })
    
    logging.info(f"Scraped {len(reviews)} reviews from {episode_url}")
    return reviews

def save_reviews_to_json(show_name, reviews, output_json):
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(reviews, f, ensure_ascii=False, indent=4)
    logging.info(f"Reviews saved to {output_json}")

def scrape_show_reviews(show_url, output_json):
    episode_urls = get_episode_urls(show_url)
    all_reviews = []
    
    for episode_url in episode_urls:
        reviews = scrape_imdb_reviews(episode_url)
        all_reviews.extend(reviews)
    
    save_reviews_to_json(show_url, all_reviews, output_json)

# Example usage:
show_url = "https://www.imdb.com/title/tt11041332/episodes?season=1"  # Replace with the actual URL of the show's episodes list
output_json = "imdb_reviews.json"
scrape_show_reviews(show_url, output_json)
