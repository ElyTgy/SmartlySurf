from pymongo import MongoClient
import random

client = MongoClient("mongodb://localhost:27017")
db = client['smartly-surf']
collection = db.processedvideos

collection.delete_many({})
urls = [
    "https://www.instagram.com/",
    "https://www.tiktok.com/",
    "https://devpost.com/",
    "https://www.codechef.com/",
    "https://codeforces.com/",
    "https://www.reddit.com/",
    "https://www.canva.com/",
    "https://discord.com/",
    "https://www.facebook.com/",
    "https://github.com/",
    "https://WeGame.com",
    "https://www.geeksforgeeks.org/",
    "https://www.youtube.com/",
    "https://www.topcoder.com/"
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