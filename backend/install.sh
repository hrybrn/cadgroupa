#!/bin/bash

FLASK_APP=main.py
REQUIREMENTS=requirements.txt

echo Setting FLASK_APP=$FLASK_APP
export FLASK_APP=$FLASK_APP

PYTHONVERSION=$(python --version | sed 's/[^0-9]*//g')
if [ "$PYTHONVERSION" -ge 360 -a "$PYTHONVERSION" -le 372 ]; then
    echo "$PYTHONVERSION is acceptable";
else 
    echo "$PYTHONVERSION is too low! Install a python version between 3.6 and 3.7.2" 
    exit 1
fi

echo "Installing PIP Requirements..."
if [ ! -f $REQUIREMENTS ]; then
    echo "Error - $REQUIREMENTS not found! Check it exists then try again"
    exit 1
fi
pip install -r $REQUIREMENTS
brew install gcloud
gcloud components install cloud-datastore-emulator
gcloud auth application-default login
echo "Done!";
echo "Run `flask run` in the backend directory to get started working locally."