from django.conf import settings
import requests
import os
import uuid
from .config import TEST_RATE_COEF, MISSION_RATE_COEF
import json
from student.models import SkillTest

def generate_random_id()-> str:
    return str(uuid.uuid4())

def clean_json_content(content: str) -> str:
    """
    Prend le contenu d'un fichier (sous forme de chaîne)
    et retourne ce contenu sans les balises ```json et ```.
    """
    lines = content.splitlines()
    cleaned_lines = [line for line in lines if line.strip() not in ("```json", "```")]
    return "\n".join(cleaned_lines)

def make_skill_test(skill: str):
    prompt = f"Génère moi un bon test qcm de niveau en {skill} au format json (questions: [] ). Chaque objet question contient title & choices: [text, is_correct].\nJuste le test rien d'autres. Retourne uniquement du JSON brut valide."
    key = settings.AI_KEY
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",  # ou "deepseek-coder" pour le modèle orienté code
        "messages": [
            {"role": "user", "content": prompt}
        ],
    }
    response = requests.post(url, headers=headers, json=data).json()
    # print(response)
    raw = response["choices"][0]["message"]["content"]
    return clean_json_content(raw)

def make_file(file):
    ext = os.path.splitext(file.name)[1].lower()
    name = f'{generate_random_id()}{ext}'
    file.name = name
    return file

def correct_skill_test(response: dict, questions: list[dict])-> float:
    rate = 0.0
    question_rate = len(questions) / 10
    index = 0
    for question in questions:
        if (not response.get(f'{index}')):
            print("Response not found")
            index +=1
            continue
        if (question.get("choices")[int(response.get(f"{index}"))]["is_correct"] == True):
            rate += question_rate
        index += 1
    return rate

def compute_skill_rate(mission_rate, test_rate):
    total = (mission_rate*MISSION_RATE_COEF) + (test_rate*TEST_RATE_COEF)
    return total

def parse_test_file(skill_test: SkillTest):
    if not skill_test.file:
        return None

    # Accès au fichier depuis le champ FileField
    with skill_test.file.open(mode='r') as f:
        try:
            data = json.load(f)
            return data
        except json.JSONDecodeError as e:
            print("Erreur JSON :", e)
            return None
