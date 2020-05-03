import json
import re
import logging
from flask import Flask, render_template, request, make_response, Response
from functools import wraps

from google.appengine.ext import ndb

app = Flask(__name__)

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwards):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwards)
    return decorated

def check_auth(username, password):
    uname="parthematics@gmail.com"
    pwd="mypassword" # placeholder value, replace with correct auth credentials     
    return username == uname and password == pwd

def authenticate():
    return Response(
    'Invalid login.\n'
    'Invalid login.', 401,
    {'WWW-Authenticate': 'Basic realm="Login Required"'})

@app.route('/webhook/', methods=['POST'])
@requires_auth
def handle():
    req = request.get_json(silent=True, force=True)
    if req.get('queryResult').get('action') != 'lookup':
        return {}

    topic = req.get('queryResult').get('parameters').get('topic')
    topic = re.sub(r'[^\w\s]', '', topic)
    print(topic)
    rsp = getResponse(topic)
    rsp = json.dumps(rsp, indent=4)
    print(rsp)
    r = make_response(rsp)
    r.headers['Content-Type'] = 'application/json'
    return r

def getResponse(topic):
    #Get synonyms
    synonym_text = getSynonym(topic)
    action_text = getActionText(synonym_text)
    return buildReply(action_text)

def buildReply(info):
    return {
        'fulfillmentText': info,
    }

def getSynonym(query_text):
    synonym_key = ndb.Key('Synonym', query_text)
    synonyms = Synonym.query_synonym(synonym_key).fetch(1)

    synonym_text = ""
    for synonym in synonyms:
        synonym_text = synonym.synonym
        break

    return synonym_text

def getActionText(synonym_text):
    synonym_text = synonym_text.strip()
    topic_key = ndb.Key('Topic', synonym_text)
    topics = Topic.query_topic(topic_key).fetch(1)

    action_text = ""
    for topic in topics:
        action_text = topic.action_text

    if action_text == None or action_text == "":
        return ""

    return action_text

@app.errorhandler(500)
def server_error(e):
    # Log the error and stacktrace.
    print(e)
    return 'An internal error occurred.', 500

class Topic(ndb.Model):
    action_text = ndb.StringProperty()

    @classmethod
    def query_topic(cls, ancestor_key):
        return cls.query(ancestor=ancestor_key)

class Synonym(ndb.Model):
    synonym = ndb.StringProperty()

    @classmethod
    def query_synonym(cls, ancestor_key):
        return cls.query(ancestor=ancestor_key)
