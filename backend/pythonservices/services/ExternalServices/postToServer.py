from dataclasses import asdict
import requests
from models.PostWeightDTO import PostWeightDTO




#The following method can be used to send post requests between sping boot applicaiton and python services
# The following method takes the postweightdto and the path as a variable and sends the object weight

def send_post_request_to_spring(postWeightDto: PostWeightDTO, springPath: str):
    payload = asdict(postWeightDto)
    
    headers={
        "Content-type":"application/json"
    }
    
    try:
        response = requests.post(
            springPath,
            json=payload,
            headers= headers)
        
        if response.status_code == 200 or response.status_code == 201:
            
            print("Success:", response.json())
            
            return response.json()
        
        else:
            print("Failed with status:", response.status_code)
            
            print("Response:", response.text)
            
            return None

    except Exception as e:
        print("Error occurred:", e)
        return None
    