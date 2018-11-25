start gcloud beta emulators datastore start --no-store-on-disk
timeout /t 3 /nobreak
call gcloud beta emulators datastore env-init
call set_vars.cmd
python main.py