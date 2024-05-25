import logging
import pandas as pd
import requests
from bs4 import BeautifulSoup
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def scrape_imdb_reviews(movie_id, output_json):
    
    url = (
        "https://www.imdb.com/title/tt" + movie_id + "/reviews/_ajax?ref_=undefined&paginationKey={}"
    )
    key = ""
    data = {"title": [], "review": [], "rating": [], "date": []}

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

        reviews = soup.find_all(class_="review-container")
        if not reviews:
            logging.info("No reviews found on this page.")
            break
        
        for review in reviews:
            title = review.find(class_="title")
            text = review.find(class_="text show-more__control")
            rating = review.find(class_="rating-other-user-rating")
            date = review.find(class_="review-date")

            data["title"].append(title.get_text(strip=True) if title else "")
            data["review"].append(text.get_text(strip=True) if text else "")
            data["rating"].append(rating.get_text(strip=True) if rating else "")
            data["date"].append(date.get_text(strip=True) if date else "")

            

        logging.info(f"Scraped {len(data['title'])} reviews so far.")
        time.sleep(1)  # Delay to prevent being rate limited

    logging.info(f"Scraped a total of {len(data['title'])} reviews. Saving to {output_json}")

    df = pd.DataFrame(data)
    df.to_json(output_json, orient='records', lines=True)

    logging.info("Scraping completed successfully")

# Example usage:
movie_id = "8806524"
movie_id=["11041332","8806524","18335752","0106004","13111078","9184820","15399640","13111040","26591110","9018736"]

movie_name=["yellowjackets","startrekpicard","1923","Frasier","SpecialOps:Lioness","StarTrekLowerDecks","LawmenBassReeves","TheOffer","Elsbeth","AvatarTheLastAirbender"]
i=0
while i<10:
    output_json = "reviews/imdb/"+movie_name[i]+"_overallreviews.json"
    scrape_imdb_reviews(movie_id[i], output_json)
    i+=1
