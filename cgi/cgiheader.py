#!/usr/bin/python

import sys
import json

version = 1.0

def write_header():
    print 'Content-Type: text/html; charset=utf-8'
    print
    

def write_cookie(c):
    print '%s'%c

def bld_header():
    hdr = 'Access-Control-Allow-Origin: *\r\n'
    hdr = hdr + 'Access-Control-Allow-Methods: POST\r\n'
    hdr = hdr + 'Access-Control-Max-Age: 1000\r\n'
    hdr = hdr + 'Content-Type: text/html; charset=utf-8\r\n\r\n'
    return hdr

    

def bld_cookie(c):
    return '%s\r\n'%c

SPEC_DB_PATH='/var/www/html/spec/cgi/db/spec.db'

USER_FILE='db/user.json'
PLATFORM_FILE='db/platform.json'
SENSOR_FILE='db/sensor.json'
HOUSING_FILE='db/housing.json'
MODEL_FILE='db/model.json'
PARAM_FILE='inc/param.json'

# define

RESPONSE_SUCCESS = 'success'
RESPONSE_FAIL = 'failure'


# RETRURN CODES
######################################################
RESPONSE_CODE_SUCC = 0

RESPONSE_CODE_UNAUTHORIZED = -1
RESPONSE_CODE_INVALID_MESSAGE_CODE = -2
RESPONSE_CODE_INSUFFICIENT_PRIVILEGES = -3
RESPONSE_CODE_INVALID_PARAMETER = -4
RESPONSE_CODE_INTERNAL_ERROR = -5
RESPONSE_CODE_INVALID_REQUEST = -6
RESPONSE_CODE_DEVICE_UNINITIALIZED = -7
RESPONSE_CODE_PARAMETER_DOES_NOT_EXIST = -8

RESPONSE_CODE_AUTH_FAIL = -101
RESPONSE_CODE_AUTH_ALEADY_LOGIN = -102
RESPONSE_CODE_ID_EXIST = -103

# member
RESPONSE_CODE_MEMBER_ALREADY_EXISTS = -200
RESPONSE_CODE_MEMBER_NO_SUCH_ID = -201


