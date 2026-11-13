"""Conteúdo inicial (PT-BR). Editável depois pelo painel Django em /admin."""

LESSONS = [
    # (título, categoria, nível, descrição, minutos)
    ("Postura base e posição de espera", "Fundamentos", "iniciante", "Pés, quadril e olhar: a base de todo movimento na areia.", 5),
    ("Deslocamento na areia", "Fundamentos", "iniciante", "Como andar, correr e frear sem cansar a perna.", 6),
    ("Domínio de bola com o pé", "Toque", "iniciante", "Primeiro contato: amortecer e controlar a bola.", 7),
    ("Toque de peito de pé", "Toque", "iniciante", "A superfície mais usada do jogo. Controle, altura e direção.", 8),
    ("Toque com o ombro", "Toque", "iniciante", "Segurar e redirecionar bolas mais baixas.", 6),
    ("Toque de cabeça", "Toque", "iniciante", "Cabeceio para passar a bola com segurança.", 7),
    ("Recepção de peito", "Defesa", "iniciante", "Amortecer a bola no peito e deixar pronta para o parceiro.", 7),
    ("Recepção de saque", "Defesa", "iniciante", "Ler a bola do saque e entregar redonda.", 8),
    ("Saque por baixo", "Saque", "iniciante", "O saque seguro: consistência antes de potência.", 5),
    ("Levantada para o parceiro", "Toque", "iniciante", "O passe ideal para o ataque da dupla.", 8),
    ("Troca de bola em dupla", "Fundamentos", "iniciante", "Ritmo: 20 toques seguidos sem deixar cair.", 9),
    ("Leitura de jogo em dupla", "Tática", "iniciante", "Quem pega o quê? Cobertura de quadra no 2x2.", 10),
    ("Chapa na rede", "Ataque", "intermediario", "Ataque de chapa, firme e colocado.", 8),
    ("Ataque de pé", "Ataque", "intermediario", "Salto, tempo de bola e acerto.", 10),
    ("Saque viagem", "Saque", "intermediario", "Saque com efeito que complica a recepção.", 8),
    ("Defesa de ataque forte", "Defesa", "intermediario", "Posicionamento e reação para bolas rápidas.", 9),
    ("Peixinho de defesa", "Defesa", "intermediario", "Mergulho controlado, sem se machucar.", 7),
    ("Levantada para chapa", "Toque", "intermediario", "Altura e distância certas para o ataque.", 8),
    ("Paradinha e largada", "Ataque", "intermediario", "Enganar a defesa com a bola curta.", 6),
    ("Bloqueio com o corpo", "Defesa", "intermediario", "Fechar a diagonal e forçar o erro.", 7),
    ("Transição defesa-ataque", "Tática", "intermediario", "Defender, levantar, atacar: o ciclo do ponto.", 10),
    ("Condicionamento na areia", "Preparação", "intermediario", "Saltos e deslocamentos para aguentar o set.", 10),
]

# Legendas que acompanham o vídeo do hero enquanto a página rola.
STEPS = [
    ("Base e postura", "Sem base, nada se sustenta. Posição, deslocamento e equilíbrio na areia.", "Passo 1"),
    ("Toque e controle", "Pé, peito, ombro e cabeça. A bola obedece quando você entende a superfície.", "Passo 2"),
    ("Defesa e saque", "Receba, defenda e coloque a bola em jogo com consistência.", "Passo 3"),
    ("Chapa e ataque", "Ataque colocado e leitura de jogo. É aqui que o ponto nasce.", "Passo 4"),
]

# Cartões da seção "fundamentos" (rolagem horizontal presa ao scroll).
FUNDAMENTALS = [
    ("Toque", "Peito do pé, ombro, peito e cabeça. Controle antes de força.", "Controle"),
    ("Recepção", "Amortecer o saque e entregar a bola redonda para o parceiro.", "Defesa"),
    ("Saque", "Do saque por baixo ao saque viagem. Consistência primeiro.", "Início do ponto"),
    ("Levantada", "Altura e distância certas para a dupla atacar.", "Dupla"),
    ("Chapa", "Ataque firme e colocado, longe da defesa.", "Ataque"),
    ("Ataque", "Salto, tempo de bola e acerto para fechar o ponto.", "Ataque"),
]

BENEFITS = [
    ("Aulas de 5 a 10 minutos", "Curtas e diretas. Cabe na rotina, sem enrolação.", "clock"),
    ("Do zero ao intermediário", "Começa pela base e avança no seu ritmo.", "stairs"),
    ("Correção de erros comuns", "O erro, a causa e o ajuste. Sem repetir vício.", "target"),
    ("Assista onde quiser", "Celular, tablet ou TV, antes de ir pra areia.", "phone"),
    ("Acesso vitalício", "Pagou uma vez, é seu. Reveja quantas vezes quiser.", "ball"),
    ("Do vídeo para a areia", "No Premium você aplica tudo em uma aula presencial na Royal.", "people"),
]

PLANS = [
    {
        "name": "Essencial", "badge": "", "proof": "", "price_from": "", "price": "R$ 27,90",
        "installments": "Fundamentos para começar",
        "features": ["Videoaulas do nível iniciante", "Aulas de 5 a 10 minutos", "Acesso vitalício"],
        "highlight": False, "cta_label": "Quero o Essencial",
    },
    {
        "name": "Completo", "badge": "Mais escolhido", "proof": "+200 vendas", "price_from": "", "price": "R$ 35,90",
        "installments": "Iniciante + intermediário",
        "features": ["Todas as videoaulas", "Iniciante e intermediário", "Acesso vitalício", "Atualizações incluídas"],
        "highlight": True, "cta_label": "Quero o Completo",
    },
    {
        "name": "Premium", "badge": "Presencial", "proof": "+15 alunos hoje treinam na Royal", "price_from": "", "price": "R$ 65,90",
        "installments": "Completo (R$ 35,90) + aula presencial (R$ 30)",
        "features": ["Tudo do plano Completo", "1 aula presencial na Royal", "O conteúdo dos vídeos aplicado na areia", "Correção ao vivo com o professor"],
        "highlight": False, "cta_label": "Quero o Premium",
    },
]

TESTIMONIALS = []

FAQS = [
    ("Preciso saber jogar?", "Não. As aulas começam do zero, com postura, toque e controle de bola."),
    ("Por quanto tempo tenho acesso?", "Para sempre. O acesso é vitalício em todos os planos."),
    ("Como recebo o acesso?", "Logo após a confirmação do pagamento, pelo WhatsApp."),
    ("Como funciona a aula presencial?", "No plano Premium você faz uma aula na Royal e aplica na areia o conteúdo dos vídeos, com correção do professor."),
]
