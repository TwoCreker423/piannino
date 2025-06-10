document.addEventListener('DOMContentLoaded', () => {
    const pianoKeys = document.querySelectorAll('.piano-key');
    let currentStage = 0;
    let currentNoteIndex = 0;
    let canPlay = true;

    // Define melodies for each stage (notes: c, e, g for C major chord)
    const melodies = [
        // Stage 1: Playful C major variation (bouncy rhythm)
        ['c', 'e', 'g', 'e', 'c', 'g', 'c', 'e', 'g'],
        // Stage 2: Cheerful C major variation (ascending and descending)
        ['c', 'e', 'g', 'g', 'e', 'c', 'e', 'g', 'c'],
        // Stage 3: Quirky C major variation (staccato feel)
        ['g', 'c', 'e', 'c', 'g', 'e', 'g', 'c', 'e'],
        // Stage 4: Lively C major variation (circus-like)
        ['e', 'g', 'c', 'e', 'g', 'c', 'g', 'e', 'c']
    ];

    // Load sounds
    const noteSounds = {
        'c': new Audio('sound/zvuk-notyi-do.mp3'),
        'c-sharp': new Audio('sound/brue.mp3'),
        'd': new Audio('sound/zvuk-notyi-re.mp3'),
        'd-sharp': new Audio('sound/kazahstan-ugrojaet-nam-bombordirovkoi.mp3'),
        'e': new Audio('sound/zvuk-notyi-mi.mp3'),
        'f': new Audio('sound/zvuk-notyi-fa.mp3'),
        'f-sharp': new Audio('sound/povezlo-povezlo.mp3'),
        'g': new Audio('sound/zvuk-notyi-sol.mp3'),
        'g-sharp': new Audio('sound/puk.mp3'),
        'a': new Audio('sound/zvuk-notyi-lya.mp3'),
        'a-sharp': new Audio('sound/shizofreniya.mp3'),
        'b': new Audio('sound/zvuk-notyi-si.mp3')
    };

    const stageCompleteSound = new Audio('sound/stage_complete.mp3');
    stageCompleteSound.preload = 'auto';
    stageCompleteSound.volume = 0.5;

    const allStagesCompleteSound = new Audio('sound/all_stages_complete.mp3');
    allStagesCompleteSound.preload = 'auto';
    allStagesCompleteSound.volume = 0.5;

    // Message elements
    const stageCompleteMessage = document.getElementById('stage-complete-message');
    const allStagesCompleteMessage = document.getElementById('all-stages-complete-message');

    function loadStage() {
        currentNoteIndex = 0;
        document.getElementById('status').textContent = `Stage ${currentStage + 1}`;
        canPlay = true;
        stageCompleteMessage.classList.remove('show');
        allStagesCompleteMessage.classList.remove('show');
        pianoKeys.forEach(key => key.classList.remove('pressed'));
    }

    async function playMelody(melody) {
        for (let i = 0; i < melody.length; i++) {
            const note = melody[i];
            const sound = noteSounds[note];
            const keyElement = document.querySelector(`.piano-key[data-note="${note}"]`);
            sound.currentTime = 0;
            sound.play().catch(error => console.error('Error playing note:', error));
            if (keyElement) {
                keyElement.classList.add('pressed');
                await new Promise(resolve => setTimeout(resolve, 200));
                keyElement.classList.remove('pressed');
            }
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    function playNote(note, element) {
        if (!canPlay) return;

        // Play note sound
        const sound = noteSounds[note];
        sound.currentTime = 0;
        sound.play().catch(error => console.error('Error playing note:', error));

        // Visual feedback
        element.classList.add('pressed');
        setTimeout(() => element.classList.remove('pressed'), 200);

        // Check if correct note
        if (note === melodies[currentStage][currentNoteIndex]) {
            currentNoteIndex++;
            if (currentNoteIndex >= melodies[currentStage].length) {
                canPlay = false;
                playMelody(melodies[currentStage]).then(() => {
                    stageCompleteSound.currentTime = 0;
                    stageCompleteSound.play().catch(error => console.error('Error playing stage complete sound:', error));
                    stageCompleteMessage.textContent = `ТЫ ПРОШЕЛ ${currentStage + 1} ЭТАП`;
                    stageCompleteMessage.classList.add('show');
                    setTimeout(() => {
                        stageCompleteMessage.classList.remove('show');
                        currentStage++;
                        if (currentStage >= melodies.length) {
                            allStagesCompleteSound.currentTime = 0;
                            allStagesCompleteSound.play().catch(error => console.error('Error playing all stages complete sound:', error));
                            allStagesCompleteMessage.classList.add('show');
                            setTimeout(() => {
                                allStagesCompleteMessage.classList.remove('show');
                                currentStage = 0;
                                loadStage();
                            }, 7000);
                        } else {
                            loadStage();
                        }
                    }, 7000);
                });
            }
        }
    }

    // Keyboard controls
    const keyMap = {
        '1': 'c', '2': 'c-sharp', '3': 'd', '4': 'd-sharp', '5': 'e',
        '6': 'f', '7': 'f-sharp', '8': 'g', '9': 'g-sharp', '0': 'a',
        'q': 'a-sharp', 'w': 'b'
    };

    document.addEventListener('keydown', (e) => {
        const note = keyMap[e.key.toLowerCase()];
        if (note) {
            const keyElement = document.querySelector(`.piano-key[data-note="${note}"]`);
            if (keyElement) playNote(note, keyElement);
        }
    });

    // Piano key controls
    pianoKeys.forEach(key => {
        const note = key.dataset.note;
        key.addEventListener('click', () => playNote(note, key));
        key.addEventListener('touchstart', (e) => {
            e.preventDefault();
            playNote(note, key);
        });
    });

    // Initialize game
    loadStage();
});