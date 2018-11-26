#!/bin/bash

function setup(){
    FLASK_APP=main.py
    REQUIREMENTS=requirements.txt

    echo Setting FLASK_APP=$FLASK_APP
    export FLASK_APP=$FLASK_APP

    eval "$(pyenv init -)"
    pyenv shell 3.7.1

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
    pyenv shell 2.7.12
    brew cask install google-cloud-sdk
    gcloud init
    gcloud components install beta
    gcloud components install cloud-datastore-emulator
    gcloud auth application-default login
    echo "Done!";
    echo "Run `flask run` in the backend directory to get started working locally."
}

function run(){
        pyenv local 2.7.12
        if command -v python2 &>/dev/null; then
            echo Python 2 is installed
        else
            echo "Warning! Python 2 is not installed, you might run into problems with the gcloud SDK"
        fi        
        gcloud beta emulators datastore start --no-store-on-disk &
        sleep 3
        gcloud beta emulators datastore env-init
        pyenv local 3.7.1
        python main.py
}

if [ $# -eq 0 ]
    then
        echo "No arguments supplied! Exiting."
        exit 1
fi

POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -r|--run)
        run
    ;;
    -i|--install)
        setup
    ;;
    *)    # unknown option
        echo "Unknown argument $key. Skipping"
    ;;
esac
done
set -- "${POSITIONAL[@]}" #


