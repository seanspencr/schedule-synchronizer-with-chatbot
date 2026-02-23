from huggingface_hub import login, upload_folder

login()

upload_folder(folder_path="./output/model-best", repo_id="seanspencr/calendar_ner", repo_type="model")