// ═══════════════════════════════════════════════════════════
//  i18n — FR / EN / PT translations
//  Usage in HTML:
//    <span data-i18n="menu.title">…fallback text…</span>
//    <input data-i18n-placeholder="join.name_placeholder">
//    document.title = t('page.display_title');
// ═══════════════════════════════════════════════════════════

const TRANSLATIONS = {

  // ─── Common ───────────────────────────────────────────────
  'common.back':        { fr:'← Retour',           en:'← Back',           pt:'← Voltar' },
  'common.cancel':      { fr:'Annuler',            en:'Cancel',           pt:'Cancelar' },
  'common.ok':          { fr:'OK',                 en:'OK',               pt:'OK' },
  'common.save':        { fr:'Enregistrer',        en:'Save',             pt:'Guardar' },
  'common.reset':       { fr:'Reset',              en:'Reset',            pt:'Reiniciar' },
  'common.delete':      { fr:'Supprimer',          en:'Delete',           pt:'Apagar' },
  'common.confirm':     { fr:'Confirmer',          en:'Confirm',          pt:'Confirmar' },
  'common.loading':     { fr:'Chargement...',      en:'Loading...',       pt:'A carregar...' },
  'common.connecting':  { fr:'Connexion...',       en:'Connecting...',    pt:'A ligar...' },
  'common.connected':   { fr:'Connecté',           en:'Connected',        pt:'Ligado' },
  'common.offline':     { fr:'Hors ligne',         en:'Offline',          pt:'Sem ligação' },
  'common.saved':       { fr:'✓ Sauvegardé',       en:'✓ Saved',          pt:'✓ Guardado' },
  'common.saving':      { fr:'Sauvegarde...',      en:'Saving...',        pt:'A guardar...' },
  'common.error':       { fr:'Erreur',             en:'Error',            pt:'Erro' },
  'common.chips':       { fr:'jetons',             en:'chips',            pt:'fichas' },
  'common.players':     { fr:'joueurs',            en:'players',          pt:'jogadores' },
  'common.player':      { fr:'joueur',             en:'player',           pt:'jogador' },
  'common.next':        { fr:'Suivant',            en:'Next',             pt:'Seguinte' },

  // ─── Brand / Subtitle ─────────────────────────────────────
  'brand.title':        { fr:'Maison de la Roue',  en:'House of the Wheel', pt:'Casa da Roda' },
  'brand.subtitle':     { fr:'Soirée Casino · Bienvenue', en:'Casino Night · Welcome', pt:'Noite de Casino · Bem-vindos' },
  'brand.table':        { fr:'Table № 1',          en:'Table № 1',        pt:'Mesa № 1' },

  // ─── Menu / Index ─────────────────────────────────────────
  'menu.join.title':    { fr:'Rejoindre la Table', en:'Join the Table',   pt:'Entrar na Mesa' },
  'menu.join.desc':     { fr:'Joueur · Roulette mobile', en:'Player · Mobile roulette', pt:'Jogador · Roleta no telemóvel' },
  'menu.display.title': { fr:'Écran Principal',    en:'Main Display',     pt:'Ecrã Principal' },
  'menu.display.desc':  { fr:'Affichage TV · Table de jeu', en:'TV display · Game table', pt:'Ecrã TV · Mesa de jogo' },
  'menu.rules.title':   { fr:'Règles des Jeux',    en:'Game Rules',       pt:'Regras dos Jogos' },
  'menu.rules.desc':    { fr:'Blackjack · Poker · Roulette', en:'Blackjack · Poker · Roulette', pt:'Blackjack · Poker · Roleta' },
  'menu.coffre.title':  { fr:'Mon Coffre',         en:'My Vault',         pt:'O Meu Cofre' },
  'menu.coffre.desc':   { fr:'Suivi personnel · Sauvegardé', en:'Personal tracker · Saved', pt:'Registo pessoal · Guardado' },
  'menu.leader.title':  { fr:'Classement',         en:'Leaderboard',      pt:'Classificação' },
  'menu.leader.desc':   { fr:'Podium des joueurs · Live TV', en:'Players ranking · Live TV', pt:'Pódio · Em direto' },
  'menu.liar.title':    { fr:"Liar's Bar",         en:"Liar's Bar",       pt:"Liar's Bar" },
  'menu.liar.desc':     { fr:'Bluff & cartes · Grand écran', en:'Bluff & cards · Big screen', pt:'Bluff & cartas · Ecrã grande' },
  'menu.bank.title':    { fr:'La Banque',          en:'The Bank',         pt:'O Banco' },
  'menu.bank.desc':     { fr:'Calculatrice de gains', en:'Winnings calculator', pt:'Calculadora de ganhos' },
  'menu.admin.title':   { fr:'Maître du Jeu',      en:'Game Master',      pt:'Mestre do Jogo' },
  'menu.admin.desc':    { fr:'Panneau Admin · Mot de passe requis', en:'Admin panel · Password required', pt:'Painel Admin · Palavra-passe necessária' },
  'menu.admin.badge':   { fr:'🔒 PROTÉGÉ',         en:'🔒 PROTECTED',     pt:'🔒 PROTEGIDO' },
  'menu.pwd.title':     { fr:'Accès Restreint',    en:'Restricted Access', pt:'Acesso Restrito' },
  'menu.pwd.subtitle':  { fr:'Mot de passe requis', en:'Password required', pt:'Palavra-passe necessária' },
  'menu.pwd.enter':     { fr:'Entrer',             en:'Enter',            pt:'Entrar' },
  'menu.pwd.bad':       { fr:'✗ Mot de passe incorrect', en:'✗ Wrong password', pt:'✗ Palavra-passe errada' },
  'menu.pwd.ok':        { fr:'✓ ACCÈS AUTORISÉ',   en:'✓ ACCESS GRANTED', pt:'✓ ACESSO AUTORIZADO' },

  // ─── Phone (join screen) ──────────────────────────────────
  'phone.join.head':    { fr:'EST. SOIRÉE · SALON PRIVÉ', en:'EST. EVENING · PRIVATE ROOM', pt:'EST. NOITE · SALA PRIVADA' },
  'phone.join.welcome': { fr:'Bienvenue, voyageur. Inscrivez votre nom au registre pour prendre place à la table.',
                          en:'Welcome, voyager. Inscribe your name in the ledger to take a seat at the table.',
                          pt:'Bem-vindo, viajante. Inscreva o seu nome no registo para ocupar um lugar à mesa.' },
  'phone.join.placeholder': { fr:'votre nom',      en:'your name',        pt:'o seu nome' },
  'phone.join.enter':   { fr:'Entrer dans le salon →', en:'Enter the salon →', pt:'Entrar no salão →' },
  'phone.join.warn':    { fr:'Entrez votre nom',   en:'Please enter your name', pt:'Insira o seu nome' },

  // ─── Phone (game) ─────────────────────────────────────────
  'phone.guest':        { fr:'Invité assis',       en:'Seated guest',     pt:'Convidado sentado' },
  'phone.tab.roulette': { fr:'🎰 Roulette',        en:'🎰 Roulette',      pt:'🎰 Roleta' },
  'phone.tab.liar':     { fr:"🃏 Liar's Bar",      en:"🃏 Liar's Bar",    pt:"🃏 Liar's Bar" },
  'phone.phase.open':   { fr:'OUVERT',             en:'OPEN',             pt:'ABERTO' },
  'phone.phase.bet':    { fr:'PLACEZ VOS MISES',   en:'PLACE YOUR BETS',  pt:'FAÇAM AS VOSSAS APOSTAS' },
  'phone.phase.nomore': { fr:'PLUS DE MISES',      en:'NO MORE BETS',     pt:'NÃO HÁ MAIS APOSTAS' },
  'phone.phase.end':    { fr:'TOUR TERMINÉ',       en:'ROUND ENDED',      pt:'RONDA TERMINADA' },
  'phone.waiting':      { fr:'EN ATTENTE DU PROCHAIN TOUR', en:'WAITING FOR NEXT ROUND', pt:'A AGUARDAR PRÓXIMA RONDA' },
  'phone.recent':       { fr:'NUMÉROS RÉCENTS',   en:'RECENT NUMBERS',   pt:'NÚMEROS RECENTES' },
  'phone.none_yet':     { fr:'AUCUN POUR LE MOMENT', en:'NONE YET',      pt:'AINDA NENHUM' },
  'phone.chip.wager':   { fr:'Jeton à miser',      en:'Chip to wager',    pt:'Ficha a apostar' },
  'phone.outside':      { fr:'Mises extérieures',  en:'Outside bets',     pt:'Apostas externas' },
  'phone.straight':     { fr:'Numéro plein · Paie 35:1', en:'Straight up · Pays 35:1', pt:'Número pleno · Paga 35:1' },
  'phone.your_bets':    { fr:'Vos mises ce tour',  en:'Your wagers this round', pt:'As suas apostas desta ronda' },
  'phone.next_wager':   { fr:'Prochaine mise',     en:'Next wager',       pt:'Próxima aposta' },
  'phone.tap_bet':      { fr:'· choisissez un type', en:'· tap a bet to place', pt:'· escolha uma aposta' },
  'phone.undo':         { fr:'Annuler',            en:'Undo',             pt:'Anular' },
  'phone.spin':         { fr:'Lancer',             en:'Spin',             pt:'Girar' },
  'phone.next_round':   { fr:'Tour suivant',       en:'Next round',       pt:'Próxima ronda' },
  'phone.closed':       { fr:'Mises fermées',      en:'Betting is closed', pt:'Apostas fechadas' },
  'phone.no_chips':     { fr:'Pas assez de jetons', en:'Not enough chips', pt:'Fichas insuficientes' },
  'phone.bet_first':    { fr:'Placez au moins une mise', en:'Place at least one bet first', pt:'Faça pelo menos uma aposta' },
  // Bet labels
  'bet.red':            { fr:'Rouge',              en:'Red',              pt:'Vermelho' },
  'bet.black':          { fr:'Noir',               en:'Black',            pt:'Preto' },
  'bet.even':           { fr:'Pair',               en:'Even',             pt:'Par' },
  'bet.odd':            { fr:'Impair',             en:'Odd',              pt:'Ímpar' },
  'bet.low':            { fr:'1 – 18',             en:'1 – 18',           pt:'1 – 18' },
  'bet.high':           { fr:'19 – 36',            en:'19 – 36',          pt:'19 – 36' },
  'bet.dozen1':         { fr:'1ère 12',            en:'1st 12',           pt:'1ª dúzia' },
  'bet.dozen2':         { fr:'2ème 12',            en:'2nd 12',           pt:'2ª dúzia' },
  'bet.dozen3':         { fr:'3ème 12',            en:'3rd 12',           pt:'3ª dúzia' },
  'bet.col1':           { fr:'Col. I',             en:'Col. I',           pt:'Col. I' },
  'bet.col2':           { fr:'Col. II',            en:'Col. II',          pt:'Col. II' },
  'bet.col3':           { fr:'Col. III',           en:'Col. III',         pt:'Col. III' },
  'bet.pays11':         { fr:'PAIE 1:1',           en:'PAYS 1:1',         pt:'PAGA 1:1' },
  'bet.pays21':         { fr:'PAIE 2:1',           en:'PAYS 2:1',         pt:'PAGA 2:1' },

  // ─── Display (roulette TV) ────────────────────────────────
  'disp.phase.bet':     { fr:'PLACEZ VOS MISES',   en:'PLACE YOUR BETS',  pt:'FAÇAM AS APOSTAS' },
  'disp.phase.spin':    { fr:'PLUS DE MISES',      en:'NO MORE BETS',     pt:'NÃO HÁ MAIS APOSTAS' },
  'disp.phase.end':     { fr:'TOUR TERMINÉ',       en:'ROUND ENDED',      pt:'RONDA TERMINADA' },
  'disp.join':          { fr:'◆ Rejoignez depuis votre téléphone', en:'◆ Join from your phone', pt:'◆ Entre pelo seu telemóvel' },
  'disp.same_wifi':     { fr:'Tout téléphone sur le même WiFi', en:'Any phone on the same WiFi', pt:'Qualquer telemóvel na mesma WiFi' },
  'disp.players_at':    { fr:'◆ Joueurs à la table', en:'◆ Players at the table', pt:'◆ Jogadores à mesa' },
  'disp.awaiting':      { fr:'En attente des invités…', en:'Awaiting guests…', pt:'A aguardar convidados…' },
  'disp.scan_qr':       { fr:'📷 Scanne avec ta caméra', en:'📷 Scan with your camera', pt:'📷 Lê com a câmara' },

  // Mini-games
  'games.idle':         { fr:'L\'hôte démarrera bientôt un jeu…', en:'The host will start a game soon…', pt:'O anfitrião vai começar um jogo em breve…' },
  'games.idle_badge':   { fr:'EN ATTENTE',         en:'IDLE',             pt:'EM ESPERA' },
  'games.betting':      { fr:'MISES OUVERTES',     en:'BETS OPEN',        pt:'APOSTAS ABERTAS' },
  'games.spinning':     { fr:'EN COURS',           en:'IN PROGRESS',      pt:'EM CURSO' },
  'games.result':       { fr:'RÉSULTAT',           en:'RESULT',           pt:'RESULTADO' },
  'games.pot':          { fr:'CAGNOTTE',           en:'POT',              pt:'POTE' },
  'games.bets':         { fr:'MISES',              en:'BETS',             pt:'APOSTAS' },
  'games.chips':        { fr:'jetons',             en:'chips',            pt:'fichas' },
  'games.win':          { fr:'GAGNÉ',              en:'WIN',              pt:'GANHOU' },
  'games.miss':         { fr:'Pas de chance',      en:'No luck',          pt:'Sem sorte' },
  'games.no_winner':    { fr:'Aucun gagnant',      en:'No winner',        pt:'Sem vencedor' },
  'games.takes_pot':    { fr:'Prend la cagnotte',  en:'Takes the pot',    pt:'Leva o pote' },
  'games.target':       { fr:'Cible',              en:'Target',           pt:'Alvo' },
  'games.distance':     { fr:'Écart',              en:'Distance',         pt:'Distância' },
  'games.slot.title':   { fr:'Machine à sous',     en:'Slot machine',     pt:'Slot' },
  'games.lucky.title':  { fr:'Numéro chanceux',    en:'Lucky number',     pt:'Número da sorte' },
  'games.lucky.target': { fr:'CIBLE 1–100',        en:'TARGET 1–100',     pt:'ALVO 1–100' },
  'games.war.title':    { fr:'Bataille',           en:'War',              pt:'Batalha' },
  'games.horse.title':  { fr:'Course de chevaux',  en:'Horse Race',       pt:'Corrida de Cavalos' },
  'games.winners':      { fr:'Gagnants',           en:'Winners',          pt:'Vencedores' },
  // Phone-side
  'phone.games.tab':    { fr:'Jeux',               en:'Games',            pt:'Jogos' },
  'phone.games.none':   { fr:'Aucun jeu en cours. L\'hôte va en lancer un.', en:'No game running. The host will start one.', pt:'Sem jogo a decorrer. O anfitrião vai começar um.' },
  'phone.games.bet_lbl':{ fr:'Ta mise',            en:'Your bet',         pt:'A tua aposta' },
  'phone.games.pick_lbl':{fr:'Ton numéro (1-100)', en:'Your number (1-100)', pt:'O teu número (1-100)' },
  'phone.games.pick_horse':{fr:'Ton cheval',       en:'Your horse',       pt:'O teu cavalo' },
  'phone.games.pick_horse_warn':{fr:'Choisis un cheval !', en:'Pick a horse!', pt:'Escolhe um cavalo!' },
  'phone.games.place':  { fr:'Placer la mise',     en:'Place bet',        pt:'Apostar' },
  'phone.games.placed': { fr:'Mise placée',        en:'Bet placed',       pt:'Aposta feita' },
  'phone.games.update': { fr:'Modifier',           en:'Update',           pt:'Modificar' },
  'phone.games.waiting':{ fr:'En attente du résultat…', en:'Waiting for result…', pt:'A aguardar resultado…' },
  'phone.games.you_won':{ fr:'TU AS GAGNÉ',        en:'YOU WON',          pt:'GANHASTE' },
  'phone.games.you_lost':{fr:'Pas cette fois…',    en:'Not this time…',   pt:'Desta vez não…' },
  'phone.games.your_card':{fr:'Ta carte',          en:'Your card',        pt:'A tua carta' },
  // Admin
  'admin.games':        { fr:'Mini-jeux',          en:'Mini-games',       pt:'Mini-jogos' },
  'admin.games.start_slot':{fr:'Lancer Slot',      en:'Start Slot',       pt:'Iniciar Slot' },
  'admin.games.start_lucky':{fr:'Lancer Lucky',    en:'Start Lucky',      pt:'Iniciar Lucky' },
  'admin.games.start_war':{fr:'Lancer Bataille',   en:'Start War',        pt:'Iniciar Batalha' },
  'admin.games.start_horse':{fr:'Lancer Course',   en:'Start Race',       pt:'Iniciar Corrida' },
  'admin.games.resolve':{ fr:'Résoudre',           en:'Resolve',          pt:'Resolver' },
  'admin.games.end':    { fr:'Terminer',           en:'End',              pt:'Terminar' },
  'admin.games.current':{ fr:'Jeu actuel',         en:'Current game',     pt:'Jogo atual' },
  'phone.join.pick_avatar':{fr:'Choisis ton avatar', en:'Choose your avatar', pt:'Escolhe o teu avatar' },
  'menu.games.title':   { fr:'Salle des Jeux',     en:'Games Room',       pt:'Sala de Jogos' },
  'menu.games.desc':    { fr:'Slot · Lucky · Bataille · TV', en:'Slot · Lucky · War · TV', pt:'Slot · Lucky · Batalha · TV' },
  'disp.recent_spins':  { fr:'◆ Tirages récents',  en:'◆ Recent spins',   pt:'◆ Tiragens recentes' },
  'disp.closed':        { fr:'ROUND FERMÉ',        en:'ROUND CLOSED',     pt:'RONDA FECHADA' },

  // ─── Coffre (vault) ───────────────────────────────────────
  'coffre.title':       { fr:'Mon Coffre',         en:'My Vault',         pt:'O Meu Cofre' },
  'coffre.subtitle':    { fr:'Suivi personnel des jetons', en:'Personal chip tracker', pt:'Registo pessoal de fichas' },
  'coffre.name_ph':     { fr:'Votre nom',          en:'Your name',        pt:'O seu nome' },
  'coffre.total':       { fr:'TOTAL EN MAIN',      en:'TOTAL ON HAND',    pt:'TOTAL EM MÃO' },
  'coffre.chip_count':  { fr:'jetons au total',    en:'chips total',      pt:'fichas no total' },
  'coffre.chip_count_one': { fr:'jeton au total',  en:'chip total',       pt:'ficha no total' },
  'coffre.in_vault':    { fr:'◆ Dans votre coffre', en:'◆ In your vault', pt:'◆ No seu cofre' },
  'coffre.chip.white':  { fr:'Blancs',             en:'Whites',           pt:'Brancos' },
  'coffre.chip.red':    { fr:'Rouges',             en:'Reds',             pt:'Vermelhos' },
  'coffre.chip.blue':   { fr:'Bleus',              en:'Blues',            pt:'Azuis' },
  'coffre.chip.green':  { fr:'Verts',              en:'Greens',           pt:'Verdes' },
  'coffre.chip.black':  { fr:'Noirs',              en:'Blacks',           pt:'Pretos' },
  'coffre.clear_hist':  { fr:'🗑️ Effacer Historique', en:'🗑️ Clear History', pt:'🗑️ Limpar Histórico' },
  'coffre.reset':       { fr:'🔄 Reset',           en:'🔄 Reset',         pt:'🔄 Reiniciar' },
  'coffre.save_snap':   { fr:"📸 Enregistrer dans l'Historique", en:'📸 Save to History', pt:'📸 Guardar no Histórico' },
  'coffre.history':     { fr:'📜 Historique',      en:'📜 History',       pt:'📜 Histórico' },
  'coffre.empty_hist':  { fr:'Aucun enregistrement', en:'No entries yet', pt:'Sem registos' },
  'coffre.confirm_reset': { fr:'Remettre tous les jetons à 0 ?', en:'Reset all chips to 0?', pt:'Repor todas as fichas a 0?' },
  'coffre.confirm_clear': { fr:"Effacer tout l'historique ?", en:'Clear all history?', pt:'Apagar todo o histórico?' },

  // ─── Leaderboard ──────────────────────────────────────────
  'leader.title':       { fr:'Classement',         en:'Leaderboard',      pt:'Classificação' },
  'leader.subtitle':    { fr:'En direct · Mis à jour automatiquement', en:'Live · Auto-updated', pt:'Em direto · Atualização automática' },
  'leader.players':     { fr:'JOUEURS',            en:'PLAYERS',          pt:'JOGADORES' },
  'leader.total_chips': { fr:'TOTAL DES JETONS',   en:'TOTAL CHIPS',      pt:'TOTAL DE FICHAS' },
  'leader.empty':       { fr:'En attente des premiers comptes...', en:'Awaiting first entries...', pt:'A aguardar os primeiros registos...' },
  'leader.open_vault':  { fr:'Ouvrez "Mon Coffre" sur votre téléphone', en:'Open "My Vault" on your phone', pt:'Abra "O Meu Cofre" no seu telemóvel' },
  'leader.podium_only': { fr:'✨ Que des champions au podium !', en:'✨ Only champions on the podium!', pt:'✨ Só campeões no pódio!' },
  'leader.auto':        { fr:'↻ Mise à jour automatique', en:'↻ Auto-update', pt:'↻ Atualização automática' },
  'leader.chip_phys':   { fr:'jetons physiques',   en:'physical chips',   pt:'fichas físicas' },
  'leader.chip_phys_one': { fr:'jeton physique',   en:'physical chip',    pt:'ficha física' },

  // ─── Bank (banque) ────────────────────────────────────────
  'bank.title':         { fr:'La Banque',          en:'The Bank',         pt:'O Banco' },
  'bank.subtitle':      { fr:'Calculatrice de gains', en:'Winnings calculator', pt:'Calculadora de ganhos' },
  'bank.your_bet':      { fr:'Votre mise',         en:'Your bet',         pt:'A sua aposta' },
  'bank.bet_type':      { fr:'Type de pari',       en:'Bet type',         pt:'Tipo de aposta' },
  'bank.result':        { fr:'Gain potentiel',     en:'Potential winnings', pt:'Ganho potencial' },
  'bank.you_win':       { fr:'Vous gagnez',        en:'You win',          pt:'Ganha' },
  'bank.total_back':    { fr:'Total récupéré',     en:'Total returned',   pt:'Total devolvido' },
  'bank.calculate':     { fr:'Calculer',           en:'Calculate',        pt:'Calcular' },

  // ─── Admin ────────────────────────────────────────────────
  'admin.title':        { fr:'Panneau Maître du Jeu (Secret)', en:'Game Master Panel (Secret)', pt:'Painel Mestre do Jogo (Secreto)' },
  'admin.logout':       { fr:'Déconnexion',        en:'Log out',          pt:'Terminar sessão' },
  'admin.mode':         { fr:'⚙️ MODE DE JEU',     en:'⚙️ GAME MODE',     pt:'⚙️ MODO DE JOGO' },
  'admin.mode.virtual': { fr:'Virtuel (Auto-Spin & Timer)', en:'Virtual (Auto-Spin & Timer)', pt:'Virtual (Auto e Temporizador)' },
  'admin.mode.real':    { fr:'Roulette Réelle (Saisie Manuelle)', en:'Real Roulette (Manual Entry)', pt:'Roleta Real (Inserir Manualmente)' },
  'admin.force':        { fr:'🏁 FORCER LE TIRAGE (Virtuel)', en:'🏁 FORCE SPIN (Virtual)', pt:'🏁 FORÇAR TIRAGEM (Virtual)' },
  'admin.submit':       { fr:'🎯 SAISIR LE RÉSULTAT (Réel)', en:'🎯 ENTER RESULT (Real)', pt:'🎯 INSERIR RESULTADO (Real)' },
  'admin.tap_winner':   { fr:'Tapez le numéro sorti :', en:'Tap the winning number:', pt:'Toque no número sorteado:' },
  'admin.confirm_n':    { fr:'Le numéro gagnant est bien le %N% ?', en:'Confirm winning number is %N%?', pt:'Confirmar número vencedor %N%?' },
  'admin.state':        { fr:'ÉTAT ACTUEL',        en:'CURRENT STATE',    pt:'ESTADO ATUAL' },
  'admin.phase':        { fr:'Phase',              en:'Phase',            pt:'Fase' },
  'admin.timer':        { fr:'Timer',              en:'Timer',            pt:'Temporizador' },
  'admin.players_h':    { fr:'JOUEURS',            en:'PLAYERS',          pt:'JOGADORES' },
  'admin.no_players':   { fr:'Aucun joueur',       en:'No players',       pt:'Sem jogadores' },
  'admin.kick':         { fr:'Exclure',            en:'Kick',             pt:'Expulsar' },
  'admin.confirm_kick': { fr:'Expulser ?',         en:'Kick this player?', pt:'Expulsar este jogador?' },
  'admin.real_wait':    { fr:'Mode Réel (Attente Admin)', en:'Real Mode (Awaiting Admin)', pt:'Modo Real (À espera do Admin)' },
  'admin.lock.title':   { fr:'🔒 ACCÈS REFUSÉ',    en:'🔒 ACCESS DENIED', pt:'🔒 ACESSO NEGADO' },
  'admin.lock.desc':    { fr:"Vous devez vous authentifier depuis le menu principal.",
                          en:'You must authenticate from the main menu.',
                          pt:'Tem de se autenticar pelo menu principal.' },
  'admin.lock.back':    { fr:'← Retour au Menu',   en:'← Back to Menu',   pt:'← Voltar ao Menu' },
  'admin.denied':       { fr:'Accès refusé par le serveur', en:'Access denied by server', pt:'Acesso negado pelo servidor' },

  // ─── Rules page ───────────────────────────────────────────
  'rules.title':        { fr:'Règles des Jeux',    en:'Game Rules',       pt:'Regras dos Jogos' },
  'rules.intro':        { fr:'Un récapitulatif rapide des trois jeux ce soir.',
                          en:'A quick refresher on tonight\'s three games.',
                          pt:'Um resumo rápido dos três jogos desta noite.' },
  'rules.roulette.h':   { fr:'🎰 Roulette',        en:'🎰 Roulette',      pt:'🎰 Roleta' },
  'rules.roulette.b':   { fr:'Misez sur un numéro (0–36), une couleur, pair/impair, ou une plage. Le croupier lance la roue. Vous gagnez si la bille s\'arrête sur votre mise.',
                          en:'Bet on a number (0–36), a color, even/odd, or a range. The dealer spins the wheel. You win if the ball lands on your bet.',
                          pt:'Aposte num número (0–36), numa cor, par/ímpar ou intervalo. O croupier gira a roda. Ganha se a bola parar na sua aposta.' },
  'rules.blackjack.h':  { fr:'🃏 Blackjack',       en:'🃏 Blackjack',     pt:'🃏 Blackjack' },
  'rules.blackjack.b':  { fr:'Approchez-vous au plus près de 21 sans dépasser. Les figures valent 10, les As valent 1 ou 11. Battez le croupier sans exploser.',
                          en:'Get as close to 21 as possible without going over. Face cards = 10, Aces = 1 or 11. Beat the dealer without busting.',
                          pt:'Aproxime-se de 21 sem ultrapassar. As figuras valem 10, o Ás vale 1 ou 11. Vença o croupier sem rebentar.' },
  'rules.poker.h':      { fr:'♠ Poker',            en:'♠ Poker',          pt:'♠ Poker' },
  'rules.poker.b':      { fr:'Texas Hold\'em : deux cartes en main, cinq cartes communes. Misez, relancez, suivez ou couchez-vous. La meilleure main de cinq cartes gagne.',
                          en:"Texas Hold'em: two cards in hand, five community cards. Bet, raise, call, or fold. Best five-card hand wins.",
                          pt:"Texas Hold'em: duas cartas na mão, cinco cartas comuns. Aposte, suba, iguale ou desista. A melhor mão de cinco cartas vence." },
  'rules.liar.h':       { fr:"🔫 Liar's Bar",      en:"🔫 Liar's Bar",    pt:"🔫 Liar's Bar" },
  'rules.liar.b':       { fr:"5 cartes en main : As, Roi, Dame, Valet. À votre tour, jouez 1 à 4 cartes face cachée en annonçant un rang. Le suivant croit ou crie BLUFF ! Le perdant doit tirer sur lui-même avec un revolver à 6 chambres dont une chargée.",
                          en:"5 cards in hand: Ace, King, Queen, Jack. On your turn, play 1–4 cards face-down declaring a rank. The next player believes you or calls BLUFF! The loser must shoot themselves with a 6-chamber revolver, one bullet loaded.",
                          pt:"5 cartas na mão: Ás, Rei, Dama, Valete. Na sua vez, jogue 1 a 4 cartas viradas para baixo declarando uma carta. O próximo acredita ou grita BLUFF! O perdedor tem de disparar contra si mesmo com um revólver de 6 câmaras, uma com bala." },

  // ─── Liar's Bar (Steam rules) ─────────────────────────────
  'liar.lobby.title':   { fr:"Liar's Bar",         en:"Liar's Bar",       pt:"Liar's Bar" },
  'liar.lobby.sub':     { fr:'Bluff. Nerfs. Et un revolver chargé.', en:'Bluff. Nerve. And a loaded revolver.', pt:'Bluff. Nervos. E um revólver carregado.' },
  'liar.lobby.join':    { fr:'Rejoindre la table', en:'Join the table',   pt:'Entrar na mesa' },
  'liar.lobby.start':   { fr:'Démarrer la partie', en:'Start the game',   pt:'Começar o jogo' },
  'liar.lobby.need2':   { fr:'Au moins 2 joueurs requis', en:'At least 2 players required', pt:'São necessários pelo menos 2 jogadores' },
  'liar.lobby.players_at': { fr:'À la table : ',  en:'At the table: ',   pt:'À mesa: ' },
  'liar.lobby.nobody':  { fr:'Personne n\'est encore à table — les téléphones doivent rejoindre !',
                          en:'No one at the table yet — phones need to join!',
                          pt:'Ninguém à mesa ainda — os telemóveis têm de entrar!' },
  'liar.rules.h':       { fr:'Comment jouer',     en:'How to play',      pt:'Como jogar' },
  'liar.rules.1':       { fr:'Chacun reçoit 5 cartes (réelles) : As, Roi, Dame, Valet',
                          en:'Everyone gets 5 (real) cards: Ace, King, Queen, Jack',
                          pt:'Cada um recebe 5 cartas (reais): Ás, Rei, Dama, Valete' },
  'liar.rules.2':       { fr:'À votre tour, posez 1 à 4 cartes face cachée et annoncez un rang',
                          en:'On your turn, play 1–4 cards face down and declare a rank',
                          pt:'Na sua vez, jogue 1 a 4 cartas viradas para baixo e declare uma carta' },
  'liar.rules.3':       { fr:'Le suivant CROIT (passe) ou crie BLUFF !',
                          en:'Next player BELIEVES (passes) or calls BLUFF!',
                          pt:'O próximo ACREDITA (passa) ou grita BLUFF!' },
  'liar.rules.4':       { fr:'Si BLUFF : on retourne les cartes. Quelqu\'un perd la manche.',
                          en:'On BLUFF: cards are revealed. Someone loses the round.',
                          pt:'Em BLUFF: revelam-se as cartas. Alguém perde a ronda.' },
  'liar.rules.5':       { fr:'🔫 Le perdant tire au revolver : 6 chambres, 1 balle au hasard',
                          en:'🔫 The loser pulls the trigger: 6 chambers, 1 random bullet',
                          pt:'🔫 O perdedor puxa o gatilho: 6 câmaras, 1 bala ao acaso' },
  'liar.rules.6':       { fr:'CLIC = vivant, on continue. BANG = éliminé !',
                          en:'CLICK = alive, game continues. BANG = eliminated!',
                          pt:'CLIQUE = vivo, continua. BANG = eliminado!' },
  'liar.rules.7':       { fr:'Dernier survivant = vainqueur 🏆',
                          en:'Last survivor wins 🏆',
                          pt:'Último sobrevivente vence 🏆' },

  // gameplay UI
  'liar.current_rank':  { fr:'Rang à annoncer',    en:'Current rank',     pt:'Carta atual' },
  'liar.turn':          { fr:'À jouer',            en:"Whose turn",       pt:'Vez de' },
  'liar.your_turn':        { fr:'C\'est ton tour !',   en:'Your turn!',         pt:'É a tua vez!' },
  'liar.card_to_play':  { fr:'Carte à jouer',      en:'Card to play',     pt:'Carta a jogar' },
  'liar.chambers_left': { fr:'chambres restantes', en:'chambers left',    pt:'câmaras restantes' },
  'liar.done_playing':     { fr:'✅  J\'ai joué',       en:'✅  Done playing',    pt:'✅  Joguei' },
  'liar.playing_now':      { fr:'EN TRAIN DE JOUER',   en:'NOW PLAYING',        pt:'A JOGAR AGORA' },
  'liar.call_liar_anytime':{ fr:'Crie LIAR sur n\'importe qui, n\'importe quand', en:'Call LIAR on anyone, anytime', pt:'Chama LIAR a qualquer um, a qualquer momento' },
  'liar.play_n':           { fr:'Jouer %N% carte(s)',  en:'Play %N% card(s)',   pt:'Jogar %N% carta(s)' },
  'liar.tap_count':     { fr:'Combien de cartes posez-vous ?', en:'How many cards are you playing?', pt:'Quantas cartas vai jogar?' },
  'liar.play_n':        { fr:'Jouer %N% carte(s)',  en:'Play %N% card(s)', pt:'Jogar %N% carta(s)' },
  'liar.waiting':       { fr:'En attente de',      en:'Waiting for',      pt:'À espera de' },
  'liar.table_says':    { fr:'a annoncé',          en:'claims',           pt:'declara' },
  'liar.believe':       { fr:'✓ JE CROIS',         en:'✓ I BELIEVE',      pt:'✓ ACREDITO' },
  'liar.bluff':         { fr:'⚡ BLUFF !',          en:'⚡ BLUFF!',         pt:'⚡ BLUFF!' },
  'liar.who_lost':      { fr:'Qui a perdu la manche ?', en:'Who lost the round?', pt:'Quem perdeu a ronda?' },
  'liar.who_lost_sub':  { fr:'Tapez sur la personne qui doit tirer.', en:'Tap the person who must pull the trigger.', pt:'Toque na pessoa que tem de puxar o gatilho.' },
  // revolver
  'liar.revolver':      { fr:'LE REVOLVER',        en:'THE REVOLVER',     pt:'O REVÓLVER' },
  'liar.must_pull':     { fr:'doit tirer',         en:'must pull',        pt:'tem de puxar' },
  'liar.pull_btn':      { fr:'🔫 TIRER',           en:'🔫 PULL TRIGGER',  pt:'🔫 PUXAR' },
  'liar.chambers':      { fr:'Chambres',           en:'Chambers',         pt:'Câmaras' },
  'liar.bullet_risk':   { fr:'Risque',             en:'Risk',             pt:'Risco' },
  'liar.point_chin':    { fr:'📱 Place le téléphone vertical sous ton menton', en:'📱 Hold phone vertical under your chin', pt:'📱 Põe o telemóvel vertical sob o queixo' },
  'liar.hold_still':    { fr:'Ne bouge plus…',     en:'Hold still…',      pt:'Não te mexas…' },
  'liar.armed':         { fr:'ARMÉ — accroche-toi', en:'ARMED — hold on',  pt:'ARMADO — aguenta' },
  'liar.firing':        { fr:'FEU !',              en:'FIRING!',          pt:'FOGO!' },
  'liar.round':         { fr:'Tour',               en:'Round',            pt:'Ronda' },
  'liar.last_bullet':   { fr:'⚠ MOMENT CRITIQUE ⚠', en:'⚠ CRITICAL MOMENT ⚠', pt:'⚠ MOMENTO CRÍTICO ⚠' },
  'liar.timeout_in':    { fr:'Tir auto dans',      en:'Auto-fire in',     pt:'Disparo auto em' },
  'liar.enable_motion': { fr:'Activer les capteurs', en:'Enable motion sensors', pt:'Ativar sensores' },
  'liar.click':         { fr:'CLIC ! Vivant.',     en:'CLICK! Alive.',    pt:'CLIQUE! Vivo.' },
  'liar.bang':          { fr:'💀 BANG ! Éliminé.', en:'💀 BANG! Eliminated.', pt:'💀 BANG! Eliminado.' },
  'liar.next_round':    { fr:'Tour suivant',       en:'Next round',       pt:'Próxima ronda' },
  'liar.eliminated':    { fr:'Éliminé',            en:'Eliminated',       pt:'Eliminado' },
  'liar.alive':         { fr:'En vie',             en:'Alive',            pt:'Vivo' },
  'liar.winner':        { fr:'VAINQUEUR',          en:'WINNER',           pt:'VENCEDOR' },
  'liar.game_over':     { fr:'Partie terminée',    en:'Game over',        pt:'Jogo terminado' },
  'liar.new_game':      { fr:'Nouvelle partie',    en:'New game',         pt:'Novo jogo' },
  'liar.confirm_reset': { fr:'Démarrer une nouvelle partie ?', en:'Start a new game?', pt:'Começar um novo jogo?' },

  // log lines (server uses keys with placeholders)
  'liar.log.start':     { fr:'Partie démarrée ! Premier rang : %R%', en:'Game started! First rank: %R%', pt:'Jogo começou! Primeira carta: %R%' },
  'liar.log.played':    { fr:'%P% a joué ses cartes', en:'%P% played their cards', pt:'%P% jogou as cartas' },
  'liar.log.play':      { fr:'%P% joue %N% carte(s) — annonce %N%× %R%', en:'%P% plays %N% card(s) — claims %N%× %R%', pt:'%P% joga %N% carta(s) — declara %N%× %R%' },
  'liar.log.believe':   { fr:'%P% croit — au tour suivant !', en:'%P% believes — next turn!', pt:'%P% acredita — próxima vez!' },
  'liar.log.bluff':     { fr:'%P% crie LIAR sur %P2% !', en:'%P% calls LIAR on %P2%!', pt:'%P% grita LIAR a %P2%!' },
  'liar.log.lost':      { fr:'%P% a perdu la manche et doit tirer', en:'%P% lost the round and must shoot', pt:'%P% perdeu a ronda e tem de disparar' },
  'liar.log.click':     { fr:'CLIC ! %P% est en vie.', en:'CLICK! %P% is alive.', pt:'CLIQUE! %P% está vivo.' },
  'liar.log.bang':      { fr:'💀 BANG ! %P% est éliminé.', en:'💀 BANG! %P% is eliminated.', pt:'💀 BANG! %P% foi eliminado.' },
  'liar.log.win':       { fr:'🏆 %P% remporte la partie !', en:'🏆 %P% wins the game!', pt:'🏆 %P% vence o jogo!' },

  // ─── Footer ───────────────────────────────────────────────
  'foot.tagline':       { fr:'◆ Maison de la Roue · Table № 1 ◆', en:'◆ House of the Wheel · Table № 1 ◆', pt:'◆ Casa da Roda · Mesa № 1 ◆' },
};

