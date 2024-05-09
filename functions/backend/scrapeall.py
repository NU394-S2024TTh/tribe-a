import pandas as pd
import requests
from bs4 import BeautifulSoup

id="0133093"
url = (
    "https://www.imdb.com/title/tt"+id+"/reviews/_ajax?ref_=undefined&paginationKey={}"
)
key = ""
data = {"title": [], "review": []}

while True:
    response = requests.get(url.format(key))
    soup = BeautifulSoup(response.content, "html.parser")
    # Find the pagination key
    pagination_key = soup.find("div", class_="load-more-data")
    if not pagination_key:
        break

    # Update the `key` variable in-order to scrape more reviews
    key = pagination_key["data-key"]
    for title, review in zip(
        soup.find_all(class_="title"), soup.find_all(class_="text show-more__control")
    ):
        data["title"].append(title.get_text(strip=True))
        data["review"].append(review.get_text())

df = pd.DataFrame(data)
print(df)