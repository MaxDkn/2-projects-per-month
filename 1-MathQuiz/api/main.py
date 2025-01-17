from fastapi.requests import Request
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from typing import Optional, List
from pydantic import BaseModel
import uvicorn
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from multiple_choice_quiz import generate_mcq_question


app = FastAPI()
logger = logging.getLogger('uvicorn.error')


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
    return generate_mcq_question(**subjects.model_dump())


try:
    app.mount('/static', StaticFiles(directory="../ui/build/static"), 'static')
    templates = Jinja2Templates(directory="../ui/build")
except Exception as e:
    logger.warning(f'Error, cannot display react app ({e.__str__()} - {e.args}).')
else:
    logger.info('React App successfuly found running on ["/"]')

    @app.get('/{rest_of_path:path}', tags=['React App'])
    async def react_app(req: Request, rest_of_path: str):
        return templates.TemplateResponse('index.html', {'request': req})


if __name__ == '__main__':

    for _ in range(10):
        print(generate_mcq_question(subjects=['Arithmetic']))
    uvicorn.run(app)
