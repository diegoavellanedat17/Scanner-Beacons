/*
   Based on Neil Kolban example for IDF: https://github.com/nkolban/esp32-snippets/blob/master/cpp_utils/tests/BLE%20Tests/SampleScan.cpp
   Ported to Arduino ESP32 by Evandro Copercini
*/

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <LinkedList.h>

int scanTime = 1; //In seconds
BLEScan* pBLEScan;


// La idea es que estos items se metan en la lista
struct item {
 
    String nameBeacon;
    int rssi;
    char *data_beacon;
    
  
};

LinkedList<item> *myLinkedList = new LinkedList<item>();
// Make sure you call delete(MyClass) when you remove!

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {

      if(advertisedDevice.haveName()== true && advertisedDevice.getName().c_str()[1]=='S' ){
      //Serial.printf("Advertised Device: %s \n", advertisedDevice.toString().c_str());
      char *pHex = BLEUtils::buildHexData(nullptr, (uint8_t*)advertisedDevice.getManufacturerData().data(), advertisedDevice.getManufacturerData().length());
      // Crear el item
      item temp_item = {advertisedDevice.getName().c_str(),advertisedDevice.getRSSI(),pHex};
      // igresarlo en la lista
      myLinkedList->add(temp_item);
      }
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Scanning...");

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); //create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);  // less or equal setInterval value
}

void loop() {
   BLEDevice::init("");
  // put your main code here, to run repeatedly:
  BLEScanResults foundDevices = pBLEScan->start(scanTime, false);

  //Imprimir en JSON

  int listSize = myLinkedList->size();
  //Imprimit en JSON

    for (int h = 0; h < listSize; h++) {

      if(h==0){
        Serial.print("{\"devices\":");
      }

    item itemDevice = myLinkedList->get(h);
    
    Serial.print("{\"name\": \"");
    Serial.print(itemDevice.nameBeacon);
    Serial.print("\",");
    Serial.print("\"rssi\": ");
    Serial.print(String(itemDevice.rssi));
    Serial.print(",");
    Serial.print("\"baterry\": \"");
    Serial.print(itemDevice.data_beacon);
    Serial.print("\"");
    

        if(h==listSize-1){
        Serial.println("}}");
      }
      else{
        Serial.print("\"},");
      }
  }
  
  myLinkedList->clear();
  pBLEScan->clearResults();   // delete results fromBLEScan buffer to release memory
  delay(500);
  BLEDevice::deinit(false);
}
