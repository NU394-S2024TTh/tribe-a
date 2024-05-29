import json
from datetime import datetime
from scrapereddit import scrape_reddit_reviews

author = "author"
content = "content"
created = "created"
rating = "rating"
show = "show"
source = "source"
title = "title"
type = "type"
scraped_ratings_dict = {}

all_urls: dict = {
    "avatar_the_last_airbender": [
            "https://www.reddit.com/r/TheLastAirbender/comments/172r803/what_is_your_top_moment_from_the_show/",
            "https://www.reddit.com/r/TheLastAirbender/top/",
            "https://www.reddit.com/r/TheLastAirbender/",
            "https://www.reddit.com/r/TheLastAirbender/comments/1cp2ih1/post_your_favorite_avatar_the_last_airbender/",
            "https://www.reddit.com/t/avatar_the_last_airbender/"
        ]
}

for key in all_urls:
    review_key_suffix = "_" + "reddit" + "_" + key

    urls = all_urls[key]

    i = 1
    for a_url in urls:
        all_reviews = scrape_reddit_reviews(key, a_url)

        for a_rating in all_reviews:
            review_key = str(i) + review_key_suffix
            scraped_ratings_dict[review_key] = {}
            scraped_ratings_dict[review_key][author] = a_rating["user_demographic_data"]["author"]
            scraped_ratings_dict[review_key][content] = a_rating["review_content"]
            scraped_ratings_dict[review_key][created] = str(datetime.fromtimestamp(int(float(a_rating["time_published"]))).strftime("%B %d, %Y"))
            scraped_ratings_dict[review_key][rating] = ""
            scraped_ratings_dict[review_key][show] = key
            scraped_ratings_dict[review_key][source] = "Reddit"
            scraped_ratings_dict[review_key][title] = ""
            scraped_ratings_dict[review_key][type] = "Human"
            i += 1

json_object = json.dumps(scraped_ratings_dict, indent=4)

with open("avatar_the_last_airbender.json", "w") as ratings_file:
    ratings_file.write(json_object)
