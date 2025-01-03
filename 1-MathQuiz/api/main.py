from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from typing import Optional, List, Literal
from pydantic import BaseModel
import uvicorn

from cmq_questions import generate


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


class QuestionData(BaseModel):
    question: str
    answer: bool | str | int
    others_answers: Optional[List]
    subject: str
    response_type: str


class ChooseSubject(BaseModel):
    subjects: Optional[List[str | None]] = ["Algebra", "Arithmetic", "Trigonometry", "Geometry"]


@app.post('/api/generate')
async def generate_a_question(subjects: ChooseSubject):
    return generate(subjects.model_dump())


if __name__ == '__main__':
    uvicorn.run(app)
