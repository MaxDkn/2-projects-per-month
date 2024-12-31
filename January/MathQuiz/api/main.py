from fastapi import FastAPI
from typing import Optional, List, Literal
from pydantic import BaseModel
import uvicorn

from questions import generate_question, verify_answer


app = FastAPI()


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
    return generate_question(subjects.model_dump())


@app.post('/api/verify')
async def verify_an_answer(question_data: QuestionData, answer: str or int or bool):
    return verify_answer(question_data=question_data.model_dump(), answer=answer)


if __name__ == '__main__':
    uvicorn.run(app)
