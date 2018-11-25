gcloud beta emulators datastore start --no-store-on-disk &
sleep 3
call gcloud beta emulators datastore env-init
python main.py