# 🦈 Sharkie – Underwater Adventure

Sharkie ist ein browserbasiertes 2D-Jump-and-Run-Spiel, das mit **JavaScript, HTML5 und CSS** entwickelt wurde. Der Spieler steuert einen kleinen Hai durch eine Unterwasserwelt, sammelt Münzen und Giftflaschen, bekämpft verschiedene Meeresbewohner und stellt sich am Ende einem mächtigen Endboss.

Das Spiel verwendet das **HTML5 Canvas API** und ist mit objektorientiertem JavaScript umgesetzt.

## 🎮 Spielbeschreibung

Begleite Sharkie auf seinem Abenteuer durch die Unterwasserwelt!

Auf seinem Weg begegnet Sharkie gefährlichen Kugelfischen und Quallen. Er kann sich mit einem Flossenschlag verteidigen und Giftblasen auf seine Gegner schießen.

Sammle Münzen und Giftflaschen, weiche feindlichen Angriffen aus und besiege den Endboss, um das Spiel zu gewinnen.

## ✨ Features

- 🦈 Steuerbarer Hauptcharakter mit verschiedenen Animationen
- 🌊 Scrollende Unterwasserwelt mit Kamera
- 🐡 Unterschiedliche Gegnertypen wie Kugelfische und Quallen
- 🫧 Flossenschlag und Giftblasen als Angriffsmöglichkeiten
- 🪙 Sammelbare Münzen
- 🧪 Giftflaschen zum Auffüllen der Munition
- ❤️ Lebensanzeige und weitere Statusanzeigen
- 👹 Endboss mit Nahkampf- und Fernkampfangriffen
- 🎬 Kamerafahrten und Animationen beim Bosskampf
- 🏆 Game-Over- und You-Win-Bildschirm

## 🛠️ Verwendete Technologien

- **HTML5** – Grundstruktur des Spiels
- **CSS3** – Gestaltung der Benutzeroberfläche
- **JavaScript** – Spiellogik und Animationen
- **HTML5 Canvas API** – Darstellung der Spielwelt
- **Objektorientierte Programmierung (OOP)** – Strukturierung der Spielobjekte und Spielfunktionen

Das Spiel wurde mit Vanilla JavaScript entwickelt.

## 🎮 Spielsteuerung

Sharkie kann sich durch die Unterwasserwelt bewegen und seine Gegner mit zwei verschiedenen Angriffen bekämpfen.

Die verfügbaren Aktionen sind:

- Nach links und rechts schwimmen
- Nach oben und unten schwimmen
- Flossenschlag ausführen
- Giftblase abschießen

**Hinweis:** Die konkreten Tastenbelegungen sollten entsprechend der im Projekt verwendeten Steuerung ergänzt werden.

## 👹 Der Endboss

Am Ende des Levels wartet ein gefährlicher Endboss auf Sharkie.

Der Boss verfügt über verschiedene Angriffsmechaniken:

**Nahkampfangriff**

Wenn Sharkie dem Boss zu nahe kommt, führt dieser eine Nahkampfattacke aus.

**Fernkampfangriff**

Der Boss kann außerdem ein Projektil auf Sharkie abschießen. Der Schuss ist mit der Angriffsanimation synchronisiert und wird beim vierten Animationsbild ausgelöst.

**Boss-Animationen**

Der Endboss besitzt verschiedene Animationen für Bewegung, Angriffe, Treffer und Tod.

Der Bosskampf beinhaltet zusätzlich eine Kamerafahrt zum Endboss und eine abschließende Todesanimation.

## 🧩 Projektstruktur

Die Spiellogik ist in mehrere JavaScript-Klassen aufgeteilt.

Zu den zentralen Klassen gehören:

| Klasse | Aufgabe |
|---|---|
| `World` | Verwaltet die Spielwelt, Kollisionen, Kamera und den Spielablauf |
| `Endboss` | Steuert den Endboss, seine Animationen und Angriffe |
| `BossProjectile` | Verwaltet die Projektile des Endbosses |
| `Character` | Steuert Sharkie und seine Aktionen |
| `PufferFish` | Repräsentiert die Kugelfische |
| `Jellyfish` | Repräsentiert die Quallen |
| `Coin` | Verwaltet sammelbare Münzen |
| `PoisonBottle` | Verwaltet Giftflaschen |

Die Klassen sind auf einzelne Dateien aufgeteilt, um den Code übersichtlich und wartbar zu halten.

## 💡 Technische Umsetzung

Ein Schwerpunkt des Projekts liegt auf der objektorientierten Programmierung.

Durch die Verwendung verschiedener Klassen können Spielfiguren, Gegner, Sammelobjekte und Projektile unabhängig voneinander verwaltet werden.

Weitere wichtige Bestandteile sind:

- Kollisionserkennung zwischen Spielobjekten
- Zustandsabhängige Charakteranimationen
- Zeitgesteuerte Gegnerangriffe
- Synchronisierung von Animationen und Projektilen
- Kamera- und Cutscene-Steuerung
- Verwaltung von Lebenspunkten und Munition
- Dynamisches Hinzufügen und Entfernen von Spielobjekten

Die JavaScript-Methoden und Eigenschaften werden mithilfe von englischen JSDoc-Kommentaren dokumentiert.

## 🎯 Spielziel

Sammle Münzen, überlebe die Begegnungen mit den Unterwassergegnern und erreiche den Endboss.

Setze deine Angriffe gezielt ein, achte auf deine Lebenspunkte und nutze die gesammelten Giftflaschen, um den Endboss zu besiegen.

**Viel Spaß beim Spielen von Sharkie! 🦈**

## 👨‍💻 Entwickler

Entwickelt als JavaScript-Projekt zur praktischen Anwendung von objektorientierter Programmierung, Animationen und Spieleentwicklung mit dem HTML5 Canvas API.
