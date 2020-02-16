#include <Servo.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>


#include <ESP8266WiFi.h>
#include <SocketIoClient.h>

#define ServoPin 14 //D5
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define DoorPin A0

/// WIFI Settings ///
const char* ssid = "BELLWIFI@MCDONALDS";
const char* password = "bigChungus";

/// Socket.IO Settings ///
const char* host = "2726c660.ngrok.io";
const int port = 3001;

SocketIoClient socket;

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);
Servo myservo;

int lastDoorClosed, doorClosed; //1 for closed

void openLock(){
    myservo.write(50);
    display.clearDisplay();
    display.setCursor(0, 10);
    display.println("Unlocked");
    display.display();
    socket.emit("postLock", "\"unlocked\"");
}

void closeLock(){
    myservo.write(0);
    display.clearDisplay();
    display.setCursor(0, 10);
    display.println("Locked");
    display.display();
    socket.emit("postLock", "\"locked\"");
}

void setLock(const char * payload, size_t length){
  if(strcmp(payload, "unlock") == 0){
    openLock();
  } else if (strcmp(payload, "lock") == 0){
    closeLock();
  }
  delay(2000);
}

void setId(const char * payload, size_t length){
  display.clearDisplay();
  display.setCursor(0, 10);
  display.println("Your code");
  display.println(payload);
  display.display();
  Serial.println("Updated lock code");
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
  socket.on("idState", setId);
  socket.begin(host);
  
}

void loop() {
  socket.loop();
  doorClosed = analogRead(DoorPin) > 800;

  if(doorClosed != lastDoorClosed){
    if(doorClosed){ // Door just closed
      socket.emit("postDoor", "\"closed\"");
      delay(2000);
      closeLock();
    } else {
      socket.emit("postDoor", "\"open\"");
    }
    lastDoorClosed = doorClosed;
  }

  
  delay(100);
}
