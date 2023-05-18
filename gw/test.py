import os
import time
from google.cloud import storage
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from watchdog.events import FileSystemEvent

# GCP 설정
bucket_name = 'awdfaf_storage'
service_account_json = './helical-button-381600-09e0ad9040c9.json'
storage_client = storage.Client.from_service_account_json(service_account_json)
bucket = storage_client.get_bucket(bucket_name)

class FileHandler(FileSystemEventHandler):
    def on_created(self, event):
        filepath = event.src_path
        filename = os.path.basename(filepath)

        # 파일이 폴더가 아니고, '.mp3' 파일인 경우에만 업로드
        if os.path.isfile(filepath) and filename.endswith('.mp3'):
            print(f'{filename} has been created, will upload when next file is created...')

# 감시할 폴더 설정
folder_to_watch = './test'
event_handler = FileHandler()
observer = Observer()
observer.schedule(event_handler, folder_to_watch, recursive=True)

# 감시 시작
observer.start()
print('Start watching the folder...')

# 순서대로 파일을 업로드
index = 0
previous_filepath = None
while True:
    filename = f"{index}.mp3"
    filepath = os.path.join(folder_to_watch, filename)

    if os.path.exists(filepath):
        if previous_filepath:
            print(f'Start uploading {os.path.basename(previous_filepath)} to GCP...')
            blob = bucket.blob(os.path.basename(previous_filepath))
            blob.upload_from_filename(previous_filepath)
            print(f'{os.path.basename(previous_filepath)} has been uploaded.')
        previous_filepath = filepath
        index += 1
    else:
        time.sleep(1)  # 파일이 아직 생성되지 않았다면 1초 동안 대기

try:
    while True:
        pass
except KeyboardInterrupt:
    observer.stop()
observer.join()
