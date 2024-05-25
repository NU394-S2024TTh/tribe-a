import praw
import json

# Reddit API credentials
client_id = 'CLIENT-ID'
client_secret = 'CLIENT-SECRET'
user_agent = 'USER-AGENT'

# Initialize Reddit instance
try:
    reddit = praw.Reddit(client_id=client_id, client_secret=client_secret, user_agent=user_agent)
except Exception as e:
    print(f"Error initializing Reddit instance: {e}")
    exit(1)

def scrape_reddit_reviews(show_name, post_url):
    try:
        submission = reddit.submission(url=post_url)
    except Exception as e:
        print("Submission not found.")
        return []
    
    # Ensure that all comments are loaded
    try:
        submission.comments.replace_more(limit=None)
    except Exception as e:
        print(f"Error loading comments: {e}")
        return []
        
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