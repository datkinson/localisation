# Cordova application for playing with BLE

## Requirements

This application requires nodejs installed

It will also requires build tools for your intended mobile platform:

- For Android it is the android SDK or android studio
- Windows phone will require Visual Studio and the phone sdk

## Installation

Just install the node dependancies via:

```bash
npm install
```

This will also build the project into the www folder

## Development

Never change anything in the www folder as it will get deleted when the application is built via gulp.

All the code changes should be made inside the app folder.

To build just run:

```bash
npm run build
```

You can also set gulp to watch the app folder and auto-build when anyhting is changed.  This can be started via:

```bash
npm run watch

