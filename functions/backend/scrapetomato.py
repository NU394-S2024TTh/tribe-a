from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
from bs4 import BeautifulSoup
import time
import requests
import json
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def scrape_rotten_tomatoes_reviews(movie_name = 'star_trek_picard'):
    options = Options()
    options.add_argument('--headless')  # Optional for headless mode
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920x1080')

    # Set up the Chrome webdriver
    service = Service(ChromeDriverManager().install())
    # driver = webdriver.Chrome(service=service)
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    output_json = 'tomato_reviews_' + movie_name
    season = 0
    while True:
            season += 1
            # URL of the review page
            url = 'https://www.rottentomatoes.com/tv/' + movie_name + '/s0' + str(season) + '/reviews?type=user'
            output_json_by_season = output_json+'_0' + str(season) + '.json'
            print(output_json_by_season)
            response = requests.get(url)
            if response.status_code == 404:
                print("Page not found (404). Exiting the script.")
                break
            # Navigate to the review page
            driver.get(url)
            time.sleep(5)  # Wait for the page to load
            print(url)
            # Click the "Load More" button until all reviews are loaded


            wait = WebDriverWait(driver, 10)
            # count=0
            while True:
                try:
                    load_more_container = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CLASS_NAME, 'load-more-container')))
                    load_more_button = load_more_container.find_element(By.CSS_SELECTOR, 'rt-button[data-qa="load-more-btn"]')
                    load_more_button.click()
                    print("click it")
                    # count += 1
                    # print(count)
                    time.sleep(2)
                except:
                    print("no such button")
                    break

            # Parse the page HTML
            soup = BeautifulSoup(driver.page_source, 'html.parser')

            # Extract review data
            reviews = []
            review_elements = soup.select('div.audience-review-row')

            for review_element in review_elements:
                review = {}
                
                review['review'] = review_element.select_one('.audience-reviews__review.js-review-text').text.strip()
                review['date'] = review_element.select_one('.audience-reviews__duration').text.strip()
                rating_element = review_element.select_one('.star-display')
                filled_stars = len(rating_element.select('.star-display__filled'))
                half_stars = len(rating_element.select('.star-display__half'))
                review['rating'] = filled_stars + 0.5 * half_stars

                review['episode info'] = "Season " + str(season)
                # print(review)
                reviews.append(review)

            # Create a DataFrame from the reviews
            # df = pd.DataFrame(reviews)
            with open(output_json_by_season, 'w') as json_file:
                json.dump({f"{movie_name}": reviews}, json_file, indent=2)

            # except (NoSuchElementException, TimeoutException):
            #     print(f"Page for season {season} does not exist. Exiting loop.")
            #     break

    # Print the DataFrame
    # print(df)

    # Close the webdriver
    driver.quit()


# Example usage:

# movie_name = "yellowjackets"
# movie_name = "special_ops_lioness"
# movie_name = "elsbeth"
movie_name = "avatar_the_last_airbender"
# movie_name = "the_offer"
# movie_name = "lawmen_bass_reeves"
# movie_name = "star_trek_lower_decks"
# output_csv_tomato = "tomato_reviews.csv"
# output_json = 'tomato_reviews_star_trek_picard.json'
scrape_rotten_tomatoes_reviews(movie_name)