// ═══════════════════════════════════════════════════════════
//  Helpers
// ═══════════════════════════════════════════════════════════
const I18N = {
  current: 'fr',

  init() {
    const saved = localStorage.getItem('lang');
    if (saved === 'fr' || saved === 'en' || saved === 'pt') this.current = saved;
    this.apply();
  },

  set(lang) {
    if (!['fr','en','pt'].includes(lang)) return;
    this.current = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    this.apply();
    // notify listeners
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  },

  t(key, vars) {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    let s = entry[this.current] || entry.fr || key;
    if (vars) {
      for (const k of Object.keys(vars)) {
        s = s.replace(new RegExp('%' + k + '%', 'g'), vars[k]);
      }
    }
    return s;
  },

  apply() {
    document.documentElement.lang = this.current;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = this.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', this.t(key));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.setAttribute('title', this.t(key));
    });
    if (document.querySelector('[data-i18n-doctitle]')) {
      const key = document.querySelector('[data-i18n-doctitle]').getAttribute('data-i18n-doctitle');
      document.title = this.t(key);
    }
  },
};

// Expose a tiny global `t()` for convenience
function t(key, vars) { return I18N.t(key, vars); }

if (typeof window !== 'undefined') {
  window.I18N = I18N;
  window.t = t;
}
