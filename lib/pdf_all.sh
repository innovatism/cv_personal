#!/bin/bash
# From https://github.com/rreusser/gulp-latex/issues/2
# Compiles every tex file within the parent dir

PATTERN="*.tex"
IGNORED_TEX_FILE="structure.tex"
IGNORED_FOLDER="*node_modules/*"

BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"
TEX_FILE_LIST=$(find . -type f -not -path "$IGNORED_FOLDER" \( -iname "*.tex" ! -iname "$IGNORED_TEX_FILE" \))

for texFile in $TEX_FILE_LIST; do 
    cd $BASE_DIR
    directory=$(dirname "${texFile}")
    filename=$(basename "${texFile}")
    pdflatex -interaction=nonstopmode $filename

done


cd $BASE_DIR

exit 0
