#!/usr/bin/python

import sys
import time
import logging
import shutil
import os
from watchdog.observers import Observer
from watchdog.events import LoggingEventHandler

import hackskulpt

def skip_file(fname):
    base = os.path.basename(fname)
    if len(base) < 1:
        print 'skip file: ' + base + ' true'
        return True
    if base[0] == '.' or base[0] == '#' or base[len(base) - 1] == '~':
        print 'skip file: ' + base + ' true'
        return True
    return False

class BuildEventHandler(LoggingEventHandler):
    """Logs all the events captured."""
    def do_copy(self):
        if not os.access(self._dest, os.F_OK):
            os.mkdir(self._dest)

        hackskulpt.dist()
        files = ['skulpt.js', 'skulpt-stdlib.js']
        for f in files:
            src_file = self._dist + '/' + f
            shutil.copy(src_file, self._dest)

    def __init__(self, dist, dest):
        super(BuildEventHandler, self).__init__()
        self._dest = dest
        self._dist = dist
        self.do_copy()

    def on_moved(self, event):
        super(BuildEventHandler, self).on_moved(event)
        if event.is_directory or skip_file(event.src_path):
            return
        self.do_copy()

    def on_created(self, event):
        super(BuildEventHandler, self).on_created(event)
        if event.is_directory or skip_file(event.src_path):
            return
        self.do_copy()

    def on_deleted(self, event):
        super(BuildEventHandler, self).on_deleted(event)
        if event.is_directory or skip_file(event.src_path):
            return
        self.do_copy()

    def on_modified(self, event):
        super(BuildEventHandler, self).on_modified(event)
        if event.is_directory or skip_file(event.src_path):
            return
        self.do_copy()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print 'usage: ./tmp/watch.py [destination]'
        exit(1)

    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    dest_path = sys.argv[1]
    dist_path = './dist'
    src_path = './src'
    event_handler = BuildEventHandler(dist_path, dest_path)

    # If there is a third argument, assume it means quit after generation.
    if len(sys.argv) > 2:
        exit(0)

    observer = Observer()
    observer.schedule(event_handler, src_path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        observer.join()