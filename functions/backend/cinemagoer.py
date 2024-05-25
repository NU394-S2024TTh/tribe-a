from imdb import Cinemagoer, helpers
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def fetch_and_print_episodes(movie_id):
    try:
        # Initialize Cinemagoer instance
        i = Cinemagoer()

        # Fetch movie by ID
        m = i.get_movie(movie_id)
        if not m:
            logging.error(f"Movie with ID {movie_id} not found.")
            return

        # Update movie object with episode details
        logging.info(f"Updating movie {movie_id} with episode details.")
        i.update(m, 'episodes')

        # Check if episodes are present
        if 'episodes' not in m or not m['episodes']:
            logging.error(f"No episodes found for movie ID {movie_id}.")
            return

        # Sort and print episodes
        p = helpers.sortedEpisodes(m, season=None)
        if not p:
            logging.error("No sorted episodes found.")
        else:
            for season, episodes in p.items():
                logging.info(f"Season {season}: {len(episodes)} episodes found.")
            print(p)
    except Exception as e:
        logging.error(f"An error occurred: {e}")

# Example usage
movie_id = '0411008'
fetch_and_print_episodes(movie_id)
