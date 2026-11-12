"""Conteúdo inicial (PT-BR). Editável depois pelo painel Django em /admin."""

LESSONS = [
    # (título, categoria, nível, descrição, minutos)
    ("Postura base e posição de espera", "Fundamentos", "iniciante", "Pés, quadril e olhar: a base de todo movimento na areia.", 8),
    ("Deslocamento na areia", "Fundamentos", "iniciante", "Como andar, correr e frear sem cansar a perna nos primeiros minutos.", 9),
    ("Domínio de bola com o pé", "Toque", "iniciante", "Primeiro contato: amortecer e controlar a bola no peito do pé.", 10),
    ("Toque de peito de pé", "Toque", "iniciante", "A superfície mais usada do jogo. Controle, altura e direção.", 12),
    ("Toque com a coxa", "Toque", "iniciante", "Segurar e redirecionar bolas mais baixas e mais fortes.", 9),
    ("Toque de cabeça", "Toque", "iniciante", "Técnica de cabeceio para passar a bola com segurança.", 11),
    ("Manchete de pé", "Defesa", "iniciante", "Recepção e defesa com o peito do pé ou o peito, em equilíbrio.", 10),
    ("Recepção de saque", "Defesa", "iniciante", "Ler a bola vindo do saque e entregar redonda para o parceiro.", 13),
    ("Saque por baixo", "Saque", "iniciante", "O saque seguro: consistência antes de potência.", 8),
    ("Passe e levantada para o parceiro", "Toque", "iniciante", "Dupla trabalhando: passe ideal para o ataque.", 14),
    ("Troca de bola em dupla", "Fundamentos", "iniciante", "Treino de ritmo: 20 toques seguidos sem deixar cair.", 12),
    ("Leitura de jogo em dupla", "Tática", "iniciante", "Quem pega o quê? Cobertura de quadra no 2x2.", 15),
    ("Chapa na rede", "Ataque", "intermediario", "Ataque de chapa com o peito do pé, firme e colocado.", 12),
    ("Cortada de pé", "Ataque", "intermediario", "Salto, ritmo e acerto: como tirar a bola do bloqueio.", 14),
    ("Saque viagem", "Saque", "intermediario", "Saque com efeito que complica a recepção adversária.", 11),
    ("Defesa de ataque forte", "Defesa", "intermediario", "Posicionamento e reação para recuperar bolas rápidas.", 13),
    ("Peixinho de defesa", "Defesa", "intermediario", "Mergulho controlado: caia na areia sem se machucar.", 10),
    ("Levantada para chapa", "Toque", "intermediario", "Altura e distância certas para o ataque do parceiro.", 12),
    ("Paradinha e largada", "Ataque", "intermediario", "Enganar a defesa com a bola curta atrás do bloqueio.", 9),
    ("Bloqueio com o corpo", "Defesa", "intermediario", "Fechar a diagonal e forçar o erro do ataque.", 10),
    ("Transição defesa-ataque", "Tática", "intermediario", "Defender, levantar, atacar: o ciclo completo do ponto.", 16),
    ("Condicionamento na areia", "Preparação", "intermediario", "Saltos, deslocamentos e core para aguentar o set inteiro.", 20),
    ("Bicicleta", "Ataque", "avancado", "Finalização acrobática com o pé de costas para a rede.", 15),
    ("Shark attack", "Ataque", "avancado", "Ataque de peito de pé em salto com giro, estilo profissional.", 14),
    ("Saque de força", "Saque", "avancado", "Potência com precisão para pontuar direto.", 12),
    ("Defesa de mergulho", "Defesa", "avancado", "Recuperar bolas impossíveis lançando o corpo.", 11),
    ("Sistema tático 2x2 avançado", "Tática", "avancado", "Formações, marcação e trocas para vencer jogos fechados.", 18),
    ("Variação de ataques", "Ataque", "avancado", "Alternar chapa, largada e diagonal para não ser previsível.", 14),
    ("Jogo sob pressão", "Tática", "avancado", "Foco, respiração e decisão nos pontos decisivos.", 13),
    ("Preparação física de competição", "Preparação", "avancado", "Periodização semanal para quem joga torneio.", 22),
]

