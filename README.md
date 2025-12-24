# Tank Battle Game

A classic 2D tank battle game inspired by 1980s console games like Battle City, built with Phaser.js.

## 🎮 How to Play

1. Open `index.html` in a web browser
2. Press **ENTER** to start the game
3. Use **Arrow Keys** to move your tank (green)
4. Press **SPACEBAR** to fire projectiles
5. Destroy all enemy tanks (red) while protecting your base (blue)
6. Avoid enemy fire and protect your base at all costs!

## 🎯 Game Features

### Current Implementation (MVP)
- ✅ Player tank movement with arrow keys
- ✅ Projectile shooting with spacebar
- ✅ Enemy tanks with basic AI
- ✅ Destructible brick walls (brown)
- ✅ Indestructible steel walls (gray)
- ✅ Base protection mechanics
- ✅ Lives system (3 lives)
- ✅ Score tracking
- ✅ Level progression
- ✅ Collision detection
- ✅ Game over and restart functionality

### Game Mechanics
- **Tank Movement**: Grid-aligned movement in 4 directions
- **Combat**: Single projectile per tank with cooldown
- **Walls**: Brick walls can be destroyed, steel walls deflect bullets
- **Enemy AI**: Random movement with periodic shooting
- **Scoring**:
  - Destroy enemy tank: +100 points
  - Destroy brick wall: +10 points
  - Complete level: +500 points

## 🛠️ Technical Details

- **Framework**: Phaser.js 3.70.0
- **Resolution**: 800x600 pixels
- **Tile Size**: 32x32 pixels
- **Performance**: Targets 60 FPS
- **Browser Support**: Modern browsers with HTML5 Canvas support

## 🎨 Graphics

Tank sprites with realistic details including barrels, tracks, and turrets:
- 🟢 Player Tank (Green with directional barrel)
- 🔴 Enemy Tanks (Red with directional barrel)
- 🟫 Brick Walls (Brown, destructible)
- ⬜ Steel Walls (Gray, indestructible)
- 🔵 Base (Blue, must protect)
- 🟢 Player Projectiles (Green, 12x12 pixels)
- 🟡 Enemy Projectiles (Yellow, 8x8 pixels)

## 🚀 Getting Started

1. Clone or download the files
2. Open `index.html` in any modern web browser
3. No additional installation required!

## 📁 File Structure

```
tank-game/
├── index.html      # Main HTML file with game container
├── game.js         # Core game logic and Phaser implementation
├── PRD.md          # Product Requirements Document
└── README.md       # This file
```

## 🎯 Gameplay Tips

1. **Use walls strategically** - Hide behind brick walls and create paths
2. **Protect your base** - Keep enemies away from the blue base at the bottom
3. **Plan your shots** - You can only fire one bullet at a time
4. **Watch enemy patterns** - Enemies move randomly but shoot periodically
5. **Clear paths** - Destroy brick walls to create better firing lanes

## 🔮 Future Enhancements

Based on the PRD, potential future additions include:
- Power-ups (rapid fire, armor, speed boost)
- Different enemy tank types
- Multiple level designs
- Sound effects and music
- Improved graphics and animations
- Mobile touch controls
- Better AI pathfinding

## 🐛 Known Issues

- None currently identified - report any bugs you find!

## 📄 License

This is a demonstration project. Feel free to use and modify as needed.

---

**Have fun playing!** 🎮
