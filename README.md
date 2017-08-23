# To Do App Native Code
A native code alternate of the to do app.

## How to install:
1. Follow the instructions at https://facebook.github.io/react-native/docs/getting-started.html to build projects with native code. Stop at "Creating a new application."
2. Add `%ANDROID_HOME%/tools` and `%ANDROID_HOME%/platform-tools` to your path variable.
3. Download Genymotion at https://www.genymotion.com/fun-zone and create a new account.
4. Download VirtualBox at https://www.virtualbox.org/wiki/Downloads.
5. Open Genymotion ang log in to your account.
6. Once you are logged in, go to settings and click ADB. Choose "Use custom Android SDK tools" and browse for the location of your Android SDK which should be the same locations as your `ANDROID_HOME` path variable.
7. Create a new device through Genymotion.
8. Open the device and wait for startup.
9. Run `npm install` at the root of this project.
10. Run `react-native run-android` at the root of this project to launch the app.

## Note:
These instructions may not be complete or clear enough so if you have any questions please send me a message at our Discord server.
