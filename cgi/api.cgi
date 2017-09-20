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

        _map['GetParamRequest'] = ['GetParamResponse', self.GetParamRequest]

        _map['GetPlatformRequest'] = ['GetPlatformResponse', self.GetPlatformRequest]
        _map['AddPlatformRequest'] = ['AddPlatformResponse', self.AddPlatformRequest]
        _map['DelPlatformRequest'] = ['DelPlatformResponse', self.DelPlatformRequest]
        _map['ModifyPlatformRequest'] = ['ModifyPlatformResponse', self.ModifyPlatformRequest]
        _map['GetPlatformDataRequest'] = ['GetPlatformDataResponse', self.GetPlatformDataRequest]

        _map['GetSensorRequest'] = ['GetSensorResponse', self.GetSensorRequest]
        _map['AddSensorRequest'] = ['AddSensorResponse', self.AddSensorRequest]
        _map['DelSensorRequest'] = ['DelSensorResponse', self.DelSensorRequest]
        _map['GetSensorDataRequest'] = ['GetSensorDataResponse', self.GetSensorDataRequest]
        _map['ModifySensorRequest'] = ['ModifySensorResponse', self.ModifySensorRequest]
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
        name = ''

        for p in platform["platform"]:
            if p["name"] == self.properties['name']:
                self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_ALREADY_EXISTS, "member already exists")
                return
        platform["platform"].append(self.properties)
        self.save_json_file(PLATFORM_FILE, platform)
        self.response = self.make_simple_response( RESPONSE_CODE_SUCC, "succ")
        return
    def DelPlatformRequest(self):
        platform = self.load_json_file(PLATFORM_FILE)
        for i in xrange(len(platform["platform"])):
            if platform["platform"][i]["name"] == self.properties['platform']:
                platform["platform"].pop(i)
                self.save_json_file(PLATFORM_FILE, platform)
                self.response = self.make_simple_response( RESPONSE_CODE_SUCC, "success")
                return
        self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_NO_SUCH_ID, "no such platform name")
        return
    def ModifyPlatformRequest(self):
        platform = self.load_json_file(PLATFORM_FILE)
        for i in xrange(len(platform["platform"])):
            if platform['platform'][i]['name'] == self.properties['name']:
                platform["platform"][i] = self.properties
                self.save_json_file(PLATFORM_FILE, platform)
                self.response = self.make_simple_response( RESPONSE_CODE_SUCC, '')
                return
        self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_NO_SUCH_ID, '')     
    def GetPlatformDataRequest(self):
        platform_data = self.load_json_file(PLATFORM_FILE)
        for p in platform_data['platform']:
            if p['name'] == self.properties['platform']:
                self.response = self.make_custom_response( RESPONSE_CODE_SUCC, '',p)
                return
        self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_NO_SUCH_ID, 'no such platform name');
        return


    def GetSensorRequest(self):
        j = self.load_json_file(SENSOR_FILE)
        self.response = self.make_custom_response( RESPONSE_CODE_SUCC, '', j)
        return
    def AddSensorRequest(self):
        sensor = self.load_json_file(SENSOR_FILE)
        name = ''

        for p in sensor["sensor"]:
            if p["name"] == self.properties['name']:
                self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_ALREADY_EXISTS, "member already exists")
                return
        sensor["sensor"].append(self.properties)
        self.save_json_file(SENSOR_FILE, sensor)
        self.response = self.make_simple_response( RESPONSE_CODE_SUCC, "succ")
        return
    def DelSensorRequest(self):
        sensor = self.load_json_file(SENSOR_FILE)
        for i in xrange(len(sensor["sensor"])):
            if sensor["sensor"][i]["name"] == self.properties['sensor']:
                sensor["sensor"].pop(i)
                self.save_json_file(SENSOR_FILE, sensor)
                self.response = self.make_simple_response( RESPONSE_CODE_SUCC, "success")
                return
        self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_NO_SUCH_ID, "no such sensor name")
        return
    def GetSensorDataRequest(self):
        sensor_data = self.load_json_file(SENSOR_FILE)
        for p in sensor_data['sensor']:
            if p['name'] == self.properties['sensor']:
                self.response = self.make_custom_response( RESPONSE_CODE_SUCC, '',p)
                return
        self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_NO_SUCH_ID, 'no such sensor name');
        return
    def ModifySensorRequest(self):
        sensor = self.load_json_file(SENSOR_FILE)
        for i in xrange(len(sensor["sensor"])):
            if sensor['sensor'][i]['name'] == self.properties['name']:
                sensor["sensor"][i] = self.properties
                self.save_json_file(SENSOR_FILE, sensor)
                self.response = self.make_simple_response( RESPONSE_CODE_SUCC, '')
                return
        self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_NO_SUCH_ID, '')     


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
