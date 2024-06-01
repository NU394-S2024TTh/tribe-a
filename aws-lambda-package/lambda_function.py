import requests
from bs4 import BeautifulSoup
import json
import imdb

# import firebase_admin
# from firebase_admin import credentials, db
import praw
from datetime import datetime
import re
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

# Reddit API credentials
client_id = "YOUR_CLIENT_ID"
client_secret = "YOUR_CLIENT_SECRET"
user_agent = "USER-AGENT"


# Initialize Reddit instance
def initialize_reddit():
    try:
        return praw.Reddit(
            client_id=client_id, client_secret=client_secret, user_agent=user_agent
        )
    except Exception as e:
        print(f"Error initializing Reddit instance: {e}")
        exit(1)


reddit = initialize_reddit()


# # Initialize Firebase Admin SDK
# def initialize_firebase():
#     try:
#         cred = credentials.Certificate(
#             "./firebase-adminsdk.json"
#         )  # Ensure the path is correct
#         firebase_admin.initialize_app(
#             cred,
#             {
#                 "databaseURL": "https://streaming-trends-ai-default-rtdb.firebaseio.com/"  # Replace with your Firebase Realtime Database URL
#             },
#         )
#     except Exception as e:
#         print(f"Error initializing Firebase: {e}")
#         exit(1)


# initialize_firebase()


def get_imdb_movie_id(movie_name):
    try:
        ia = imdb.Cinemagoer()
        movies = ia.search_movie(movie_name)
        return movies[0].movieID if movies else None
    except Exception as e:
        print(f"Error fetching IMDb movie ID: {e}")
        return None


def scrape_imdb_reviews(movie_id, movie_name, season):
    imdb_reviews_dict = {}
    imdb_review_id = 1
    key = ""
    try:
        while imdb_review_id <= 100:  # Limit to first 100 reviews
            imdb_url = f"https://www.imdb.com/title/tt{movie_id}/reviews/_ajax?ref_=undefined&paginationKey={key}"
            response = requests.get(imdb_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, "html.parser")
            pagination_key = soup.find("div", class_="load-more-data")
            reviews = soup.find_all(class_="review-container")
            if not reviews:
                break
            for review in reviews:
                if imdb_review_id > 10:
                    break
                title = review.find(class_="title")
                text = review.find(class_="text show-more__control")
                rating = review.find(class_="rating-other-user-rating")
                date = review.find(class_="review-date")
                author = review.find(class_="display-name-link")
                review_data = {
                    "author": author.get_text(strip=True) if author else "Unknown",
                    "content": text.get_text(strip=True) if text else "",
                    "created": date.get_text(strip=True) if date else "",
                    "rating": (
                        int(rating.get_text(strip=True).split("/")[0]) / 2
                        if rating
                        else None
                    ),
                    "show": f"{movie_name}_s{season}",
                    "source": "IMDb",
                    "title": title.get_text(strip=True) if title else "",
                    "type": "Human",
                }
                review_key = f"{str(imdb_review_id).zfill(2)}_imdb_{movie_name.lower()}_s{season}"
                imdb_reviews_dict[review_key] = review_data
                imdb_review_id += 1

            if not pagination_key or not reviews or imdb_review_id > 100:
                break
            key = pagination_key["data-key"]
    except Exception as e:
        print(f"Error scraping IMDb reviews: {e}")

    return imdb_reviews_dict


def scrape_rt_reviews(movie_name, season):
    rt_reviews_dict = {}
    rt_review_id = 1
    air_date = None
    genre = None
    try:
        rt_url = f"https://www.rottentomatoes.com/tv/{movie_name}/s0{season}/reviews?type=user"
        rt_response = requests.get(rt_url)
        # print(rt_review_id)
        if rt_response.status_code == 404:
            return rt_reviews_dict, None, None
        rt_response.raise_for_status()
        rt_soup = BeautifulSoup(rt_response.content, "html.parser")
        info_section = rt_soup.select_one(".info-section")
        if info_section:
            details = info_section.select('ul[data-qa="sidebar-tv-details"] li')
            for detail in details:
                if "Air Date" in detail.text:
                    air_date = detail.text.replace("Air Date: ", "").strip()
                elif "Genre" in detail.text:
                    genre = detail.text.replace("Genre: ", "").strip()

        review_elements = rt_soup.select("div.audience-review-row")
        for review_element in review_elements:
            if rt_review_id > 100:
                break
            review = {}
            review["source"] = "Rotten Tomato"
            author_element = review_element.select_one(".audience-reviews__name")
            review["author"] = (
                author_element.text.strip() if author_element else "Unknown"
            )
            review["type"] = "Human"
            review["created"] = review_element.select_one(
                ".audience-reviews__duration"
            ).text.strip()
            review["content"] = review_element.select_one(
                ".audience-reviews__review.js-review-text"
            ).text.strip()
            rating_element = review_element.select_one(".star-display")
            filled_stars = len(rating_element.select(".star-display__filled"))
            half_stars = len(rating_element.select(".star-display__half"))
            review["rating"] = filled_stars + 0.5 * half_stars
            review["title"] = ""
            review["show"] = f"{movie_name}_s{season}"
            review_key = f"{str(rt_review_id).zfill(2)}_tomato_{movie_name}_s{season}"
            rt_reviews_dict[review_key] = review
            rt_review_id += 1
    except Exception as e:
        print(f"Error scraping Rotten Tomatoes reviews: {e}")

    return rt_reviews_dict, genre, air_date


