from dataclasses import dataclass


@dataclass
class PostWeightDTO:
    transactionid: str
    itemId:str
    weight:float