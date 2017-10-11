from pexpect import pxssh, spawn, EOF
import re, os
import json

nodes = []
links = []

def saveJsonArray(objects,name):
    with open(os.path.dirname(os.path.abspath(__file__))+'/data/'+name, 'w') as outfile:
        json.dump(objects,outfile,indent=4, separators=(',', ': '))

def readPvLinks(pvname, fields):
    for i in range(0,len(fields)/3-1):
        if fields[i*3]=="fields" and fields[i*3+2].startswith("VEPP"):
            links.add({"type": "ref", "source": pvname, "target": fields[i*3+2]})



def readRecords(systemname,iocname):
    global links, nodes
    lines = []
    try:
        child = spawn('ssh vepp4@vepp4-pult6',timeout=30)
        child.expect('password')
        child.sendline('vepp4vepp4')
        child.sendline(systemname+"bpmd telnet "+iocname)
        child.sendline("dbDumpRecord")
        child.expect(">")
        lines = child.before.split("record(")
        child.close()
    except pxssh.ExceptionPxssh as e:
        print("pxssh failed on login.")
        print(e)
    for line in lines[1:]:
        sline = re.sub("[\"\r\n\\}\\{\t\s]?(NPP)?(NMS)?(DEC)?(DTY)?","",line)
        sline = re.split("[\\{,\\)\\(\"]",sline)
        record = {"id":sline[1], "type": "pv"}
        nodes.append(record)
        link = {"type": "has", "source": iocname, "target": sline[1]}
        links.append(link)
        readPvLinks(sline[1],sline[2:])


def readIOC(systemname):
    global nodes
    lines = []
    try:
        child = spawn('ssh vepp4@vepp4-pult6',timeout=10)
        child.expect('password')
        child.sendline('vepp4vepp4')
        child.sendline(systemname+"bpmd status")
        child.expect("(pid  7864)")
        lines = child.before.split("ioc:")
        child.close()
    except pxssh.ExceptionPxssh as e:
        print("pxssh failed on login.")
        print(e)
    for line in lines[1:]:
        sline = line.split()
        ioc = {"id":sline[1], "type": "ioc"}
        nodes.append(ioc)
        if sline[1]!="sep_all":
            readRecords(systemname,sline[1])


def readPvData():
    #print re.sub("[\"\r\n\\}\\{\t\s]?(NPP)?(NMS)?(DEC)?(DTY)?","","V  EPP  NPP")
    readIOC("v4")
    saveJsonArray(nodes,"nodes.json")
    saveJsonArray(links,"links.json")



readPvData()

"""
try:
    child = spawn('ssh vepp4@vepp4-pult6')
    child.expect('password')
    child.sendline('vepp4vepp4')
    child.sendline("v4bpmd telnet sep_helper")
    child.sendline("dbDumpRecord")
    child.expect(">")
    print child.before
    child.close()
except pxssh.ExceptionPxssh as e:
    print("pxssh failed on login.")
    print(e)
"""