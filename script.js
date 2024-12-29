document.addEventListener('DOMContentLoaded', () => {
    // Game State
    const gameState = {
        player: {
            name: 'Tala Reyes',
            class: 'Med Student',
            health: 100,
            energy: 80,
            inventory: ['Medical Kit', 'Flashlight', 'Radio'],
            inventoryCapacity: 5, // Basic capacity
            backpackTier: 1, // Backpack level
            currentLocation: 'Quezon City Hospital',
            questProgress: 0,
            discoveredLocations: ['Quezon City Hospital']
        },
        currentAct: 1,
        time: {
            hour: 21,
            minute: 42,
            day: 1
        },
        gameStarted: false,
        activeQuest: {
            title: 'Finding the Cure',
            description: 'Search for Dr. Santos and his research on the virus.',
            objectives: [
                { id: 1, text: 'Find Dr. Santos\'s research notes in the Hospital', completed: false },
                { id: 2, text: 'Locate the missing lab equipment at the University', completed: false },
                { id: 3, text: 'Gather medical supplies from the Safe House', completed: false },
                { id: 4, text: 'Establish contact using the Radio Tower', completed: false },
                { id: 5, text: 'Return to the Hospital with all components', completed: false }
            ],
            currentObjective: 1
        }
    };

    // Location Data
    const locations = {
        'Quezon City Hospital': {
            coordinates: [14.6417, 121.0375],
            description: 'A once-bustling hospital, now eerily quiet. The flickering emergency lights cast long shadows in the corridors. Dr. Santos\'s office might hold vital clues.',
            npcs: [
                {
                    id: 'nurse_elena',
                    name: 'Nurse Elena',
                    status: 'Treating patients',
                    avatar: '👩‍⚕️',
                    dialog: {
                        greeting: 'Thank goodness you\'re here! Dr. Santos was close to a breakthrough before he disappeared.',
                        quest: 'His research notes should be in his office, but be careful. Some of the infected are still roaming the upper floors.',
                        options: [
                            { text: 'Tell me more about Dr. Santos', response: 'He was working day and night on a cure. The day before he vanished, he seemed agitated, talking about "unethical experiments" and "Project Archipelago".' },
                            { text: 'What happened here?', response: 'The virus spread so quickly. One day everything was normal, the next... chaos. Dr. Santos believed it wasn\'t a natural mutation.' },
                            { text: 'I\'ll find those notes', response: 'Check his office on the third floor. The door code is 4-2-3-1. And Tala... watch out for the infected.' }
                        ]
                    }
                }
            ],
            items: ['Research Notes', 'Medical Supplies', 'Emergency Kit'],
            danger: 2
        },
        'University of the Philippines': {
            coordinates: [14.6538, 121.0685],
            description: 'The university labs are dark and foreboding. Emergency generators keep vital equipment running. Strange sounds echo through the empty halls.',
            npcs: [
                {
                    id: 'prof_cruz',
                    name: 'Professor Cruz',
                    status: 'Securing the lab',
                    avatar: '👨‍🔬',
                    dialog: {
                        greeting: 'A visitor? These days that\'s either very brave or very desperate.',
                        quest: 'The lab equipment is in the secure storage. Dr. Santos was here last week, very disturbed about something he found.',
                        options: [
                            { text: 'What\'s still working here?', response: 'The backup generators keep the containment units powered. Whatever they were working on in the Research Facility, they wanted it kept alive.' },
                            { text: 'Have you seen Dr. Santos?', response: 'He came here ranting about genetic manipulation and corporate cover-ups. Said something about "Project Archipelago" being a front.' },
                            { text: 'I need the lab equipment', response: 'It\'s in the secure storage. The keycard is in my office, but the infected... they\'re drawn to sound and movement.' }
                        ]
                    }
                }
            ],
            items: ['Lab Equipment', 'Research Data', 'Microscope', 'Keycard'],
            danger: 4
        },
        'Safe House': {
            coordinates: [14.6280, 121.0419],
            description: 'A fortified shelter where survivors have gathered supplies and created a safe zone.',
            npcs: [
                {
                    id: 'maria',
                    name: 'Maria',
                    status: 'Managing supplies',
                    avatar: '👩',
                    dialog: {
                        greeting: 'Welcome to the Safe House. Everyone here contributes to survive.',
                        quest: 'Medical supplies? Yes, we have some stored. But we\'ll need your help in return.',
                        options: [
                            { text: 'What do you need?', response: 'Help us reinforce the barriers, and I\'ll make sure you get those supplies.' },
                            { text: 'How many survivors are here?', response: 'About twenty now. We lost some good people along the way.' },
                            { text: 'I\'ll help', response: 'Good. Start with the eastern wall. Tools are by the entrance.' }
                        ]
                    }
                }
            ],
            items: ['Medical Supplies', 'Food Rations'],
            danger: 1
        },
        'Radio Tower': {
            coordinates: [14.6461, 121.0504],
            description: 'The old radio tower might still be operational. Could be our best chance to contact the outside world.',
            npcs: [
                {
                    id: 'tech_ramon',
                    name: 'Technician Ramon',
                    status: 'Repairing equipment',
                    avatar: '👨‍🔧',
                    dialog: {
                        greeting: 'The equipment\'s old, but I\'ve kept it running. We pick up signals sometimes.',
                        quest: 'Help me fix the backup generator, and we can boost the signal strength.',
                        options: [
                            { text: 'Any important transmissions?', response: 'Military chatter mostly. Something big is happening up north.' },
                            { text: 'Who else is out there?', response: 'Other survivor groups. Some friendly, some... not so much.' },
                            { text: 'Let\'s fix that generator', response: 'I\'ll show you what needs to be done. Watch out for the infected though.' }
                        ]
                    }
                }
            ],
            items: ['Radio Parts', 'Tools'],
            danger: 3
        },
        'Abandoned Mall': {
            coordinates: [14.6350, 121.0280],
            description: 'A massive shopping complex, now a maze of darkness and echoes. Valuable supplies might remain in the stores.',
            npcs: [
                {
                    id: 'security_guard',
                    name: 'Guard Santos',
                    status: 'Patrolling',
                    avatar: '👮',
                    dialog: {
                        greeting: 'Stop! This area is under our protection. State your business.',
                        quest: 'If you\'re looking for supplies, I might know where to find them.',
                        options: [
                            { text: 'What happened here?', response: 'Looters came first, then the infected. We\'ve secured some areas, but it\'s still dangerous.' },
                            { text: 'Any medical supplies?', response: 'The pharmacy on the second floor hasn\'t been completely ransacked.' },
                            { text: 'I need help', response: 'Prove you\'re trustworthy by helping clear the east wing, then we\'ll talk.' }
                        ]
                    }
                }
            ],
            items: ['Pharmacy Supplies', 'Emergency Kit'],
            danger: 4
        },
        'Metro Station': {
            coordinates: [14.6320, 121.0520],
            description: 'The underground metro station offers shelter and possible escape routes. The tunnels might lead to other safe zones.',
            npcs: [
                {
                    id: 'station_master',
                    name: 'Station Master Jun',
                    status: 'Monitoring tunnels',
                    avatar: '🚉',
                    dialog: {
                        greeting: 'The tunnels are our lifeline now. They connect all the safe zones.',
                        quest: 'We need to restore power to the emergency lights. Too many people have gotten lost in the dark.',
                        options: [
                            { text: 'Are the tunnels safe?', response: 'Safer than above ground, but watch for flooded sections and cave-ins.' },
                            { text: 'Who uses these tunnels?', response: 'Survivors, traders, sometimes military patrols. We try to keep track.' },
                            { text: 'I\'ll help with the lights', response: 'The maintenance room has the tools we need. Be careful down there.' }
                        ]
                    }
                }
            ],
            items: ['Metro Map', 'Flashlight Batteries'],
            danger: 3
        },
        'Research Facility': {
            coordinates: [14.6490, 121.0290],
            description: 'A high-security research complex where it all began. Warning signs and quarantine notices cover the walls. The truth lies somewhere in these halls.',
            npcs: [
                {
                    id: 'scientist',
                    name: 'Dr. Chen',
                    status: 'Analyzing data',
                    avatar: '🔬',
                    dialog: {
                        greeting: 'You shouldn\'t be here... but since you are, maybe you can help expose the truth.',
                        quest: 'The real data about Project Archipelago is in the Level B3 containment unit. It proves this was no accident.',
                        options: [
                            { text: 'What happened here?', response: 'They were playing god with genetics. Project Archipelago wasn\'t about disease prevention - it was about human enhancement.' },
                            { text: 'Know about Dr. Santos?', response: 'He found out the truth. The virus wasn\'t a mistake, it was a test run. They wanted to see how it would spread.' },
                            { text: 'Where\'s the data?', response: 'Level B3, in the containment unit. You\'ll need hazmat gear and Dr. Santos\'s security clearance. The evidence must be preserved.' }
                        ]
                    }
                }
            ],
            items: ['Project Files', 'Hazmat Suit', 'Security Badge', 'Viral Samples'],
            danger: 5
        }
    };

    // Add backpacks to locations
    const backpackUpgrades = {
        'Small Backpack': { capacity: 8, tier: 2 },
        'Medium Backpack': { capacity: 12, tier: 3 },
        'Large Backpack': { capacity: 16, tier: 4 },
        'Military Backpack': { capacity: 20, tier: 5 }
    };

    // Add backpacks to random locations
    Object.entries(locations).forEach(([name, data]) => {
        if (Math.random() < 0.3) { // 30% chance for each location
            const backpacks = Object.keys(backpackUpgrades);
            const randomBackpack = backpacks[Math.floor(Math.random() * backpacks.length)];
            if (!data.items.includes(randomBackpack)) {
                data.items.push(randomBackpack);
            }
        }
    });

    // Initialize Map
    let map = L.map('map', {
        center: [14.6417, 121.0375],
        zoom: 14,
        zoomControl: true,
        attributionControl: false
    });

    // Custom map tiles with retro/terminal style
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        className: 'map-tiles'
    }).addTo(map);

    // Initialize markers
    let locationMarkers = {};
    let playerMarker = null;

    // Custom icons
    const createCustomIcon = (symbol, color) => {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-content" style="color: ${color}; font-size: 32px;">
                    ${symbol}
                    <div class="pulse-circle" style="border-color: ${color}"></div>
                   </div>`,
            iconSize: [40, 40]
        });
    };

    // Initialize game
    function initializeGame() {
        // Add location markers with specific icons for each location type
        Object.entries(locations).forEach(([name, data]) => {
            let icon = '🏥'; // Default hospital icon
            
            // Assign specific icons based on location
            if (name.includes('Hospital')) icon = '🏥';
            if (name.includes('University')) icon = '🏛️';
            if (name.includes('Safe House')) icon = '🏠';
            if (name.includes('Radio Tower')) icon = '📡';
            
            const marker = L.marker(data.coordinates, {
                icon: createCustomIcon(icon, '#00ff00')
            }).addTo(map);
            
            marker.bindPopup(createLocationPopup(name, data));
            locationMarkers[name] = marker;
        });

        // Add player marker with a distinct icon
        updatePlayerLocation(gameState.player.currentLocation);
        
        // Start the game with initial story
        if (!gameState.gameStarted) {
            startGame();
        }
    }

    function startGame() {
        const intro = [
            "SYSTEM INITIALIZING...",
            "Loading game world...",
            "Establishing connection...",
            "Welcome to Shadows Over the Archipelago",
            "Year: 2031 | Location: Metro Manila, Philippines",
            "Three months after the outbreak...",
            "",
            "You are Tala Reyes, a medical student caught in the aftermath of a devastating viral outbreak.",
            "Your mentor, Dr. Santos, disappeared while working on a cure.",
            "His last message mentioned a breakthrough, but also a warning about 'what they were really doing' at the research facility.",
            "",
            "The virus has transformed Manila into a dangerous archipelago of isolated safe zones.",
            "Communities survive in fortified buildings, connected by treacherous streets and underground passages.",
            "",
            "Your mission is crucial:",
            "- Find Dr. Santos's research notes",
            "- Gather the necessary equipment and supplies",
            "- Uncover the truth about the outbreak",
            "- Help develop a cure before it's too late",
            "",
            "Current Location: Quezon City Hospital",
            "Nurse Elena has information about Dr. Santos's last known whereabouts.",
            "",
            "Type 'help' for available commands or use the quick action buttons.",
            "Your quest begins now... The fate of the archipelago depends on you."
        ];

        intro.forEach((line, index) => {
            setTimeout(() => {
                appendToGameLog(line);
            }, index * 1000);
        });

        gameState.gameStarted = true;
        updateQuestLog();
    }

    // Game Commands
    window.gameCommands = {
        help: () => {
            appendToGameLog("Available Commands:");
            appendToGameLog("- look : Examine your surroundings and find searchable areas");
            appendToGameLog("- search [area] : Search a specific area thoroughly");
            appendToGameLog("- scan : Check for dangers nearby");
            appendToGameLog("- inv : Check your inventory");
            appendToGameLog("- status : View your current status");
            appendToGameLog("- quest : View current objectives");
            appendToGameLog("- story : Review story progress");
            appendToGameLog("- talk [person] : Speak with someone");
            appendToGameLog("- take [item] : Pick up an item");
            appendToGameLog("- use [item] : Use an item from your inventory");
        },
        
        story: () => {
            appendToGameLog("\n=== Story Progress ===");
            appendToGameLog("Year: 2031 | Location: Metro Manila, Philippines");
            appendToGameLog("Three months after the devastating viral outbreak...");
            
            // Show completed objectives
            let completedCount = gameState.activeQuest.objectives.filter(obj => obj.completed).length;
            appendToGameLog(`\nProgress: ${completedCount}/${gameState.activeQuest.objectives.length} objectives completed`);
            
            // Show current story phase based on progress
            if (completedCount === 0) {
                appendToGameLog("\nPhase: Beginning");
                appendToGameLog("Dr. Santos has disappeared with crucial research about the virus.");
                appendToGameLog("You must find his research notes at the hospital.");
            } else if (completedCount === 1) {
                appendToGameLog("\nPhase: Investigation");
                appendToGameLog("With the research notes found, you need the lab equipment from the university.");
                appendToGameLog("The notes mention experiments that went wrong...");
            } else if (completedCount === 2) {
                appendToGameLog("\nPhase: Gathering Resources");
                appendToGameLog("The equipment is secured. Now you need medical supplies from the Safe House.");
                appendToGameLog("Time is running out as the infection spreads...");
            } else if (completedCount === 3) {
                appendToGameLog("\nPhase: Making Contact");
                appendToGameLog("With supplies gathered, you must reach the Radio Tower.");
                appendToGameLog("Other survivor groups might have crucial information.");
            } else if (completedCount === 4) {
                appendToGameLog("\nPhase: Final Steps");
                appendToGameLog("The broadcast is out. Return to the Hospital with everything.");
                appendToGameLog("The cure might be within reach...");
            }
            
            // Show discovered locations
            appendToGameLog("\nDiscovered Locations:");
            gameState.player.discoveredLocations.forEach(loc => {
                appendToGameLog(`- ${loc}`);
            });
        },

        look: () => {
            const location = locations[gameState.player.currentLocation];
            const areas = areaInteractions[gameState.player.currentLocation];
            
            appendToGameLog(`\nLocation: ${gameState.player.currentLocation}`);
            appendToGameLog(location.description);
            
            if (areas) {
                appendToGameLog("\nSearchable Areas:");
                Object.entries(areas).forEach(([name, area]) => {
                    const status = area.searched ? "[Searched]" : "[Not Searched]";
                    appendToGameLog(`- ${name} ${status}`);
                    appendToGameLog(`  ${area.description}`);
                });
            }

            appendToGameLog(`\nPeople here:`);
            location.npcs.forEach(npc => {
                appendToGameLog(`- ${npc.name} (${npc.status})`);
            });
            
            // Update the location items display
            updateLocationItems();
        },

        scan: () => {
            const location = locations[gameState.player.currentLocation];
            appendToGameLog(`\nScanning area...`);
            setTimeout(() => {
                appendToGameLog(`Danger Level: ${'🔴'.repeat(location.danger)}`);
                appendToGameLog(`Threat Assessment: ${getDangerDescription(location.danger)}`);
                appendToGameLog(`Safe exits: ${getConnectedLocations(gameState.player.currentLocation).join(', ')}`);
            }, 1000);
        },

        inv: () => {
            appendToGameLog("\nInventory:");
            appendToGameLog(`Capacity: ${gameState.player.inventory.length}/${gameState.player.inventoryCapacity} slots`);
            appendToGameLog(`Backpack: ${getBackpackName(gameState.player.backpackTier)}`);
            appendToGameLog("\nItems:");
            gameState.player.inventory.forEach(item => {
                appendToGameLog(`- ${item}`);
            });
        },

        status: () => {
            appendToGameLog(`\nName: ${gameState.player.name}`);
            appendToGameLog(`Class: ${gameState.player.class}`);
            appendToGameLog(`Health: ${'♥'.repeat(Math.ceil(gameState.player.health/10))}`);
            appendToGameLog(`Energy: ${'⚡'.repeat(Math.ceil(gameState.player.energy/10))}`);
            appendToGameLog(`Location: ${gameState.player.currentLocation}`);
        },

        quest: () => {
            appendToGameLog(`\nCurrent Quest: ${gameState.activeQuest.title}`);
            appendToGameLog(gameState.activeQuest.description);
            appendToGameLog("\nObjectives:");
            gameState.activeQuest.objectives.forEach(obj => {
                appendToGameLog(`${obj.completed ? '✅' : '⬜'} ${obj.text}`);
            });
        },

        take: (item) => {
            if (!item) {
                appendToGameLog("\nWhat do you want to take? Type 'look' to see available items.");
                return;
            }
            takeItem(item);
        }
    };

    // Helper Functions
    function appendToGameLog(message) {
        const output = document.querySelector('.output-text');
        const p = document.createElement('p');
        p.textContent = message;
        p.classList.add('typewriter');
        output.appendChild(p);
        output.scrollTop = output.scrollHeight;
    }

    function updateQuestLog() {
        const questObj = gameState.activeQuest.objectives[gameState.activeQuest.currentObjective - 1];
        if (questObj) {
            appendToGameLog(`\nCurrent Objective: ${questObj.text}`);
        }
    }

    function getDangerDescription(level) {
        const descriptions = [
            'Safe - No immediate threats',
            'Caution - Minimal risk',
            'Warning - Potential threats present',
            'Danger - High risk area',
            'Critical - Extreme danger'
        ];
        return descriptions[level - 1] || 'Unknown';
    }

    function getConnectedLocations(currentLocation) {
        // Simple implementation - all locations are connected for now
        return Object.keys(locations).filter(loc => loc !== currentLocation);
    }

    function createLocationPopup(name, data) {
        return `
            <div class="location-popup">
                <h3>${name}</h3>
                <p>${data.description}</p>
                <div class="popup-actions">
                    <button class="popup-button" onclick="moveToLocation('${name}')">Move Here</button>
                    <button class="popup-button" onclick="scanLocation('${name}')">Scan Area</button>
                </div>
                <small>Danger Level: ${'🔴'.repeat(data.danger)}</small>
            </div>
        `;
    }

    function updatePlayerLocation(newLocation) {
        if (playerMarker) {
            map.removeLayer(playerMarker);
        }
        
        const locationData = locations[newLocation];
        playerMarker = L.marker(locationData.coordinates, {
            icon: createCustomIcon('👤', '#00ff00')
        }).addTo(map);
        
        gameState.player.currentLocation = newLocation;
        document.getElementById('current-location').textContent = newLocation;
        
        // Update NPCs list
        updateNPCList(locationData.npcs);
        
        // Center map on new location
        map.setView(locationData.coordinates, 14);
    }

    function updateNPCList(npcs) {
        const npcList = document.getElementById('npc-list');
        const npcCount = document.getElementById('npc-count');
        
        npcList.innerHTML = '';
        npcCount.textContent = npcs.length;
        
        npcs.forEach(npc => {
            const npcCard = document.createElement('div');
            npcCard.className = 'npc-card';
            npcCard.onclick = () => startDialog(npc);
            
            npcCard.innerHTML = `
                <div class="npc-avatar">${npc.avatar}</div>
                <div class="npc-info">
                    <div class="npc-name">${npc.name}</div>
                    <div class="npc-status">${npc.status}</div>
                </div>
            `;
            
            npcList.appendChild(npcCard);
        });
    }

    function startDialog(npc) {
        const modal = document.getElementById('dialog-modal');
        const npcNameEl = document.getElementById('npc-name');
        const dialogText = document.getElementById('dialog-text');
        const dialogOptions = document.getElementById('dialog-options');
        
        npcNameEl.textContent = npc.name;
        dialogText.textContent = npc.dialog.greeting;
        
        dialogOptions.innerHTML = '';
        npc.dialog.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'dialog-option';
            button.textContent = option.text;
            button.onclick = () => {
                dialogText.textContent = option.response;
                // Check for quest-related responses and update accordingly
                checkQuestProgress(npc.id, option.text);
            };
            dialogOptions.appendChild(button);
        });
        
        modal.style.display = 'block';
    }

    function checkQuestProgress(npcId, response) {
        // Update quest progress based on dialog choices and location
        const currentObjective = gameState.activeQuest.objectives[gameState.activeQuest.currentObjective - 1];
        
        if (currentObjective && !currentObjective.completed) {
            switch(npcId) {
                case 'nurse_elena':
                    if (gameState.activeQuest.currentObjective === 1) {
                        completeObjective(1);
                    }
                    break;
                case 'prof_cruz':
                    if (gameState.activeQuest.currentObjective === 2) {
                        completeObjective(2);
                    }
                    break;
                case 'maria':
                    if (gameState.activeQuest.currentObjective === 3) {
                        completeObjective(3);
                    }
                    break;
                case 'tech_ramon':
                    if (gameState.activeQuest.currentObjective === 4) {
                        completeObjective(4);
                    }
                    break;
            }
        }
    }

    function completeObjective(objectiveId) {
        const objective = gameState.activeQuest.objectives.find(obj => obj.id === objectiveId);
        if (objective && !objective.completed) {
            objective.completed = true;
            
            // Show completion message with checkbox
            appendToGameLog(`\n☐ → ☑ Objective Complete: ${objective.text}`);
            
            // Update quest progress
            gameState.activeQuest.currentObjective++;
            
            // Show next objective
            if (gameState.activeQuest.currentObjective <= gameState.activeQuest.objectives.length) {
                const nextObjective = gameState.activeQuest.objectives[gameState.activeQuest.currentObjective - 1];
                appendToGameLog(`\nNew Objective: ${nextObjective.text}`);
                appendToGameLog('Type "quest" to review your objectives.');
            } else {
                endGame();
            }
            
            // Update UI
            updateQuestDisplay();
        }
    }

    function updateQuestDisplay() {
        const questDisplay = document.createElement('div');
        questDisplay.className = 'quest-status';
        
        const currentObjective = gameState.activeQuest.currentObjective;
        const requiredItems = questItems[currentObjective]?.required || [];
        
        questDisplay.innerHTML = `
            <h3>${gameState.activeQuest.title}</h3>
            <p>${gameState.activeQuest.description}</p>
            <div class="objectives-list">
                ${gameState.activeQuest.objectives.map(obj => `
                    <div class="objective ${obj.completed ? 'completed' : ''}">
                        <span class="checkbox">${obj.completed ? '☑' : '☐'}</span>
                        <span class="objective-text">${obj.text}</span>
                        ${obj.id === currentObjective ? `
                            <div class="required-items">
                                Required Items:
                                ${requiredItems.map(item => `
                                    <div class="required-item">
                                        ${gameState.player.inventory.includes(item) ? '✅' : '⬜'} ${item}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        // Update the quest display in the game interface
        const questSection = document.querySelector('.status-panel');
        const existingQuest = questSection.querySelector('.quest-status');
        if (existingQuest) {
            existingQuest.replaceWith(questDisplay);
        } else {
            questSection.appendChild(questDisplay);
        }
    }

    function endGame() {
        const ending = [
            "\n🌟 Congratulations! You've completed your mission! 🌟",
            "With Dr. Santos's research notes, the lab equipment, and medical supplies,",
            "you've successfully assembled everything needed to continue work on the cure.",
            "",
            "The radio tower broadcast has reached other survivor groups,",
            "and help is on the way. There's hope for the future of the archipelago.",
            "",
            "Thank you for playing Shadows Over the Archipelago!",
            "Your journey has helped pave the way for humanity's survival."
        ];
        
        ending.forEach((line, index) => {
            setTimeout(() => {
                appendToGameLog(line);
            }, index * 2000);
        });
    }

    // Event Listeners
    document.getElementById('game-command-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const commandInput = document.getElementById('command');
        const command = commandInput.value.toLowerCase().trim();
        
        if (command) {
            appendToGameLog(`\n> ${command}`);
            processCommand(command);
            commandInput.value = '';
        }
    });

    document.querySelector('.close-btn').onclick = () => {
        document.getElementById('dialog-modal').style.display = 'none';
    };

    window.onclick = (event) => {
        const modal = document.getElementById('dialog-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Quick Commands
    window.quickCommand = (command) => {
        const currentCoords = locations[gameState.player.currentLocation].coordinates;
        let newLocation = null;
        
        switch(command) {
            case 'north':
                // Find the nearest location to the north
                newLocation = findNearestLocation(currentCoords, 0.01, 0);
                break;
            case 'south':
                newLocation = findNearestLocation(currentCoords, -0.01, 0);
                break;
            case 'east':
                newLocation = findNearestLocation(currentCoords, 0, 0.01);
                break;
            case 'west':
                newLocation = findNearestLocation(currentCoords, 0, -0.01);
                break;
            case 'rest':
                if (gameState.player.energy < 100) {
                    appendToGameLog('\nResting...');
                    const restInterval = setInterval(() => {
                        appendToGameLog('💤 ...');
                    }, 3000); // Show progress every 3 seconds
                    
                    setTimeout(() => {
                        clearInterval(restInterval);
                        gameState.player.energy = Math.min(100, gameState.player.energy + 40);
                        updateTime(30); // Rest takes 30 minutes in game time
                        appendToGameLog('You feel refreshed and energized.');
                        appendToGameLog(`Energy restored to ${gameState.player.energy}%`);
                    }, 15000); // 15 seconds real time
                } else {
                    appendToGameLog('\nYou are already well-rested.');
                }
                break;
            case 'heal':
                if (gameState.player.inventory.includes('Medical Kit') && gameState.player.health < 100) {
                    appendToGameLog('\nApplying medical treatment...');
                    setTimeout(() => {
                        gameState.player.health = Math.min(100, gameState.player.health + 30);
                        updateTime(15); // Healing takes 15 minutes
                        appendToGameLog('Health restored. Wounds have been treated.');
                    }, 1500);
                } else {
                    appendToGameLog('\nNo Medical Kit available or full health.');
                }
                break;
        }

        if (newLocation) {
            moveToLocation(newLocation);
        }
    };

    // Helper function to find nearest location in a direction
    function findNearestLocation(currentCoords, latOffset, lngOffset) {
        const targetLat = currentCoords[0] + latOffset;
        const targetLng = currentCoords[1] + lngOffset;
        
        let nearest = null;
        let minDistance = Infinity;
        
        Object.entries(locations).forEach(([name, data]) => {
            if (name === gameState.player.currentLocation) return;
            
            const locationCoords = data.coordinates;
            const isInDirection = 
                (latOffset > 0 && locationCoords[0] > currentCoords[0]) || // North
                (latOffset < 0 && locationCoords[0] < currentCoords[0]) || // South
                (lngOffset > 0 && locationCoords[1] > currentCoords[1]) || // East
                (lngOffset < 0 && locationCoords[1] < currentCoords[1]);   // West
                
            if (isInDirection) {
                const distance = Math.sqrt(
                    Math.pow(locationCoords[0] - targetLat, 2) +
                    Math.pow(locationCoords[1] - targetLng, 2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = name;
                }
            }
        });
        
        return nearest;
    }

    // Update moveToLocation to include time cost
    window.moveToLocation = (newLocation) => {
        const currentLocation = gameState.player.currentLocation;
        const targetLocation = locations[newLocation];
        
        if (!targetLocation) {
            appendToGameLog(`\nError: Location not found.`);
            return;
        }

        const energyCost = 10 + (targetLocation.danger * 2);
        
        if (gameState.player.energy < energyCost) {
            appendToGameLog(`\nNot enough energy to travel. Need ${energyCost} energy points.`);
            appendToGameLog(`Rest to recover energy.`);
            return;
        }

        // Calculate travel time based on distance and road path
        const currentCoords = locations[currentLocation].coordinates;
        const directDistance = Math.sqrt(
            Math.pow(targetLocation.coordinates[0] - currentCoords[0], 2) +
            Math.pow(targetLocation.coordinates[1] - currentCoords[1], 2)
        );
        // Add 30% distance for road paths
        const roadDistance = directDistance * 1.3;
        const travelMinutes = Math.round(roadDistance * 1000); // Approximate travel time

        appendToGameLog(`\nMoving to ${newLocation}...`);
        appendToGameLog(`Estimated travel time: ${travelMinutes} minutes`);

        // Create road-like path with waypoints
        const waypoints = [
            currentCoords,
            [currentCoords[0], targetLocation.coordinates[1]], // Horizontal movement
            targetLocation.coordinates // Vertical movement
        ];

        // Create travel line that follows roads
        const travelLine = L.polyline(waypoints, {
            color: '#00ff00',
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 10',
            className: 'travel-line'
        }).addTo(map);

        // Create player marker
        const playerIcon = createCustomIcon('👤', '#00ff00');
        const movingPlayer = L.marker(currentCoords, { icon: playerIcon }).addTo(map);

        let currentWaypoint = 0;
        let secondsElapsed = 0;
        const totalWaypoints = waypoints.length - 1;
        const timePerWaypoint = Math.floor(travelMinutes / totalWaypoints);

        const moveInterval = setInterval(() => {
            secondsElapsed++;
            appendToGameLog(`Traveling... ${secondsElapsed}/${travelMinutes} minutes`);

            // Update marker position
            if (currentWaypoint < totalWaypoints) {
                const start = waypoints[currentWaypoint];
                const end = waypoints[currentWaypoint + 1];
                const progress = (secondsElapsed % timePerWaypoint) / timePerWaypoint;

                if (progress >= 1) {
                    currentWaypoint++;
                }

                if (currentWaypoint < totalWaypoints) {
                    const newLat = start[0] + (end[0] - start[0]) * progress;
                    const newLng = start[1] + (end[1] - start[1]) * progress;
                    movingPlayer.setLatLng([newLat, newLng]);
                }
            }

            // Check if travel is complete
            if (secondsElapsed >= travelMinutes) {
                clearInterval(moveInterval);
                map.removeLayer(travelLine);
                map.removeLayer(movingPlayer);
                
                gameState.player.energy -= energyCost;
                updatePlayerLocation(newLocation);
                updateTime(travelMinutes);
                
                appendToGameLog(`\nArrived at ${newLocation}`);
                appendToGameLog(`Travel time: ${Math.floor(travelMinutes/60)}h ${travelMinutes%60}m`);
                appendToGameLog(`Energy cost: ${energyCost} points`);
                appendToGameLog(targetLocation.description);
                
                if (!gameState.player.discoveredLocations.includes(newLocation)) {
                    gameState.player.discoveredLocations.push(newLocation);
                    appendToGameLog(`\nNew location discovered!`);
                }

                if (targetLocation.danger > 3) {
                    appendToGameLog(`\nWARNING: High danger level detected!`);
                    if (Math.random() < targetLocation.danger * 0.1) {
                        gameState.player.health -= 10;
                        appendToGameLog(`\nYou've encountered infected! Lost 10 health.`);
                    }
                }
            }
        }, 1000); // Update every second

        document.getElementById('dialog-modal').style.display = 'none';
    };

    // Add time management functions
    function updateTime(minutes) {
        gameState.time.minute += minutes;
        while (gameState.time.minute >= 60) {
            gameState.time.minute -= 60;
            gameState.time.hour += 1;
        }
        while (gameState.time.hour >= 24) {
            gameState.time.hour -= 24;
            gameState.time.day += 1;
        }
        updateTimeDisplay();
    }

    function updateTimeDisplay() {
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

    // Add scanLocation to window object
    window.scanLocation = (locationName) => {
        const location = locations[locationName];
        if (!location) return;

        appendToGameLog(`\nScanning ${locationName}...`);
        setTimeout(() => {
            appendToGameLog(`Location: ${locationName}`);
            appendToGameLog(`Danger Level: ${'🔴'.repeat(location.danger)}`);
            appendToGameLog(`NPCs Present: ${location.npcs.length}`);
            appendToGameLog(`Items Available: ${location.items.join(', ')}`);
            appendToGameLog(`Threat Assessment: ${getDangerDescription(location.danger)}`);
        }, 1000);
    };

    // Add item interaction system
    window.takeItem = (item) => {
        const currentLocation = locations[gameState.player.currentLocation];
        
        // Check if item exists in location
        if (!currentLocation.items.includes(item)) {
            appendToGameLog(`\nCannot find ${item} here.`);
            return;
        }

        // Check if it's a backpack
        if (backpackUpgrades[item]) {
            if (backpackUpgrades[item].tier <= gameState.player.backpackTier) {
                appendToGameLog(`\nYou already have a better backpack equipped.`);
                return;
            }
            // Upgrade backpack
            gameState.player.backpackTier = backpackUpgrades[item].tier;
            gameState.player.inventoryCapacity = backpackUpgrades[item].capacity;
            currentLocation.items = currentLocation.items.filter(i => i !== item);
            appendToGameLog(`\nUpgraded to ${item}!`);
            appendToGameLog(`Inventory capacity increased to ${backpackUpgrades[item].capacity} slots.`);
            updateLocationItems();
            return;
        }

        // Check inventory capacity
        if (gameState.player.inventory.length >= gameState.player.inventoryCapacity) {
            appendToGameLog(`\nInventory full! Capacity: ${gameState.player.inventory.length}/${gameState.player.inventoryCapacity}`);
            appendToGameLog(`Find a better backpack to increase capacity.`);
            return;
        }

        // Check quest-related items and trigger story progression
        let questItem = false;
        switch(item) {
            case 'Research Notes':
                if (gameState.activeQuest.currentObjective === 1) {
                    questItem = true;
                    appendToGameLog("\n[STORY] You've found Dr. Santos's research notes!");
                    appendToGameLog("The notes reveal disturbing details about unauthorized experiments...");
                    appendToGameLog("There are references to 'Project Archipelago' and 'human trials'...");
                    completeObjective(1);
                }
                break;
            case 'Lab Equipment':
                if (gameState.activeQuest.currentObjective === 2) {
                    questItem = true;
                    appendToGameLog("\n[STORY] The lab equipment is intact!");
                    appendToGameLog("This specialized equipment will be essential for developing the cure.");
                    completeObjective(2);
                }
                break;
            case 'Medical Supplies':
                if (gameState.activeQuest.currentObjective === 3) {
                    questItem = true;
                    appendToGameLog("\n[STORY] These medical supplies are exactly what we need!");
                    appendToGameLog("With these, we can begin treating the infected and testing the cure.");
                    completeObjective(3);
                }
                break;
            case 'Radio Parts':
                if (gameState.activeQuest.currentObjective === 4) {
                    questItem = true;
                    appendToGameLog("\n[STORY] The radio parts are in good condition!");
                    appendToGameLog("We can use these to boost the signal and reach other survivors.");
                    completeObjective(4);
                }
                break;
        }

        // Remove item from location and add to inventory
        currentLocation.items = currentLocation.items.filter(i => i !== item);
        gameState.player.inventory.push(item);
        
        // Display appropriate message
        if (questItem) {
            appendToGameLog(`\n✅ Quest item acquired: ${item}`);
            appendToGameLog(`Check your quest log to see your next objective.`);
        } else {
            appendToGameLog(`\nPicked up: ${item}`);
        }
        
        appendToGameLog(`Inventory: ${gameState.player.inventory.length}/${gameState.player.inventoryCapacity} slots used`);
        
        // Update UI
        updateLocationItems();
        updateQuestDisplay();
    };

    function updateLocationItems() {
        const location = locations[gameState.player.currentLocation];
        const itemsList = document.createElement('div');
        itemsList.className = 'items-list';
        
        if (location.items.length === 0) {
            itemsList.innerHTML = '<div class="item-entry">No items available</div>';
        } else {
            appendToGameLog('\nVisible items:');
            location.items.forEach(item => {
                const isBackpack = backpackUpgrades[item] !== undefined;
                const isQuestItem = isItemNeededForCurrentQuest(item);
                
                // Create clickable item in the game log
                const itemLine = document.createElement('p');
                itemLine.className = 'clickable-item';
                itemLine.innerHTML = `- ${item}${isQuestItem ? ' [❗Quest Item]' : ''}`;
                itemLine.onclick = () => showItemPopup(item, isQuestItem, isBackpack);
                document.querySelector('.output-text').appendChild(itemLine);

                // Create item in the items list
                const itemElement = document.createElement('div');
                itemElement.className = `item-entry ${isQuestItem ? 'quest-item' : ''} ${isBackpack ? 'backpack-item' : ''}`;
                itemElement.onclick = () => showItemPopup(item, isQuestItem, isBackpack);
                
                itemElement.innerHTML = `
                    <div class="item-content">
                        <span class="item-icon">${isBackpack ? '🎒' : isQuestItem ? '❗' : '📦'}</span>
                        <span class="item-name">${item}</span>
                        <span class="item-hint">Click to interact</span>
                    </div>
                `;
                itemsList.appendChild(itemElement);
            });
        }
        
        // Update the items display in the location info
        const locationInfo = document.querySelector('.location-info');
        const existingItems = locationInfo.querySelector('.items-list');
        if (existingItems) {
            existingItems.replaceWith(itemsList);
        } else {
            locationInfo.appendChild(itemsList);
        }
    }

    function checkQuestItemProgress(item) {
        const currentObjective = gameState.activeQuest.objectives[gameState.activeQuest.currentObjective - 1];
        
        // Check if item is related to current objective
        switch(item) {
            case 'Research Notes':
                if (currentObjective.id === 1) {
                    completeObjective(1);
                    appendToGameLog('\n✅ Found Dr. Santos\'s research notes!');
                    appendToGameLog('The notes contain disturbing information about experiments...');
                }
                break;
            case 'Lab Equipment':
                if (currentObjective.id === 2) {
                    completeObjective(2);
                    appendToGameLog('\n✅ Retrieved the necessary lab equipment!');
                    appendToGameLog('This will be crucial for developing the cure.');
                }
                break;
            case 'Medical Supplies':
                if (currentObjective.id === 3) {
                    completeObjective(3);
                    appendToGameLog('\n✅ Gathered essential medical supplies!');
                    appendToGameLog('These supplies will help treat the infected.');
                }
                break;
        }
    }

    function getBackpackName(tier) {
        switch(tier) {
            case 1: return "Basic Pouch";
            case 2: return "Small Backpack";
            case 3: return "Medium Backpack";
            case 4: return "Large Backpack";
            case 5: return "Military Backpack";
            default: return "Basic Pouch";
        }
    }

    // Add CSS styles for new elements
    const style = document.createElement('style');
    style.textContent = `
        .items-list {
            margin-top: 10px;
            border-top: 1px solid var(--terminal-dim);
            padding-top: 10px;
        }
        
        .item-entry {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            border: 1px solid var(--terminal-dim);
            margin: 5px 0;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .item-entry:hover {
            background: rgba(0, 255, 0, 0.1);
            border-color: var(--terminal-green);
            transform: translateX(5px);
        }
        
        .item-icon {
            font-size: 1.2em;
            min-width: 24px;
            text-align: center;
        }
        
        .item-name {
            flex: 1;
        }
        
        .pickup-hint {
            color: var(--terminal-dim);
            font-size: 0.9em;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .item-entry:hover .pickup-hint {
            opacity: 1;
        }
        
        .quest-item {
            border-color: #ffff00;
            background: rgba(255, 255, 0, 0.05);
        }
        
        .quest-item:hover {
            border-color: #ffff00;
            background: rgba(255, 255, 0, 0.1);
        }
        
        .backpack-item {
            border-color: #ffd700;
            background: rgba(255, 215, 0, 0.05);
        }
        
        .backpack-item:hover {
            border-color: #ffd700;
            background: rgba(255, 215, 0, 0.1);
        }
    `;
    document.head.appendChild(style);

    // Add specific area interactions for items
    const areaInteractions = {
        'Quezon City Hospital': {
            'Dr. Santos Office': {
                description: "A ransacked office with papers scattered everywhere. Dr. Santos's research might be hidden here.",
                searchable: true,
                searchTime: 10, // minutes
                items: ['Research Notes'],
                searched: false,
                searchDialog: [
                    "You carefully search through the scattered papers...",
                    "Most documents are administrative files...",
                    "Under a fallen cabinet, you notice a locked drawer...",
                    "Using your medical student ID, you manage to pry it open..."
                ]
            },
            'Emergency Room': {
                description: "Medical supplies are scattered around. Some might still be useful.",
                searchable: true,
                searchTime: 5,
                items: ['Emergency Meds', 'Bandages'],
                searched: false,
                searchDialog: [
                    "You check the medical cabinets...",
                    "Most supplies are expired or contaminated...",
                    "But some sealed packages might still be useful..."
                ]
            }
        },
        'University of the Philippines': {
            'Research Lab': {
                description: "The university's main research lab. The equipment you need might be here.",
                searchable: true,
                searchTime: 15,
                items: ['Lab Equipment', 'Research Data'],
                searched: false,
                searchDialog: [
                    "The lab is dark, only emergency lights are working...",
                    "You hear distant sounds of infected...",
                    "The equipment seems to be locked in a secure cabinet...",
                    "Professor Cruz's keycard might work..."
                ]
            },
            'Library': {
                description: "The vast library might contain important research documents.",
                searchable: true,
                searchTime: 20,
                items: ['Medical Journals', 'Virus Research Papers'],
                searched: false,
                searchDialog: [
                    "Rows of books stretch into darkness...",
                    "You find the medical research section...",
                    "Recent publications might have relevant information..."
                ]
            }
        },
        'Safe House': {
            'Storage Room': {
                description: "A well-organized storage area with various supplies.",
                searchable: true,
                searchTime: 8,
                items: ['Medical Supplies', 'Food Rations'],
                searched: false,
                searchDialog: [
                    "The survivors keep their supplies well organized...",
                    "Medical supplies are carefully rationed...",
                    "You find a sealed box of medical supplies..."
                ]
            }
        },
        'Radio Tower': {
            'Control Room': {
                description: "The main control room for the radio equipment.",
                searchable: true,
                searchTime: 12,
                items: ['Radio Parts', 'Technical Manual'],
                searched: false,
                searchDialog: [
                    "Old equipment hums with electricity...",
                    "The control panel shows some active frequencies...",
                    "You notice a maintenance kit under the desk..."
                ]
            }
        }
    };

    // Add search area command
    window.searchArea = (areaName) => {
        const currentLocation = gameState.player.currentLocation;
        const areas = areaInteractions[currentLocation];
        
        if (!areas || !areas[areaName]) {
            appendToGameLog("\nThis area cannot be searched.");
            return;
        }

        const area = areas[areaName];
        if (!area.searchable || area.searched) {
            appendToGameLog("\nNothing more to find here.");
            return;
        }

        if (gameState.player.energy < 10) {
            appendToGameLog("\nToo tired to search. Rest to recover energy.");
            return;
        }

        appendToGameLog(`\nSearching ${areaName}...`);
        let dialogIndex = 0;
        
        const searchInterval = setInterval(() => {
            if (dialogIndex < area.searchDialog.length) {
                appendToGameLog(area.searchDialog[dialogIndex]);
                dialogIndex++;
            } else {
                clearInterval(searchInterval);
                completeSearch(area, areaName);
            }
        }, 2000);
    };

    function completeSearch(area, areaName) {
        area.searched = true;
        gameState.player.energy -= 10;
        updateTime(area.searchTime);

        appendToGameLog("\nSearch complete!");
        if (area.items.length > 0) {
            appendToGameLog("You found:");
            area.items.forEach(item => {
                appendToGameLog(`- ${item}`);
                if (!locations[gameState.player.currentLocation].items.includes(item)) {
                    locations[gameState.player.currentLocation].items.push(item);
                }
            });
            updateLocationItems();
        }

        // Special story triggers
        if (area.items.includes('Research Notes')) {
            appendToGameLog("\n[STORY] You've found Dr. Santos's research notes!");
            appendToGameLog("The notes reveal disturbing details about unauthorized experiments...");
            appendToGameLog("There are references to a 'Project Archipelago' and 'human trials'...");
        }
    }

    // Add command processing for search
    function processCommand(command) {
        const parts = command.split(' ');
        const action = parts[0];
        const target = parts.slice(1).join(' ');

        if (action === 'search' && target) {
            searchArea(target);
            return;
        }

        if (action === 'take' && target) {
            takeItem(target);
            return;
        }

        if (window.gameCommands[action]) {
            if (target) {
                window.gameCommands[action](target);
            } else {
                window.gameCommands[action]();
            }
        } else {
            appendToGameLog("Unknown command. Type 'help' for available commands.");
        }
    }

    // Add quest item requirements
    const questItems = {
        1: {
            required: ['Research Notes', 'Project Files'],
            description: 'Dr. Santos\'s research notes and Project Archipelago files reveal disturbing truths about the virus\'s origin.'
        },
        2: {
            required: ['Lab Equipment', 'Viral Samples'],
            description: 'Advanced laboratory equipment and virus samples are needed to analyze the mutation patterns and develop a cure.'
        },
        3: {
            required: ['Medical Supplies', 'Emergency Kit'],
            description: 'Medical supplies and emergency equipment for treating the infected and testing potential cures.'
        },
        4: {
            required: ['Security Badge', 'Keycard'],
            description: 'Security credentials needed to access restricted areas and uncover more evidence.'
        },
        5: {
            required: ['Research Notes', 'Lab Equipment', 'Medical Supplies', 'Project Files'],
            description: 'All components needed to expose the truth and begin developing the cure.'
        }
    };

    // Helper function to check if an item is needed for current quest
    function isItemNeededForCurrentQuest(item) {
        const currentObjective = gameState.activeQuest.currentObjective;
        const requiredItems = questItems[currentObjective]?.required || [];
        return requiredItems.includes(item);
    }

    // Add item interaction popup HTML to the page
    const itemPopupHTML = `
        <div id="item-popup" class="modal">
            <div class="modal-content item-popup-content">
                <div class="item-popup-header">
                    <h3 id="item-name">Item Name</h3>
                    <span class="close-btn">&times;</span>
                </div>
                <div class="item-popup-body">
                    <div id="item-description"></div>
                    <div class="item-popup-actions">
                        <button id="take-item-btn" class="popup-button">Pick Up</button>
                        <button id="leave-item-btn" class="popup-button">Ignore</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', itemPopupHTML);

    // Update styles for item popup
    const itemPopupStyles = `
        .item-popup-content {
            max-width: 400px;
            background: rgba(0, 20, 0, 0.95);
            border: 2px solid var(--terminal-green);
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
        }
        
        .item-popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid var(--terminal-green);
            background: rgba(0, 40, 0, 0.5);
        }
        
        .item-popup-header h3 {
            color: var(--terminal-green);
            text-shadow: 0 0 5px var(--terminal-green);
            margin: 0;
        }
        
        .item-popup-body {
            padding: 20px;
        }
        
        .item-popup-actions {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            justify-content: center;
        }
        
        .popup-button {
            background: transparent;
            color: var(--terminal-green);
            border: 1px solid var(--terminal-green);
            padding: 10px 20px;
            font-family: var(--terminal-font);
            font-size: 1.1em;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 120px;
        }
        
        .popup-button:hover {
            background: var(--terminal-green);
            color: var(--terminal-bg);
            transform: scale(1.05);
        }
        
        #item-description {
            text-align: center;
            margin: 15px 0;
            color: var(--terminal-dim);
            font-size: 1.1em;
            line-height: 1.4;
        }
        
        .quest-marker {
            color: #ffff00;
            display: block;
            margin-top: 10px;
            font-weight: bold;
        }
        
        .item-entry {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            border: 1px solid var(--terminal-dim);
            margin: 8px 0;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .item-entry:hover {
            background: rgba(0, 255, 0, 0.1);
            border-color: var(--terminal-green);
            transform: translateX(5px);
        }
        
        .item-entry:hover::after {
            content: 'Click to interact';
            position: absolute;
            right: 10px;
            color: var(--terminal-dim);
            font-size: 0.9em;
        }
        
        .item-icon {
            font-size: 1.4em;
            min-width: 30px;
            text-align: center;
        }
    `;
    style.textContent += itemPopupStyles;

    // Function to show item popup
    function showItemPopup(item, isQuestItem, isBackpack) {
        const popup = document.getElementById('item-popup');
        const itemNameEl = document.getElementById('item-name');
        const itemDescEl = document.getElementById('item-description');
        const takeBtn = document.getElementById('take-item-btn');
        const leaveBtn = document.getElementById('leave-item-btn');

        // Set item name and description
        itemNameEl.textContent = item;
        if (isQuestItem) {
            const questDesc = questItems[gameState.activeQuest.currentObjective]?.description || '';
            itemDescEl.innerHTML = `${questDesc}<br><span class="quest-marker">❗Quest Item</span>`;
        } else if (isBackpack) {
            const backpackInfo = backpackUpgrades[item];
            itemDescEl.textContent = `Capacity: ${backpackInfo.capacity} slots`;
        } else {
            itemDescEl.textContent = 'A useful item that might come in handy.';
        }

        // Update button text for backpacks
        takeBtn.textContent = isBackpack ? 'Equip' : 'Pick Up';

        // Set up button handlers
        takeBtn.onclick = () => {
            takeItem(item);
            popup.style.display = 'none';
        };
        leaveBtn.onclick = () => {
            popup.style.display = 'none';
        };

        // Show popup
        popup.style.display = 'block';

        // Close on X click
        popup.querySelector('.close-btn').onclick = () => {
            popup.style.display = 'none';
        };

        // Close on outside click
        window.onclick = (event) => {
            if (event.target === popup) {
                popup.style.display = 'none';
            }
        };
    }

    // Add additional styles for better item visibility
    const additionalStyles = `
        .item-content {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            position: relative;
        }

        .item-hint {
            position: absolute;
            right: 10px;
            color: var(--terminal-dim);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .item-entry:hover .item-hint {
            opacity: 1;
        }

        .item-entry {
            padding: 12px;
            border: 1px solid var(--terminal-dim);
            margin: 8px 0;
            transition: all 0.3s ease;
            background: rgba(0, 20, 0, 0.3);
        }

        .item-entry:hover {
            background: rgba(0, 255, 0, 0.1);
            border-color: var(--terminal-green);
            transform: translateX(5px);
        }

        .quest-item {
            border-color: #ffff00;
            background: rgba(255, 255, 0, 0.05);
        }

        .quest-item:hover {
            background: rgba(255, 255, 0, 0.1);
        }

        .backpack-item {
            border-color: #ffd700;
            background: rgba(255, 215, 0, 0.05);
        }

        .backpack-item:hover {
            background: rgba(255, 215, 0, 0.1);
        }
    `;
    style.textContent += additionalStyles;

    // Add styles for clickable items
    const clickableItemStyles = `
        .clickable-item {
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 5px;
            margin: 2px 0;
        }

        .clickable-item:hover {
            background: rgba(0, 255, 0, 0.1);
            transform: translateX(5px);
            border-left: 2px solid var(--terminal-green);
        }

        .item-content {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
        }

        .item-entry {
            background: rgba(0, 20, 0, 0.3);
            margin: 5px 0;
            padding: 10px;
            border: 1px solid var(--terminal-dim);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .item-entry:hover {
            background: rgba(0, 255, 0, 0.1);
            border-color: var(--terminal-green);
            transform: translateX(5px);
        }
    `;
    style.textContent += clickableItemStyles;

    // Initialize the game
    initializeGame();
}); 