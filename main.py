from flask.cli import prepare_import
import spacy
# from spacy.lang.en import English, tokenizer_exceptions
# from spacy.lang.ar.examples import sentences 
from data.TwitterData import Listener, api
from data.DBHelper import DBHelper
from tweepy.streaming import Stream
import tweepy
from flask import Flask, render_template, stream_with_context, Response
from flask_cors import CORS
import json



app = Flask(__name__)
CORS(app)

listener = Listener()
stream = Stream(auth=api.auth, listener=listener)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dataStream')
def streamData():
    print('starting...')
    try:
        # stream.filter(track=['#Champ'])
        # stream.filter(track=['STILL WITH YOU'])
        return '200'
    except tweepy.TweepError as e:
        print(e)
        print(e.reason)
        return '500'


@app.route('/stopStream')
def stop():
    # def gen():
    print('stopping...')
    try:
        stream.disconnect()
        return '200'
    except tweepy.TweepError as e:
        print(e)
        print(e.reason)
        return '500'


@app.route('/data')
def fetchLatest():
    print('fetching latest tweets...')
    db = DBHelper()
    db.__connect__()
    result = db.fetch('select * from tweets order by id desc')
    print('Fetched 👍')
    return json.dumps(result, default=str)



if __name__ == "__main__":
    app.run(debug=True)

