/* =====================================================================
   TREMPO — script.js
   Índice:
   1. Banco de exercícios
   2. Dados das opções do formulário
   3. Estado global da aplicação
   4. Referências ao DOM
   5. Inicialização
   6. Renderização das opções (option-grid)
   7. selectOption() — seleção de preferências
   8. Envio do formulário / validação
   9. Geração do treino (filterExercises, generateWorkout, calculateWorkoutDuration)
   10. Renderização do resultado (renderWorkout)
   11. Modo treino / cronômetro (showWorkoutMode, startTimer, pauseTimer, nextExercise)
   12. Conclusão do treino (finishWorkout, confete)
   13. Histórico (saveWorkout, loadHistory)
   14. Utilitários (toast, áudio, formatação)
   15. Navegação (menu hambúrguer)
   ===================================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------------------
     1. BANCO DE EXERCÍCIOS
     Cada exercício tem: id, nome, categoria, nivel, equipamento,
     duracao (segundos), instrucao, musculos (array)
  ------------------------------------------------------------------- */
  const EXERCISES = [
    { id: 'agachamento', nome: 'Agachamento', categoria: 'pernas', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Mantenha os pés afastados na largura dos ombros, flexione os joelhos e desça mantendo o peito aberto.', musculos: ['quadríceps', 'glúteos'] },
    { id: 'flexao', nome: 'Flexão de braço', categoria: 'bracos', nivel: 'intermediario', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Apoie as mãos na largura dos ombros e desça o peito até quase tocar o chão.', musculos: ['peitoral', 'tríceps'] },
    { id: 'polichinelo', nome: 'Polichinelo', categoria: 'cardio', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Salte abrindo pernas e braços ao mesmo tempo, retornando à posição inicial em seguida.', musculos: ['corpo inteiro'] },
    { id: 'burpee', nome: 'Burpee', categoria: 'hiit', nivel: 'avancado', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Agache, jogue as pernas para trás em prancha, retorne e salte para cima.', musculos: ['corpo inteiro'] },
    { id: 'prancha', nome: 'Prancha', categoria: 'abdomen', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Apoie os antebraços e as pontas dos pés, mantendo o corpo alinhado e o core contraído.', musculos: ['core'] },
    { id: 'afundo', nome: 'Afundo', categoria: 'pernas', nivel: 'intermediario', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Dê um passo à frente e flexione ambos os joelhos a 90 graus, alternando as pernas.', musculos: ['quadríceps', 'glúteos'] },
    { id: 'mountain_climber', nome: 'Mountain Climber', categoria: 'cardio', nivel: 'intermediario', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Em posição de prancha, alterne trazendo os joelhos ao peito rapidamente.', musculos: ['core', 'cardio'] },
    { id: 'corrida_parada', nome: 'Corrida parada', categoria: 'cardio', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Corra no lugar elevando os joelhos até a altura do quadril.', musculos: ['pernas', 'cardio'] },
    { id: 'panturrilha', nome: 'Elevação de panturrilha', categoria: 'pernas', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Fique na ponta dos pés e desça de forma controlada, repetindo o movimento.', musculos: ['panturrilhas'] },
    { id: 'abdominal', nome: 'Abdominal reto', categoria: 'abdomen', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Deite-se, flexione os joelhos e eleve o tronco em direção aos joelhos.', musculos: ['abdômen'] },
    { id: 'prancha_lateral', nome: 'Prancha lateral', categoria: 'abdomen', nivel: 'intermediario', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Apoie um antebraço e a lateral dos pés, mantendo o quadril elevado e alinhado.', musculos: ['oblíquos'] },
    { id: 'agachamento_sumo', nome: 'Agachamento sumô', categoria: 'pernas', nivel: 'intermediario', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Com os pés bem afastados e apontados para fora, desça mantendo o tronco ereto.', musculos: ['glúteos', 'adutores'] },
    { id: 'flexao_diamante', nome: 'Flexão diamante', categoria: 'bracos', nivel: 'avancado', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Posicione as mãos formando um diamante sob o peito e flexione os cotovelos.', musculos: ['tríceps'] },
    { id: 'jump_squat', nome: 'Agachamento com salto', categoria: 'pernas', nivel: 'avancado', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Agache e salte explosivamente para cima, aterrissando suavemente.', musculos: ['pernas', 'potência'] },
    { id: 'skater', nome: 'Skater lateral', categoria: 'cardio', nivel: 'intermediario', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Salte lateralmente de um pé para o outro, como um patinador de velocidade.', musculos: ['pernas', 'cardio'] },
    { id: 'superman', nome: 'Superman', categoria: 'funcional', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Deitado de bruços, eleve braços e pernas ao mesmo tempo, contraindo a lombar.', musculos: ['lombar', 'glúteos'] },
    { id: 'ponte_gluteo', nome: 'Ponte de glúteo', categoria: 'pernas', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Deite-se, flexione os joelhos e eleve o quadril contraindo os glúteos.', musculos: ['glúteos', 'posterior de coxa'] },
    { id: 'prancha_toque', nome: 'Prancha com toque no ombro', categoria: 'abdomen', nivel: 'intermediario', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Em prancha alta, toque um ombro de cada vez com a mão oposta, sem balançar o quadril.', musculos: ['core', 'estabilidade'] },
    { id: 'flexao_inclinada', nome: 'Flexão inclinada', categoria: 'bracos', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Apoie as mãos em uma superfície elevada, como um sofá, e flexione os cotovelos.', musculos: ['peitoral'] },
    { id: 'agachamento_salto_lateral', nome: 'Agachamento com salto lateral', categoria: 'hiit', nivel: 'avancado', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Agache e salte para o lado, alternando a direção a cada repetição.', musculos: ['pernas', 'cardio'] },
    { id: 'alongamento_isquios', nome: 'Alongamento de isquiotibiais', categoria: 'mobilidade', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Sentado, estenda uma perna e incline o tronco suavemente em direção ao pé.', musculos: ['posterior de coxa'] },
    { id: 'alongamento_borboleta', nome: 'Alongamento borboleta', categoria: 'mobilidade', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Sentado, junte as solas dos pés e pressione levemente os joelhos em direção ao chão.', musculos: ['quadril', 'adutores'] },
    { id: 'rotacao_tronco', nome: 'Rotação de tronco', categoria: 'mobilidade', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Em pé, gire o tronco suavemente de um lado para o outro, sem forçar.', musculos: ['core', 'coluna'] },
    { id: 'gato_camelo', nome: 'Gato-camelo', categoria: 'mobilidade', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 40, instrucao: 'Em quatro apoios, alterne entre arquear e curvar a coluna lentamente.', musculos: ['coluna'] },
    { id: 'alongamento_ombros', nome: 'Alongamento de ombros', categoria: 'mobilidade', nivel: 'iniciante', equipamento: 'peso_corporal', duracao: 30, instrucao: 'Cruze um braço à frente do corpo e pressione levemente com o outro braço.', musculos: ['ombros'] },
    { id: 'rosca_halteres', nome: 'Rosca direta com halteres', categoria: 'bracos', nivel: 'intermediario', equipamento: 'halteres', duracao: 40, instrucao: 'Segure os halteres e flexione os cotovelos, contraindo o bíceps.', musculos: ['bíceps'] },
    { id: 'desenvolvimento_halteres', nome: 'Desenvolvimento de ombro', categoria: 'bracos', nivel: 'intermediario', equipamento: 'halteres', duracao: 40, instrucao: 'Empurre os halteres para cima, estendendo os braços acima da cabeça.', musculos: ['deltoides'] },
    { id: 'agachamento_halteres', nome: 'Agachamento com halteres', categoria: 'pernas', nivel: 'intermediario', equipamento: 'halteres', duracao: 45, instrucao: 'Segure os halteres ao lado do corpo e realize o agachamento normalmente.', musculos: ['quadríceps', 'glúteos'] },
    { id: 'stiff_halteres', nome: 'Stiff com halteres', categoria: 'pernas', nivel: 'avancado', equipamento: 'halteres', duracao: 45, instrucao: 'Com leve flexão nos joelhos, incline o tronco à frente segurando os halteres.', musculos: ['posterior de coxa', 'lombar'] },
    { id: 'remada_halteres', nome: 'Remada curvada com halteres', categoria: 'funcional', nivel: 'intermediario', equipamento: 'halteres', duracao: 45, instrucao: 'Incline o tronco à frente e puxe os halteres em direção à cintura.', musculos: ['costas'] },
    { id: 'elevacao_lateral', nome: 'Elevação lateral com halteres', categoria: 'bracos', nivel: 'iniciante', equipamento: 'halteres', duracao: 30, instrucao: 'Eleve os halteres lateralmente até a altura dos ombros, com leve flexão nos cotovelos.', musculos: ['deltoides'] },
    { id: 'supino_halteres', nome: 'Supino com halteres no chão', categoria: 'bracos', nivel: 'intermediario', equipamento: 'halteres', duracao: 45, instrucao: 'Deitado, empurre os halteres para cima a partir da altura do peito.', musculos: ['peitoral'] },
    { id: 'agachamento_barra', nome: 'Agachamento com barra', categoria: 'pernas', nivel: 'avancado', equipamento: 'academia', duracao: 45, instrucao: 'Posicione a barra sobre as costas e realize o agachamento com controle.', musculos: ['quadríceps', 'glúteos'] },
    { id: 'puxada_polia', nome: 'Puxada na polia', categoria: 'funcional', nivel: 'intermediario', equipamento: 'academia', duracao: 45, instrucao: 'Puxe a barra em direção ao peito, contraindo os músculos das costas.', musculos: ['costas'] },
    { id: 'leg_press', nome: 'Leg press', categoria: 'pernas', nivel: 'intermediario', equipamento: 'academia', duracao: 45, instrucao: 'Empurre a plataforma com os pés, estendendo os joelhos de forma controlada.', musculos: ['quadríceps'] },
    { id: 'remada_elastico', nome: 'Remada com elástico', categoria: 'funcional', nivel: 'iniciante', equipamento: 'elasticos', duracao: 40, instrucao: 'Prenda o elástico à frente e puxe em direção ao abdômen, contraindo as costas.', musculos: ['costas'] },
    { id: 'agachamento_elastico', nome: 'Agachamento com elástico', categoria: 'pernas', nivel: 'iniciante', equipamento: 'elasticos', duracao: 40, instrucao: 'Posicione o elástico acima dos joelhos e agache mantendo tensão lateral constante.', musculos: ['glúteos', 'quadríceps'] },
    { id: 'triceps_elastico', nome: 'Extensão de tríceps com elástico', categoria: 'bracos', nivel: 'iniciante', equipamento: 'elasticos', duracao: 30, instrucao: 'Prenda o elástico acima da cabeça e estenda os braços para baixo.', musculos: ['tríceps'] }
  ];

  /* -------------------------------------------------------------------
     2. DADOS DAS OPÇÕES DO FORMULÁRIO
  ------------------------------------------------------------------- */
  const OPTIONS = {
    time: [
      { value: '5', label: '5 min' },
      { value: '10', label: '10 min' },
      { value: '15', label: '15 min' },
      { value: '20', label: '20 min' },
      { value: '30', label: '30 min' },
      { value: '45', label: '45 min' },
      { value: '60', label: '60 min' }
    ],
    goal: [
      { value: 'queimar_calorias', icon: '🔥', label: 'Queimar calorias' },
      { value: 'ganhar_forca', icon: '💪', label: 'Ganhar força' },
      { value: 'condicionamento', icon: '🏃', label: 'Melhorar condicionamento' },
      { value: 'mobilidade', icon: '🧘', label: 'Mobilidade' },
      { value: 'treino_rapido', icon: '⚡', label: 'Treino rápido' },
      { value: 'hipertrofia', icon: '🏋️', label: 'Hipertrofia' }
    ],
    level: [
      { value: 'iniciante', label: 'Iniciante' },
      { value: 'intermediario', label: 'Intermediário' },
      { value: 'avancado', label: 'Avançado' }
    ],
    type: [
      { value: 'full_body', label: 'Full Body' },
      { value: 'pernas', label: 'Pernas' },
      { value: 'bracos', label: 'Braços' },
      { value: 'abdomen', label: 'Abdômen' },
      { value: 'cardio', label: 'Cardio' },
      { value: 'hiit', label: 'HIIT' },
      { value: 'mobilidade', label: 'Mobilidade' },
      { value: 'funcional', label: 'Funcional' }
    ],
    equipment: [
      { value: 'peso_corporal', label: 'Apenas peso corporal' },
      { value: 'halteres', label: 'Halteres' },
      { value: 'academia', label: 'Academia completa' },
      { value: 'elasticos', label: 'Elásticos' },
      { value: 'qualquer', label: 'Qualquer equipamento' }
    ]
  };

  const STEP_LABELS = {
    time: 'quanto tempo você tem',
    goal: 'seu objetivo',
    level: 'seu nível',
    type: 'o tipo de treino',
    equipment: 'seus equipamentos'
  };

  // Categorias que cada tipo de treino aceita
  const TYPE_CATEGORY_MAP = {
    full_body: ['pernas', 'bracos', 'abdomen', 'cardio', 'funcional'],
    pernas: ['pernas'],
    bracos: ['bracos'],
    abdomen: ['abdomen'],
    cardio: ['cardio'],
    hiit: ['hiit', 'cardio'],
    mobilidade: ['mobilidade'],
    funcional: ['funcional']
  };

  // Equipamentos de exercício permitidos para cada equipamento escolhido pelo usuário
  const EQUIPMENT_ALLOWED_MAP = {
    peso_corporal: ['peso_corporal'],
    halteres: ['peso_corporal', 'halteres'],
    academia: ['peso_corporal', 'halteres', 'academia', 'elasticos'],
    elasticos: ['peso_corporal', 'elasticos'],
    qualquer: ['peso_corporal', 'halteres', 'academia', 'elasticos']
  };

  // Níveis cumulativos: quem é avançado também consegue fazer exercícios mais simples
  const LEVEL_ALLOWED_MAP = {
    iniciante: ['iniciante'],
    intermediario: ['iniciante', 'intermediario'],
    avancado: ['iniciante', 'intermediario', 'avancado']
  };

  // Categorias priorizadas por objetivo (pontuação extra na hora de sortear)
  const GOAL_PRIORITY_MAP = {
    queimar_calorias: ['cardio', 'hiit'],
    ganhar_forca: ['pernas', 'bracos', 'funcional'],
    condicionamento: ['cardio', 'funcional'],
    mobilidade: ['mobilidade'],
    treino_rapido: ['hiit', 'cardio'],
    hipertrofia: ['bracos', 'pernas']
  };

  // Calorias aproximadas por minuto, por categoria
  const CALORIES_PER_MINUTE = {
    cardio: 10, hiit: 11, pernas: 8, funcional: 8, bracos: 6,
    abdomen: 6, mobilidade: 3, aquecimento: 4, descanso: 1.2, finalizacao: 3
  };

  const LEVEL_CALORIE_MULTIPLIER = { iniciante: 0.85, intermediario: 1, avancado: 1.15 };

  const FOCUS_LABELS = {
    full_body: 'Corpo inteiro',
    pernas: 'Pernas',
    bracos: 'Braços e ombros',
    abdomen: 'Abdômen e core',
    cardio: 'Condicionamento cardiovascular',
    hiit: 'Alta intensidade',
    mobilidade: 'Mobilidade e flexibilidade',
    funcional: 'Força funcional'
  };

  /* -------------------------------------------------------------------
     3. ESTADO GLOBAL DA APLICAÇÃO
  ------------------------------------------------------------------- */
  const state = {
    prefs: { time: null, goal: null, level: null, type: null, equipment: 'peso_corporal' },
    currentWorkout: null,     // { items, totalSeconds, totalCalories }
    workoutSession: {         // controla o modo treino em andamento
      itemIndex: 0,
      remaining: 0,
      timerId: null,
      isPaused: false,
      exercisesTotal: 0
    },
    audioCtx: null
  };

  const HISTORY_KEY = 'trempo_history';

  /* -------------------------------------------------------------------
     4. REFERÊNCIAS AO DOM
  ------------------------------------------------------------------- */
  const el = (id) => document.getElementById(id);

  const dom = {
    navToggle: el('navToggle'),
    navMenu: el('navMenu'),
    generatorForm: el('generatorForm'),
    generateBtn: el('generateBtn'),
    loadingState: el('loadingState'),
    resultSection: el('resultado'),
    generatorSection: el('gerador'),
    resultTime: el('resultTime'),
    resultType: el('resultType'),
    resultLevel: el('resultLevel'),
    resultCalories: el('resultCalories'),
    resultFocus: el('resultFocus'),
    resultDuration: el('resultDuration'),
    exerciseList: el('exerciseList'),
    editPrefsBtn: el('editPrefsBtn'),
    startWorkoutBtn: el('startWorkoutBtn'),
    rerollBtn: el('rerollBtn'),
    historyContent: el('historyContent'),
    toast: el('toast'),

    workoutMode: el('workoutMode'),
    workoutCloseBtn: el('workoutCloseBtn'),
    workoutProgressLabel: el('workoutProgressLabel'),
    workoutProgressFill: el('workoutProgressFill'),
    workoutExerciseName: el('workoutExerciseName'),
    workoutInstruction: el('workoutInstruction'),
    timerRingFg: el('timerRingFg'),
    workoutTimerValue: el('workoutTimerValue'),
    pauseBtn: el('pauseBtn'),
    nextExerciseBtn: el('nextExerciseBtn'),
    endWorkoutBtn: el('endWorkoutBtn'),

    workoutComplete: el('workoutComplete'),
    confettiCanvas: el('confettiCanvas'),
    completeTime: el('completeTime'),
    completeExercises: el('completeExercises'),
    completeCalories: el('completeCalories'),
    completeType: el('completeType'),
    newWorkoutBtn: el('newWorkoutBtn'),
    backHomeBtn: el('backHomeBtn')
  };

  const TIMER_CIRCUMFERENCE = 2 * Math.PI * 90; // r=90 no SVG do cronômetro

  /* -------------------------------------------------------------------
     5. INICIALIZAÇÃO
  ------------------------------------------------------------------- */
  function init() {
    renderAllOptionGrids();
    setDefaultEquipmentSelection();
    bindEvents();
    loadHistory();
  }

  function bindEvents() {
    dom.navToggle.addEventListener('click', toggleNavMenu);
    dom.navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', closeNavMenu);
    });

    dom.generatorForm.addEventListener('submit', handleFormSubmit);
    dom.editPrefsBtn.addEventListener('click', showGeneratorForm);
    dom.startWorkoutBtn.addEventListener('click', showWorkoutMode);
    dom.rerollBtn.addEventListener('click', handleReroll);

    dom.workoutCloseBtn.addEventListener('click', () => exitWorkoutMode(false));
    dom.endWorkoutBtn.addEventListener('click', () => exitWorkoutMode(false));
    dom.pauseBtn.addEventListener('click', pauseTimer);
    dom.nextExerciseBtn.addEventListener('click', () => nextExercise(true));

    dom.newWorkoutBtn.addEventListener('click', handleGenerateAnother);
    dom.backHomeBtn.addEventListener('click', handleBackHome);
  }

  /* -------------------------------------------------------------------
     6. RENDERIZAÇÃO DAS OPÇÕES (option-grid)
  ------------------------------------------------------------------- */
  function renderAllOptionGrids() {
    Object.keys(OPTIONS).forEach((groupName) => {
      const fieldset = dom.generatorForm.querySelector(`[data-step="${groupName}"]`);
      const grid = fieldset.querySelector('.option-grid');
      grid.innerHTML = '';
      OPTIONS[groupName].forEach((opt) => {
        grid.appendChild(createOptionElement(groupName, opt));
      });
    });
  }

  function createOptionElement(groupName, opt) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option';
    button.setAttribute('role', 'radio');
    button.setAttribute('aria-checked', 'false');
    button.dataset.group = groupName;
    button.dataset.value = opt.value;
    button.tabIndex = 0;

    if (opt.icon) {
      const icon = document.createElement('span');
      icon.className = 'option-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = opt.icon;
      button.appendChild(icon);
    }

    const label = document.createElement('span');
    label.className = 'option-label';
    label.textContent = opt.label;
    button.appendChild(label);

    button.addEventListener('click', () => selectOption(groupName, opt.value));
    return button;
  }

  function setDefaultEquipmentSelection() {
    // Por padrão, "Apenas peso corporal" já vem selecionado
    selectOption('equipment', 'peso_corporal');
  }

  /* -------------------------------------------------------------------
     7. selectOption() — seleção de preferências
  ------------------------------------------------------------------- */
  function selectOption(groupName, value) {
    state.prefs[groupName] = value;

    const fieldset = dom.generatorForm.querySelector(`[data-step="${groupName}"]`);
    const buttons = fieldset.querySelectorAll('.option');
    buttons.forEach((btn) => {
      const isSelected = btn.dataset.value === value;
      btn.setAttribute('aria-checked', String(isSelected));
    });

    clearFieldError(groupName);
  }

  /* -------------------------------------------------------------------
     8. ENVIO DO FORMULÁRIO / VALIDAÇÃO
  ------------------------------------------------------------------- */
  function handleFormSubmit(evt) {
    evt.preventDefault();

    const missing = Object.keys(OPTIONS).filter((key) => !state.prefs[key]);

    if (missing.length > 0) {
      missing.forEach(showFieldError);
      showToast(`Só falta escolher ${STEP_LABELS[missing[0]]} para montarmos o treino.`);
      const firstMissing = dom.generatorForm.querySelector(`[data-step="${missing[0]}"]`);
      firstMissing.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    runGenerationFlow();
  }

  function showFieldError(groupName) {
    const p = dom.generatorForm.querySelector(`[data-error-for="${groupName}"]`);
    p.textContent = 'Escolha suas preferências antes de gerar o treino.';
    p.hidden = false;
  }

  function clearFieldError(groupName) {
    const p = dom.generatorForm.querySelector(`[data-error-for="${groupName}"]`);
    p.hidden = true;
  }

  /* -------------------------------------------------------------------
     Fluxo de geração: mostra "Preparando seu TREMPO..." por ~500ms
  ------------------------------------------------------------------- */
  function runGenerationFlow() {
    dom.generatorForm.hidden = true;
    dom.loadingState.hidden = false;

    setTimeout(() => {
      const workout = generateWorkout(state.prefs);
      state.currentWorkout = workout;

      dom.loadingState.hidden = true;
      renderWorkout(workout);
      dom.resultSection.hidden = false;
      dom.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 520);
  }

  function handleReroll() {
    const workout = generateWorkout(state.prefs);
    state.currentWorkout = workout;
    renderWorkout(workout);
    dom.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showGeneratorForm() {
    dom.resultSection.hidden = true;
    dom.generatorForm.hidden = false;
    dom.generatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* -------------------------------------------------------------------
     9. GERAÇÃO DO TREINO
  ------------------------------------------------------------------- */

  // Filtra o banco de exercícios de acordo com as preferências do usuário.
  // Se o resultado for pequeno demais, relaxa gradualmente as restrições
  // para nunca deixar o gerador sem opções.
  function filterExercises(prefs) {
    const allowedEquip = EQUIPMENT_ALLOWED_MAP[prefs.equipment] || EQUIPMENT_ALLOWED_MAP.qualquer;
    const allowedLevels = LEVEL_ALLOWED_MAP[prefs.level] || LEVEL_ALLOWED_MAP.avancado;
    const allowedCategories = TYPE_CATEGORY_MAP[prefs.type] || TYPE_CATEGORY_MAP.full_body;

    let pool = EXERCISES.filter((ex) =>
      allowedEquip.includes(ex.equipamento) &&
      allowedLevels.includes(ex.nivel) &&
      allowedCategories.includes(ex.categoria)
    );

    // Fallback 1: amplia para as categorias de "full body" se o tipo escolhido for muito restrito
    if (pool.length < 4) {
      pool = EXERCISES.filter((ex) =>
        allowedEquip.includes(ex.equipamento) &&
        allowedLevels.includes(ex.nivel) &&
        TYPE_CATEGORY_MAP.full_body.includes(ex.categoria)
      );
    }

    // Fallback 2: amplia o equipamento para "qualquer" mantendo nível e tipo
    if (pool.length < 4) {
      pool = EXERCISES.filter((ex) =>
        allowedLevels.includes(ex.nivel) &&
        allowedCategories.includes(ex.categoria)
      );
    }

    // Fallback 3: último recurso — qualquer exercício compatível com o nível
    if (pool.length < 3) {
      pool = EXERCISES.filter((ex) => allowedLevels.includes(ex.nivel));
    }

    return pool;
  }

  // Sorteia um exercício da lista com peso maior para categorias
  // alinhadas ao objetivo do usuário, evitando repetir os últimos usados.
  function pickWeightedExercise(pool, recentIds, goal) {
    const priorityCategories = GOAL_PRIORITY_MAP[goal] || [];
    let candidates = pool.filter((ex) => !recentIds.includes(ex.id));
    if (candidates.length === 0) candidates = pool;

    const weighted = [];
    candidates.forEach((ex) => {
      const weight = priorityCategories.includes(ex.categoria) ? 3 : 1;
      for (let i = 0; i < weight; i++) weighted.push(ex);
    });

    return weighted[Math.floor(Math.random() * weighted.length)];
  }

  // Calcula a duração total (em segundos) de uma lista de itens de treino
  function calculateWorkoutDuration(items) {
    return items.reduce((total, item) => total + item.duracao, 0);
  }

  function calorieForItem(item) {
    const perMinute = CALORIES_PER_MINUTE[item.categoria] || 6;
    const multiplier = item.nivel ? (LEVEL_CALORIE_MULTIPLIER[item.nivel] || 1) : 1;
    return (item.duracao / 60) * perMinute * multiplier;
  }

  // Monta a lista completa do treino: aquecimento, exercícios (com descansos), finalização
  function generateWorkout(prefs) {
    const timeMinutes = Number(prefs.time);
    const totalSeconds = timeMinutes * 60;

    let warmup = 0;
    let cooldown = 0;
    if (totalSeconds > 600) {
      warmup = 120;
      cooldown = 120;
    } else if (totalSeconds > 300) {
      warmup = 60;
      cooldown = 60;
    }

    let mainBudget = totalSeconds - warmup - cooldown;
    if (mainBudget < 30) {
      warmup = 0;
      cooldown = 0;
      mainBudget = totalSeconds;
    }

    const restDuration = totalSeconds <= 300 ? 15 : 30;
    const pool = filterExercises(prefs);

    const items = [];

    if (warmup > 0) {
      items.push({
        type: 'aquecimento',
        nome: 'Aquecimento',
        categoria: 'aquecimento',
        nivel: null,
        duracao: warmup,
        instrucao: 'Solte os ombros, gire os braços e ative as pernas com movimentos leves antes de começar.'
      });
    }

    let elapsed = warmup;
    const recentIds = [];
    let sinceRest = 0;
    let safety = 0;

    while (elapsed < warmup + mainBudget - 10 && safety < 60) {
      safety++;
      const exercise = pickWeightedExercise(pool, recentIds, prefs.goal);
      if (!exercise) break;

      items.push({
        type: 'exercise',
        id: exercise.id,
        nome: exercise.nome,
        categoria: exercise.categoria,
        nivel: exercise.nivel,
        duracao: exercise.duracao,
        instrucao: exercise.instrucao,
        musculos: exercise.musculos
      });

      elapsed += exercise.duracao;
      recentIds.push(exercise.id);
      if (recentIds.length > 2) recentIds.shift();
      sinceRest++;

      const remainingBudget = warmup + mainBudget - elapsed;
      if (sinceRest >= 2 && remainingBudget > restDuration + 10) {
        items.push({
          type: 'descanso',
          nome: 'Descanso',
          categoria: 'descanso',
          nivel: null,
          duracao: restDuration,
          instrucao: 'Respire fundo e prepare-se para o próximo exercício.'
        });
        elapsed += restDuration;
        sinceRest = 0;
      }
    }

    if (cooldown > 0) {
      items.push({
        type: 'finalizacao',
        nome: 'Finalização',
        categoria: 'finalizacao',
        nivel: null,
        duracao: cooldown,
        instrucao: 'Desacelere o ritmo, alongue levemente e respire fundo para encerrar com segurança.'
      });
    }

    const totalCalories = items.reduce((sum, item) => sum + calorieForItem(item), 0);

    return {
      prefs: { ...prefs },
      items,
      totalSeconds: calculateWorkoutDuration(items),
      totalCalories: Math.round(totalCalories)
    };
  }

  /* -------------------------------------------------------------------
     10. RENDERIZAÇÃO DO RESULTADO
  ------------------------------------------------------------------- */
  function renderWorkout(workout) {
    const { prefs, items, totalCalories } = workout;
    const timeOpt = OPTIONS.time.find((o) => o.value === prefs.time);
    const typeOpt = OPTIONS.type.find((o) => o.value === prefs.type);
    const levelOpt = OPTIONS.level.find((o) => o.value === prefs.level);
    const timeLabel = timeOpt ? timeOpt.label : `${prefs.time} min`;
    const typeLabel = typeOpt ? typeOpt.label : prefs.type;
    const levelLabel = levelOpt ? levelOpt.label : prefs.level;

    dom.resultTime.textContent = timeLabel.toUpperCase();
    dom.resultType.textContent = typeLabel.toUpperCase();
    dom.resultLevel.textContent = levelLabel.toUpperCase();

    const calLow = Math.max(0, Math.round(totalCalories * 0.85));
    const calHigh = Math.round(totalCalories * 1.15);
    dom.resultCalories.textContent = `${calLow}–${calHigh} kcal`;
    dom.resultFocus.textContent = FOCUS_LABELS[prefs.type] || 'Corpo inteiro';
    dom.resultDuration.textContent = `${prefs.time} minutos`;

    dom.exerciseList.innerHTML = '';
    let exerciseNumber = 0;

    items.forEach((item) => {
      const li = document.createElement('li');
      const isRestLike = item.type !== 'exercise';
      li.className = 'exercise-card' + (isRestLike ? ' is-rest' : '');

      if (item.type === 'exercise') exerciseNumber++;
      const numberLabel = item.type === 'exercise' ? String(exerciseNumber).padStart(2, '0') : '•';
      const categoryLabel = isRestLike ? item.nome : (item.categoria || '').toUpperCase();

      li.innerHTML = `
        <div class="exercise-top">
          <span class="exercise-number">${numberLabel}</span>
          <span class="exercise-name">${item.nome}</span>
        </div>
        <div class="exercise-meta">
          <span class="exercise-category">${categoryLabel}</span>
          <span>🕐 ${formatDuration(item.duracao)}</span>
        </div>
        <p class="exercise-instruction">${item.instrucao}</p>
        <div class="exercise-duration-bar"><div class="exercise-duration-fill" style="width:100%"></div></div>
      `;
      dom.exerciseList.appendChild(li);
    });
  }

  function formatDuration(seconds) {
    if (seconds >= 60) {
      const minutes = Math.round(seconds / 60);
      return `${minutes} min`;
    }
    return `${seconds}s`;
  }

  /* -------------------------------------------------------------------
     11. MODO TREINO / CRONÔMETRO
  ------------------------------------------------------------------- */
  function showWorkoutMode() {
    if (!state.currentWorkout || state.currentWorkout.items.length === 0) return;

    ensureAudioContext();

    state.workoutSession.itemIndex = 0;
    state.workoutSession.isPaused = false;
    state.workoutSession.exercisesTotal = state.currentWorkout.items.length;

    dom.workoutMode.hidden = false;
    loadWorkoutStep(0);
  }

  function loadWorkoutStep(index) {
    const items = state.currentWorkout.items;
    if (index >= items.length) {
      finishWorkout();
      return;
    }

    state.workoutSession.itemIndex = index;
    const item = items[index];

    dom.workoutProgressLabel.textContent = `Exercício ${index + 1} de ${items.length}`;
    dom.workoutProgressFill.style.width = `${(index / items.length) * 100}%`;
    dom.workoutExerciseName.textContent = item.nome.toUpperCase();
    dom.workoutInstruction.textContent = item.instrucao;

    dom.pauseBtn.textContent = 'Pausar';
    startTimer(item.duracao);
  }

  function startTimer(durationSeconds) {
    clearInterval(state.workoutSession.timerId);
    state.workoutSession.remaining = durationSeconds;
    state.workoutSession.duration = durationSeconds;
    state.workoutSession.isPaused = false;

    updateTimerDisplay();

    state.workoutSession.timerId = setInterval(() => {
      state.workoutSession.remaining--;
      updateTimerDisplay();

      if (state.workoutSession.remaining <= 0) {
        clearInterval(state.workoutSession.timerId);
        playBeep();
        nextExercise(false);
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const remaining = Math.max(0, state.workoutSession.remaining);
    const duration = state.workoutSession.duration || 1;
    const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
    const seconds = (remaining % 60).toString().padStart(2, '0');
    dom.workoutTimerValue.textContent = `${minutes}:${seconds}`;

    const progress = 1 - remaining / duration;
    const offset = TIMER_CIRCUMFERENCE * (1 - progress);
    dom.timerRingFg.style.strokeDashoffset = String(offset);
  }

  function pauseTimer() {
    if (state.workoutSession.isPaused) {
      // Continuar
      state.workoutSession.isPaused = false;
      dom.pauseBtn.textContent = 'Pausar';
      state.workoutSession.timerId = setInterval(() => {
        state.workoutSession.remaining--;
        updateTimerDisplay();
        if (state.workoutSession.remaining <= 0) {
          clearInterval(state.workoutSession.timerId);
          playBeep();
          nextExercise(false);
        }
      }, 1000);
    } else {
      state.workoutSession.isPaused = true;
      dom.pauseBtn.textContent = 'Continuar';
      clearInterval(state.workoutSession.timerId);
    }
  }

  function nextExercise(isManual) {
    clearInterval(state.workoutSession.timerId);
    const nextIndex = state.workoutSession.itemIndex + 1;
    loadWorkoutStep(nextIndex);
  }

  function exitWorkoutMode(completed) {
    clearInterval(state.workoutSession.timerId);
    dom.workoutMode.hidden = true;
    if (!completed) {
      showToast('Treino encerrado. Você pode retomar quando quiser.');
    }
  }

  /* -------------------------------------------------------------------
     12. CONCLUSÃO DO TREINO
  ------------------------------------------------------------------- */
  function finishWorkout() {
    clearInterval(state.workoutSession.timerId);
    dom.workoutMode.hidden = true;

    const workout = state.currentWorkout;
    const exercisesCompleted = workout.items.filter((i) => i.type === 'exercise').length;
    const typeOpt = OPTIONS.type.find((o) => o.value === workout.prefs.type);
    const typeLabel = typeOpt ? typeOpt.label : workout.prefs.type;

    dom.completeTime.textContent = `${workout.prefs.time} min`;
    dom.completeExercises.textContent = String(exercisesCompleted);
    dom.completeCalories.textContent = `${workout.totalCalories} kcal`;
    dom.completeType.textContent = typeLabel;

    saveWorkout({
      date: new Date().toISOString(),
      minutes: Number(workout.prefs.time),
      type: typeLabel,
      level: workout.prefs.level,
      goal: workout.prefs.goal,
      calories: workout.totalCalories
    });

    dom.workoutComplete.hidden = false;
    runConfetti();
  }

  function handleGenerateAnother() {
    dom.workoutComplete.hidden = true;
    const workout = generateWorkout(state.prefs);
    state.currentWorkout = workout;
    renderWorkout(workout);
    dom.resultSection.hidden = false;
    dom.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleBackHome() {
    dom.workoutComplete.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Animação de confete simples em canvas, sem bibliotecas externas
  function runConfetti() {
    const canvas = dom.confettiCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;

    const colors = ['#A3FF12', '#7ED321', '#FFFFFF', '#9AA4B2'];
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      size: 4 + Math.random() * 5,
      speedY: 2 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    let frame = 0;
    const maxFrames = 220;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      frame++;
      if (frame < maxFrames && !dom.workoutComplete.hidden) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(draw);
  }

  /* -------------------------------------------------------------------
     13. HISTÓRICO (localStorage)
  ------------------------------------------------------------------- */
  function saveWorkout(entry) {
    const history = readHistory();
    history.unshift(entry);
    const trimmed = history.slice(0, 20);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch (e) {
      // localStorage indisponível (modo privado, etc.) — falha silenciosa
    }
    loadHistory();
  }

  function readHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function loadHistory() {
    const history = readHistory();

    if (history.length === 0) {
      dom.historyContent.innerHTML = `
        <div class="history-empty">
          <h3>Ainda não há treinos por aqui.</h3>
          <p>Seu primeiro TREMPO está esperando por você.</p>
          <button class="btn btn-primary" id="firstWorkoutBtn">Gerar meu primeiro treino</button>
        </div>
      `;
      el('firstWorkoutBtn').addEventListener('click', () => {
        dom.generatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }

    const list = document.createElement('ul');
    list.className = 'history-list';

    history.forEach((entry) => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.innerHTML = `
        <span class="history-day">${formatHistoryDay(entry.date)}</span>
        <span class="history-detail">${entry.minutes} min • ${entry.type} • ${entry.calories} kcal</span>
      `;
      list.appendChild(li);
    });

    dom.historyContent.innerHTML = '';
    dom.historyContent.appendChild(list);
  }

  function formatHistoryDay(isoDate) {
    const date = new Date(isoDate);
    const now = new Date();
    const isSameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (isSameDay(date, now)) return 'Hoje';
    if (isSameDay(date, yesterday)) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  /* -------------------------------------------------------------------
     14. UTILITÁRIOS (toast, áudio)
  ------------------------------------------------------------------- */
  let toastTimeoutId = null;
  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.hidden = false;
    clearTimeout(toastTimeoutId);
    toastTimeoutId = setTimeout(() => {
      dom.toast.hidden = true;
    }, 3200);
  }

  function ensureAudioContext() {
    if (!state.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) state.audioCtx = new AudioContextClass();
    }
  }

  function playBeep() {
    if (!state.audioCtx) return;
    const ctx = state.audioCtx;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.35);
  }

  /* -------------------------------------------------------------------
     15. NAVEGAÇÃO (menu hambúrguer)
  ------------------------------------------------------------------- */
  function toggleNavMenu() {
    const isOpen = dom.navMenu.classList.toggle('is-open');
    dom.navToggle.classList.toggle('is-open', isOpen);
    dom.navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  function closeNavMenu() {
    dom.navMenu.classList.remove('is-open');
    dom.navToggle.classList.remove('is-open');
    dom.navToggle.setAttribute('aria-expanded', 'false');
  }

  /* -------------------------------------------------------------------
     Start
  ------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', init);
})();
