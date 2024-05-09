from scrapegraphai.graphs import SmartScraperGraph
OPENAI_API_KEY = "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"

graph_config = {
    "llm": {
        "api_key": OPENAI_API_KEY,
        "model": "gpt-4",
    },
}

smart_scraper_graph = SmartScraperGraph(
    prompt="List me all the reviews and their review dates. Make sure to load the full review and load all the reviews by clicking load more.",
    # also accepts a string with the already downloaded HTML code
    source="https://www.imdb.com/title/tt11041332/reviews?ref_=tt_urv",
    config=graph_config
)

result = smart_scraper_graph.run()
print(result)