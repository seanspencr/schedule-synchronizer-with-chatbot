
import spacy

ner = spacy.load("./output/model-best")

while True:
    user_input =  input("Input your schedule: ")
    doc = ner(user_input)
    for ent in doc.ents:
        print(ent.text, ent.label_)