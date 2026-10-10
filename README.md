# 🦈 Sharkie – Underwater Adventure

Sharkie ist ein browserbasiertes 2D-Unterwasser-Actionspiel, das mit
**JavaScript, HTML5 und CSS** entwickelt wurde.

Der Spieler steuert einen kleinen Hai durch eine Unterwasserwelt,
sammelt Münzen und Giftflaschen, bekämpft verschiedene Meeresbewohner
und stellt sich am Ende einem mächtigen Endboss.

Das Spiel verwendet die **HTML5 Canvas API** und wurde vollständig
mit **Vanilla JavaScript** und objektorientierter Programmierung (OOP)
umgesetzt.

## 🎮 Spielbeschreibung

Begleite Sharkie auf seinem Abenteuer durch die Unterwasserwelt!

Auf seinem Weg begegnet Sharkie gefährlichen Kugelfischen und Quallen.
Er kann sich mit einem Flossenschlag verteidigen und Giftblasen auf
seine Gegner schießen.

Sammle Münzen und Giftflaschen, weiche feindlichen Angriffen aus
und besiege den Endboss, um das Spiel zu gewinnen.

## ✨ Features

### 🦈 Gameplay

- Steuerbarer Hauptcharakter mit verschiedenen Animationen
- Scrollende Unterwasserwelt mit Kamerasteuerung
- Unterschiedliche Gegnertypen wie Kugelfische und Quallen
- Flossenschlag und Giftblasen als Angriffsmöglichkeiten
- Sammelbare Münzen
- Giftflaschen zum Auffüllen der Munition
- Lebensanzeige sowie Münz- und Giftstatusanzeigen
- Kollisionserkennung zwischen Spielfiguren und Objekten
- Unterschiedliche Schadensarten, darunter elektrische Angriffe
- Dynamisches Erzeugen von Gegnern

### 👹 Endboss

- Endboss mit eigener Aktivierungslogik
- Nahkampf- und Fernkampfangriffe
- Synchronisierung von Projektilen und Angriffsanimationen
- Trefferanimationen und Lebenspunkte
- Kamerafahrt zum Endboss
- Eigene Todesanimation und Todessound
- Victory-Bildschirm nach dem Bosskampf

### 🎵 Audio

- Hintergrundmusik für Hauptmenü und Gameplay
- Eigene Musik für den Victory-Bildschirm
- Soundeffekte für Angriffe und Treffer
- Unterschiedliche Geräusche für Gegner
- Sounds beim Einsammeln von Münzen und Giftflaschen
- Eigene Todessounds für Sharkie und den Endboss
- Game-Over-Sound
- Soundeffekte für elektrische Angriffe
- Mute-Button zum Ein- und Ausschalten des Tons
- Automatisches Pausieren und Fortsetzen der Audioausgabe

### 🖥️ Benutzeroberfläche

- Hauptmenü mit Spielstart und Anleitung
- Pause-Menü mit Resume-Funktion
- Neustart nach Game Over oder Victory
- Rückkehr zum Hauptmenü
- Game-Over- und Victory-Bildschirm
- Responsive Gestaltung
- Touch-Steuerung für mobile Geräte
- Separater Sound-Button
- Impressum

## 🛠️ Verwendete Technologien

| Technologie | Verwendung |
|---|---|
| HTML5 | Grundstruktur und Benutzeroberfläche |
| CSS3 | Design, Layout und responsive Darstellung |
| JavaScript | Spiellogik, Steuerung und Animationen |
| HTML5 Canvas API | Darstellung der Spielwelt |
| HTMLAudioElement | Hintergrundmusik und Soundeffekte |
| OOP | Strukturierung der Spielobjekte |
| JSDoc | Dokumentation der JavaScript-Methoden |

Das Projekt verwendet keine JavaScript-Frameworks.

## 🎮 Spielsteuerung

### Tastatur

| Taste | Aktion |
|---|---|
| Pfeiltaste links | Nach links schwimmen |
| Pfeiltaste rechts | Nach rechts schwimmen |
| Pfeiltaste oben | Nach oben schwimmen |
| Pfeiltaste unten | Nach unten schwimmen |
| Leertaste | Flossenschlag |
| A | Giftblase abschießen |

### Mobile Geräte

Auf Geräten mit Touch-Bedienung werden zusätzliche Steuerelemente
eingeblendet.

Diese ermöglichen:

- Bewegung in alle vier Richtungen
- Flossenschlag
- Giftblasenangriff

### Weitere Steuerungsmöglichkeiten

- **Menu:** Öffnet das Pause-Menü.
- **Resume:** Setzt das Spiel fort.
- **Main Menu:** Kehrt zum Hauptmenü zurück.
- **Sound-Button:** Schaltet Musik und Soundeffekte ein oder aus.

## 👹 Der Endboss

Am Ende des Levels wartet ein gefährlicher Endboss auf Sharkie.

Der Boss besitzt mehrere Angriffsmechaniken und eigene Animationen.

### Nahkampfangriff

Wenn Sharkie dem Boss zu nahe kommt, kann dieser eine
Nahkampfattacke ausführen.

### Fernkampfangriff

Der Endboss kann außerdem ein Projektil auf Sharkie abschießen.

Der Schuss wird mit der Angriffsanimation synchronisiert und
beim vorgesehenen Animationsbild ausgelöst.

### Boss-Animationen

Der Endboss verfügt über Animationen für:

- Einführung
- Bewegung
- Nahkampf
- Fernkampf
- Treffer
- Tod

Der Bosskampf beinhaltet außerdem eine Kamerafahrt und eine
abschließende Todesanimation.

