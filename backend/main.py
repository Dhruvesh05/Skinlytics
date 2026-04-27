from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Base, engine
from backend import models
from backend.routes import auth, history, predict, profile, recommend, routine

app = FastAPI(title="Skinlytix API", version="1.0")


Base.metadata.create_all(bind=engine)


# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Production React app
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# Health check
@app.get("/")
def root():
    return {"message": "Skinlytix API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


# Include routes
app.include_router(predict.router, prefix="/api")
app.include_router(recommend.router, prefix="/api")
app.include_router(routine.router, prefix="/api")
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(profile.router, tags=["Profile"])
app.include_router(history.router, tags=["History"])