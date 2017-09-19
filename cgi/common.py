#!/usr/bin/python
# -*- coding: utf-8 -*-


H_CODING = "utf-8"
H_CODING2 = "utf-8-sig"
import logging
import logging.handlers
import fcntl
import sys,os
import json
#import zmq
from cgiheader import *
#import codecs
import socket

reload(sys)
sys.setdefaultencoding(H_CODING)
import sqlite3 as db

LOG_FILE = '/tmp/cgilog.log'
logger = logging.getLogger('logger')
logger.setLevel(logging.DEBUG)

handler = logging.handlers.RotatingFileHandler(LOG_FILE, maxBytes=102400, backupCount=3)

logger.addHandler(handler)

# for latex escape
import re
def tex_escape(text):
    """
        :param text: a plain text message
        :return: the message escaped to appear correctly in LaTeX
    """
    conv = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\^{}',
        '\\': r'\textbackslash{}',
        '<': r'\textless ',
        '>': r'\textgreater ',
    }
    regex = re.compile('|'.join(re.escape(unicode(key)) for key in sorted(conv.keys(), key = lambda item: - len(item))))
    return regex.sub(lambda match: conv[match.group()], text)
        
class Udb:
    def __init__(self, path):
        self.con = None
        self.cur = None
        self.con = db.connect(path)
        self.cur = self.con.cursor()

    # SQL SUPPORT
    
    def make_dic_with_field_name(self, desc, row):
        data = {}
        if row == None:
            return data
        fields = []
        for field in desc:
            fields.append(field[0])
        i = 0
        for f in fields:

            data[f] = row[i]
            i = i + 1
        return data

    def make_dic_array_with_field_name(self, desc, rows):
        data_array = []
        for r in rows:
            data_array.append(self.make_dic_with_field_name(desc, r))
        return data_array

    def make_select_query_with_dic(self, table, fields, dic):
        wheres  = ''
        i = 0
        for k in dic.keys():
            if i != 0 : 
                wheres = wheres + ' and '
            wheres = wheres + "%s = '%s' "%(k, dic[k])
            i += 1
        i = 0
        fstr = ''
        for f in fields :
            if i != 0 :
                fstr = fstr + ', '
            i += 1
            fstr = fstr + '%s '%f
        query = "select %s from %s where %s"%(fstr, table, wheres)
        return query
            
    def make_update_value_with_dic(self, table, where_name, where_value, dic):
        where_clause = ''
        update_clause = ''
        start = 0

        logger.debug(where_name)

        logger.debug(where_value)
        
        for i in range(len(where_name)):
            if start != 0:
                where_clause = where_clause + ' and '

            c = " %s = '%s'"%(where_name[i], where_value[i])
            where_clause = where_clause + c
            start = start +1
        i = 0
        for k in dic.keys():
            if i != 0:
                update_clause = update_clause + ', '
            update_clause = update_clause + " %s = '%s'"%(k, dic[k])

            i = i+1
        query = 'update %s set %s where %s'%(table, update_clause, where_clause)
        
        return query

    def make_update_value_with_dic_exclude(self, table, where_name, where_value, dic, exclude):
        where_clause = ''
        update_clause = ''
        start = 0
        logger.debug(where_name)
        logger.debug(where_value)
        
        for i in range(len(where_name)):
            if start != 0:
                where_clause = where_clause + ' and '

            c = " %s = '%s'"%(where_name[i], where_value[i])
            where_clause = where_clause + c
            start = start +1
        i = 0
        for k in dic.keys():
            if i != 0:
                update_clause = update_clause + ', '
            update_clause = update_clause + " %s = '%s'"%(k, dic[k])

            i = i+1
        query = 'update %s set %s where %s'%(table, update_clause, where_clause)
        
        return query

    def make_key_value_with_dic(self, dic):
        kv = ''
        i = 0
        for k in dic.keys():
            if i != 0:
                kv = kv + ' and '
            
            kv = kv + " %s = '%s'"%(k, dic[k])
            i = i+1
        return kv
        
    def make_inser_value_with_dic(self, table, dic):
        fields = ''
        values = ''
        i = 0
        for k in dic.keys():
            if table == 'menu' and k == 'ingredient':
                continue

            if i != 0 :
                fields = fields + ', '
                values = values + ', '
            fields = fields + '%s '%k

            values = values + "'%s' "%dic[k]
            i += 1
        query = "insert into %s (%s) values(%s)"%(table, fields, values)
        return query

    def make_insert_ignore_with_dic(self, table, dic):
        fields = ''
        values = ''
        i = 0
        for k in dic.keys():
            if i != 0 :
                fields = fields + ', '
                values = values + ', '
            fields = fields + '%s '%k
            if k == 'password' :
                if USE_MYSQL:
                    values = values + "old_password('%s') "%dic[k]
                else:
                    values = values + "'%s' "%dic[k]
            else:
                values = values + "'%s' "%dic[k]
            i += 1
        query = "insert or ignore into %s (%s) values(%s)"%(table, fields, values)
        return query

    def make_insert_value_with_dic2(self, table, dic):
        fields = ''
        values = ''
        update = ''
        i = 0
        for k in dic.keys():
            if i != 0 :
                fields = fields + ', '
                values = values + ', '
                update = update + ', '

            fields = fields + '%s '%k
            values = values + " '%s' "%dic[k]
            update = update + " %s = '%s'"%(k, dic[k])
            i += 1
        query = "insert into %s (%s) values(%s) on duplicate key update %s"%(table, fields, values, update)
        return query








