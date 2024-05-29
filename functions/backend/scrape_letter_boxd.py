import requests
import json
from bs4 import BeautifulSoup

rating = "rating"
review = "review"
time_published = "time published"
scraped_ratings_dict = {}

all_urls: dict = {
    "star-trek-picard": "https://letterboxd.com/film/star-trek-picard-the-imax-live-series-finale-event/reviews/by/activity/",
    "yellow-jackets": "https://letterboxd.com/film/the-yellow-jackets/reviews/by/activity/"}

for key in all_urls:

    url = all_urls[key]

    r = requests.get(url) 

    soup = BeautifulSoup(r.content, 'html5lib')

    all_ratings = soup.find_all('div', attrs={'class':'film-detail-content'})

    scraped_ratings_dict[key] = {}
    i = 1
    for a_rating in all_ratings:
        scraped_ratings_dict[key][i] = {}
        span_rating = a_rating.find('span', attrs={'class':'rating'})
        scraped_ratings_dict[key][i][rating] = span_rating.text.count('\u2605') # Count stars
        div_review = a_rating.find('div', attrs={'class':'body-text'})
        scraped_ratings_dict[key][i][review] = div_review.text
        span_date = a_rating.find('span', attrs={'class':'_nobr'})
        scraped_ratings_dict[key][i][time_published] = span_date.text
        i += 1

json_object = json.dumps(scraped_ratings_dict, indent=4)

with open("ratings_6.json", "w") as ratings_file:
    ratings_file.write(json_object)
