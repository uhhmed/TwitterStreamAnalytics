from os import stat
from creds import *
from tweepy import OAuthHandler, API, parsers
from data.DBHelper import DBHelper
from tweepy.streaming import StreamListener
from textblob import TextBlob
from termcolor import colored
from datetime import datetime as dt
import spacy
import time

# nlp = spacy.load('en_core_web_trf')
db = DBHelper()



auth = OAuthHandler(api_key, api_secret_key)
auth.set_access_token(access_token, access_token_secret)
api = API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True, parser=parsers.JSONParser())


'''
Tweepy Stream class that bypasses tweets that are retweeted (so to get only original tweets)
it then connects to the db and inserts a tweet with its details (tweet text, author, created date, full text [if available] )

TODO:
- pass each tweet to a sentiment analyzer using `Textblob`
- classify each tweet based on its sentiment
- get more data per tweet to show on client end
'''

class Listener(StreamListener):
    
    tweets = { 'tweets_and_scores': [{
   'tweet': '',
   'sentiment': {},
   'timestamp': dt.now(),
   'screen_name': '',
   'location': '',


        }]
    }

    def __init__(self):
        super(Listener, self).__init__()
        # self.output_file = output_file
        self.count = 0

    def on_status(self, status):
        if (status.text != ''):
            if hasattr(status, "retweeted_status"):
                pass
            else:
                try:
                    # doc = nlp(status.extended_tweet["full_text"])
                    print('🚀'*60)
                    print(status)
                    db.__connect__()
                    db.insert(('', status.created_at, status.user.name ,status.user.screen_name, status.user.location, status.extended_tweet["full_text"]))
                    # print(status.extended_tweet["full_text"])
                    # print(status.created_at)
                except:
                    # doc = nlp(status.text)
                    print('🚀'*60)
                    print(status)
                    db.insert((status.text, status.created_at, status.user.name ,status.user.screen_name, status.user.location, ''))
                    # print(status.text)
                    # print(status.created_at)
            # print('Tweet being analyzed...', '\n', colored(status.text, 'blue'))
            # tweet = TextBlob(status.text)
            # determine if sentiment is positive, negative, or neutral
            # if tweet.sentiment.polarity < 0:
            #     sentiment = colored("negative", "white","on_red")
            # elif tweet.sentiment.polarity == 0:
            #     sentiment = colored("neutral", "yellow","on_grey")
            # else:
            #     sentiment = colored("positive", "white","on_green")
            # print('Sentiment of Tweet: ', sentiment, '\n', 'Polarity: ', tweet.sentiment.polarity)
            # for token in doc:
            #     print(token.text, token.pos_, token.dep_)

            return status

    def on_limit(self,status):
        print ("Rate Limit Exceeded, Sleep for 15 Mins")
        time.sleep(15 * 60)
        return True


    def on_error(self, status_code):
        if status_code == 420:
            return False
        print(status_code)
        return False


