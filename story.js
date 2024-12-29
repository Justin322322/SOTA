// Story and Quest Data
const storyData = {
    acts: {
        1: {
            title: "The Search Begins",
            description: "Dr. Santos has disappeared with crucial research about the virus. You must find his notes and uncover the truth.",
            objectives: [
                { id: 1, text: "Find Dr. Santos's research notes and Project Files", completed: false },
                { id: 2, text: "Gather lab equipment and viral samples for analysis", completed: false },
                { id: 3, text: "Collect medical supplies for testing", completed: false }
            ]
        },
        2: {
            title: "Uncovering the Truth",
            description: "The notes reveal a darker truth about Project Archipelago. You must gather evidence and find allies.",
            objectives: [
                { id: 1, text: "Access the Research Facility's secure levels", completed: false },
                { id: 2, text: "Find Dr. Chen and learn about the experiments", completed: false },
                { id: 3, text: "Gather evidence of unauthorized human trials", completed: false }
            ]
        },
        3: {
            title: "Race Against Time",
            description: "With the truth exposed, you must develop a cure before it's too late.",
            objectives: [
                { id: 1, text: "Set up a secure lab for cure development", completed: false },
                { id: 2, text: "Test potential cure formulas", completed: false },
                { id: 3, text: "Distribute the cure to survivor enclaves", completed: false }
            ]
        }
    },

    // Story events that trigger based on player actions or discoveries
    events: {
        findResearchNotes: {
            trigger: "Research Notes",
            text: [
                "The research notes are encrypted, but you recognize Dr. Santos's handwriting...",
                "Project Archipelago wasn't just about disease prevention...",
                "They were developing something else, something they couldn't control...",
                "Dr. Santos's last entry mentions 'Site B' and unauthorized experiments."
            ]
        },
        findViralSamples: {
            trigger: "Viral Samples",
            text: [
                "The viral samples are carefully preserved...",
                "Labels indicate different mutation strains: A1, B2, X7...",
                "One sample is marked 'ORIGINAL STRAIN - CONTAIN AT ALL COSTS'",
                "What were they trying to create here?"
            ]
        },
        findProjectFiles: {
            trigger: "Project Files",
            text: [
                "The project files contain disturbing information...",
                "Test subjects showed 'enhanced capabilities' but at a terrible cost...",
                "Corporate emails discuss 'acceptable losses' and 'population control'",
                "This wasn't an accident - it was a controlled release."
            ]
        }
    },

    // Character backgrounds and development
    characters: {
        player: {
            name: "Tala Reyes",
            background: "A brilliant medical student who worked closely with Dr. Santos. Her knowledge of genetics and medicine makes her humanity's best hope for a cure.",
            development: [
                "Discovers her mentor's involvement in Project Archipelago",
                "Struggles with the moral implications of human experimentation",
                "Becomes a leader in the fight for survival"
            ]
        },
        drSantos: {
            name: "Dr. Santos",
            background: "A renowned virologist who discovered the truth about Project Archipelago. His disappearance holds the key to understanding the outbreak.",
            development: [
                "Left encrypted messages about the true nature of the virus",
                "Tried to stop the project before it was too late",
                "May still be alive, working on a cure in secret"
            ]
        },
        nurseElena: {
            name: "Nurse Elena",
            background: "One of the few surviving medical staff from the hospital. She knows more about Dr. Santos's last days than she initially reveals.",
            development: [
                "Gradually reveals information about suspicious activities",
                "Helps establish a medical base for survivors",
                "Becomes a key ally in developing the cure"
            ]
        }
    },

    // Location-specific story elements
    locationStory: {
        'Quezon City Hospital': {
            initialDescription: "The hospital where it all began. Emergency lights flicker, casting shadows that hide dark secrets.",
            exploration: [
                "Medical records show a pattern of unusual symptoms before the outbreak",
                "Security footage reveals late-night deliveries from unmarked vehicles",
                "Dr. Santos's office contains hidden compartments with encrypted files"
            ],
            secretAreas: {
                'Hidden Lab': {
                    description: "A concealed laboratory behind a false wall in the basement",
                    requirements: ["Security Keycard", "Dr. Santos's Notes"],
                    revelation: "This is where they tested the first samples..."
                }
            }
        },
        'Research Facility': {
            initialDescription: "A high-security complex where Project Archipelago conducted its most sensitive experiments.",
            exploration: [
                "Warning signs about 'Class 4 Biohazard' materials",
                "Abandoned containment units with broken seals",
                "Computer logs detailing unauthorized access to restricted areas"
            ],
            secretAreas: {
                'Level B3': {
                    description: "The deepest level of the facility, requiring special clearance",
                    requirements: ["Level 3 Keycard", "Hazmat Suit"],
                    revelation: "The truth about Project Archipelago lies within..."
                }
            }
        }
    },

    // Story progression triggers
    triggers: {
        act1Complete: {
            requirements: ["Research Notes", "Lab Equipment", "Medical Supplies"],
            nextAct: 2,
            revelation: "The pieces start coming together. Project Archipelago was more than a research initiative..."
        },
        act2Complete: {
            requirements: ["Project Files", "Security Badge", "Viral Samples"],
            nextAct: 3,
            revelation: "The truth is worse than anyone imagined. The virus was engineered for human enhancement..."
        }
    }
};

// Story progression functions
function checkStoryProgress(item) {
    const event = storyData.events[`find${item.replace(/\s+/g, '')}`];
    if (event) {
        return event.text;
    }
    return null;
}

function getActDescription(act) {
    return storyData.acts[act];
}

function getCharacterInfo(character) {
    return storyData.characters[character];
}

function getLocationStory(location) {
    return storyData.locationStory[location];
}

function checkTriggers(inventory) {
    for (const [trigger, data] of Object.entries(storyData.triggers)) {
        if (data.requirements.every(item => inventory.includes(item))) {
            return {
                trigger: trigger,
                nextAct: data.nextAct,
                revelation: data.revelation
            };
        }
    }
    return null;
}

// Export story functions
window.storyModule = {
    checkStoryProgress,
    getActDescription,
    getCharacterInfo,
    getLocationStory,
    checkTriggers,
    storyData
}; 