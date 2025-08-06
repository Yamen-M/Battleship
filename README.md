# Battleship

A classic naval strategy game reimagined with a retro cyberpunk aesthetic, built as part of [The Odin Project](https://www.theodinproject.com/)'s Full Stack JavaScript curriculum. Experience the ship-hunting gameplay enhanced with smart AI, modern ES6+ modules, and neon visuals that bring the digital battlefield to life.

## 🔧 Features

-  **Interactive Ship Placement**: Drag and drop ships with visual previews and rotation controls
-  **Smart AI Opponent**: Advanced targeting algorithm that hunts systematically after scoring hits
-  **Classic Grid System**: Traditional A-J, 1-10 coordinate system for authentic gameplay
-  **Visual Feedback**: Real-time hit/miss indicators with explosion animations
-  **Retro Cyberpunk Design**: Neon glows, scanlines, and synthwave-inspired color palette
-  **Fully Responsive**: Optimized gameplay across desktop, tablet, and mobile devices
-  **Instant Restart**: Quick game reset without page reload for continuous play
-  **Smooth Animations**: Polished transitions and hover effects throughout

## 🛠️ Technologies Used

- **HTML5** — Semantic structure with accessible grid-based layout
- **CSS3** — Custom properties, grid layouts, neon effects, keyframe animations
- **JavaScript (ES6+)** — Modular architecture, classes, import/export, async operations
- **Jest** — Comprehensive unit testing for game logic and components
- **Google Fonts (Orbitron)** — Futuristic typography for the retro aesthetic

## 🎮 Game Rules

1. **Setup Phase**: Place your 5 ships (Carrier: 5, Battleship: 4, Cruiser: 3, Submarine: 3, Destroyer: 2) on your grid
2. **Battle Phase**: Take turns attacking enemy coordinates to find and sink their fleet
3. **Victory**: First player to sink all enemy ships wins the battle
4. **AI Strategy**: The computer remembers hits and systematically targets adjacent cells

## 🚀 Key Implementation Highlights

- **Object-Oriented Design**: Separate classes for Ship, Gameboard, Player, and Game logic
- **Smart AI Algorithm**: Queue-based targeting system that switches between hunt and target modes
- **Test-Driven Development**: Comprehensive Jest test suite ensuring reliable gameplay
- **Modern ES Modules**: Clean separation of concerns with import/export syntax
- **CSS Grid & Flexbox**: Responsive layout system that scales across all devices
- **Progressive Enhancement**: Vanilla JavaScript foundation with enhanced visual effects

Check it out [here](https://yamen-m.github.io/Battleship/)