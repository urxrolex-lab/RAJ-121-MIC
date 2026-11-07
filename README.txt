121 MIC LAB - ANDROID PWA PROTOTYPE 0.2

NEW IN 0.2
- Installable PWA manifest and app icons.
- Service worker caches the app shell for repeat/offline opening (mic access still requires a secure origin and permission).
- Added a final safety compressor/limiter after dry + echo + reverb are mixed. This reduces clipping risk but does not guarantee distortion-free audio.

FEATURES
- Mic gain, Bass, Presence, Treble, Echo and Reverb controls.
- CLEAR, DEEP BASS, BRIGHT and ULTRA V2-style presets.
- NORMAL, RADIO and ROBOT tone-character modes.
- Audio processing remains local in the browser tab.

ANDROID INSTALL / TEST
1. Host this folder on an HTTPS site. Microphone access and PWA install generally require HTTPS (localhost is suitable for local development).
2. Open the HTTPS address in Android Chrome. Grant microphone permission.
3. Use the browser menu > Install app / Add to Home screen if offered.
4. Connect headphones before pressing Start mic. Start at low gain; test CLEAR first, then adjust one control at a time.
5. Turn mic off before leaving the app.

IMPORTANT PLATFORM LIMIT
This PWA is a standalone browser app for local monitoring. It does not create a virtual microphone, replace Android's system microphone, or inject processed audio into native WhatsApp/other apps. Android does not provide ordinary third-party apps a general system-wide microphone replacement API.

SOURCE
The supplied MOHIT GOD MIC V2 extension targets WhatsApp Web on desktop Chrome. This prototype recreates selected DSP controls in a mobile browser; it is not a direct port of the Chrome extension.
