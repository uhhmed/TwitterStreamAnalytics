from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.probability import FreqDist
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords

sid = SentimentIntensityAnalyzer()


## =======================================================
## TOKENIZING
## =======================================================

def get_tokens(sentence):
    tokens = word_tokenize(sentence)
    clean_tokens = [word.lower() for word in tokens if word.isalpha()]
    return clean_tokens

def get_sentence_tokens(review):
    return sent_tokenize(review)


## =======================================================
## REMOVING STOPWORDS
## =======================================================

stop_words = set(stopwords.words("english"))
def remove_stopwords(sentence):
    filtered_text = []
    for word in sentence:
        if word not in stop_words:
            filtered_text.append(word)
    return filtered_text

## =======================================================
## FREQUENCY DISTRIBUTIONS
## =======================================================

def get_most_common(tokens):
    fdist = FreqDist(tokens)
    return fdist.most_common(10)

def get_most_common(tokens):
    fdist = FreqDist(tokens)
    return fdist.most_common(10)

def get_fdist(tokens):
    return (FreqDist(tokens))


## =======================================================
## VADER Classifier
## =======================================================
def get_vader_score(sent):
    # Polarity score returns dictionary
    ss = sid.polarity_scores(sent)
    data = {}
    for k in sorted(ss):
        print('{0}: {1}, '.format(k, ss[k]), end='')
        print()
        data[k] = ss[k]
    return data