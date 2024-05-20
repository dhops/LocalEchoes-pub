import requests
from openai import OpenAI
import json
from geopy.geocoders import Nominatim

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('../private/localechoes-firebase-adminsdk-qebyo-ae1d4b9fc2.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Function to query Library of Congress API
def query_library_of_congress(query_string):
    response = requests.get(f"https://www.loc.gov/search/?{query_string}&fo=json")
    if response.status_code == 200:
        return response.json()
    else:
        return None

def rate_description(client, description):
    try:
        prompt1 = """
            Please read the following description from a audio file and decide if it is about a particular geographical place (city, state, region, country, etc). Please fill in the json response by giving the name of the place (as specific as possible), the specific relevance of the content to that place (i.e. how particular is it to the place) on a scale of 1 to 5, how interesting the content would be for a visitor to that place on a scale of 1 to 5, how interesting the content would be for a local (to gain a deeper understanding of their own place) on a scale of 1 to 5, and the type of content it concerns: . If it is not about a particular place, please put 'N/A' for the place and 0 for the remaining fields. Please also give a boolean value called "precise" that is true if the place is smaller than a state, e.g. a county or town or village, and false if the place is larger.

            Description:
            """
        prompt2 = """
            Do not include any explanations, only provide a  JSON response  following this format without deviation.
            [{
              	"place": the place
              	"relevance to the place": a number from 1 to 5,
              	"interestingness to a visitor": a number from 1 to 5,
            	"interestingness to a local": a number from 1 to 5,
                "precise": boolean
                "type": culture, history, economy, nature, legend, or other
            }]
            The JSON response:
            """
        prompt = prompt1 + description + prompt2

        response = client.chat.completions.create(
          model="gpt-3.5-turbo-1106",
          response_format={ "type": "json_object" },
          messages=[
            {"role": "user", "content": prompt},
          ]
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    
def get_coordinates(locator, place_name):
    try:
        location = locator.geocode(place_name)
        return location.latitude, location.longitude
    except Exception as e:
        print(f"Geocoding error: {e}")
        return None, None

# Function to check scores and add to Firestore
# Function to check scores and add to Firestore
def process_results(results, client, locator):
    for result in results:
        # Concatenating description, notes, location, and date
        description_parts = []

        for field in ['description', 'notes', 'location', 'date']:
            value = result.get(field, "")
            if isinstance(value, list):
                description_parts.extend(value)
            elif isinstance(value, str):
                description_parts.append(value)
        
        full_description = " ".join(description_parts)

        # Rate the concatenated description
        gpt_data = rate_description(client, full_description)
        print(result.get("title"))
        # print(gpt_data)

        # Define your scoring criteria here
        if gpt_data and gpt_data["relevance to the place"] >= 4 and (gpt_data["interestingness to a visitor"] >= 4 or gpt_data["interestingness to a local"] >= 4):
            # Perform an additional JSON query using the result URL
            detail_response = requests.get(result.get("url") + "?fo=json")
            # print(detail_response)
            if detail_response.status_code == 200:
                detail_data = detail_response.json()
                # print(detail_data)
                
                audio_url = detail_data.get("resources")[0].get("audio", "")
                print(audio_url)
            else:
                print(f"Failed to retrieve details for {result.get('title')}")
                continue

            print(gpt_data["place"])
            if gpt_data["precise"]:
                lat, long = get_coordinates(locator, gpt_data["place"])
                if not (lat and long):
                    gpt_data["precise"] = False

            data = {
                "description": full_description,
                "title": result.get("title"),
                "gpt_place": gpt_data["place"],
                "audioRef": audio_url,  # Retrieved audio URL
                "location": result.get("location"),
                "date": result.get("date"),
                "coordinates": {"latitude": lat, "longitude": long},
                "local_interest": gpt_data["interestingness to a local"],
                "visitor_interest": gpt_data["interestingness to a visitor"],
                "relevance_to_place": gpt_data["relevance to the place"],
                "date": result.get("date"),
                "local": False,
                "source": "oral-history",
                "type": gpt_data["type"],
                "precise": gpt_data["precise"]
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

    geolocator = Nominatim(user_agent="test")

    # GOOGLE_API_KEY = ''

    query_string = "fa=online-format%3Aaudio%7Csubject%3Avermont&st=list&c=10"
    loc_data = query_library_of_congress(query_string)

    if loc_data:
        results = loc_data.get("results", [])
        process_results(results, client, geolocator)

if __name__ == "__main__":
    main()
