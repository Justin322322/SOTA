// Game Engine Module
const gameEngine = {
    // Time Management
    time: {
        updateTime(minutes) {
            gameState.time.minute += minutes;
            while (gameState.time.minute >= 60) {
                gameState.time.minute -= 60;
                gameState.time.hour += 1;
            }
            while (gameState.time.hour >= 24) {
                gameState.time.hour -= 24;
                gameState.time.day += 1;
            }
            this.updateDisplay();
        },

        updateDisplay() {
            const timeString = `${gameState.time.hour.toString().padStart(2, '0')}:${gameState.time.minute.toString().padStart(2, '0')}`;
            document.querySelector('.game-footer').innerHTML = `
                <pre class="ascii-footer">
+------------------------------------------+
|  SYSTEM STATUS: ACTIVE   |  DAY: ${gameState.time.day.toString().padStart(3, ' ')}    |
|  LOCATION: ${gameState.player.currentLocation.substring(0, 12).padEnd(12, ' ')} |  TIME: ${timeString} |
+------------------------------------------+
                </pre>
            `;
        }
    },

    // Movement System
    movement: {
        calculateTravelTime(start, end) {
            const startCoords = locations[start].coordinates;
            const endCoords = locations[end].coordinates;
            const directDistance = Math.sqrt(
                Math.pow(endCoords[0] - startCoords[0], 2) +
                Math.pow(endCoords[1] - startCoords[1], 2)
            );
            return Math.round(directDistance * 1300); // Convert to minutes, including road paths
        },

        async movePlayer(newLocation) {
            const currentLocation = gameState.player.currentLocation;
            const targetLocation = locations[newLocation];
            const travelMinutes = this.calculateTravelTime(currentLocation, newLocation);
            
            // Create waypoints for road-like movement
            const currentCoords = locations[currentLocation].coordinates;
            const waypoints = [
                currentCoords,
                [currentCoords[0], targetLocation.coordinates[1]],
                targetLocation.coordinates
            ];

            // Show travel line
            const travelLine = this.createTravelLine(waypoints);
            
            // Start movement animation
            await this.animateMovement(waypoints, travelMinutes);
            
            // Clean up and update game state
            map.removeLayer(travelLine);
            gameState.player.currentLocation = newLocation;
            gameEngine.time.updateTime(travelMinutes);
            
            // Trigger location events
            this.handleLocationArrival(newLocation);
        },

        createTravelLine(waypoints) {
            return L.polyline(waypoints, {
                color: '#00ff00',
                weight: 2,
                opacity: 0.6,
                dashArray: '5, 10'
            }).addTo(map);
        },

        async animateMovement(waypoints, totalTime) {
            const steps = totalTime; // One step per minute
            let currentStep = 0;

            return new Promise(resolve => {
                const interval = setInterval(() => {
                    currentStep++;
                    appendToGameLog(`Traveling... ${currentStep}/${totalTime} minutes`);
                    
                    if (currentStep >= totalTime) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 1000); // 1 second = 1 minute
            });
        },

        handleLocationArrival(location) {
            const locationData = locations[location];
            appendToGameLog(`\nArrived at ${location}`);
            appendToGameLog(locationData.description);
            
            // Check for story events
            const locationStory = storyModule.getLocationStory(location);
            if (locationStory) {
                appendToGameLog(locationStory.initialDescription);
            }

            // Handle danger
            if (locationData.danger > 3) {
                appendToGameLog(`\nWARNING: High danger level detected!`);
                if (Math.random() < locationData.danger * 0.1) {
                    gameState.player.health -= 10;
                    appendToGameLog(`\nYou've encountered infected! Lost 10 health.`);
                }
            }
        }
    },

    // Inventory System
    inventory: {
        addItem(item) {
            if (gameState.player.inventory.length >= gameState.player.inventoryCapacity) {
                appendToGameLog("\nInventory full!");
                return false;
            }
            gameState.player.inventory.push(item);
            return true;
        },

        removeItem(item) {
            const index = gameState.player.inventory.indexOf(item);
            if (index > -1) {
                gameState.player.inventory.splice(index, 1);
                return true;
            }
            return false;
        },

        upgradeBackpack(newBackpack) {
            const upgrade = backpackUpgrades[newBackpack];
            if (upgrade && upgrade.tier > gameState.player.backpackTier) {
                gameState.player.backpackTier = upgrade.tier;
                gameState.player.inventoryCapacity = upgrade.capacity;
                appendToGameLog(`\nBackpack upgraded! New capacity: ${upgrade.capacity} slots`);
                return true;
            }
            return false;
        }
    },

    // Combat/Danger System
    danger: {
        checkEncounter(dangerLevel) {
            if (Math.random() < dangerLevel * 0.1) {
                return this.generateEncounter(dangerLevel);
            }
            return null;
        },

        generateEncounter(level) {
            const encounters = {
                infected: { damage: 10, chance: 0.6 },
                raiders: { damage: 15, chance: 0.3 },
                mutants: { damage: 20, chance: 0.1 }
            };

            // Generate random encounter based on danger level
            let encounter = null;
            const roll = Math.random();
            
            if (roll < encounters.infected.chance) {
                encounter = {
                    type: 'infected',
                    damage: encounters.infected.damage * (level * 0.5)
                };
            } else if (roll < encounters.infected.chance + encounters.raiders.chance) {
                encounter = {
                    type: 'raiders',
                    damage: encounters.raiders.damage * (level * 0.5)
                };
            } else {
                encounter = {
                    type: 'mutants',
                    damage: encounters.mutants.damage * (level * 0.5)
                };
            }

            return encounter;
        }
    }
};

// Export game engine
window.gameEngine = gameEngine; 