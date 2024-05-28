import json
import time
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import boto3

s3 = boto3.client('s3')
BUCKET_NAME = 'your-s3-bucket-name'  # Replace with your S3 bucket name

def lambda_handler(event, context):
    movie_name = event.get('movie_name', 'star_trek_picard')
    options = Options()
    options.add_argument('--headless')  # Optional for headless mode
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920x1080')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    # Set up the Chrome webdriver
    service = Service('/opt/chromedriver')  # Path to the chromedriver in the Lambda layer
    driver = webdriver.Chrome(service=service, options=options)
    output_json = 'tomato_reviews_' + movie_name
    season = 0
    review_id = 1
    shows_metadata = {}
    reviews = {}

    while True:
        season += 1
        url = 'https://www.rottentomatoes.com/tv/' + movie_name + '/s0' + str(season) + '/reviews?type=user'
        response = requests.get(url)
        if response.status_code == 404:
            print("Page not found (404). Exiting the script.")
            break

        driver.get(url)
        time.sleep(5)
        print(url)

        wait = WebDriverWait(driver, 10)
        while True:
            try:
                load_more_container = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, 'load-more-container')))
                load_more_button = load_more_container.find_element(By.CSS_SELECTOR, 'rt-button[data-qa="load-more-btn"]')
                load_more_button.click()
                print("Clicked load more button")
                time.sleep(2)
            except:
                print("No more load more button")
                break

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        air_date = None
        genre = None
        info_section = soup.select_one('.info-section')
        if info_section:
            details = info_section.select('ul[data-qa="sidebar-tv-details"] li')
            for detail in details:
                if 'Air Date' in detail.text:
                    air_date = detail.text.replace('Air Date: ', '').strip()
                elif 'Genre' in detail.text:
                    genre = detail.text.replace('Genre: ', '').strip()

        review_elements = soup.select('div.audience-review-row')
        reviews_per_season = []
        for review_element in review_elements:
            review = {}
            review['source'] = "Rotten Tomato"
            author_element = review_element.select_one('.audience-reviews__name')
            review['author'] = author_element.text.strip() if author_element else "Unknown"
            review['type'] = "Human"
            review['created'] = review_element.select_one('.audience-reviews__duration').text.strip()
            review['content'] = review_element.select_one('.audience-reviews__review.js-review-text').text.strip()
            rating_element = review_element.select_one('.star-display')
            filled_stars = len(rating_element.select('.star-display__filled'))
            half_stars = len(rating_element.select('.star-display__half'))
            review['rating'] = filled_stars + 0.5 * half_stars
            review['title'] = ""
            review['show'] = movie_name + "_" + str(season)
            review_key = f"{str(review_id).zfill(2)}_tomato_{movie_name}_{season}"
            reviews[review_key] = review
            reviews_per_season.append(review_key)
            review_id += 1

        show_info = {
            "name": movie_name,
            "season": season,
            "category": genre if genre else "Unknown",
            "release_date": air_date if air_date else "Unknown",
            "review_ids": reviews_per_season
        }
        shows_metadata[f"{movie_name}_{season}"] = show_info

    driver.quit()
    
    # Save to S3
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=f"{output_json}.json",
        Body=json.dumps({"shows": shows_metadata, "reviews": reviews}, indent=2),
        ContentType='application/json'
    )

    return {
        'statusCode': 200,
        'body': json.dumps(f"Scraping completed for {movie_name}, data saved to {output_json}.json in S3 bucket {BUCKET_NAME}")
    }

# Test locally
# if __name__ == "__main__":
#     print(lambda_handler({"movie_name": "avatar_the_last_airbender"}, None))
