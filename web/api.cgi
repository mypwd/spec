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






class Faceapi(Protocol):
    def __init__(self):
        command_map = self.set_map()
        Protocol.__init__(self, command_map)

        self.response = ''

    def dispatcher(self):
        self.command_map[self.command][1]()
        
    def set_map(self):
        _map = {}
        _map['SetPasswordRequest'] = ['SetPasswordResponse', self.SetPasswordRequest]
        _map['GetDevicePropertiesRequest'] = ['GetDevicePropertiesResponse', self.GetDevicePropertiesRequest]
        _map['SetDevicePropertiesRequest'] = ['SetDevicePropertiesResponse', self.SetDevicePropertiesRequest]
        _map['GetDoorPropertiesRequest'] = ['GetDoorPropertiesResponse', self.GetDoorPropertiesRequest]
        _map['SetDoorPropertiesRequest'] = ['SetDoorPropertiesResponse', self.SetDoorPropertiesRequest]
        _map['GetSecurityPropertiesRequest'] = ['GetSecurityPropertiesResponse', self.GetSecurityPropertiesRequest]
        _map['SetSecurityPropertiesRequest'] = ['SetSecurityPropertiesResponse', self.SetSecurityPropertiesRequest]
        _map['GetFacePropertiesRequest'] = ['GetFacePropertiesResponse', self.GetFacePropertiesRequest]
        _map['SetFacePropertiesRequest'] = ['SetFacePropertiesResponse', self.SetFacePropertiesRequest]
        _map['GetFingerPropertiesRequest'] = ['GetFingerPropertiesResponse', self.GetFingerPropertiesRequest]
        _map['SetFingerPropertiesRequest'] = ['SetFingerPropertiesResponse', self.SetFingerPropertiesRequest]
        _map['SetSystemTimeRequest'] = ['SetSystemTimeResponse', self.SetSystemTimeRequest]
        _map['GetSystemTimeRequest'] = ['GetSystemTimeResponse', self.GetSystemTimeRequest]
        _map['GetInOutLogRequest'] = ['GetInOutLogResponse', self.GetInOutLogRequest]
        _map['AddMemberPropertiesRequest'] = ['AddMemberPropertiesResponse', self.AddMemberPropertiesRequest]
        _map['GetMemberPropertiesRequest'] = ['GetMemberPropertiesResponse', self.GetMemberPropertiesRequest]
        _map['SetMemberPropertiesRequest'] = ['SetMemberPropertiesResponse', self.SetMemberPropertiesRequest]
        _map['RemoveMemberPropertiesRequest'] = ['RemoveMemberPropertiesResponse', self.RemoveMemberPropertiesRequest]
        _map['GetAllMemberPropertiesRequest'] = ['GetAllMemberPropertiesResponse', self.GetAllMemberPropertiesRequest]
        _map['GetMemberFaceDataRequest'] = ['GetMemberFaceDataResponse', self.GetMemberFaceDataRequest]
        _map['SetMemberFaceDataRequest'] = ['SetMemberFaceDataResponse', self.SetMemberFaceDataRequest]
        _map['AddMemberFaceDataRequest'] = ['AddMemberFaceDataResponse', self.AddMemberFaceDataRequest]
        _map['RemoveMemberFaceDataRequest'] = ['RemoveMemberFaceDataResponse', self.RemoveMemberFaceDataRequest]
        _map['GetAllMemberFaceDataRequest'] = ['GetAllMemberFaceDataResponse', self.GetAllMemberFaceDataRequest]
        _map['GetNetworkPropertiesRequest'] = ['GetNetworkPropertiesResponse', self.GetNetworkPropertiesRequest]
        _map['SetNetworkPropertiesRequest'] = ['SetNetworkPropertiesResponse', self.SetNetworkPropertiesRequest]
        _map['SetClientInfoRequest'] = ['SetClientInfoResponse', self.SetClientInfoRequest]
        _map['RemapMemberIdRequest'] = ['RemapMemberIdResponse', self.RemapMemberIdRequest]
        return _map
    
    def SetPasswordRequest(self):
        # max len, min len
        if self.properties.has_key("password") == False:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return
        if len(self.properties["password"]) < 4 or len(self.properties["password"]) > 16 :
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER, "fail. password is too short or long")
            return
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success")
        return
    def GetDevicePropertiesRequest(self):
        p = {}
        conf = self.load_json_file(STANDALONE_CONF_PATH)
        if conf.has_key("password"):
            p["password"] = conf["password"]
        if conf.has_key("serial"):
            p["serial"] = conf["serial"]
        if conf.has_key("model"):
            p["model"] = conf["model"]
        if conf.has_key("name"):
            p["name"] = conf["name"]
        self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", p)
        return
    
    def SetDevicePropertiesRequest(self):
        p = self.properties
        conf = self.load_json_file(STANDALONE_CONF_PATH)

        if p.has_key("name"):
            conf["name"] = p["name"]
        if p.has_key("password"):
            conf["password"] = p["password"]
        if p.has_key("model"):
            conf["model"] = p["model"]
        if p.has_key("serial"):
            conf["serial"] = p["serial"]

        self.save_json_file(STANDALONE_CONF_PATH, conf)
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success")
        return
    def GetDoorPropertiesRequest(self):
        p = {}
        conf = self.load_json_file(STANDALONE_CONF_PATH)
        if conf.has_key("door") :
            door = conf["door"]
        else:
            door = {}
            
        if door.has_key("autoclose"):
            p["autoclose"] = door["autoclose"]
        if door.has_key("openlimit"):
            p["openlimit"] = door["openlimit"]
        if door.has_key("emergencyopen"):
            p["emergencyopen"] = door["emergencyopen"]

        self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", p)
        return
    def SetDoorPropertiesRequest(self):
        # 저장을 face_control로 옮김
        """
        p = self.properties
        conf = self.load_json_file(STANDALONE_CONF_PATH)
        if conf.has_key("door") == False:
            conf["door"] = {}

        if p.has_key("autoclose"):
            conf["door"]["autoclose"] = p["autoclose"]
        if p.has_key("openlimit"):
            conf["door"]["openlimit"] = p["openlimit"]
        if p.has_key("emergencyopen"):
            conf["door"]["emergencyopen"] = p["emergencyopen"]

        self.save_json_file(STANDALONE_CONF_PATH, conf)
        """
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success")
        return

    def GetSecurityPropertiesRequest(self):
        p = {}
        conf = self.load_json_file(STANDALONE_CONF_PATH)
        if conf.has_key("security") :
            door = conf["security"]
        else:
            door = {}
            
        if door.has_key("guard"):
            p["guard"] = door["guard"]
        if door.has_key("tamperalert"):
            p["tamperalert"] = door["tamperalert"]
        if door.has_key("controller"):
            p["controller"] = door["controller"]

        self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", p)
        return
        
    def SetSecurityPropertiesRequest(self):
        # systemd 로 옮겨야 함
        p = self.properties
        conf = self.load_json_file(STANDALONE_CONF_PATH)
        if conf.has_key("security") == False:
            conf["security"] = {}

        if p.has_key("guard"):
            conf["security"]["guard"] = p["guard"]
        if p.has_key("tamperalert"):
            conf["security"]["tamperalert"] = p["tamperalert"]
        if p.has_key("controller"):
            conf["security"]["controller"] = p["controller"]

        self.save_json_file(STANDALONE_CONF_PATH, conf)
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success")
        return

    def GetFacePropertiesRequest(self):
        p = {}
        conf = self.load_json_file(STANDALONE_CONF_PATH)
        if conf.has_key("face") :
            face = conf["face"]
        else:
            face = {}

        if face.has_key("registerthreshold"):
            p["registerthreshold"] = face["registerthreshold"]
        if face.has_key("recognitionthreshold"):
            p["recognitionthreshold"] = face["recognitionthreshold"]
        
        self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", p)
        return
        
    def SetFacePropertiesRequest(self):
        # 저장 담당을 cgi에서 face_control로 옮김
        """
        p = self.properties
        conf = self.load_json_file(STANDALONE_CONF_PATH)
        if conf.has_key("face") == False:
            conf["face"] = {}

        if p.has_key("registerthreshold"):
            conf["face"]["registerthreshold"] = p["registerthreshold"]
        if p.has_key("recognitionthreshold"):
            conf["face"]["recognitionthreshold"] = p["recognitionthreshold"]

        self.save_json_file(STANDALONE_CONF_PATH, conf)
        """
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success")
        return

    def GetFingerPropertiesRequest(self):
        pass
    def SetFingerPropertiesRequest(self):
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success")
        pass
    def SetSystemTimeRequest(self):
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success")
        pass
    def GetSystemTimeRequest(self):
        time_str = strftime('%Y-%m-%d %I:%M:%S', localtime())
        p = {}
        p['systemtime'] = time_str
        self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", p)
        return

    def GetInOutLogRequest(self):
        p = self.properties
        if p.has_key("start") == False or p.has_key("end") == False :
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER, "fail")
            return
        db = Udb(FACE_DB_PATH)
        query = "select logtime, action, method, score, success, id from log where logtime > '%s' and logtime < '%s'"%\
                ( p["start"], p["end"])
        db.cur.execute(query)
        rows = db.cur.fetchall()
        log_list = []
        for row in rows:
            log = {}
            log["time"] = row[0]
            log["action"] = row[1]
            log["method"] = row[2]
            log["score"] = row[3]
            log["success"] = row[4]
            log["id"] = row[5]
            log_list.append(log)
        prop = {}
        prop["log_list"] = log_list
        self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", prop)
        return

    def AddMemberPropertiesRequest(self):
        # face control로 옮겨야 함

        p = self.properties
        if p.has_key("id") == False:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter1")
            return
        """
        # insert #member
        db = Udb(FACE_DB_PATH)
        faceid = self.get_external_faceid()
        query = "insert into member (id, faceid, privilege, mode, name, confirm) values ('%s', '%d', '%s', '%s', '%s', '%s')"\
                    % ( p["id"], faceid, p["privilege"], p["mode"], p["name"], p["confirm"])
        db.cur.execute(query)
        # insert #face

        query = "insert into face (faceid) values('%s')" % faceid
        logger.debug(query)

        db.cur.execute(query)
        db.con.commit()
        db.con.close()
        """
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC , "success")
        return
        
        
    def GetMemberPropertiesRequest(self):
        p = self.properties
        if p.has_key("id")==False :
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return
        
        db = Udb(FACE_DB_PATH)
        query = "select id, privilege, mode, name, confirm from member where id='%s'"%p["id"]
        logger.debug(query)
        db.cur.execute(query)
        row = db.cur.fetchone()

        if row==None or len(row) == 0 :
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_MEMBER_NO_SUCH_ID , "fail. no such id exists.")
            return

        prop = {}
        prop["id"] = row[0]
        prop["privilege"] = row[1]
        prop["mode"] = row[2]
        prop["name"] = row[3]
        prop["confirm"] = row[4]
        
        self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", prop)
        return
    def SetMemberPropertiesRequest(self):
        # face control 로 옮겨야 함
        # 보류
        p = self.properties
        if p.has_key("id")==False :
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return
        set_str = ''
        if p.has_key('privilege'):
            set_str += 'privilege = %s '%p['privilege']
        if p.has_key('mode'):
            if len(set_str) != 0 :
                set_str += ' , '
            set_str += 'mode = %s '%p['mode']
        if p.has_key('name') and len(p['name']) > 0:
            if len(set_str) != 0 :
                set_str += ' , '
            set_str += 'name = %s '%p['name']
        if p.has_key('confirm'):
            if len(set_str) != 0 :
                set_str += ' , '
            set_str += 'confirm = %s '%p['confirm']

        if len(set_str) == 0:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return
        db = Udb(FACE_DB_PATH)
        query = "update member set %s where id='%s'"% (set_str, p["id"])
        logger.debug(query)
        db.cur.execute(query)
        db.con.commit()
        db.con.close()
        
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success")
        return
    def RemoveMemberPropertiesRequest(self):
        # 부분적으로 face_control 로 옮겨야 함
        p = self.properties
        if p.has_key("id")==False :
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return
        db = Udb(FACE_DB_PATH)
        query = "select faceid, fingerid, rfid from member where id = '%s'"%p["id"]
        db.cur.execute(query)
        row = db.cur.fetchone()
        if row == None or len(row) == 0 :
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_MEMBER_NO_SUCH_ID , "fail. no such id exist")
            return
        """
        # delete face data
        query = "delete from face where faceid = '%d'"%row[0]
        db.cur.execute(query)
        
        # delete rf data

        # delete finger print data

        # delete member data
        query = "delete from member where id='%s'"%p["id"]
        db.cur.execute(query)
        db.con.commit()
        db.con.close()
        """
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success")
        return
        
        
    
    def GetAllMemberPropertiesRequest(self):
        db = Udb(FACE_DB_PATH)
        query = "select id, privilege,mode,name,confirm from member"
        db.cur.execute(query)
        rows = db.cur.fetchall()
        p = {}
        member_list = []
        for row in rows:
            m = {}
            m["id"] = row[0]
            m["privilege"] = row[1]
            m["mode"] = row[2]
            m["name"] = row[3]
            m["confirm"] = row[4]
            member_list.append(m)
        p["member_list"] = member_list
        self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", p)
        return
    
    def GetMemberFaceDataRequest(self):
        if self.properties.has_key("id") == False:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return

        db = Udb(FACE_DB_PATH)
        # get face id
        query = "select faceid from member where id = '%s'"%self.properties["id"]
        db.cur.execute(query)
        row = db.cur.fetchone()
        if row == None or len(row) == 0 :
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_MEMBER_NO_SUCH_ID , "fail. no such id exist")
            return
        faceid = row[0]

        # get face data
        query = "select feature1, feature2, jpegimg from face where faceid = '%d'" % faceid
        db.cur.execute(query)
        row = db.cur.fetchone()
        if row == None:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_MEMBER_NO_SUCH_ID , "fail. no data")
            return
        p = {}
        p["id"] = self.properties["id"]
        p["feature1"] = row[0]
        p["feature2"] = row[1]
        p["jpegimage"] = row[2]        
        self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", p)
        return
    
    def SetMemberFaceDataRequest(self):
        # face_control로 옮겨야 함
        p = self.properties
        if ( p.has_key("id") and p.has_key("jpegimage") and p.has_key("feature1") and p.has_key("feature2") ) == False:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return
        db = Udb(FACE_DB_PATH)
        # get faceid
        query = "select faceid from member where id = '%s'"% p["id"]
        db.cur.execute(query)
        row = db.cur.fetchone()
        if row == None or len(row) == 0 :
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_MEMBER_NO_SUCH_ID , "fail. no such id exist")
            return
        """
        faceid = row[0]
        
        query = "update face set  jpegimg='%s', feature1='%s', feature2='%s' where faceid='%d'"%\
                (  p["jpegimage"], p["feature1"], p["feature2"], faceid )
        try:
            db.cur.execute(query)
        except:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_MEMBER_NO_SUCH_ID , "fail. no data")
            return
        db.con.commit()
        db.con.close()
        """
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC , "success")  
        return
        
    def AddMemberFaceDataRequest(self):
        # 없어져야 함
        """
        p = self.properties
        if p.has_key("member_list") == False:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter1")
            return

        # verify param 
        for m in p["member_list"]:
            if ( m.has_key("id") and m.has_key("jpegimage") and m.has_key("feature1") and m.has_key("feature2") ) == False:
                self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter2")
                return
        
        # insert param
        db = Udb(FACE_DB_PATH)
        for m in p["member_list"]:
            query = "insert into face (faceid, feature1, feature2, jpegimg) values ('%s', '%s', '%s', '%s')"\
                    % ( m["id"], m["feature1"], m["feature2"], m["jpegimage"])
            db.cur.execute(query)
            query = "insert into member (id, faceid, privilege, confirm, mode) values('%s', '%d', '%d', '%d')"\
                    % ( m["id"], 2, 1, 1)
            db.cur.execute(query)
        db.con.commit()
        db.con.close()
        """
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC , "success. but deplicated.")
        return
        
        
    def RemoveMemberFaceDataRequest(self):
        # 사용 되지 않음
        if self.properties.has_key("id") == False:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return
        """
        db = Udb(FACE_DB_PATH)

        # get faceid
        query = "select faceid from member where id = '%s'"%self.properties["id"]
        db.cur.execute(query)
        row = db.cur.fetchone()
        if row == None:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_MEMBER_NO_SUCH_ID , "fail. no data")
            return
        faceid = row[0]
        
        # remove data
        query = "update face  set feature1 = '' , feature2 = '' , jpegimg = '' where faceid='%d'"%faceid
        db.cur.execute(query)
        db.con.commit()
        db.con.close()
        """
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC , "success. but deplicated.")
        return
        
    def GetAllMemberFaceDataRequest(self):
        if self.properties.has_key("select") == False:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return
        select = self.properties["select"]
        if select != 'registed' and select != 'unregisted' and select != 'all':
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return
        db = Udb(FACE_DB_PATH)
        if select == 'registed':
            query = "select faceid from member where confirm=1"
        elif select == 'unregisted':
            query = "select faceid from member where confirm=0"
        elif select == 'all':
            query = "select faceid from member"
            
        db.cur.execute(query)
        rows = db.cur.fetchall()
        member_list = []
        prop = {}

        if rows == None or len(rows) == 0:
            prop["member_list"] = member_list
            self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", prop)
            return
        for row in rows:
            query = "select member.faceid, face.feature1, face.feature2, face.jpegimg from face join member on member.faceid ='%d' and face.faceid = '%s'" % ( row[0], row[0] )
            db.cur.execute(query)
            r = db.cur.fetchone()
            if r == None:
                continue
            facedata = {}

            facedata["id"] = r[0]
            facedata["feature1"] = r[1]
            facedata["feature2"] = r[2]
            facedata["jpegimage"] = r[3]
            member_list.append(facedata)
        prop["member_list"] = member_list
        self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", prop)
        return

    def SetNetworkPropertiesRequest(self):
        conf = self.load_json_file(STANDALONE_CONF_PATH)
        conf["network"] = self.properties
        self.save_json_file(STANDALONE_CONF_PATH, conf)
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC , "success")
        return
        
    def GetNetworkPropertiesRequest(self):
        conf = self.load_json_file(STANDALONE_CONF_PATH)
        if conf.has_key("network"):
            self.response = self.make_custom_response(self.get_response_command(), RESPONSE_CODE_SUCC, "success", conf["network"])
            return
        else:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_PARAMETER_DOES_NOT_EXIST , "have no network parameter")
            return
    def SetClientInfoRequest(self):
        p = self.properties
        if p.has_key("ipaddr") == False or p.has_key('port') == False:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return
        conf = self.load_json_file(STANDALONE_CONF_PATH)
        conf["client"] = {}
        conf["client"]["ipaddr"] = p["ipaddr"]
        conf["client"]["port"] = p["port"]
        self.save_json_file(STANDALONE_CONF_PATH, conf)
        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC , "success")
        return
    def RemapMemberIdRequest(self):
        p = self.properties
        if p.has_key("id") == False or p.has_key('remapid') == False:
            self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_INVALID_PARAMETER , "fail. invalid parameter")
            return
        db = Udb(FACE_DB_PATH)
        
        query = "UPDATE member SET id='%s' where id='%s'"%(p["remapid"], p["id"])
        db.cur.execute(query)
        logger.debug(query)
        db.cur.execute(query)
        db.con.commit()
        db.con.close()

        self.response = self.make_simple_response(self.get_response_command(), RESPONSE_CODE_SUCC , "success")
        return

    def system_log(self, log):
        db = Udb(FACE_DB_PATH)
        time_str = strftime('%Y-%m-%d %I:%M:%S', localtime())
        
        query = "insert into system_log (logtime, log) values('%s', '%s')"%(time_str, log)
        db.cur.execute(query)
        db.con.commit()
        db.con.close()

    def get_external_faceid(self):
        db = Udb(FACE_DB_PATH)
        query = "select max(faceid) from face where faceid > %d"%EXTERNAL_FACEID_BASE
        db.cur.execute(query)
        r = db.cur.fetchone()
        if r == None or len(r) == 0 or r[0] == None:
            return EXTERNAL_FACEID_BASE
        else:
            return r[0]+1
        
        
def main():
    faceapi = Faceapi()
#    faceapi.db = Udb()
    faceapi.uds = Uds(SERVER_ADDRESS)

    sess = session.Session()

    if sess.has_session() == False:
        faceapi.make_simple_response_without_session(faceapi.get_response_command(), RESPONSE_CODE_UNAUTHORIZED, 'unauthorized access');
        exit(-1)
    # check command
    if faceapi.check_command() == False:
        faceapi.response = faceapi.make_simple_response("unknown command", RESPONSE_CODE_INVALID_MESSAGE_CODE, "unkown command received")
    else:
        faceapi.dispatcher()

    faceapi.uds.write(faceapi.raw_buffer)
    faceapi.uds.close()
    out = bld_header() + faceapi.response
    print out

if __name__=='__main__':
    main()
