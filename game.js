// Tank Battle Game - Main Game Logic
// Based on classic Battle City style gameplay

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        // Game state
        this.gameState = {
            player1: {
                lives: 3,
                score: 0,
                alive: true
            },
            player2: {
                lives: 3,
                score: 0,
                alive: true
            },
            level: 1,
            gameStarted: false,
            gameOver: false
        };
    }

    preload() {
        // Create tank sprites that actually look like tanks
        this.createTankSprites();
        this.createDirectionalTankSprites();

        // Player 1 projectile (green, wider)
        this.add.graphics()
            .fillStyle(0x00ff00)
            .fillRect(0, 0, 12, 12)
            .generateTexture('player1Bullet', 12, 12);
            
        // Player 2 projectile (blue, wider)
        this.add.graphics()
            .fillStyle(0x0088ff)
            .fillRect(0, 0, 12, 12)
            .generateTexture('player2Bullet', 12, 12);
            
        // Enemy projectile (yellow, smaller)
        this.add.graphics()
            .fillStyle(0xffff00)
            .fillRect(0, 0, 8, 8)
            .generateTexture('enemyBullet', 8, 8);

        // Brick wall (brown)
        this.add.graphics()
            .fillStyle(0x8B4513)
            .fillRect(0, 0, 32, 32)
            .generateTexture('brickWall', 32, 32);

        // Steel wall (gray)
        this.add.graphics()
            .fillStyle(0x808080)
            .fillRect(0, 0, 32, 32)
            .generateTexture('steelWall', 32, 32);

        // Base (blue)
        this.add.graphics()
            .fillStyle(0x0000ff)
            .fillRect(0, 0, 32, 32)
            .generateTexture('base', 32, 32);
    }

    createTankSprites() {
        // Player tank (green) facing up
        this.drawTank('playerTank', 0x00aa00, 0x00ff00, 'up');
        
        // Enemy tank (red) facing down  
        this.drawTank('enemyTank', 0xaa0000, 0xff0000, 'down');
    }

    createDirectionalTankSprites() {
        // Create player 1 tank sprites for all 4 directions (green)
        this.drawTank('player1Tank_up', 0x00aa00, 0x00ff00, 'up');
        this.drawTank('player1Tank_down', 0x00aa00, 0x00ff00, 'down');
        this.drawTank('player1Tank_left', 0x00aa00, 0x00ff00, 'left');
        this.drawTank('player1Tank_right', 0x00aa00, 0x00ff00, 'right');
        
        // Create player 2 tank sprites for all 4 directions (blue)
        this.drawTank('player2Tank_up', 0x0000aa, 0x0000ff, 'up');
        this.drawTank('player2Tank_down', 0x0000aa, 0x0000ff, 'down');
        this.drawTank('player2Tank_left', 0x0000aa, 0x0000ff, 'left');
        this.drawTank('player2Tank_right', 0x0000aa, 0x0000ff, 'right');
        
        // Create enemy tank sprites for all 4 directions (red)
        this.drawTank('enemyTank_up', 0xaa0000, 0xff0000, 'up');
        this.drawTank('enemyTank_down', 0xaa0000, 0xff0000, 'down');
        this.drawTank('enemyTank_left', 0xaa0000, 0xff0000, 'left');
        this.drawTank('enemyTank_right', 0xaa0000, 0xff0000, 'right');
    }

    drawTank(textureName, bodyColor, lightColor, direction) {
        const graphics = this.add.graphics();
        
        // Tank body (main square)
        graphics.fillStyle(bodyColor);
        graphics.fillRect(4, 4, 24, 24);
        
        // Tank highlights for 3D effect
        graphics.fillStyle(lightColor);
        graphics.fillRect(6, 6, 20, 2); // Top highlight
        graphics.fillRect(6, 6, 2, 20); // Left highlight
        
        // Tank tracks (treads)
        graphics.fillStyle(0x333333);
        graphics.fillRect(2, 6, 3, 20); // Left track
        graphics.fillRect(27, 6, 3, 20); // Right track
        
        // Tank barrel based on direction
        graphics.fillStyle(0x666666);
        
        switch (direction) {
            case 'up':
                graphics.fillRect(14, 0, 4, 12); // Barrel pointing up
                break;
            case 'down':
                graphics.fillRect(14, 20, 4, 12); // Barrel pointing down
                break;
            case 'left':
                graphics.fillRect(0, 14, 12, 4); // Barrel pointing left
                break;
            case 'right':
                graphics.fillRect(20, 14, 12, 4); // Barrel pointing right
                break;
        }
        
        // Tank center (turret)
        graphics.fillStyle(bodyColor);
        graphics.fillCircle(16, 16, 6);
        
        // Generate texture
        graphics.generateTexture(textureName, 32, 32);
        graphics.destroy();
    }

    create() {
        // Initialize groups
        this.walls = this.add.group();
        this.enemyTanks = this.add.group();
        this.player1Bullets = this.add.group();
        this.player2Bullets = this.add.group();
        this.enemyBullets = this.add.group();

        // Create level
        this.createLevel();

        // Create player 1 tank (green)
        this.player1 = this.physics.add.sprite(350, 550, 'player1Tank_up');
        this.player1.setCollideWorldBounds(true);
        this.player1.body.setSize(30, 30);
        this.player1.direction = 'up';
        this.player1.canShoot = true;
        
        // Create player 2 tank (blue)
        this.player2 = this.physics.add.sprite(450, 550, 'player2Tank_up');
        this.player2.setCollideWorldBounds(true);
        this.player2.body.setSize(30, 30);
        this.player2.direction = 'up';
        this.player2.canShoot = true;

        // Create base
        this.base = this.physics.add.sprite(400, 580, 'base');
        this.base.body.setImmovable(true);

        // Input handling
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,S,A,D,SPACE,ENTER,FIVE');

        // Collisions
        this.setupCollisions();

        // Create enemies
        this.createEnemies();

        // UI
        this.updateUI();

        // Game start text
        this.startText = this.add.text(400, 300, 'Press ENTER to Start!', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Courier New'
        }).setOrigin(0.5).setDepth(1000);
    }

    createLevel() {
        const tileSize = 32;
        
        // Always create outer steel walls (indestructible border)
        this.createOuterWalls(tileSize);
        
        // Create level-specific layout based on current level
        const levelIndex = (this.gameState.level - 1) % 3; // Cycle through 3 different maps
        
        switch (levelIndex) {
            case 0:
                this.createLevel1Layout(tileSize);
                break;
            case 1:
                this.createLevel2Layout(tileSize);
                break;
            case 2:
                this.createLevel3Layout(tileSize);
                break;
        }
        
        console.log(`Level ${this.gameState.level}: Using map layout ${levelIndex + 1}`);
    }
    
    createOuterWalls(tileSize) {
        // Outer steel walls (indestructible border)
        for (let x = 0; x < 25; x++) {
            this.createWall(x * tileSize, 0, 'steelWall');
            this.createWall(x * tileSize, 568, 'steelWall');
        }
        
        for (let y = 1; y < 18; y++) {
            this.createWall(0, y * tileSize, 'steelWall');
            this.createWall(768, y * tileSize, 'steelWall');
        }
    }
    
    createLevel1Layout(tileSize) {
        // Classic Battle City style - Simple cross pattern
        // Central cross formation
        for (let x = 10; x < 15; x++) {
            this.createWall(x * tileSize, 8 * tileSize, 'brickWall');
            this.createWall(x * tileSize, 10 * tileSize, 'brickWall');
        }
        
        for (let y = 6; y < 13; y++) {
            if (y !== 8 && y !== 10) { // Leave gaps in cross
                this.createWall(12 * tileSize, y * tileSize, 'brickWall');
            }
        }
        
        // Corner fortresses
        for (let x = 3; x < 6; x++) {
            for (let y = 3; y < 6; y++) {
                this.createWall(x * tileSize, y * tileSize, 'brickWall');
            }
        }
        
        for (let x = 19; x < 22; x++) {
            for (let y = 3; y < 6; y++) {
                this.createWall(x * tileSize, y * tileSize, 'brickWall');
            }
        }
        
        // Base protection
        this.createWall(11 * tileSize, 15 * tileSize, 'steelWall');
        this.createWall(13 * tileSize, 15 * tileSize, 'steelWall');
    }
    
    createLevel2Layout(tileSize) {
        // Maze corridors - Complex pathways
        // Vertical corridors
        for (let y = 2; y < 16; y++) {
            if (y !== 5 && y !== 9 && y !== 13) { // Gaps for horizontal movement
                this.createWall(6 * tileSize, y * tileSize, 'brickWall');
                this.createWall(18 * tileSize, y * tileSize, 'brickWall');
            }
        }
        
        // Horizontal corridors
        for (let x = 3; x < 22; x++) {
            if (x !== 6 && x !== 12 && x !== 18) { // Gaps for vertical movement
                this.createWall(x * tileSize, 5 * tileSize, 'brickWall');
                this.createWall(x * tileSize, 13 * tileSize, 'brickWall');
            }
        }
        
        // Central fortress
        for (let x = 10; x < 15; x++) {
            for (let y = 7; y < 12; y++) {
                if (x === 10 || x === 14 || y === 7 || y === 11) {
                    this.createWall(x * tileSize, y * tileSize, 'brickWall');
                }
            }
        }
        
        // Steel strongpoints
        this.createWall(12 * tileSize, 3 * tileSize, 'steelWall');
        this.createWall(3 * tileSize, 9 * tileSize, 'steelWall');
        this.createWall(21 * tileSize, 9 * tileSize, 'steelWall');
    }
    
    createLevel3Layout(tileSize) {
        // Diamond formation - Strategic positioning
        // Central diamond
        const centerX = 12, centerY = 9;
        for (let i = 0; i < 5; i++) {
            this.createWall((centerX - i) * tileSize, (centerY - 2 + i) * tileSize, 'brickWall');
            this.createWall((centerX + i) * tileSize, (centerY - 2 + i) * tileSize, 'brickWall');
            this.createWall((centerX - i) * tileSize, (centerY + 2 - i) * tileSize, 'brickWall');
            this.createWall((centerX + i) * tileSize, (centerY + 2 - i) * tileSize, 'brickWall');
        }
        
        // Side diamonds
        for (let i = 0; i < 3; i++) {
            this.createWall((5 - i) * tileSize, (6 + i) * tileSize, 'brickWall');
            this.createWall((5 + i) * tileSize, (6 + i) * tileSize, 'brickWall');
            this.createWall((5 - i) * tileSize, (10 - i) * tileSize, 'brickWall');
            this.createWall((5 + i) * tileSize, (10 - i) * tileSize, 'brickWall');
            
            this.createWall((19 - i) * tileSize, (6 + i) * tileSize, 'brickWall');
            this.createWall((19 + i) * tileSize, (6 + i) * tileSize, 'brickWall');
            this.createWall((19 - i) * tileSize, (10 - i) * tileSize, 'brickWall');
            this.createWall((19 + i) * tileSize, (10 - i) * tileSize, 'brickWall');
        }
        
        // Strategic steel walls
        this.createWall(12 * tileSize, 2 * tileSize, 'steelWall');
        this.createWall(8 * tileSize, 14 * tileSize, 'steelWall');
        this.createWall(16 * tileSize, 14 * tileSize, 'steelWall');
    }

    createWall(x, y, type) {
        const wall = this.physics.add.sprite(x, y, type);
        wall.setOrigin(0, 0);
        wall.body.setImmovable(true);
        wall.wallType = type;
        this.walls.add(wall);
    }
    
    resetPlayersToStart() {
        // Reset both players to their initial starting positions
        if (this.player1 && this.gameState.player1.alive) {
            this.player1.x = 350;
            this.player1.y = 550;
            this.player1.direction = 'up';
            this.player1.setTexture('player1Tank_up');
            this.player1.body.setVelocity(0, 0);
            console.log('Player 1 reset to starting position');
        }
        
        if (this.player2 && this.gameState.player2.alive) {
            this.player2.x = 450;
            this.player2.y = 550;
            this.player2.direction = 'up';
            this.player2.setTexture('player2Tank_up');
            this.player2.body.setVelocity(0, 0);
            console.log('Player 2 reset to starting position');
        }
    }

    createEnemies() {
        // Calculate number of enemies based on level (3 + level - 1, max 8)
        const baseEnemies = 3;
        const maxEnemies = 8;
        const enemyCount = Math.min(baseEnemies + (this.gameState.level - 1), maxEnemies);
        
        // Define possible spawn positions across the top
        const allPositions = [
            { x: 64, y: 50 },   // Far left
            { x: 160, y: 50 },  // Left
            { x: 256, y: 50 },  // Left-center
            { x: 352, y: 50 },  // Center-left
            { x: 448, y: 50 },  // Center-right
            { x: 544, y: 50 },  // Right-center
            { x: 640, y: 50 },  // Right
            { x: 736, y: 50 }   // Far right
        ];
        
        // Shuffle positions and take only what we need
        const shuffledPositions = [...allPositions].sort(() => Math.random() - 0.5);
        const selectedPositions = shuffledPositions.slice(0, enemyCount);
        
        selectedPositions.forEach(pos => {
            const enemy = this.physics.add.sprite(pos.x, pos.y, 'enemyTank_down');
            enemy.setCollideWorldBounds(true);
            enemy.body.setSize(30, 30);
            enemy.direction = 'down';
            enemy.moveTimer = 0;
            enemy.shootTimer = Math.random() * 1000; // Random initial delay
            enemy.canShoot = true;
            this.enemyTanks.add(enemy);
        });
        
        console.log(`Level ${this.gameState.level}: Spawned ${enemyCount} enemies`);
    }

    setupCollisions() {
        // Player collisions with walls
        this.physics.add.collider(this.player1, this.walls);
        this.physics.add.collider(this.player2, this.walls);
        
        // Player collisions with enemies
        this.physics.add.collider(this.player1, this.enemyTanks);
        this.physics.add.collider(this.player2, this.enemyTanks);
        
        // Player vs Player collision
        this.physics.add.collider(this.player1, this.player2);
        
        // Enemy collisions
        this.physics.add.collider(this.enemyTanks, this.walls);
        this.physics.add.collider(this.enemyTanks, this.enemyTanks);
        this.physics.add.collider(this.enemyTanks, this.player1);
        this.physics.add.collider(this.enemyTanks, this.player2);
        
        // Player 1 bullet collisions
        this.physics.add.collider(this.player1Bullets, this.walls, this.player1BulletHitWall, null, this);
        this.physics.add.collider(this.player1Bullets, this.enemyTanks, this.player1BulletHitEnemy, null, this);
        this.physics.add.collider(this.player1Bullets, this.player2, this.player1BulletHitPlayer2, null, this);
        
        // Player 2 bullet collisions
        this.physics.add.collider(this.player2Bullets, this.walls, this.player2BulletHitWall, null, this);
        this.physics.add.collider(this.player2Bullets, this.enemyTanks, this.player2BulletHitEnemy, null, this);
        this.physics.add.collider(this.player2Bullets, this.player1, this.player2BulletHitPlayer1, null, this);
        
        // Enemy bullet collisions
        this.physics.add.collider(this.enemyBullets, this.walls, this.enemyBulletHitWall, null, this);
        this.physics.add.collider(this.enemyBullets, this.player1, this.enemyBulletHitPlayer1, null, this);
        this.physics.add.collider(this.enemyBullets, this.player2, this.enemyBulletHitPlayer2, null, this);
        
        // Base protection
        this.physics.add.collider(this.base, this.enemyBullets, this.baseHit, null, this);
        this.physics.add.collider(this.base, this.player1Bullets, this.baseHit, null, this);
        this.physics.add.collider(this.base, this.player2Bullets, this.baseHit, null, this);
    }

    update() {
        if (!this.gameState.gameStarted) {
            if (this.keys.ENTER.isDown) {
                this.startGame();
            }
            return;
        }

        if (this.gameState.gameOver) {
            return;
        }

        this.handlePlayer1Input();
        this.handlePlayer2Input();
        this.updateEnemies();
        this.checkWinCondition();
    }

    startGame() {
        this.gameState.gameStarted = true;
        if (this.startText) {
            this.startText.destroy();
            this.startText = null;
        }
    }

    handlePlayer1Input() {
        if (!this.gameState.player1.alive) return;
        
        const speed = 100;
        
        // Player 1 Movement (Arrow Keys)
        if (this.cursors.left.isDown) {
            this.player1.setVelocityX(-speed);
            this.player1.setVelocityY(0);
            this.player1.direction = 'left';
            this.player1.setTexture('player1Tank_left');
        } else if (this.cursors.right.isDown) {
            this.player1.setVelocityX(speed);
            this.player1.setVelocityY(0);
            this.player1.direction = 'right';
            this.player1.setTexture('player1Tank_right');
        } else if (this.cursors.up.isDown) {
            this.player1.setVelocityX(0);
            this.player1.setVelocityY(-speed);
            this.player1.direction = 'up';
            this.player1.setTexture('player1Tank_up');
        } else if (this.cursors.down.isDown) {
            this.player1.setVelocityX(0);
            this.player1.setVelocityY(speed);
            this.player1.direction = 'down';
            this.player1.setTexture('player1Tank_down');
        } else {
            this.player1.setVelocity(0, 0);
        }
        
        // Player 1 Shooting (SPACE)
        if (this.keys.SPACE.isDown && this.player1.canShoot) {
            this.player1Shoot();
        }
    }

    handlePlayer2Input() {
        if (!this.gameState.player2.alive) return;
        
        const speed = 100;
        
        // Player 2 Movement (WASD)
        if (this.keys.A.isDown) {
            this.player2.setVelocityX(-speed);
            this.player2.setVelocityY(0);
            this.player2.direction = 'left';
            this.player2.setTexture('player2Tank_left');
        } else if (this.keys.D.isDown) {
            this.player2.setVelocityX(speed);
            this.player2.setVelocityY(0);
            this.player2.direction = 'right';
            this.player2.setTexture('player2Tank_right');
        } else if (this.keys.W.isDown) {
            this.player2.setVelocityX(0);
            this.player2.setVelocityY(-speed);
            this.player2.direction = 'up';
            this.player2.setTexture('player2Tank_up');
        } else if (this.keys.S.isDown) {
            this.player2.setVelocityX(0);
            this.player2.setVelocityY(speed);
            this.player2.direction = 'down';
            this.player2.setTexture('player2Tank_down');
        } else {
            this.player2.setVelocity(0, 0);
        }
        
        // Player 2 Shooting (5 key)
        if (this.keys.FIVE.isDown && this.player2.canShoot) {
            this.player2Shoot();
        }
    }

    player1Shoot() {
        this.player1.canShoot = false;
        
        const bullet = this.physics.add.sprite(this.player1.x, this.player1.y, 'player1Bullet');
        this.player1Bullets.add(bullet);

        const speed = 200;
        switch (this.player1.direction) {
            case 'up':
                bullet.setVelocity(0, -speed);
                break;
            case 'down':
                bullet.setVelocity(0, speed);
                break;
            case 'left':
                bullet.setVelocity(-speed, 0);
                break;
            case 'right':
                bullet.setVelocity(speed, 0);
                break;
        }
        
        // Cooldown
        this.time.delayedCall(500, () => {
            this.player1.canShoot = true;
        });
    }

    player2Shoot() {
        this.player2.canShoot = false;
        
        const bullet = this.physics.add.sprite(this.player2.x, this.player2.y, 'player2Bullet');
        this.player2Bullets.add(bullet);

        const speed = 200;
        switch (this.player2.direction) {
            case 'up':
                bullet.setVelocity(0, -speed);
                break;
            case 'down':
                bullet.setVelocity(0, speed);
                break;
            case 'left':
                bullet.setVelocity(-speed, 0);
                break;
            case 'right':
                bullet.setVelocity(speed, 0);
                break;
        }
        
        // Cooldown
        this.time.delayedCall(500, () => {
            this.player2.canShoot = true;
        });
    }

    updateEnemies() {
        this.enemyTanks.children.entries.forEach(enemy => {
            enemy.moveTimer += 16; // Assuming 60 FPS
            enemy.shootTimer += 16;

            // Simple AI: move randomly and shoot occasionally
            if (enemy.moveTimer > 1000) { // Change direction every second
                const directions = ['up', 'down', 'left', 'right'];
                enemy.direction = directions[Math.floor(Math.random() * directions.length)];
                enemy.moveTimer = 0;
            }

            // Move enemy and update sprite
            const speed = 50;
            switch (enemy.direction) {
                case 'up':
                    enemy.setVelocity(0, -speed);
                    enemy.setTexture('enemyTank_up');
                    break;
                case 'down':
                    enemy.setVelocity(0, speed);
                    enemy.setTexture('enemyTank_down');
                    break;
                case 'left':
                    enemy.setVelocity(-speed, 0);
                    enemy.setTexture('enemyTank_left');
                    break;
                case 'right':
                    enemy.setVelocity(speed, 0);
                    enemy.setTexture('enemyTank_right');
                    break;
            }

            // Enemy shooting
            if (enemy.shootTimer > 2000 && enemy.canShoot) { // Shoot every 2 seconds
                this.enemyShoot(enemy);
                enemy.shootTimer = 0;
            }
        });
    }

    enemyShoot(enemy) {
        const bullet = this.physics.add.sprite(enemy.x, enemy.y, 'enemyBullet');
        this.enemyBullets.add(bullet);

        const speed = 150;
        switch (enemy.direction) {
            case 'up':
                bullet.setVelocity(0, -speed);
                break;
            case 'down':
                bullet.setVelocity(0, speed);
                break;
            case 'left':
                bullet.setVelocity(-speed, 0);
                break;
            case 'right':
                bullet.setVelocity(speed, 0);
                break;
        }
    }

        // Player 1 bullet collisions
    player1BulletHitWall(bullet, wall) {
        bullet.destroy();
        if (wall.wallType === 'brickWall') {
            wall.destroy();
            this.gameState.player1.score += 10;
            this.updateUI();
        }
    }
    
    player1BulletHitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        this.gameState.player1.score += 100;
        this.updateUI();
    }
    
    player1BulletHitPlayer2(bullet, player) {
        bullet.destroy();
        this.gameState.player2.lives--;
        this.updateUI();
        
        if (this.gameState.player2.lives <= 0) {
            this.gameState.player2.alive = false;
            player.setVisible(false);
            this.gameState.player1.score += 200; // Bonus for defeating other player
            this.updateUI();
        } else {
            // Respawn player 2
            player.setPosition(450, 550);
        }
    }
    
    // Player 2 bullet collisions
    player2BulletHitWall(bullet, wall) {
        bullet.destroy();
        if (wall.wallType === 'brickWall') {
            wall.destroy();
            this.gameState.player2.score += 10;
            this.updateUI();
        }
    }
    
    player2BulletHitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        this.gameState.player2.score += 100;
        this.updateUI();
    }
    
    player2BulletHitPlayer1(bullet, player) {
        bullet.destroy();
        this.gameState.player1.lives--;
        this.updateUI();
        
        if (this.gameState.player1.lives <= 0) {
            this.gameState.player1.alive = false;
            player.setVisible(false);
            this.gameState.player2.score += 200; // Bonus for defeating other player
            this.updateUI();
        } else {
            // Respawn player 1
            player.setPosition(350, 550);
        }
    }
    
    // Enemy bullet collisions
    enemyBulletHitWall(bullet, wall) {
        bullet.destroy();
        if (wall.wallType === 'brickWall') {
            wall.destroy();
        }
    }

    enemyBulletHitPlayer1(bullet, player) {
        bullet.destroy();
        this.gameState.player1.lives--;
        this.updateUI();
        
        if (this.gameState.player1.lives <= 0) {
            this.gameState.player1.alive = false;
            player.setVisible(false);
        } else {
            player.setPosition(350, 550);
        }
    }
    
    enemyBulletHitPlayer2(bullet, player) {
        bullet.destroy();
        this.gameState.player2.lives--;
        this.updateUI();
        
        if (this.gameState.player2.lives <= 0) {
            this.gameState.player2.alive = false;
            player.setVisible(false);
        } else {
            player.setPosition(450, 550);
        }
    }

    baseHit(base, bullet) {
        bullet.destroy();
        this.gameOver();
    }

    checkWinCondition() {
        if (this.enemyTanks.children.entries.length === 0) {
            this.levelComplete();
        }
    }

    levelComplete() {
        this.gameState.level++;
        this.gameState.player1.score += 500;
        this.gameState.player2.score += 500;
        this.updateUI();
        
        // Clear existing walls and create new level layout
        this.walls.clear(true, true);
        this.createLevel();
        
        // Create new enemies for next level
        this.createEnemies();
        
        // Reset players to starting positions (after everything is created)
        this.time.delayedCall(100, () => {
            this.resetPlayersToStart();
        });
        
        const levelText = this.add.text(400, 300, 'Level Complete!\nNext Level Starting...', {
            fontSize: '24px',
            fill: '#0f0',
            fontFamily: 'Courier New',
            align: 'center'
        }).setOrigin(0.5);
        
        this.time.delayedCall(2000, () => {
            if (levelText) {
                levelText.destroy();
            }
        });
    }

    gameOver() {
        this.gameState.gameOver = true;

        this.add.text(400, 300, 'GAME OVER\nPress ENTER to Restart', {
            fontSize: '32px',
            fill: '#f00',
            fontFamily: 'Courier New',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.restart();
            this.gameState = {
                player1: {
                    lives: 3,
                    score: 0,
                    alive: true
                },
                player2: {
                    lives: 3,
                    score: 0,
                    alive: true
                },
                level: 1,
                gameStarted: false,
                gameOver: false
            };
            this.updateUI();
        });
    }

    updateUI() {
        document.getElementById('p1lives').textContent = this.gameState.player1.lives;
        document.getElementById('p1score').textContent = this.gameState.player1.score;
        document.getElementById('p2lives').textContent = this.gameState.player2.lives;
        document.getElementById('p2score').textContent = this.gameState.player2.score;
        document.getElementById('level').textContent = this.gameState.level;
    }
}

// Game configuration and initialization
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'gameContainer',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: GameScene
};

// Initialize the game when the page loads
window.addEventListener('load', () => {
    const game = new Phaser.Game(config);
});
