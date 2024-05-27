from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set up Chrome options
options = Options()
options.add_argument('--headless')  # Optional for headless mode
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1920x1080')

# Set up Chromedriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# URL of the page to scrape
url = 'https://www.metacritic.com/tv/star-trek-picard/user-reviews/'  # Replace with the IMDb URL of the TV show you want to scrape

# Load the page
driver.get(url)
time.sleep(5)  # Wait for the page to load completely

# Wait for the review elements to be present
wait = WebDriverWait(driver, 20)

# # Get the overall rating

# Get the review elements
review_list_selector = 'div#reviews-container.lister-list'
review_list = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, review_list_selector)))
# review_items = driver.find_elements_by_css_selector('li.ipl-content-list__item')  # Use driver instead of review_list
review_items = driver.find_elements(By.CSS_SELECTOR, 'li.ipl-content-list__item')
# Print all the reviews
print('Reviews:')
for review_item in review_items:
    review_container = review_item.find_element(By.CSS_SELECTOR, 'div.review-container')
    user_rating = review_container.find_element(By.CSS_SELECTOR, 'div.review-header div.inline-rating').text
    review_text = review_container.find_element(By.CSS_SELECTOR, 'div.content div.text').text
    # review_container = review_item.find_element_by_css_selector('div.review-container')
    # user_rating = review_container.find_element_by_css_selector('div.review-header div.inline-rating').text
    # review_text = review_container.find_element_by_css_selector('div.content div.text').text
    print(f"User Rating: {user_rating}")
    print(review_text)
    print('-' * 20)

# Example of how to close the browser session
driver.quit()