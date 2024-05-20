import requests
from openai import OpenAI
import json

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('../private/localechoes-firebase-adminsdk-qebyo-ae1d4b9fc2.json')
firebase_admin.initialize_app(cred)

db = firestore.client()


# Function to query iTunes API
def query_itunes(query_string):
    response = requests.get(f"https://itunes.apple.com/search?{query_string}")
    if response.status_code == 200:
        return response.json()
    else:
        return None

# Function to rate description with OpenAI API
def rate_description(client, description):
    try:
        prompt1 = """
            Please read the following description from a podcast and decide if it is about a particular geographical place (city, state, region, country, etc). Please fill in the json response by giving the name of the place (as specific as possible), the specific relevance of the content to that place (i.e. how particular is it to the place) on a scale of 1 to 5, how interesting the content would be for a visitor to that place on a scale of 1 to 5, how interesting the content would be for a local (to gain a deeper understanding of their own place) on a scale of 1 to 5, the approximate decimal latitude of the place, and the approximate decimal longitude of the place. If it is not about a particular place, please put 'N/A' for the place and 0 for the remaining fields.

            Description:
            """
        prompt2 = """
            Do not include any explanations, only provide a  JSON response  following this format without deviation.
            [{
              	"place": the place
              	"relevance to the place": a number from 1 to 5,
              	"interestingness to a visitor": a number from 1 to 5,
            	"interestingness to a local": a number from 1 to 5,
            	“latitude”: approximate decimal latitude,
            	“longitude”: approximate decimal longitude
            }]
            The JSON response:
            """
        prompt = prompt1 + description + prompt2

        response = client.chat.completions.create(
          model="gpt-4-1106-preview",
          response_format={ "type": "json_object" },
          messages=[
            {"role": "user", "content": prompt},
          ]
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Function to check scores and add to Firestore
def process_results(results, client):
    for result in results:
        description = result.get("description", "")
        gpt_data = rate_description(client, description)
        print(result.get("trackName"))
        print(gpt_data)
        # Define your scoring criteria here
        if gpt_data and gpt_data["relevance to the place"]>=4 and (gpt_data["interestingness to a visitor"]>=4 or gpt_data["interestingness to a local"]>=4):
            data = {
                "length": result.get("trackTimeMillis"),
                "collectionName": result.get("collectionName"),
                "date": result.get("releaseDate"),
                "description": description,
                "title": result.get("trackName"),
                "audioRef": result.get("episodeUrl"),
                "source": "podcast",
                "coordinates": {"latitude": gpt_data["latitude"], "longitude": gpt_data["longitude"]},
                "local": False,
                "local_interest": gpt_data["interestingness to a local"],
                "visitor_interest": gpt_data["interestingness to a visitor"],
                "relevance_to_place": gpt_data["relevance to the place"]
            }
            try:
                db.collection('stories').add(data)
            except Exception as e:
                print(f"An error occurred with firebase: {e}")
                return None

# Main process
def main():
    OPENAI_API_KEY = ''
    client = OpenAI(api_key=OPENAI_API_KEY)

    query_string = "term=vermont+history&entity=podcastEpisode&attribute=descriptionTerm&limit=20"
    itunes_data = query_itunes(query_string)

    if itunes_data:
        results = itunes_data.get("results", [])
        process_results(results, client)

if __name__ == "__main__":
    main()