Nach dem Sieg erscheint der Victory-Bildschirm mit eigener Musik.

## 🧩 Projektstruktur

Das Projekt ist in mehrere Ordner und JavaScript-Klassen aufgeteilt.

```text
sharkie/
├── assets/
│   └── 8. Audio/
├── js/
│   ├── audio-manager.js
│   ├── game.js
│   ├── keyboard.js
│   └── touch-controls.js
├── models/
│   ├── character-base.class.js
│   ├── character-animation.class.js
│   ├── character.class.js
│   ├── endboss-base.class.js
│   ├── endboss-animation.class.js
│   ├── endboss.class.js
│   ├── world-base.class.js
│   ├── world-render.class.js
│   ├── world-collision.class.js
│   ├── world-collectibles.class.js
│   ├── world-boss.class.js
│   ├── world-boss-cutscene.class.js
│   ├── world-boss-poison.class.js
│   └── world.class.js
├── pages/
│   └── impressum.html
├── styles/
│   ├── game-buttons.css
│   └── impressum.css
├── index.html
├── style.css
└── README.md
```

Die Darstellung zeigt die wichtigsten Projektdateien.
Weitere Klassen für Gegner, Sammelobjekte und Projektile
befinden sich ebenfalls im Ordner `models/`.

### Zentrale Klassen

| Klasse | Aufgabe |
|---|---|
| `World` | Verwaltet die Spielwelt und den Spielablauf |
| `Character` | Steuert Sharkie und seine Aktionen |
| `Endboss` | Verwaltet das Verhalten des Endbosses |
| `BossProjectile` | Repräsentiert die Projektile des Endbosses |
| `PufferFish` | Repräsentiert Kugelfische |
| `JellyFish` | Repräsentiert Quallen |
| `Coin` | Verwaltet sammelbare Münzen |
| `PoisonBottle` | Verwaltet Giftflaschen |
| `AudioManager` | Verwaltet Musik und Soundeffekte |

Die Spiellogik ist auf mehrere Dateien verteilt, um
Verantwortlichkeiten voneinander zu trennen und die
Wartbarkeit zu verbessern.

## 💡 Technische Umsetzung

Ein Schwerpunkt des Projekts liegt auf der objektorientierten
Programmierung mit JavaScript.

Spielfiguren, Gegner, Sammelobjekte und Projektile werden
durch eigene Klassen repräsentiert.

### Objektorientierte Architektur

Die Spiellogik verwendet Klassen und Vererbung, um
gemeinsame Eigenschaften und Verhaltensweisen
wiederzuverwenden.

Beispielsweise ist die Charakterlogik auf mehrere
Klassen aufgeteilt.

Auch die Spielwelt und der Endboss sind in verschiedene
Klassen unterteilt.

### Animationen

Die Animationen werden durch den Wechsel zwischen
verschiedenen Sprite-Bildern erzeugt.

Je nach Spielzustand werden unterschiedliche Animationen
abgespielt.

Dazu gehören beispielsweise:

- Schwimmen
- Angreifen
- Schaden erhalten
- Sterben

### Kollisionserkennung

Das Spiel prüft Kollisionen zwischen Sharkie,
Gegnern, Sammelobjekten und Projektilen.

Dadurch werden unter anderem Schaden, Angriffe
und das Einsammeln von Objekten ausgelöst.

### Gegnerverhalten

Gegner werden während des Spiels dynamisch erzeugt.

Unterschiedliche Gegnertypen besitzen eigene
Bewegungs- und Angriffsmechaniken.

### Spielzeit und Pause

Das Spiel berücksichtigt Pausenzeiten bei der
Berechnung spielbezogener Zeitabläufe.

Dadurch können zeitabhängige Aktionen nach dem
Fortsetzen des Spiels korrekt weiterlaufen.

### AudioManager

Die Musik und Soundeffekte werden zentral über
die Klasse `AudioManager` verwaltet.

Zu ihren Aufgaben gehören:

- Laden der Audiodateien
- Abspielen von Hintergrundmusik
- Abspielen einzelner Soundeffekte
- Einstellen von Lautstärke und Wiedergabegeschwindigkeit
- Pausieren und Fortsetzen der Audioausgabe
- Stoppen laufender Sounds
- Stummschalten des Spiels

### Codequalität

Die JavaScript-Methoden und Eigenschaften werden
mithilfe englischer JSDoc-Kommentare dokumentiert.

Bei der Entwicklung wurde auf eine übersichtliche
Dateistruktur und kleine, klar abgegrenzte
Funktionen geachtet.

## 🎯 Spielziel

Sammle Münzen, überlebe die Begegnungen mit den
Unterwassergegnern und erreiche den Endboss.

Setze deine Angriffe gezielt ein, achte auf deine
Lebenspunkte und nutze die gesammelten Giftflaschen,
um den Endboss zu besiegen.

**Viel Spaß beim Spielen von Sharkie! 🦈**

## 🎨 Assets & Credits

Das Projekt verwendet Grafiken und Soundeffekte
aus externen Asset-Sammlungen.

Zu den verwendeten Quellen gehören unter anderem:

- OpenGameArt
- Pixabay

Die jeweiligen Urheber, Quellen und Lizenzbedingungen
der verwendeten Assets müssen vor der öffentlichen
Veröffentlichung vollständig dokumentiert und
berücksichtigt werden.

## 👨‍💻 Entwickler

Entwickelt als JavaScript-Lern- und Portfolio-Projekt
zur praktischen Anwendung von:

- Objektorientierter Programmierung
- HTML5 Canvas
- Animationen
- Kollisionserkennung
- Spielzustandsverwaltung
- Audiointegration
- Responsivem Webdesign