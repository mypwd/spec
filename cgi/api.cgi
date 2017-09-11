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


class Specapi(Protocol):
    def __init__(self):
        command_map = self.set_map()
        Protocol.__init__(self, command_map)

        self.response = ''

    def dispatcher(self):
        self.command_map[self.command][1]()
        
    def set_map(self):
        _map = {}
        _map['GetPlatformRequest'] = ['GetPlatformResponse', self.GetPlatformRequest]
        _map['GetParamRequest'] = ['GetParamResponse', self.GetParamRequest]
        _map['AddPlatformRequest'] = ['AddPlatformResponse', self.AddPlatformRequest]
        return _map
    
    def GetPlatformRequest(self):
        j = self.load_json_file(PLATFORM_FILE)
        self.response = self.make_custom_response( RESPONSE_CODE_SUCC, '', j)
        return
    def GetParamRequest(self):
        j = self.load_json_file(PARAM_FILE)
        self.response = self.make_custom_response( RESPONSE_CODE_SUCC, '', j)
        return
    def AddPlatformRequest(self):
        platform = self.load_json_file(PLATFORM_FILE)
        for p in platform["platform"]:
            if p["name"] == self.properties["name"]:
                self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_ALREADY_EXISTS, "member already exists")
                return
        platform["platform"].append(self.properties)
        self.save_json_file(PLATFORM_FILE, platform)
        self.response = self.make_simple_response( RESPONSE_CODE_SUCC, "succ")
        return
    
def main():
    specapi = Specapi()

    sess = session.Session()

    if sess.has_session() == False:
        specapi.make_simple_response_without_session( RESPONSE_CODE_UNAUTHORIZED, 'unauthorized access');
        exit(-1)
    # check command
    if specapi.check_command() == False:
        specapi.response = specapi.make_simple_response( RESPONSE_CODE_INVALID_MESSAGE_CODE, "unkown command received")
    else:
        specapi.dispatcher()

    out = bld_header() + specapi.response
    print out

if __name__=='__main__':
    main()