response_fmt = { 'info': {'command':'', 'desc':''},'return':{'code':'','desc':''}, 'properties':''} 
        
class Protocol:
    def __init__(self, command_map):
        self.command_map = command_map
        self.properties = None
        self.command = None
        self.raw_buffer = ''
        self.code = -999
        
        try:
            self.j = self.get_json()
            self.properties = self.get_properties(self.j)
            self.command = self.j['info']['command']
        except:
            self.command = 'malfunction' # please execute self.check_command() after __init__()
            self.j = None
        
    def get_json(self):
        self.raw_buffer = sys.stdin.read()
        logger.debug('raw_buffer :%s'%self.raw_buffer)
        return json.loads(self.raw_buffer.decode(H_CODING2))

    def get_properties(self,j):
        p = j['properties']
        return p


    def build_dfl_response_property(self, command, _return, desc, properties):
        b = response_fmt
        b['info'] = {}
        b['info']['command'] = command
        b['return'] = {}
        b['return']['code'] = str(_return)
        b['return']['desc'] = desc
        b['properties'] = properties
        return b


    def json_build_dfl_response(self, b):
        j = {}
        j = b
        #        logger.debug(j)
        return json.dumps(j, ensure_ascii=False, indent=4)

    def make_simple_response( self,  result, desc ):
        p = self.build_dfl_response_property( self.get_response_command(), result, desc, "")
        json_out = self.json_build_dfl_response(p)
        return json_out

    def make_simple_response_without_session( self, result, desc ):
        
        p = self.build_dfl_response_property( self.get_response_command(), result, desc, "")
        json_out = self.json_build_dfl_response(p)
        write_header()
        print json_out

    def make_custom_response(self,  result, desc, prop):
        
        p = self.build_dfl_response_property( self.get_response_command(), result, desc, prop)
        json_out = self.json_build_dfl_response(p)
        return json_out


    def get_response_command(self):
        try:
            req = self.command
            res = self.command_map[req][0]
        except:
            return 'unknown'
        return res

    def check_command(self):
        if self.command_map.has_key(self.command)==False:
            return False

    def load_json_file(self, path):

        json_data = self.read_file(path)
        if json_data == None:
            return None
        else:
            conf_data = json.loads(json_data.decode(H_CODING2))
#            conf_data = json.loads(json_data.decode(H_CODING))

        return  conf_data
    def load_file(self,path):
        chunk = self.read_file(path)
        if chunk == None:
            return None
        else:
            return chunk
    def save_json_file(self, path, j):
        #        try:

        dump = json.dumps(j, ensure_ascii=False, indent=4)
        _file = open(path, 'r+')

        fcntl.flock(_file, fcntl.LOCK_EX)
        _file.seek(0)
        _file.write(dump)
        _file.truncate()
        fcntl.flock(_file, fcntl.LOCK_UN)
        _file.close()

        return

    def read_file(self, path):
        try:
            f = open(path,'r')
        except:
            f.close()
            return None

        fcntl.flock(f, fcntl.LOCK_EX)
        b = f.read()
        fcntl.flock(f, fcntl.LOCK_UN)
        f.close()
        return b