def scrape_reddit_reviews(post_url):
    try:
        submission = reddit.submission(url=post_url)
    except Exception as e:
        print(f"Submission not found: {e}")
        return []

    reviews = []
    try:
        submission.comments.replace_more(limit=None)
        for review in submission.comments.list():
            reviews.append(
                {
                    "review_content": review.body,
                    "time_published": str(review.created_utc),
                    "user_demographic_data": {
                        "author": review.author.name if review.author else None
                    },
                }
            )
    except Exception as e:
        print(f"Error loading comments: {e}")

    return reviews


def call_perplexity_api(show_name="tracker"):
    API_KEY = "YOUR_API_KEY"
    MODEL = "llama-3-sonar-large-32k-online"
    API_ENDPOINT = "https://api.perplexity.ai/chat/completions"
    CONTENT = "You are an artificial intelligence assistant and you need to engage in a helpful, detailed, polite conversation with a user."

    prompt = f"Search the web for 'paramount+ \"{show_name}\" tv show reddit reviews'. Please provide ten URLs of the top Reddit posts with comments that talks about the tv show named '{show_name}'. Return only the URLs in a JSON array format without any surrounding text. Reddit posts only please. Please don't provide the link to a subreddit. From the 10, choose 5 that are about the tv show."

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": f"Bearer {API_KEY}",
    }
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": CONTENT},
            {"role": "user", "content": prompt},
        ],
    }

    try:
        response = requests.post(API_ENDPOINT, headers=headers, data=json.dumps(body))
        response.raise_for_status()
        data = response.json()
        completion = data["choices"][0]["message"]["content"].strip()

        json_array_match = re.search(r"\[([^\]]*)\]", completion)
        if json_array_match:
            json_array = json_array_match.group(0)
            return json.loads(json_array)
        else:
            raise ValueError("No JSON array found in the response.")
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"Error: {err}")


def scrape_reddit_reviews_for_movie(movie_name):
    reddit_reviews_dict = {}
    review_key_suffix = "_" + "reddit" + "_" + movie_name
    all_urls = call_perplexity_api(movie_name)
    if not all_urls:
        print(f"No Reddit URLs found for movie: {movie_name}")
        return reddit_reviews_dict
    i = 1
    for a_url in all_urls:
        all_reviews = scrape_reddit_reviews(a_url)
        for a_rating in all_reviews:
            if (
                a_rating["review_content"] != "[deleted]"
                and a_rating["review_content"] != "[removed]"
                and len(a_rating["review_content"]) > 10
            ):
                review_key = str(i).zfill(2) + review_key_suffix
                reddit_reviews_dict[review_key] = {
                    "author": a_rating["user_demographic_data"]["author"],
                    "content": a_rating["review_content"],
                    "created": str(
                        datetime.fromtimestamp(
                            int(float(a_rating["time_published"]))
                        ).strftime("%B %d, %Y")
                    ),
                    "rating": "",
                    "show": movie_name,
                    "source": "Reddit",
                    "title": "",
                    "type": "Human",
                }
                i += 1

    return reddit_reviews_dict


# def save_to_firebase(shows_metadata, reviews_dict):
#     try:
#         ref = db.reference("")
#         existing_data = ref.get()
#         if existing_data:
#             combined_shows_dict = {**existing_data.get("shows", {}), **shows_metadata}
#             combined_reviews_dict = {**existing_data.get("reviews", {}), **reviews_dict}
#         else:
#             combined_shows_dict = shows_metadata
#             combined_reviews_dict = reviews_dict

#         output_data = {"shows": combined_shows_dict, "reviews": combined_reviews_dict}
#         ref.set(output_data)
#         print("return")
#     except Exception as e:
#         print(f"Error saving to Firebase: {e}")


def lambda_handler(event, context):
    movie_names = event.get("movie_names", [])
    shows_metadata = {}
    imdb_reviews_dict = {}
    rt_reviews_dict = {}
    reddit_reviews_dict = {}

    for movie_name in movie_names:
        print(f"Starting to scrape reviews for movies: {movie_name}")

        movie_id = get_imdb_movie_id(movie_name.replace("_", " "))
        if not movie_id:
            print(f"IMDb movie ID not found for movie: {movie_name}")
            continue

        season = 1
        try:
            imdb_reviews = scrape_imdb_reviews(movie_id, movie_name, season)
            if not imdb_reviews:
                break
            imdb_reviews_dict.update(imdb_reviews)

            rt_reviews, genre, air_date = scrape_rt_reviews(movie_name, season)

            # Initialize show_info outside of the rt_reviews check
            reviews_per_season = list(imdb_reviews.keys())
            if rt_reviews:
                rt_reviews_dict.update(rt_reviews)
                reviews_per_season += list(rt_reviews.keys())

            show_info = {
                "name": movie_name,
                "season": season,
                "category": genre if genre else "Unknown",
                "release_date": air_date if air_date else "Unknown",
                "review_ids": reviews_per_season,
            }
            shows_metadata[f"{movie_name}_s{season}"] = show_info
        except Exception as e:
            print(f"Error processing season {season} for movie {movie_name}: {e}")
            break

        try:
            reddit_reviews = scrape_reddit_reviews_for_movie(movie_name)
            reddit_reviews_dict.update(reddit_reviews)
            for review_key in reddit_reviews.keys():
                show_name = review_key.split("_reddit_")[1]
                for keys in shows_metadata.keys():
                    if show_name in keys:
                        shows_metadata[keys]["review_ids"].append(review_key)
        except Exception as e:
            print(f"Error scraping Reddit reviews for movie {movie_name}: {e}")

    combined_reviews_dict = {
        **rt_reviews_dict,
        **imdb_reviews_dict,
        **reddit_reviews_dict,
    }
    # save_to_firebase(shows_metadata, combined_reviews_dict)

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"shows": shows_metadata, "reviews": combined_reviews_dict}),
    }


# if __name__ == "__main__":
#     event = {"movie_names": ["yellowjackets"]}
#     context = None
#     lambda_handler(event, context)
