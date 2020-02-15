#include <Servo.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define ServoPin 14 //D5
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define DoorPin 15 //D8

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

Servo myservo;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  myservo.attach(ServoPin);
  pinMode(DoorPin, INPUT);

  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { // Address 0x3D for 128x64
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }
  delay(500);
  display.clearDisplay();

  display.setTextSize(2);
  display.setTextColor(WHITE);
  display.setCursor(0, 10);
  // Display static text
  display.println("Hello, world!");
  display.display();
}

void openLock(){
    myservo.write(50);
}

void closeLock(){
    myservo.write(0);
}

void loop() {
//  openLock();
//  delay(1000);
//  closeLock();
//  delay(1000);

  Serial.println(digitalRead(DoorPin));
  delay(100);
}
