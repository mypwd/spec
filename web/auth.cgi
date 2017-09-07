#!/usr/bin/python
#-*- coding: utf-8 -*-

# face api

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

import hashlib
from cgiheader import *
from common import *
import session
from time import localtime,strftime


class Auth(Protocol):
    def __init__(self):
        command_map = self.set_map()
        Protocol.__init__(self, command_map)
        self.auth_succ = 0
        self.response = ''
        self.sess = None

        
    def dispatcher(self):
        self.command_map[self.command][1]()
        
    def request_add_custom_remocon(self):
        self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", prop)
        return
    def set_session(self, s):
        self.sess = s

 
    def set_map(self):
        _map = {}
        _map['LoginRequest'] = ['LoginResponse', self.LoginRequest]
        _map['LogoutRequest'] = ['LogoutResponse', self.LogoutRequest]
        return _map

    def LoginRequest(self):
        if self.sess.has_session() == False:
            if (self.is_valid_password(self.properties['id'],self.properties['password']) == False) :
                self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_AUTH_FAIL, "fail")
                return
            else:
                self.sess.set_new_cookie()
                self.sess.save_user_information()

        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC, "succ")
        self.auth_succ = 1
        self.system_log('로그인 되었습니다')
        return    

    def LogoutRequest(self):
        if self.sess.has_session() == True:
            self.sess.delete_session()
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success")
        self.system_log('로그아웃 되었습니다')
        return
    def is_valid_password(self, id,pw):
        conf = self.load_json_file(USER_FILE)
        for u in conf['user']:
            if u['id'] == id:
                if u['password'] == pw:
                    return True
                else:
                    return False
        return False
    def system_log(self, log):
        db = Udb(FACE_DB_PATH)
        time_str = strftime('%Y-%m-%d %I:%M:%S', localtime())
        
        query = "insert into system_log (logtime, log) values('%s', '%s')"%(time_str, log)
        db.cur.execute(query)
        db.con.commit()
        db.con.close()
 
    
def main():
    auth = Auth()

    # check command
    if auth.check_command() == False:
        auth.response = auth.make_simple_response("unknown command", RESPONSE_CODE_INVALID_MESSAGE_CODE, "unkown command received")
    else:
        sess = session.Session()
        auth.set_session(sess)
        auth.dispatcher()
    
    if auth.auth_succ == 1:
        out = bld_cookie(sess.cookie)+bld_header() + auth.response
    else:
        out = bld_header() + auth.response
    print out

if __name__=='__main__':
    main()
