start gcloud beta emulators datastore start --no-store-on-disk
timeout /t 3 /nobreak
call gcloud beta emulators datastore env-init > set_env.cmd
call set_env
del set_env.cmd
python main.py