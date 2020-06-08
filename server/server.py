from flask import Flask, render_template
from flask_socketio import SocketIO,send
from pymongo import MongoClient
import bcrypt



client = MongoClient("mongodb://grandas:grandas980206@ds045077.mlab.com:45077/distribuidos")
db = client["distribuidos"]
app = Flask(__name__,static_url_path='/static')
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def home():
    return render_template('index.html')

@socketio.on('message')
def home(data):
    print('hello')
    print(data)

@socketio.on('login')
def handleLogin(data):
    users = db["users"]
    user = data["username"]
    passw = data['password'].encode('utf-8')
    finded = users.find_one({'username' : user})
    if finded != None:
        if(bcrypt.checkpw(passw, finded['password'].encode('utf-8'))):
            return({'user' : finded['username']})
        else:
            return({'err' : 'La contraseña no es correcta'})
    else:
        return({'err' : 'Usuario no Encontrado'})

@socketio.on('signUp')
def handlesignUp(data):
    users = db["users"]
    datos  = data
    #datos['username'] = data['usuario']
    datos['username'] = data["nombre"]+'.'+data["apellido"]
    password = datos['password'].encode('utf-8')
    datos['password'] = bcrypt.hashpw(password,bcrypt.gensalt()).decode('utf-8')
    newUser= users.insert_one(datos).inserted_id
    
    return(datos['username'] )

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0',debug=True)