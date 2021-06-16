#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

BLEAdvertisementData advert;
BLEAdvertising *pAdvertising;


int i = 0;

//manufacturer code (0x02E5 for Espressif)
int man_code = 0x02E5;
//Para irse a dormir
#define uS_TO_S_FACTOR 1000000  //Conversion factor for micro seconds to seconds
#define TIME_TO_SLEEP  3        //Time ESP32 will go to sleep (in seconds)

//function takes String and adds manufacturer code at the beginning 
void setManData(String c, int c_size, BLEAdvertisementData &adv, int m_code) {
  
  String s;
  char b2 = (char)(m_code >> 8);
  m_code <<= 8;
  char b1 = (char)(m_code >> 8);
  s.concat(b1);
  s.concat(b2);
  s.concat(c);
  adv.setManufacturerData(s.c_str());
  
}

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE work!");
  print_wakeup_reason();
  BLEDevice::init("MyESP32");
  BLEServer *pServer = BLEDevice::createServer();

  pAdvertising = pServer->getAdvertising();
  advert.setName("ESP32-new");
  pAdvertising->setMinInterval(0XC8);
  pAdvertising->setMaxInterval(0x190);
  pAdvertising->setAdvertisementData(advert);
  pAdvertising->start();
}

void loop() {

  //Set timer to 5 seconds
  //esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);


  if(i>20){
    i=0;
    //Go to sleep now
    //esp_deep_sleep_start();
  // Serial.println("Setup ESP32 to sleep for every " + String(TIME_TO_SLEEP) +" Seconds");
  }
  Serial.println(i);
  i++;
  String a = String(i);
  
  BLEAdvertisementData scan_response;
  setManData(a, a.length() , scan_response, man_code);

  pAdvertising->stop();
  pAdvertising->setScanResponseData(scan_response);
  pAdvertising->start();
  delay(1000);

 
  
}

//Function that prints the reason by which ESP32 has been awaken from sleep
void print_wakeup_reason(){
  esp_sleep_wakeup_cause_t wakeup_reason;
  wakeup_reason = esp_sleep_get_wakeup_cause();
  switch(wakeup_reason)
  {
    case 1  : Serial.println("Wakeup caused by external signal using RTC_IO"); break;
    case 2  : Serial.println("Wakeup caused by external signal using RTC_CNTL"); break;
    case 3  : Serial.println("Wakeup caused by timer"); break;
    case 4  : Serial.println("Wakeup caused by touchpad"); break;
    case 5  : Serial.println("Wakeup caused by ULP program"); break;
    default : Serial.println("Wakeup was not caused by deep sleep"); break;
  }
}
