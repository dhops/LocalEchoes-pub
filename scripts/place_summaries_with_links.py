from openai import OpenAI
import wikipediaapi

def get_wikipedia_content(place, user_agent):
    """
    Fetches the content of a Wikipedia article for a given place.

    Args:
    place (str): The name of the place.
    user_agent (str): The user agent string to be used for requests.

    Returns:
    str: The content of the article.
    """
    wiki_wiki = wikipediaapi.Wikipedia(user_agent, 'en')
    page = wiki_wiki.page(place)

    if page.exists():
        content = page.text
        # Find the start of the references section and exclude it
        references_section_titles = ["References", "Notes", "Citations", "External links"]
        for title in references_section_titles:
            ref_index = content.find(title)
            if ref_index != -1:
                content = content[:ref_index]
                break
        return content
    else:
        return None

def get_wikipedia_links(page):
    """
    Fetches links from a Wikipedia page.

    Args:
    page: Wikipedia page object.

    Returns:
    list: A list of titles of linked pages.
    """
    links = page.links
    return [link for link in links if links[link].namespace == 0]

def select_relevant_links(main_content, links, client):
    """
    Selects up to five relevant links using GPT model.

    Args:
    main_content (str): The content of the main Wikipedia page.
    links (list): List of link titles from the Wikipedia page.
    openai_api_key (str): Your OpenAI API key.

    Returns:
    list: A list of selected relevant links.
    """
    prompt = f"Read the following content and select up to five most relevant and interesting links to help readers get a deeper and more colorful understanding of the place. Do not select links that are not interesting or not specifically relevant to that place. For some places, it would be reasonable to select 0 or 1 link. \n\n{main_content}\n\nLinks: {', '.join(links)}"

    try:
        # Make a request to the OpenAI API
        # response = openai.chat.completions.create(
        #     engine="gpt-4-1106-preview",
        #     prompt=prompt,
        #     max_tokens=100
        # )
        print("here")
        response = client.chat.completions.create(
          model="gpt-4-1106-preview",
          messages=[
            {"role": "user", "content": prompt},
          ]
        )
        print("here2")
        selected_links = response['choices'][0]['message']['content'].strip().split(', ')
        print(selected_links)
        return selected_links
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

def generate_summary(place, prompt_template, full_content, word_count, client):
    """
    Generates a summary for a given place using OpenAI's GPT model.

    Args:
    place (str): The name of the place to summarize.
    prompt_template (str): The template of the prompt with a placeholder for the place and its full content.
    openai_api_key (str): Your OpenAI API key.
    full_content (str): The full content to be included in the prompt.
    word_count (int): The word count of the original article.

    Returns:
    str: The generated summary.
    """

    full_content = full_content[:2000]
    word_count = 500

    # Adjust the token limit based on the word count of the original article
    token_limit = min(100 + word_count // 5, 1500)

    # Format the prompt with the place and its full content
    prompt = prompt_template.format(place, token_limit, full_content)

    try:
        # Make a request to the OpenAI API
        # response = openai.chat.completions.create(
        #     engine="gpt-4-1106-preview",
        #     prompt=prompt,
        #     max_tokens=token_limit+500  # Adjust the token limit as needed
        # )
        response = client.chat.completions.create(
          model="gpt-4-1106-preview",
          messages=[
            {"role": "system", "content": "You are an clear, concise journalistic writer with a strong sense of what is interesting to travelers. You do not use colorful language. You just stick to the facts."},
            {"role": "user", "content": prompt},
          ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def main():
    # Your OpenAI API key
    OPENAI_API_KEY = ''

    client = OpenAI(api_key=OPENAI_API_KEY)

    user_agent = 'Test/1.0 (dhopkinsnh@gmail.com)'

    # List of places to summarize
    places = [
        'Forssa'
    ]

    # Prompt template
    prompt_template = "Please create an interesting and concise article about {} using the information below. The article should be at most {} words long. Make it engaging to read, highlighting key aspects that would interest and educate visitors. Get right to the important and interesting stuff without any fluff, especially not the kind of generic stuff you find in a tourist brochure. Focus on historical, cultural, and economic aspects that have shaped the place and have influenced what a visitor sees today. Include notable landmarks, cultural festivals, and unique local customs and stories. The article should provide a vivid picture of the place. Make sure to retain all interesting and important information. \n\n {}"

    # Iterate over each place and generate summaries
    summaries = {}
    for place in places:
        main_content = get_wikipedia_content(place, user_agent)
        if main_content:
            word_count = len(main_content.split())
            print(word_count)
            if word_count < 4000:
                wiki_wiki = wikipediaapi.Wikipedia(user_agent, 'en')
                page = wiki_wiki.page(place)
                links = get_wikipedia_links(page)
                selected_links = select_relevant_links(main_content, links, client)
                linked_contents = [get_wikipedia_content(link) for link in selected_links if get_wikipedia_content(link)]
                full_content = main_content + "\n\n" + "\n\n".join(linked_contents)
            else:
                full_content = main_content
            summary = generate_summary(place, prompt_template, full_content, word_count, client)
            if summary:
                summaries[place] = summary
                print(f"Summary for {place}: {summary}\n")
            else:
                print(f"Failed to generate summary for {place}")
        else:
            print(f"Wikipedia article not found for {place}")

if __name__ == "__main__":
    main()
