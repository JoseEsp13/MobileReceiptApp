# Awesome Receipt App

## Initial install instructions

Development environment setup located in "install instructions" folder

## Deploying the app on your Android phone

Bundle your app:
```
npm run bundle
```

Build the apk:
```
npm run apk
```

An apk file will be generated at android/app/build/outputs/apk/release. You need get this install file on your phone (I used Google drive).

Once on my phone, tapping the apk file prompted my Android to ask for security permissions. Say yes and install the app.

### Troubleshooting

I follow the process described on this site. There is a small troubleshooting section: https://instamobile.io/android-development/generate-react-native-release-build-android/