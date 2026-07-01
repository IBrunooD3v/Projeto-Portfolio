/**
 * MAIN.JS - LÓGICA GLOBAL
 * Gerencia menu, animações de scroll, loading e o player de música , Terminal Web
 */

document.addEventListener('DOMContentLoaded', () => {
    // Scroll para o topo da página ao carregar
    window.scrollTo(0, 0);
    /* --- LOADING OVERLAY --- */
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loader">
            <div class="spinner"></div>
            <p>Carregando...</p>
        </div>
    `;
    document.body.appendChild(loadingOverlay);

    // Adiciona CSS básico para o loading se não existir
    const style = document.createElement('style');
    style.innerHTML = `
        #loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0a0a0a;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        }
        #loading-overlay.fade-out {
            opacity: 0;
            pointer-events: none;
        }
        .loader {
            text-align: center;
            color: #00d4ff;
        }
      B  .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(0, 212, 255, 0.1);
            border-top: 5px solid #00d4ff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.classList.add('fade-out');
        }, 500);
    });

    /* --- MENU HAMBÚRGUER --- */
    const menuBtn = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Fecha menu ao clicar em link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    /* --- ANIMAÇÕES DE SCROLL (REVEAL) --- */
    const revealElements = () => {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
-
        reveals.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealElements);
    revealElements(); // Dispara inicial

    /* --- PLAYER DE MÚSICA PERSISTENTE --- */
    // Nota: Como não temos um arquivo de áudio real, vamos simular a lógica de controle
    // No mundo real, você usaria localStorage para salvar currentTime e playing state.
    
    const musicPlayer = document.createElement('div');
    musicPlayer.id = 'music-player';
    musicPlayer.className = 'music-player';
    musicPlayer.innerHTML = `
        <div class="player-container">
            <div class="player-info">
                <span class="music-icon">🎵</span>
                <span class="music-name">Mild Minds - VIEWS</span>
            </div>
            <button id="play-pause" class="play-btn">
                <span class="icon-play">▶️</span>
                <span class="icon-pause" style="display:none;">⏸️</span>
            </button>
        </div>
        <audio id="bg-audio" loop>
            <source src="src/audio/Mild Minds - VIEWS.mp3" type="audio/mpeg">
        </audio>
    `;
    document.body.appendChild(musicPlayer);

    // Estilos do player
    const playerStyle = document.createElement('style');
    playerStyle.innerHTML = `
        .music-player {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(20, 20, 20, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 50px;
            padding: 8px 8px;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
            transition: transform 0.3s ease;
        }
        .music-player:hover {
            transform: scale(1.05);
        }
        .player-container {
            display: flex;
            align-items: center;
            gap: 2px;
        }
        .player-info {
            display: flex;
            align-items: center;
            gap: 1px;
            color: #fff;
            font-size: 0.85rem;
            white-space: nowrap;
        }
        .play-btn {
            background: #00d4ff;
            color: #000;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.7rem;
            transition: all 0.2s ease;
        }
        .play-btn:hover {
            background: rgba(0, 212, 255, 0.1);
            color: #fff;
        }
        @media (max-width: 768px) {
            .music-player {
                bottom: 15px;
                right: 15px;
                padding: 8px 15px;
            }
            .music-name { display: none; }
        }
    `;
    document.head.appendChild(playerStyle);

    const audio = document.getElementById('bg-audio');
    const playPauseBtn = document.getElementById('play-pause');
    const playIcon = playPauseBtn.querySelector('.icon-play');
    const pauseIcon = playPauseBtn.querySelector('.icon-pause');

    // Recupera estado salvo
    const isPlaying = localStorage.getItem('musicPlaying') === 'true';
    const currentTime = localStorage.getItem('musicTime') || 0;

    audio.currentTime = parseFloat(currentTime);

    const updateUI = () => {
        if (audio.paused) {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        } else {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }
    };

    if (isPlaying) {
        // O navegador pode bloquear o autoplay, por isso tentamos dar play
        audio.play().catch(() => {
            console.log("Autoplay bloqueado pelo navegador.");
            localStorage.setItem('musicPlaying', 'false');
            updateUI();
        });
        updateUI();
    }

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            localStorage.setItem('musicPlaying', 'true');
        } else {
            audio.pause();
            localStorage.setItem('musicPlaying', 'false');
        }
        updateUI();
    });

    // Salva o tempo periodicamente
    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem('musicTime', audio.currentTime);
        }
    }, 1000);

   /* --- TERMINAL DE / NAVEGAÇÃO --- */
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');
    const terminalOutput = terminalBody.querySelector('.terminal-output');

    if (terminalInput && terminalBody) {
        // Focar no input quando clicar no terminal
        terminalBody.addEventListener('click', (e) => {
            if (!e.target.classList.contains('terminal-quick-btn')) {
                terminalInput.focus();
            }
        });

        // Mapa de comandos
        const commands = {
            'inicio': 'index.html',
            'sobre': 'sobre.html',
            'carreira': 'carreira.html',
            'projetos': 'projetos.html',
            'contato': 'contato.html',
            'skill': 'skills.html',
            'teste': 'meme.html',
            // REMOVIDO 'help': null
        };

        // Função para adicionar linha ao terminal
        const addLine = (text, className = '') => {
            const line = document.createElement('div');
            line.innerHTML = text;
            if (className) line.className = className;
            terminalOutput.appendChild(line);
        };

        // Função para exibir ajuda
        const showHelp = () => {
            addLine('<span class="terminal-info">Comandos disponíveis no ( Terminal ):</span>');
            addLine('<span class="terminal-cmd-example"><span class="cmd-text">inicio</span> - Ir para a página inicio</span>');
            addLine('<span class="terminal-cmd-example"><span class="cmd-text">sobre</span> - Ir para a página sobre</span>');
            addLine('<span class="terminal-cmd-example"><span class="cmd-text">carreira</span> - Ir para a página carreira</span>');
            addLine('<span class="terminal-cmd-example"><span class="cmd-text">projetos</span> - Ir para a página projetos</span>');
            addLine('<span class="terminal-cmd-example"><span class="cmd-text">contato</span> - Ir para a página contato</span>');
            addLine('<span class="terminal-cmd-example"><span class="cmd-text">skill</span> - Ir para a página de skills</span>');
            addLine('<span class="terminal-cmd-example"><span class="cmd-text">teste</span> - Executar comando de teste</span>');

            // REMOVIDO addLine('<span class="terminal-cmd-example"><span class="cmd-text">help</span> - Exibir esta lista de ajuda</span>');

            addLine('<br>');
        };

        // Função para executar um comando
        const executeCommand = (cmd) => {
            // Adicionar a linha do comando
            addLine(`<span class="terminal-command-line"><span class="terminal-prompt">Root@DevIBrunoo:~$</span> <span class="cmd-text">${cmd}</span></span>`);
            
            // Processar o comando
            if (cmd === '') {
                // Comando vazio - não faz nada
            } else if (cmd === 'help') {
                showHelp();
            } else if (commands[cmd]) {
                // Criar elemento para o loading animado
                const loadingLine = document.createElement('div');
                loadingLine.className = 'terminal-loading';
                loadingLine.innerHTML = '<span class="terminal-info">Carregando a proxima página ( Web )</span><span class="loading-dots"></span>';
                terminalOutput.appendChild(loadingLine);
                
                let dotsCount = 0;
                const loadingDots = loadingLine.querySelector('.loading-dots');
                
                // Animação dos pontos
                const loadingInterval = setInterval(() => {
                    dotsCount = (dotsCount + 1) % 4;
                    loadingDots.textContent = '.'.repeat(dotsCount);
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }, 300);
                
                // Depois de 1 segundo, redireciona
                setTimeout(() => {
                    clearInterval(loadingInterval);
                    window.location.href = commands[cmd];
                }, 2000);
            } else {
                addLine(`<span class="terminal-error">Comando não encontrado: "${cmd}". Digite "help" para ver os comandos disponíveis.</span>`);
                addLine('<br>');
            }
            
            // Scroll para o final
            terminalBody.scrollTop = terminalBody.scrollHeight;
        };

        // Lidar com o envio do comando pelo teclado
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value.trim().toLowerCase();
                executeCommand(cmd);
                // Limpar o input
                terminalInput.value = '';
            }
        });

        // Lidar com botões de ação rápida
        const quickBtns = document.querySelectorAll('.terminal-quick-btn');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.dataset.cmd;
                executeCommand(cmd);
            });
        });
    }
});
