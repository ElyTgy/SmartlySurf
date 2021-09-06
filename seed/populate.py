from pymongo import MongoClient
import random

client = MongoClient("mongodb://localhost:27017")
db = client['smartly-surf']
collection = db.processedvideos

collection.delete_many({})
urls = [
    "https://boot.belief.com/",
    "https://bone.com/",
    "https://boot.com",
    "https://brick.com",
    "https://art.com",
    "https://alarm.com",
    "https://bee.com",
    "https://example.com",
    "https://achiever.com",
    "https://account.com",
    "https://balance.com",
    "https://educ.com",
    "https://school.com",
    "https://asdsfsdfsdf.com"
]


emotions = ["angry", "disgust", "fear", "happy", "neutral", "sad", "suprise"]
datasets = []
for url in urls:
    data = {}
    data["url"] = url
    data["emotions"] = []
    data["time"] = 0
    for emotion in emotions:
        emotionTime = random.randint(0, 11520)
        data["emotions"].append({emotion : emotionTime})
        data["time"]  = data["time"] + emotionTime
    datasets.append(data)

#print(datasets)
collection.insert_many(datasets)