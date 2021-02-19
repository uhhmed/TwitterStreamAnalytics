import pymysql

'''
A helper class for db interaction.
sets up a way to simply connect, disconnect, fetch, insert, and execute (query) data.
'''

class DBHelper:

    def __init__(self):
        self.host = "127.0.0.1"
        self.user = "root"
        self.password = ""
        self.db = "Twitter"

    def __connect__(self):
        self.con = pymysql.connect(host=self.host, user=self.user, password=self.password, db=self.db, cursorclass=pymysql.cursors.
                                   DictCursor)
        self.cur = self.con.cursor()

    def __disconnect__(self):
        self.con.close()

    def fetch(self, sql):
        self.__connect__()
        self.cur.execute(sql)
        result = self.cur.fetchall()
        self.__disconnect__()
        return result

    def insert(self, values):
        self.insert_statement = sql = "INSERT INTO `tweets` (`tweet`, `created`, `author`, `full_tweet`) VALUES (%s, %s, %s, %s)"
        self.__connect__()
        self.cur.execute(self.insert_statement, values)
        try:
            self.con.commit()
            print('commited succesfully')
        except:
            self.con.rollback()
            print('failed to commit: ', values)

    def execute(self, sql):
        self.__connect__()
        self.cur.execute(sql)
        self.__disconnect__()
