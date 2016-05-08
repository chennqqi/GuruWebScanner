import requests
import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
import datetime
import time
import json
import MySQLdb

try:
    DBCONFIGFILE = "dbconfig/db.cfg"   
    with open(DBCONFIGFILE) as configfile:    
        dbconf = json.load(configfile)
    DBserver = dbconf['server']
    DBusername = dbconf['username']
    DBpassword = dbconf['password']
    DBname = dbconf['name']    
except Exception, e:    
    raise Exception, e

def notify(toemail, url, r):
    datatime = datetime.datetime.now().strftime("%A, %d. %B %Y %I:%M%p")
    message = "GuruWS xin thong bao:\nTrang web " + url + " hien khong the truy cap duoc vao thoi diem " + datatime + "\r\n"
    message += "More information:\r\nGET " + url + " (" + str(r.status_code) + ")" + "\r\n" + str(r.headers)

    print message
 
    try:
        fromaddr = "guruws.tech@gmail.com"
        msg = MIMEMultipart()
        msg['From'] = "Guru Team"
        msg['To'] = toemail
        msg['Subject'] = "GuruWS: " + url + " khong truy cap duoc"

        body = message
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login("guruws.tech@gmail.com", "where.are.you.now?")
         
        text = msg.as_string()
        server.sendmail(fromaddr, toemail, text)
        server.quit()
    except Exception, e:
        print "[+] Gui mail loi: " . str(e)


def get_urllist():

    # Have to make new connection in every while loop because
    # of the connection time limitation of DBMS
    conn = MySQLdb.connect(DBserver, DBusername, DBpassword, DBname)
    cursor = conn.cursor()

    # execute SQL query using execute() method.
    cursor.execute("SELECT * FROM webChecker")

    # Fetch a single row using fetchone() method.
    rows = cursor.fetchall()
    
    cursor.close()
    conn.close()

    weblist = []
    for row in rows:
        web = {
            'url': row[0],
            'email': row[1],
            'name': row[2]
        }
        weblist.append(web)
    return weblist


def check_website_status():    
    weblist = get_urllist()
    
    for web in weblist:    
        try:        
            r = requests.get(web['url'])
        except Exception, e:
            print "[+] Error ! " + str(e)
            continue
        if r.status_code == 200:
            print '[+] ' + web['url'] + " : OK"
        else:
            save_status_code = r.status_code

            # recheck
            r = requests.get(web['url'])
            if r.status_code == save_status_code:
                email = web['email']
                #email = 'giaplvk57@gmail.com'                        
                notify(email, web['url'], r)

def try_connect():
    try:
        conn = MySQLdb.connect(DBserver, DBusername, DBpassword, DBname)
    except:
        return False

    return True;

def welcome():
    if try_connect():
        print green("[+] Connected to database !\n\n")
    else:
        print red("[+] Can't connect to database !")
        exit(0)

if __name__ == '__main__':    
    cnt = 0
    while True:
        print "[+] ", cnt
        cnt += 1
        check_website_status()
        time.sleep(2)
