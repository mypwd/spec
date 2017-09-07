#!/usr/bin/python

import os,sys


#import time

import sha, shelve, time, Cookie
from  cgiheader import *

DEFAULT_EXPIRE_TIME = 60*60*24

class Session(object):
    def __init__(self):
        self.data = None
        string_cookie = os.environ.get('HTTP_COOKIE', '')
        self.cookie = Cookie.SimpleCookie()
        self.cookie.load(string_cookie)
        self.session_dir = '/tmp/'
        if not os.path.exists(self.session_dir):
            os.mkdir(self.session_dir, 0777)


        self.has_cookie = False

        if self.cookie.get('sid'):
            if os.path.isfile( self.session_dir + '/sess_' + self.cookie.get('sid').value):
                self.has_cookie = True
            
    def is_set_cookie(self):
        return self.has_cookie

    def get_sid(self):
        if self.cookie.has_key('sid'):
            return self.cookie['sid'].value
        else:
            return ''
    def set_new_cookie(self):
        self.sid = sha.new(repr(time.time())).hexdigest()
        self.cookie.clear()
        self.cookie['sid'] = self.sid
        self.cookie['sid']['path'] = '/'
        self.cookie['sid']['expires'] = DEFAULT_EXPIRE_TIME
        
    def save_user_information(self):
        self.data = shelve.open(self.session_dir + '/sess_' + self.sid, writeback=True)
        self.data.close()
        
    def get_user_information(self):
        d = {}
        if self.has_cookie == False:
            return None
        try:
            self.data = shelve.open(self.session_dir + '/sess_' + self.get_sid())
        except:
            return None
        self.data.close()
        return d

    def has_session(self):
        return self.has_cookie

    def delete_session(self):
        try:
            path = self.session_dir + '/sess_' + self.get_sid()
            os.unlink(path) 
        except:
            pass