STEPS = [
    ("01", "Base e postura", "Sem base, nada se sustenta. Aprenda a se posicionar, deslocar e respirar na areia.", "Fundamento"),
    ("02", "Toque e controle", "Pé, peito, coxa e cabeça. A bola obedece quando você entende a superfície.", "Técnica"),
    ("03", "Defesa e saque", "Receba, defenda e coloque a bola em jogo com consistência.", "Jogo"),
    ("04", "Ataque e tática", "Chapa, cortada e leitura de jogo. É aqui que o ponto nasce.", "Evolução"),
]

BENEFITS = [
    ("Do zero, sem medo", "Nunca jogou? As aulas começam pela base e avançam no seu ritmo.", "ball"),
    ("Aulas curtas e diretas", "De 8 a 22 minutos. Cabe na rotina, sem enrolação.", "clock"),
    ("Correção de erros comuns", "Mostramos o erro, a causa e o ajuste. Para de repetir vício.", "target"),
    ("Evolução por nível", "Iniciante, intermediário e avançado. Você sempre sabe o próximo passo.", "stairs"),
    ("Treine onde quiser", "Celular, tablet ou TV. Vídeo aulas para assistir antes de ir pra areia.", "phone"),
    ("Comunidade na areia", "Dupla, treino e jogo: encontre gente para jogar perto de você.", "people"),
]

PLANS = [
    {
        "name": "Essencial", "badge": "", "price_from": "R$ 99,90", "price": "R$ 49,90",
        "installments": "ou 6x de R$ 9,34",
        "features": ["Todas as videoaulas de fundamentos", "Acesso por 12 meses", "Suporte por WhatsApp", "Garantia de 7 dias"],
        "highlight": False, "cta_label": "Quero o Essencial",
    },
    {
        "name": "Completo", "badge": "Mais escolhido", "price_from": "R$ 197,00", "price": "R$ 97,00",
        "installments": "ou 12x de R$ 9,70",
        "features": [
            "Todas as aulas: iniciante ao avançado", "Acesso vitalício e atualizações",
            "Planos de treino semanais", "Correção de técnica por vídeo",
            "Grupo VIP de alunos", "Garantia de 15 dias",
        ],
        "highlight": True, "cta_label": "Quero o Completo",
    },
    {
        "name": "Presencial + Online", "badge": "Premium", "price_from": "", "price": "R$ 249,00/mês",
        "installments": "1 aula presencial por semana",
        "features": ["Tudo do plano Completo", "Aula em quadra com professor", "Feedback ao vivo", "Torneios internos"],
        "highlight": False, "cta_label": "Quero treinar na areia",
    },
]

TESTIMONIALS = [
    ("Rafaela M.", "Aluna iniciante", "Em um mês eu já fazia 20 toques seguidos. Nunca pensei que ia gostar tanto."),
    ("Bruno T.", "Joga aos fins de semana", "A aula de saque viagem mudou meu jogo. Meu parceiro nem acreditou."),
    ("Camila S.", "Aluna intermediária", "Explicação clara, sem enrolação. Treino de manhã e já aplico à tarde."),
    ("Diego A.", "Atleta de torneio", "A parte tática 2x2 foi o que faltava para fechar jogos apertados."),
]

FAQS = [
    ("Preciso saber jogar?", "Não. O curso começa do zero, com postura, toque e controle de bola."),
    ("Funciona no celular?", "Sim. Celular, tablet, notebook ou TV."),
    ("Como recebo o acesso?", "Logo após a confirmação do pagamento, por e-mail e WhatsApp."),
    ("Preciso de quadra?", "Para praticar, o ideal é ter areia. Mas várias aulas funcionam em qualquer espaço com a bola."),
    ("E se eu não gostar?", "Garantia incondicional. Se não gostar, devolvemos seu dinheiro dentro do prazo do plano."),
]
