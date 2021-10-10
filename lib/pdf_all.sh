#!/bin/bash
# From https://github.com/rreusser/gulp-latex/issues/2
# Compiles every tex file within the parent dir

PATTERN="*.tex"
IGNORED_TEX_FILE="structure.tex"
IGNORED_FOLDER="*node_modules/*"

BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/../src && pwd )"
TEX_FILE_LIST=$(find -L . -type f -not -path "$IGNORED_FOLDER" \( -iname "*.tex" ! -iname "$IGNORED_TEX_FILE" \))

if [ -z "${TEX_FILE_LIST[0]}" ]; then
    echo "No tex files found!";
    exit 1;
fi

for texFile in $TEX_FILE_LIST; do 
    cd $BASE_DIR
    directory=$(dirname "${texFile}")
    filename=$(basename "${texFile}")
    echo "pdflatex -interaction=nonstopmode $filename"
    pdflatex -interaction=nonstopmode $filename
done

cd $BASE_DIR
