# KT Companion

A knowledge-of-the-trail companion app, originally developed for my backpacking trip on the Knobstone Trail in my home state of southern Indiana. Consider it a fully customizable alternative to something like *AllTrails* or *HikingProject*.

🔗 [Try it out here](https://kt-companion.vercel.app/).

![Animated screenshot demo of the app](https://prj.jameals.com/kt/kt-app-demo.gif)

This project was rapidly developed over the course of two weeks. Although it served me well on my trip, it is not advisable to rely on  it as your only resource. You should always research your trip ahead of time, plan training hikes, become familiar with the terrain, carry a physical compass and map and know how to use them.

It relies heavily on the wonderful open-source map library [Leaflet](https://leafletjs.com/) and many more plugins from the Leaflet community.

## ⭐️ Features
- **Toggle location marker** - Save battery life by only turning on location when you need it.
- **Offline-ready including map tiles** - Hold your device in landscape mode and press the 💾 button to download visible map tiles.
- **Fullscreen app experience** - For Android devices (not sure about Safari iOS).
- **Elevation profile** - Double-tap the elevation profile to zoom.
- **Manual pace calulator** - Start/stop the timer and input your miles to see your pace and expected completion time.
- **No complicated build configuration** - All third-party libraries are loaded via CDN. Bring your own build tools if you need it.
- **Tap the map to copy coordinates** - Then paste into your notes app.

## 🎨 Customization and deployment
1. Fork the project or download the code directly
2. Replace the contents of `knobstone-trail-kt.gpx` with your own GPX data *(you can often find GPX files for popular trails online, download the GPX from your smartwatch, or use a tool like [the excellent GPS Visualizer](https://www.gpsvisualizer.com/) to draw your trail directly on a map)*
3. Replace the content of `knobstone-sites.gpx` to customize markers
5. Deploy to any web server
6. Customize map tiles - [A list of map tile providers can be found here](https://leaflet-extras.github.io/leaflet-providers/preview/)

## Room for improvement
There are a few areas that need polish:
- Receiving updates requires reinstalling the app or clearing your cache
- Not so modular - most Javascript and styles are written in a single file
- The pace calculator was written with in an imperative style and needs refactoring


## Cool features you could add
- Track location over time and display it on the map. Turn that into a downloadable GPX
- Make the pace calculator automatic based on location tracking
- Tap to add notes and markers
