from fastapi.testclient import TestClient
from backend.main import app
import uuid
c=TestClient(app)
email=f'user_{uuid.uuid4().hex[:8]}@example.com'
s=c.post('/auth/signup', json={'email':email,'password':'Password123!'})
l=c.post('/auth/login', json={'email':email,'password':'Password123!'})
token=l.json().get('access_token','')
headers={'Authorization': f'Bearer {token}'}
p=c.get('/profile', headers=headers)
hsave=c.post('/history/save', json={'skin_type':'Oily','sensitivity':'Low','concern':'Acne','result':{'ingredient':'Niacinamide','confidence':94}}, headers=headers)
hget=c.get('/history', headers=headers)
has_p = '/api/predict' in app.openapi()['paths']
print('SIGNUP_STATUS', s.status_code)
print('LOGIN_STATUS', l.status_code)
print('PROFILE_STATUS', p.status_code)
print('SAVE_HISTORY_STATUS', hsave.status_code)
print('GET_HISTORY_STATUS', hget.status_code)
print('HAS_API_PREDICT', has_p)