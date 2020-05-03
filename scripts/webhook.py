import os
import json
import re
from flask import Flask, request, jsonify, make_response
from google.cloud import datastore

try:
	os.chdir(os.path.join(os.getcwd(), 'scripts'))
	print(os.getcwd())
except:
	pass

# get_ipython().system('pip install flask')

app = Flask(__name__)

@app.route('/webhook/', methods=['POST'])
def handle():
    req = request.get_json(silent=True, force=True)
    print('Request:')
    print(json.dumps(req, indent=4))
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
    client = datastore.Client()
    query = client.query(kind='Synonym')
    key = client.key('Synonym', topic)
    query.key_filter(key, '=')
    results = list(query.fetch())
    
    if len(results) == 0:
        return buildReply('I can\'t find any synonyms for that phrase')
    
    print(results[0]['synonym'])
    
    query = client.query(kind='Topic')
    key = client.key('Topic', results[0]['synonym'])
    query.key_filter(key, '=')
    results = list(query.fetch())
    
    print(results[0]['action_text'])
    
    return buildReply(results[0]['action_text'])

def buildReply(info):
    return {
        'fulfillmentText': info,
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0')


