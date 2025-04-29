# Prototipa-o_telas_APS_II

🍽️ Sistema de Gerenciamento de Restaurante
Este projeto apresenta a prototipação de telas para um sistema completo de gerenciamento de restaurante, simulando desde a recepção do cliente até o fechamento da conta, passando por todas as áreas de atendimento, cozinha e gestão de mesas.

Funcionalidades
🔐 Login de Usuários:
Sistema de autenticação no qual o usuário seleciona seu perfil de atuação:

Garçom: Atendimento às mesas e criação de pedidos.

Cozinha: Gerenciamento e preparo de pedidos.

Bar: Preparação de bebidas.

Caixa: Fechamento de contas e recebimentos.

Gerente: Supervisão geral do funcionamento do restaurante.

Recepcionista: Controle da fila de espera e reserva de mesas.

🗺️ Visualização de Mapa de Mesas:
Exibe um mapa interativo com a disposição de todas as mesas no salão:

Cada mesa é identificada por seu número e seu status atual.

Status disponíveis:

✅ Livre — Disponível para novos clientes.

🍽️ Ocupada — Clientes sentados, sendo atendidos.

⏳ Aguardando Pedido — Clientes alocados aguardando o garçom.

🧹 Em Limpeza — Mesa indisponível, aguardando higienização.

📅 Reservada — Mesa já destinada a uma reserva futura.

🔎 Filtros de Mesas:
Ferramenta que permite:

Filtrar mesas pelo status (ex.: mostrar apenas as livres ou ocupadas).

Filtrar mesas pelo setor (Salão Principal, Terraço, VIP).

📝 Abertura de Pedidos:
A partir da seleção de uma mesa:

Criar um novo pedido.

Escolher itens do cardápio organizados por categorias:

🥗 Entradas

🍝 Pratos Principais

🍹 Bebidas

🍰 Sobremesas

Adicionar observações específicas para cada item (ex.: "sem cebola", "ponto da carne: malpassada").

🛎️ Gestão de Pedidos:
Controle do fluxo dos pedidos realizados:

Alteração do status de cada item (Em Preparo ➡️ Pronto ➡️ Entregue).

Atualização automática do status da mesa conforme a situação do pedido evolui.

Indicação clara de itens atrasados ou em andamento.

💵 Cálculo de Conta:
O sistema gera:

Subtotal dos produtos consumidos.

Taxa de serviço (quando aplicável).

Valor total final para pagamento.

🧾 Solicitação de Conta:
Quando o cliente solicita a conta:

O garçom pode gerar o resumo dos pedidos da mesa.

Sistema calcula tudo automaticamente e libera a mesa após o pagamento.

👨‍🍳 Área da Cozinha:
Tela exclusiva para a equipe de cozinha e bar:

Visualização em tempo real de todos os pedidos abertos.

Controle de status:

🧑‍🍳 Em Preparo: Pedido iniciado.

✅ Pronto: Pedido concluído e aguardando retirada.

Priorização automática de pedidos por tempo de espera.

⌛ Fila de Espera:
Gerenciamento de clientes na fila:

Cadastro de clientes que aguardam mesas.

Associação automática de clientes à primeira mesa disponível, respeitando o tamanho do grupo.

🔔 Notificações de Sistema:
Emissão de alertas visuais e sonoros para:

Novos pedidos recebidos.

Pedidos prontos para entrega.

Solicitações de conta.

Alterações de status importantes.

Navegação entre Telas
🔐 Tela de Login:
Acesso inicial e seleção de perfil de usuário.

🗺️ Tela de Garçom:
Visualização do mapa de mesas, filtros, abertura e gerenciamento de pedidos.

📝 Tela de Pedido:
Detalhamento e edição dos itens pedidos por cada mesa.

👨‍🍳 Tela da Cozinha:
Controle da preparação de pedidos e aviso de pedidos prontos para entrega.
