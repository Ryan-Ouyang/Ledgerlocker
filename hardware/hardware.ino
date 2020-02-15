#include <Servo.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define ServoPin 14 //D5
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define DoorPin A0

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

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3D for 128x64
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  delay(500);
  display.clearDisplay();

  display.setTextSize(2);
  display.setTextColor(WHITE);c

  myservo.attach(ServoPin);
  lastDoorClosed = digitalRead(DoorPin) > 800;
  if(!lastDoorClosed){
    openLock();
  } else {
    closeLock();
  }
}

void loop() {
//  openLock();
//  delay(1000);
//  closeLock();
//  delay(1000);

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
