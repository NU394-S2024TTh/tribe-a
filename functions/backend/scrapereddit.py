import praw
import json
# Reddit API credentials
client_id = 'CLIENT-ID'
client_secret = 'CLIENT-SECRET'
user_agent = 'USER-AGENT'

# Initialize Reddit instance
reddit = praw.Reddit(client_id=client_id, client_secret=client_secret, user_agent=user_agent)

def scrape_reddit_reviews(show_name, post_url):
    submission = reddit.submission(url=post_url)
    
    # Ensure that all comments are loaded
    submission.comments.replace_more(limit=None)    
    reviews = []
    
    for review in submission.comments.list():
        # Filter comments

        # Format as JSON
        reviews.append({
            "review_content": review.body,
            "time_published": str(review.created_utc),
            "season": 1,
            "episode": 1,
            "user_demographic_data": {
                "author": review.author.name if review.author else None
            }
        })
    
    print(reviews)
    return reviews

# Example usage:
show_name = "Yellowjackets"
post_url = "https://www.reddit.com/r/Yellowjackets/comments/qnshoo/episode_discussion_s01e01/"
scrape_reddit_reviews(show_name, post_url)