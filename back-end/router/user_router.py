from fastapi import APIRouter, Depends, HTTPException, Response, status, Request
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordBearer
from service import user_service
from utilmodel.token import Token, TokenData
from lib.auth import create_access_token, get_current_user_from_cookie, verify_token
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.config import Config

router = APIRouter()

config = Config('.env')
oauth = OAuth(config)

oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@router.get("/users/", tags=["users"])
async def read_users():
    return user_service.get_all_users()

@router.post("/users/", tags=["users"])
async def create_user(name: str, password: str):
    print("Received request to create user with name:", name)
    return user_service.create_user(name, password)

@router.post("/users/me", tags=["users"])
async def validate_access_token(token_data : TokenData = Depends(get_current_user_from_cookie)):
    return {"token": token_data}


@router.post("/token", response_model=Token)
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    print("Login attempt for :", form_data)
    user = user_service.login(form_data.username, form_data.password)
    print(user)
    if not user or user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    response.set_cookie(key="bearer", value=access_token, httponly=True)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get('/login/google')
async def login_google(request: Request):
    redirect_uri = request.url_for('auth_via_google')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google")
async def auth_via_google(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = token['userinfo']
    return dict(user)

# contoh token google yang direturn auth_via_google
# {
#   "iss": "https://accounts.google.com",
#   "azp": "520092087802-rt87st33l18u8q3t8flm4273412vmpsl.apps.googleusercontent.com",
#   "aud": "520092087802-rt87st33l18u8q3t8flm4273412vmpsl.apps.googleusercontent.com",
#   "sub": "115603165127383067071",
#   "email": "seanspencer280806@gmail.com",
#   "email_verified": true,
#   "at_hash": "ylvXEWHqjd6ftlQ3dDiwVw",
#   "nonce": "jn5G0QTObLe7osbnClMk",
#   "name": "Sean Spencer",
#   "picture": "https://lh3.googleusercontent.com/a/ACg8ocI3oHoa8geWFc9phlqbu9_2rttD_WrK9vpC-pzhns6KiZQPa-XX=s96-c",
#   "given_name": "Sean",
#   "family_name": "Spencer",
#   "iat": 1771478445,
#   "exp": 1771482045
# }

@router.get("/auth/microsoft")
async def auth_via_microsoft(request: Request):
    return HTMLResponse(content="<h1>Microsoft Auth Not Implemented</h1>", status_code=501)
