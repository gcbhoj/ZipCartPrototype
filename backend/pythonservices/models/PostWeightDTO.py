from dataclasses import dataclass

# Data transfer model to post the weight of the loose items to spring

@dataclass
class PostWeightDTO:
    transactionid: str
    itemId:str
    weight:float