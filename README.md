# Awesome Receipt App

## React Native Install Instructions:

Official Docs: https://reactnative.dev/docs/environment-setup

### Installing dependencies

You will need Node, the React Native command line interface, a JDK, and Android Studio.

While you can use any editor of your choice to develop your app, you will need to install Android Studio in order to set up the necessary tooling to build your React Native app for Android.

### OPTIONAL: Install Node Version Manager (NVM)

It manages node installations for Windows. Not required for this project, but might help you in the future.

https://github.com/coreybutler/nvm-windows/releases

Then type: 

nvm install 21.7.3


### Install the Java SE Development Kit (JDK)

You can either install Chocolately (another package manager) or download it directly:

Chocolately: https://chocolatey.org/install

choco install -y microsoft-openjdk17

Or

Directly: https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-17

### Install Android Studio

https://developer.android.com/studio/index.html

While on the Android Studio installation wizard, make sure the boxes next to all of the following items are checked:

- Android SDK
- Android SDK Platform
- Android Virtual Device
- If you are not already using Hyper-V: Performance (Intel ® HAXM) (See here for AMD or Hyper-V)

Then, click "Next" to install all of these components.

If the checkboxes are grayed out, you will have a chance to install these components later on.

Once setup has finalized and you're presented with the Welcome screen, proceed to the next step.

### Install Android SDK

Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the Android 14 (UpsideDownCake) SDK in particular. Additional Android SDKs can be installed through the SDK Manager in Android Studio.

To do that, open Android Studio, click on the "More Actions" button and select "SDK Manager".

Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the Android 14 (UpsideDownCake) entry, then make sure the following items are checked:

- Android SDK Platform 34
- Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image

Next, select the "SDK Tools" tab and check the box next to "Show Package Details" here as well. Look for and expand the Android SDK Build-Tools entry, then make sure that 34.0.0 is selected.

Finally, click "Apply" to download and install the Android SDK and related build tools.

### Configure the ANDROID_HOME environment variable

The React Native tools require some environment variables to be set up in order to build apps with native code.

1. Open the Windows Control Panel.
2. Click on User Accounts, then click User Accounts again
3. Click on Change my environment variables
4. Click on New... to create a new ANDROID_HOME user variable that points to the path to your Android SDK:

The SDK is installed, by default, at the following location:

%LOCALAPPDATA%\Android\Sdk

You can find the actual location of the SDK in the Android Studio "Settings" dialog, under Languages & Frameworks → Android SDK.

### Add platform-tools to Path

1. Open the Windows Control Panel.
2. Click on User Accounts, then click User Accounts again
3. Click on Change my environment variables
4. Select the Path variable.
5. Click Edit.
6. Click New and add the path to platform-tools to the list.

The default location for this folder is:

%LOCALAPPDATA%\Android\Sdk\platform-tools


## Preparing Android Device

Official Docs: https://reactnative.dev/docs/environment-setup (Ctrl-f Preparing the Android device)

You will need an Android device to run your React Native Android app. This can be either a physical Android device, or more commonly, you can use an Android Virtual Device which allows you to emulate an Android device on your computer.

### Using a physical device

If you have a physical Android device, you can use it for development in place of an AVD by plugging it into your computer using a USB cable and following the instructions [here](https://reactnative.dev/docs/running-on-device).

### Using a virtual device

If you use Android Studio to open `./AwesomeProject/android`, you can see the list of available Android Virtual Devices (AVDs) by opening the "AVD Manager" from within Android Studio. Look for an icon that looks like this:

![AVD Manager Icon](https://developer.android.com/studio/run/images/avd-manager-icon.png)

If you have recently installed Android Studio, you

