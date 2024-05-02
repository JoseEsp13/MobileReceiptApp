# Awesome Receipt App

## Initial install instructions

Development environment setup located in "install instructions" folder

## Deploying the app on your Android phone

Make sure you have this asset directory in your project: android/app/src/main/assets/ (You may need to create the "assets" folder)

Bundle your app:
```
npm run release
```

Build the apk:
```
npm run apk
```

An apk file will be generated at android/app/build/outputs/apk/release. You need to get this install file on your phone (I used Google drive).

Once on my phone, tapping the apk file made my Android ask for security permissions. Say yes and install the app.

### Troubleshooting

I follow the process described on this site. There is a small troubleshooting section: https://instamobile.io/android-development/generate-react-native-release-build-android/