import feedparser
import spacy

# Load NLP model
nlp = spacy.load("en_core_web_sm")

# URL of the RSS feed
rss_url = "http://sw7x7.libsyn.com/rss"

# Parse the RSS feed
feed = feedparser.parse(rss_url)

# Iterate through each episode
for entry in feed.entries:
    title = entry.title
    description = entry.summary
    length = entry.itunes_duration
    url = entry.link

    # Process the text with spaCy
    doc = nlp(title + " " + description)

    # Check for named entities
    for ent in doc.ents:
        if ent.label_ == "GPE":  # GPE stands for GeoPolitical Entity
            # Save the information if a place name is found
            # You can replace this print statement with a save function
            print(f"Place Name: {ent.text}, Title: {title}, Length: {length}, URL: {url}")
