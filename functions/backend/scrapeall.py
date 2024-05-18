import logging
import pandas as pd
import requests
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def scrape_imdb_reviews(movie_id, output_csv):
    i=0
    url = (
        "https://www.imdb.com/title/tt"+movie_id+"/reviews/_ajax?ref_=undefined&paginationKey={}"
    )
    key = ""
    data = {"title": [], "review": []}

    logging.info(f"Starting to scrape IMDb reviews for movie ID {movie_id}")
    
    while True:
        response = requests.get(url.format(key))
        soup = BeautifulSoup(response.content, "html.parser")

        # Find the pagination key
        pagination_key = soup.find("div", class_="load-more-data")
        if not pagination_key:
            logging.info("No more reviews to load.")
            break

        key = pagination_key["data-key"]

        for title, review in zip(
            soup.find_all(class_="title"), soup.find_all(class_="text show-more__control")
        ):
            data["title"].append(title.get_text(strip=True))
            data["review"].append(review.get_text())
            print(i)
            i+=1
    
    logging.info(f"Scraped {len(data['title'])} reviews. Saving to {output_csv}")

    df = pd.DataFrame(data)
    df.to_csv(output_csv, index=False)

    logging.info("Scraping completed successfully")

# Example usage:
movie_id = "11041332"
output_csv = "imdb_reviews.csv"
scrape_imdb_reviews(movie_id, output_csv)
