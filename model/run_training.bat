SET train_path=./train.spacy
SET dev_path=./dev.spacy
set NVCC_PREPEND_FLAGS=-allow-unsupported-compiler
python -m spacy train config.cfg --output ./output --paths.train %train_path% --paths.dev %dev_path% --gpu-id 0