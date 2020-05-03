from google.cloud import datastore
import os
import dialogflow

try:
	os.chdir(os.path.join(os.getcwd(), 'scripts'))
	print(os.getcwd())
except:
	pass

get_ipython().system('pip install --upgrade pip')
get_ipython().system('yes | pip uninstall dialogflow')
get_ipython().system('pip install dialogflow==0.3.0')

client = datastore.Client()
query = client.query(kind='Topic')
results = list(query.fetch())

entity_types_client = dialogflow.EntityTypesClient()

project_id = get_ipython().getoutput('(gcloud config get-value project)')

project_agent_path = entity_types_client.project_agent_path(
        project_id[0])

for element in entity_types_client.list_entity_types(project_agent_path):
  if (element.display_name == 'Topic'):
    entity_type_path = element.name

project_id = get_ipython().getoutput('(gcloud config get-value project)')

entities = []

for result in results:
  entity = dialogflow.types.EntityType.Entity()
  entity.value = result.key.name
  entity.synonyms.append(result.key.name)

  entities.append(entity)

print(entities)

response = entity_types_client.batch_create_entities(
        entity_type_path, entities)

print('Entity created: {}'.format(response))



