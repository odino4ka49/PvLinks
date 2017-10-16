from pexpect import pxssh, spawn, EOF
import re, os
import json

nodes = []
links = []
nodesids = []

def saveJsonArray(objects,name):
    with open(os.path.dirname(os.path.abspath(__file__))+'/data/'+name, 'w') as outfile:
        json.dump(objects,outfile,indent=4, separators=(',', ': '))

def readPvLinks(pvname, fields):
    for i in range(0,len(fields)/3):
        if "field" in fields[i*3]:
            linktype = fields[i*3+1]
            pv = re.split("[\s\.]",fields[i*3+2])[0]
            if not pv.endswith("_"):
                if linktype.startswith(("FLINK","OUT","LINK")):
                    links.append({"type": "ref", "source": pvname, "target": pv, "linktype": linktype})
                elif linktype.startswith(("DOL","INP","SIML","SIOL")):
                    links.append({"type": "ref", "source": pv, "target": pvname, "linktype": linktype})


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
        sline = re.sub("[\"\r\n\\}\\{\t]","",line)
        sline = re.split("[\\{,\\)\\(\"]",sline)
        if not sline[1].endswith('_'):
            record = {"id":sline[1], "type": "pv", "rectype": sline[0]}
            nodes.append(record)
            nodesids.append(sline[1])
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
        if sline[1]!="sep_all":
            ioc = {"id":sline[1], "type": "ioc"}
            print ioc
            nodes.append(ioc)
            nodesids.append(sline[1])
            readRecords(systemname,sline[1])


def readPvData():
    #print re.sub("[\"\r\n\\}\\{\t\s]?(NPP)?(NMS)?(DEC)?(DTY)?","","V  EPP  NPP")
    readIOC("v4")
    checkPvData()
    saveJsonArray(nodes,"nodes.json")
    saveJsonArray(links,"links.json")

def checkPvData():
    global nodes, links
    for link in links:
        """try:
            next(item for item in nodesids if item["id"] == link["source"] )
            next(item for item in nodes if item["id"] == link["target"] )
        except StopIteration:
            links.remove(link)"""
        if not (link["source"] in nodesids and link["target"] in nodesids):
            links.remove(link)

readPvData()