from novanest_app.models import User, MockTest
from rest_framework_simplejwt.tokens import RefreshToken
from django.test import Client
import json

# create or get test user
user, created = User.objects.get_or_create(register_number='test1000', defaults={'username':'testuser','email':'test@example.com','role':'student'})
if created:
    user.set_password('TestPass123!')
    user.save()

# build token
refresh = RefreshToken.for_user(user)
access = str(refresh.access_token)
print('Created user:', user.register_number, 'created=', created)
print('Access token (first 40 chars):', access[:40])

# use test client to call API endpoints
client = Client(HTTP_AUTHORIZATION='Bearer ' + access)
resp = client.get('/api/mocktests/')
print('\nGET /api/mocktests/ status:', resp.status_code)
try:
    print('Body keys:', list(resp.json().keys()) if resp.content else 'no content')
except Exception as e:
    print('Could not parse JSON:', e)

# call questions for test id 1
resp2 = client.get('/api/mocktests/1/questions/')
print('\nGET /api/mocktests/1/questions/ status:', resp2.status_code)
if resp2.status_code == 200:
    data = resp2.json()
    questions = data.get('questions', [])
    print('Questions count:', len(questions))
    # prepare sample answers: pick option 0 for each question
    answers = {str(q['id']): 0 for q in questions[:5]}
    payload = {'test': 1, 'answers': answers}
    resp3 = client.post('/api/mocktests/submit/', data=json.dumps(payload), content_type='application/json')
    print('\nPOST /api/mocktests/submit/ status:', resp3.status_code)
    try:
        print('Submission response:', resp3.json())
    except Exception as e:
        print('No JSON response or error:', e)
else:
    print('No questions endpoint data')
