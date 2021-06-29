import paho.mqtt.client as mqtt
from time import sleep
import serial
import time
import binascii
import threading
#import queue
import json
from datetime import datetime
import config
#import os

#funcion al conectarse al broker

def on_connect(client, userdata, flags, rc):
    print("Connected with result code" + str(rc))
#funcion al publicar
def on_publish(client, obj, mid):
    print("mid: " + str(mid))

def fromManToBattery(man_data):
    man_data=man_data[4::]

    if(len(man_data)==2):
        man_data=man_data[1:]
    else:
        man_data=man_data[1]+man_data[3]
    #print(man_data)
    return(man_data)

#Cuando el timmer expira se debe eliminar el elementos que ya hace rato no aparezcan
def Remove_old_Beacons():
    #Se toma el tiempo actual
    timer.cancel
    new_timer()
    timer.start()
    print('timer borrar')
    timestamp = round(datetime.timestamp(datetime.now()))
    for beacon in Beacons:
        #Verificar el timestamp
        time_diference=timestamp - beacon['time']
        mqttc.publish('/bateria',beacon['battery'])
        if time_diference > 7:
            #Enviar mqtt status dead:
            print('dead Beacon')
            mqttc.publish('/status/'+beacon['name'],"OFF")
            Beacons[:]= [item for item in Beacons if item['name']!=beacon['name']]
            
        else:
            print('Still alive')
            
def new_timer():
    global timer
    timer = threading.Timer(10.0, Remove_old_Beacons)


mqttc = mqtt.Client(config.client_device)
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish
found=False
flag=False

global timer
ser = serial.Serial ("/dev/ttyS0", 115200)    #Open port with baud rate
Beacons=[]

beacon_encontrado =False

try:
    mqttc.username_pw_set(config.user, config.password)
    mqttc.connect(config.broker_address, config.port)
    mqttc.loop_start()
except Exception as e:
    print(e)

new_timer()
timer.start()

while True:

    try:
        beacon_encontrado =False
        print(Beacons)
        received_data = ser.read()              #read serial port
        sleep(0.03)
        data_left = ser.inWaiting()             #check for remaining byte
        received_data += ser.read(data_left)	
        received_data=received_data.decode('utf8')

        #print(received_data)
        json_data_incoming=json.loads(received_data)
        json_size=len(json_data_incoming['devices'])
        print(json_data_incoming)
        battery=json_data_incoming['devices']['baterry']
        battery=fromManToBattery(battery)
        # Aca se toma el valor del momento en el que se recibio el mensaje de beacon 
        timestamp = round(datetime.timestamp(datetime.now()))
        #Se recorre la lista de beacons
        for beacon in Beacons:
            # si el beacon escaneado ya esta en la lista
            if beacon['name']==json_data_incoming['devices']['name']:
                print(beacon)
                beacon['battery']=battery
                beacon['rssi']=json_data_incoming['devices']['rssi']
                # Reseteamos el tiempo
                beacon['time']=timestamp
                beacon_encontrado=True
        
        if not beacon_encontrado:
            # Incluimos el tiempo en el que lo recibimos
            Beacons.append({'name':json_data_incoming['devices']['name'],'rssi':json_data_incoming['devices']['rssi'],'battery':battery,'time':timestamp})
            #Enviar mqtt status alive
            print('alive')
            mqttc.publish('/status/'+json_data_incoming['devices']['name'],"ON")
    except:
        print('continuemos')


       






    
    
