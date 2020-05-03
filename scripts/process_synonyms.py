import os
import nltk
nltk.download('stopwords')
nltk.download('wordnet')
from nltk.corpus import stopwords
from nltk.corpus import wordnet
from sets import Set
stop = set(stopwords.words('english'))

from google.cloud import datastore
import inflect

try:
	os.chdir(os.path.join(os.getcwd(), 'scripts'))
	print(os.getcwd())
except:
	pass

# This script uses Python data science libraries and the Google Natural Language API to expand the vocabulary of COVID-19 Hub by generating synonyms for phrases and intents specified in index.js.
get_ipython().system('pip uninstall -y google-cloud-datastore')
get_ipython().system('pip install google-cloud-datastore')
get_ipython().system('pip install inflect')

datastore_client = datastore.Client()
client = datastore.Client()
query = client.query(kind='Topic')
results = list(query.fetch())

import inflect
plurals = inflect.engine()

# ## Extract Synonyms with Python
# Split the topic into words and use PyDictionary to look up synonyms in a "thesaurus" for each word.  Store these in Datastore and link them back to the topic.  Note this section uses the concept of "stop words" to filter out articles and other parts of speech that don't contribute to meaning of the topic.

for result in results:
  for word in result.key.name.split():
    if word in stop:
        continue

    
    synonyms = Set()
    for syn in wordnet.synsets(word):
      
      if ".n." in str(syn):

        for l in syn.lemmas():
          lemma = l.name()
          if (lemma.isalpha()):
            synonyms.add(lemma)
            synonyms.add(plurals.plural(lemma))
      
      if ".a." in str(syn):
        synonyms = Set()
        break

    print(result.key.name, word, synonyms)
    
    kind = 'Synonym'
    synonym_key = datastore_client.key(kind, result.key.name)

    synonym = datastore.Entity(key=synonym_key)
    synonym['synonym'] = result.key.name

    datastore_client.put(synonym)
    
    synonym_key = datastore_client.key(kind, word)

    synonym = datastore.Entity(key=synonym_key)
    synonym['synonym'] = result.key.name

    datastore_client.put(synonym)
    
    for dictionary_synonym in synonyms:
      
      synonym_key = datastore_client.key(kind, dictionary_synonym)

      synonym = datastore.Entity(key=synonym_key)
      synonym['synonym'] = result.key.name

      datastore_client.put(synonym)
      
    synonym_key = datastore_client.key(kind, plurals.plural(word))

    synonym = datastore.Entity(key=synonym_key)
    synonym['synonym'] = result.key.name

    datastore_client.put(synonym)
    


