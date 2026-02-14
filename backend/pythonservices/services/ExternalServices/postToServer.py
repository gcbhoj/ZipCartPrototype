from dataclasses import asdict
import requests
from models.PostWeightDTO import PostWeightDTO





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
    