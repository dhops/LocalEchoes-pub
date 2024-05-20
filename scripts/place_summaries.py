places = ["kallio","helsinki","espoo","vantaa","finland","turku","tampere","lahti"]



import openai

def generate_summary(place, prompt_template, openai_api_key):
    """
    Generates a summary for a given place using OpenAI's GPT model.

    Args:
    place (str): The name of the place to summarize.
    prompt_template (str): The template of the prompt with a placeholder for the place.
    openai_api_key (str): Your OpenAI API key.

    Returns:
    str: The generated summary.
    """
    # Format the prompt with the place
    prompt = prompt_template.format(place=place)

    # Set up OpenAI API
    openai.api_key = openai_api_key

    try:
        # Make a request to the OpenAI API
        response = openai.Completion.create(
            engine="text-davinci-003", # You can change the model as necessary
            prompt=prompt,
            max_tokens=150  # Adjust the token limit as needed
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def main():
    # Your OpenAI API key
    openai_api_key = ''

    # List of places to summarize
    places = [
        # 'City1', 'City2', ...
    ]

    # Prompt template
    prompt_template = "Summarize the key information about {} from Wikipedia."

    # Iterate over each place and generate summaries
    summaries = {}
    for place in places:
        summary = generate_summary(place, prompt_template, openai_api_key)
        if summary:
            summaries[place] = summary
            print(f"Summary for {place}: {summary}\n")
        else:
            print(f"Failed to generate summary for {place}")

if __name__ == "__main__":
    main()





WITH WIKI


import openai
import wikipediaapi

def get_wikipedia_summary(place):
    """
    Fetches the summary of a Wikipedia article for a given place.

    Args:
    place (str): The name of the place.

    Returns:
    str: The summary of the article.
    """
    wiki_wiki = wikipediaapi.Wikipedia('en')
    page = wiki_wiki.page(place)

    if page.exists():
        return page.text
    else:
        return None

def generate_summary(place, prompt_template, openai_api_key, wiki_summary):
    """
    Generates a summary for a given place using OpenAI's GPT model.

    Args:
    place (str): The name of the place to summarize.
    prompt_template (str): The template of the prompt with a placeholder for the place and its Wikipedia summary.
    openai_api_key (str): Your OpenAI API key.
    wiki_summary (str): The Wikipedia summary to be included in the prompt.

    Returns:
    str: The generated summary.
    """
    # Format the prompt with the place and its Wikipedia summary
    prompt = prompt_template.format(place=place, wiki_summary=wiki_summary)

    # Set up OpenAI API
    openai.api_key = openai_api_key

    try:
        # Make a request to the OpenAI API
        response = openai.Completion.create(
            engine="text-davinci-003", # You can change the model as necessary
            prompt=prompt,
            max_tokens=300  # Adjust the token limit as needed
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def main():
    # Your OpenAI API key
    openai_api_key = 'YOUR_API_KEY'

    # List of places to summarize
    places = [
        # 'City1', 'City2', ...
    ]

    # Prompt template
    prompt_template = "Create a concise summary for {}: \n\nWikipedia Summary: {}\n\nSummarize this information."

    # Iterate over each place and generate summaries
    summaries = {}
    for place in places:
        wiki_summary = get_wikipedia_summary(place)
        if wiki_summary:
            summary = generate_summary(place, prompt_template, openai_api_key, wiki_summary)
            if summary:
                summaries[place] = summary
                print(f"Summary for {place}: {summary}\n")
            else:
                print(f"Failed to generate summary for {place}")
        else:
            print(f"Wikipedia article not found for {place}")

if __name__ == "__main__":
    main()
