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
import os

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
        _map['GetItemListRequest'] = ['GetItemListResponse', self.GetItemListRequest]

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

        _map['GetHousingRequest'] = ['GetHousingResponse', self.GetHousingRequest]
        _map['AddHousingRequest'] = ['AddHousingResponse', self.AddHousingRequest]
        _map['DelHousingRequest'] = ['DelHousingResponse', self.DelHousingRequest]
        _map['GetHousingDataRequest'] = ['GetHousingDataResponse', self.GetHousingDataRequest]
        _map['ModifyHousingRequest'] = ['ModifyHousingResponse', self.ModifyHousingRequest]

        _map['GetModelRequest'] = ['GetModelResponse', self.GetModelRequest]
        _map['AddModelRequest'] = ['AddModelResponse', self.AddModelRequest]
        _map['DelModelRequest'] = ['DelModelResponse', self.DelModelRequest]
        _map['GetModelDataRequest'] = ['GetModelDataResponse', self.GetModelDataRequest]
        _map['ModifyModelRequest'] = ['ModifyModelResponse', self.ModifyModelRequest]


        return _map
    def _get_file(self, item):
        if item == 'sensor':
            return SENSOR_FILE
        elif item == 'housing':
            return HOUSING_FILE
        elif item == 'platform':
            return PLATFORM_FILE
        elif item == 'model':
            return MODEL_FILE
        
    def _add_item(self, item):
        fname = self._get_file(item)
        item_list = self.load_json_file(fname)
        
        for i in item_list[item]:
            if i["name"] == self.properties['name']:
                self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_ALREADY_EXISTS, "member already exists")
                return
        item_list[item].append(self.properties)
        self.save_json_file(fname, item_list)
        self.response = self.make_simple_response( RESPONSE_CODE_SUCC, "succ")
        return
    def _del_item(self, item):
        fname = self._get_file(item)
        item_list = self.load_json_file(fname)
        for i in xrange(len(item_list[item])):
            if item_list[item][i]["name"] == self.properties[item]:
                item_list[item].pop(i)
                self.save_json_file(fname, item_list)
                self.response = self.make_simple_response( RESPONSE_CODE_SUCC, "success")
                return
        self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_NO_SUCH_ID, "no such platform name")
        return
    def _mod_item(self, item):
        fname = self._get_file(item)
        item_list = self.load_json_file(fname)

        for i in xrange(len(item_list[item])):
            if item_list[item][i]['name'] == self.properties['name']:
                item_list[item][i] = self.properties
                self.save_json_file(fname, item_list)
                self.response = self.make_simple_response( RESPONSE_CODE_SUCC, '')
                return
        self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_NO_SUCH_ID, '')     
        
    def _get_item_data(self, item):
        fname = self._get_file(item)
        item_data = self.load_json_file(fname)
        for i in item_data[item]:
            if i['name'] == self.properties[item]:
                self.response = self.make_custom_response( RESPONSE_CODE_SUCC, '',i)
                return
        self.response = self.make_simple_response( RESPONSE_CODE_MEMBER_NO_SUCH_ID, 'no such platform name');
        return
    def _get_item(self, item):
        fname = self._get_file(item)
        j = self.load_json_file(fname)
        self.response = self.make_custom_response( RESPONSE_CODE_SUCC, '', j)
        return
    def get_name_array(self, li):
        al = []
        for l in li:
            al.append(l['name'])
        return al

    def GetParamRequest(self):
        j = self.load_json_file(PARAM_FILE)
        self.response = self.make_custom_response( RESPONSE_CODE_SUCC, '', j)
        return 
    def GetItemListRequest(self):
        p = {}
        j = self.load_json_file(PLATFORM_FILE)
        p['platform'] = self.get_name_array(j['platform'])
        j = self.load_json_file(SENSOR_FILE)
        p['sensor'] = self.get_name_array(j['sensor'])
        j = self.load_json_file(HOUSING_FILE)
        p['housing'] = self.get_name_array(j['housing'])
        j = self.load_json_file(MODEL_FILE)
        p['model'] = self.get_name_array(j['model'])
        self.response = self.make_custom_response( RESPONSE_CODE_SUCC, '', p)
        
    def GetPlatformRequest(self):
        self._get_item('platform')
    def AddPlatformRequest(self):
        self._add_item('platform')
    def DelPlatformRequest(self):
        self._del_item('platform')
    def ModifyPlatformRequest(self):
        self._mod_item('platform')
    def GetPlatformDataRequest(self):
        self._get_item_data('platform')

        
    def GetSensorRequest(self):
        self._get_item('sensor')
    def AddSensorRequest(self):
        self._add_item('sensor')
    def DelSensorRequest(self):
        self._del_item('sensor')
    def GetSensorDataRequest(self):
        self._get_item_data('sensor')
    def ModifySensorRequest(self):
        self._mod_item('sensor')

        
    def GetHousingRequest(self):
        self._get_item('housing')
    def AddHousingRequest(self):
        self._add_item('housing')
    def DelHousingRequest(self):
        self._del_item('housing')
    def GetHousingDataRequest(self):
        self._get_item_data('housing')
    def ModifyHousingRequest(self):
        self._mod_item('housing')

    def GetModelRequest(self):
        self._get_item('model')
    def AddModelRequest(self):
        self._add_item('model')
    def DelModelRequest(self):
        self._del_item('model')
    def GetModelDataRequest(self):
        self._get_item_data('model')
    def ModifyModelRequest(self):
        self._mod_item('model')

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
