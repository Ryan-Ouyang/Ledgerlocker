#include <Servo.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <SocketIOClient.h>

#define ServoPin 14 //D5
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define DoorPin A0

/// WIFI Settings ///
const char* ssid = "BELLWIFI@MCDONALDS";
const char* password = "bigChungus";

/// Socket.IO Settings ///
String host = "ad733518.ngrok.io";
const int port = 3001;

SocketIOClient socket;

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
Servo myservo;

int lastDoorClosed, doorClosed; //1 for closed

void openLock(){
    myservo.write(50);
    display.clearDisplay();
    display.setCursor(0, 10);
    display.println("Unlocked");
    display.display();
}

void closeLock(){
    myservo.write(0);
    display.clearDisplay();
    display.setCursor(0, 10);
    display.println("Locked");
    display.display();
}

void setLock(String incoming){
  if(incoming.equals("unlock")){
    openLock();
  } else if (incoming.equals("lock")){
    closeLock();
  }
}

void setup() {
  // Set up OLED
  Serial.begin(9600);

  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3D for 128x64
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  delay(500);
  display.clearDisplay();
  display.setTextSize(2);
  display.setTextColor(WHITE);

  // Set up servo 
  myservo.attach(ServoPin);
  lastDoorClosed = digitalRead(DoorPin) > 800;
  if(!lastDoorClosed){
    openLock();
  } else {
    closeLock();
  }

  // Connect to wifi
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Set up socket
  socket.on("lockState", setLock);
  if (!socket.connect(host)) Serial.println("Not connected.");
  delay(100);
  if (socket.connected())
  {
    Serial.println("Conection sucessful.");
  }
  else
  {
    Serial.println("Connection Error");
    while (1);
  }
  
}

void loop() {
  socket.monitor();

  if (Serial.available() > 0) {
    // read the incoming byte:
    char command = Serial.read();
    if(command == 'o'){
      openLock();
    } else if (command == 'c'){
      closeLock();
    }
    delay(2000);
  } else {
    doorClosed = analogRead(DoorPin) > 800;
  
    if(doorClosed != lastDoorClosed){
      if(doorClosed){ // Door just closed
        delay(2000);
        closeLock();
      }
      lastDoorClosed = doorClosed;
    }
  }
  
  delay(100);
}
