// Variáveis globais
let currentScreen = "login-screen";
let currentUser = null;
let tables = [];
let orders = [];
let waitingList = [];
let menuItems = [];
let notifications = [];
let currentTableId = null;
let currentOrderItems = [];

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function() {
    // Inicializar dados
    initializeData();
    
    // Configurar eventos
    setupEventListeners();
    
    // Mostrar tela de login
    showScreen('login-screen');
    
    // Iniciar temporizadores
    startTimers();
    
    // Iniciar simulação de notificações
    simulateNotifications();
});

// Inicializar dados do sistema
function initializeData() {
    // Dados das mesas
    tables = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        number: i + 1,
        status: getRandomTableStatus(),
        capacity: Math.floor(Math.random() * 3) + 2,
        customers: 0,
        waiter: null,
        openTime: null,
        orders: [],
        sector: getRandomSector(),
        joined: false,
        joinedWith: []
    }));
    
    // Atualizar algumas mesas para ter clientes
    for (let i = 0; i < 8; i++) {
        const tableIndex = Math.floor(Math.random() * tables.length);
        if (tables[tableIndex].status === 'occupied' || tables[tableIndex].status === 'waiting') {
            tables[tableIndex].customers = Math.floor(Math.random() * 4) + 1;
            tables[tableIndex].waiter = getRandomWaiter();
            tables[tableIndex].openTime = getRandomTime();
        }
    }
    
    // Dados da fila de espera
    waitingList = [
        { id: 1, name: 'Silva', people: 4, time: '00:18', phone: '(11) 98765-4321', notes: 'Prefere mesa perto da janela' },
        { id: 2, name: 'Oliveira', people: 2, time: '00:12', phone: '(11) 91234-5678', notes: '' },
        { id: 3, name: 'Santos', people: 6, time: '00:05', phone: '(11) 99876-5432', notes: 'Aniversário' }
    ];
    
    // Dados dos itens do menu
    menuItems = [
        { id: 1, name: 'Bruschetta', description: 'Tomate, manjericão e azeite', price: 28.00, category: 'starters' },
        { id: 2, name: 'Filé Mignon', description: 'Com molho de vinho e batatas', price: 68.00, category: 'main' },
        { id: 3, name: 'Caipirinha', description: 'Limão, açúcar e cachaça', price: 22.00, category: 'drinks' },
        { id: 4, name: 'Pudim', description: 'Pudim de leite condensado', price: 18.00, category: 'desserts' },
        { id: 5, name: 'Água Mineral', description: 'Com ou sem gás', price: 6.00, category: 'drinks' },
        { id: 6, name: 'Risoto de Funghi', description: 'Arroz arbóreo com cogumelos', price: 52.00, category: 'main' },
        { id: 7, name: 'Salada Caesar', description: 'Alface, croutons, parmesão e molho caesar', price: 32.00, category: 'starters' },
        { id: 8, name: 'Salmão Grelhado', description: 'Com legumes e molho de ervas', price: 72.00, category: 'main' },
        { id: 9, name: 'Mojito', description: 'Rum, hortelã, açúcar e água com gás', price: 24.00, category: 'drinks' },
        { id: 10, name: 'Tiramisu', description: 'Sobremesa italiana com café e mascarpone', price: 22.00, category: 'desserts' }
    ];
    
    // Dados dos pedidos
    orders = [
        {
            id: 1001,
            tableId: 3,
            items: [
                { id: 6, name: 'Risoto de Funghi', quantity: 2, price: 52.00, status: 'new', notes: 'Um sem queijo' }
            ],
            status: 'new',
            time: '00:03',
            waiter: 'Carlos'
        },
        {
            id: 1002,
            tableId: 7,
            items: [
                { id: 1, name: 'Bruschetta', quantity: 1, price: 28.00, status: 'new', notes: '' },
                { id: 7, name: 'Salada Caesar', quantity: 1, price: 32.00, status: 'new', notes: 'Sem croutons' }
            ],
            status: 'new',
            time: '00:01',
            waiter: 'Juliana'
        },
        {
            id: 1003,
            tableId: 10,
            items: [
                { id: 2, name: 'Filé Mignon', quantity: 2, price: 68.00, status: 'preparing', notes: 'Ponto médio, sem cebola' }
            ],
            status: 'preparing',
            time: '00:12',
            waiter: 'Ricardo'
        },
        {
            id: 1004,
            tableId: 2,
            items: [
                { id: 8, name: 'Salmão Grelhado', quantity: 1, price: 72.00, status: 'preparing', notes: 'Sem molho' },
                { id: 6, name: 'Risoto de Limão', quantity: 1, price: 52.00, status: 'preparing', notes: '' }
            ],
            status: 'preparing',
            time: '00:18',
            waiter: 'Amanda'
        },
        {
            id: 2001,
            tableId: 3,
            items: [
                { id: 9, name: 'Mojito', quantity: 2, price: 24.00, status: 'new', notes: 'Um sem álcool' }
            ],
            status: 'new',
            time: '00:02',
            waiter: 'Carlos'
        },
        {
            id: 2002,
            tableId: 7,
            items: [
                { id: 5, name: 'Água Mineral', quantity: 4, price: 6.00, status: 'new', notes: '2 com gás, 2 sem gás' }
            ],
            status: 'new',
            time: '00:01',
            waiter: 'Juliana'
        },
        {
            id: 2003,
            tableId: 10,
            items: [
                { id: 3, name: 'Caipirinha', quantity: 3, price: 22.00, status: 'preparing', notes: 'Uma sem açúcar' }
            ],
            status: 'preparing',
            time: '00:04',
            waiter: 'Ricardo'
        }
    ];
    
    // Inicializar notificações
    notifications = [];
}

// Funções auxiliares para gerar dados aleatórios
function getRandomTableStatus() {
    const statuses = ['free', 'occupied', 'waiting', 'cleaning', 'reserved'];
    const weights = [0.4, 0.3, 0.1, 0.1, 0.1]; // Probabilidades de cada status
    
    let random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random <= sum) return statuses[i];
    }
    
    return statuses[0];
}

function getRandomSector() {
    const sectors = ['main', 'terrace', 'vip'];
    return sectors[Math.floor(Math.random() * sectors.length)];
}

function getRandomWaiter() {
    const waiters = ['Carlos', 'Juliana', 'Ricardo', 'Amanda'];
    return waiters[Math.floor(Math.random() * waiters.length)];
}

function getRandomTime() {
    const hours = Math.floor(Math.random() * 2);
    const minutes = Math.floor(Math.random() * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Configurar listeners de eventos
function setupEventListeners() {
    // Login
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    
    // Botões de logout
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });
    
    // Toggle do menu lateral
    document.querySelectorAll('.menu-toggle').forEach(toggle => {
        toggle.addEventListener('click', toggleSidebar);
    });
    
    // Fechar menu lateral
    document.querySelectorAll('.sidebar-close').forEach(close => {
        close.addEventListener('click', closeSidebar);
    });
    
    // Filtros de status das mesas
    document.querySelectorAll('.status-filter').forEach(filter => {
        filter.addEventListener('click', function() {
            const filterGroup = this.closest('.status-filters');
            filterGroup.querySelectorAll('.status-filter').forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            const status = this.dataset.status;
            filterTables(status);
        });
    });
    
    // Clique nas mesas
    document.querySelectorAll('.table-item').forEach(table => {
        table.addEventListener('click', function() {
            const tableId = this.dataset.tableId;
            handleTableClick(tableId);
        });
    });
    
    // Botão de adicionar mesa
    document.getElementById('add-table-btn')?.addEventListener('click', function() {
        prepareAddTableModal();
        showModal('add-table-modal');
    });
    
    // Botão de alterar status
    document.getElementById('change-status-btn')?.addEventListener('click', function() {
        prepareChangeStatusModal();
        showModal('change-status-modal');
    });
    
    // Botão de solicitar conta
    document.getElementById('request-bill-btn')?.addEventListener('click', function() {
        const tableId = document.getElementById('current-table-number').textContent;
        requestBill(tableId);
    });
    
    // Botão de voltar
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            goBack();
        });
    });
    
    // Botões de categoria do pedido
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const categoryBtns = document.querySelectorAll('.category-btn');
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterMenuItems(category);
        });
    });
    
    // Botões de adicionar item ao pedido
    document.querySelectorAll('.add-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemId = menuItem.dataset.itemId;
            addItemToOrder(itemId);
        });
    });
    
    // Botões de quantidade
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderItem = this.closest('.order-item');
            const itemId = orderItem.dataset.itemId;
            const action = this.classList.contains('plus') ? 'increase' : 'decrease';
            updateItemQuantity(itemId, action);
        });
    });
    
    // Botões de remover item
    document.querySelectorAll('.delete-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderItem = this.closest('.order-item');
            const itemId = orderItem.dataset.itemId;
            removeItemFromOrder(itemId);
        });
    });
    
    // Botões de ação na cozinha/bar
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const card = this.closest('.kitchen-card, .bar-card');
            if (card) {
                const orderId = card.dataset.orderId;
                handleKitchenBarAction(action, orderId);
            }
        });
    });
    
    // Botões de método de pagamento
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.payment-method-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Botão de confirmar pagamento
    document.getElementById('confirm-payment-btn')?.addEventListener('click', function() {
        processPayment();
    });
    
    // Botão de adicionar cliente à fila
    document.getElementById('add-to-queue-btn')?.addEventListener('click', function() {
        showModal('add-customer-modal');
    });
    
    // Botões de alocar mesa
    document.querySelectorAll('[data-action="allocate-table"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const queueItem = this.closest('.waiting-item');
            const queueId = queueItem.dataset.queueId;
            prepareTableAllocation(queueId);
        });
    });
    
    // Botão de confirmar alocação
    document.getElementById('confirm-allocation-btn')?.addEventListener('click', function() {
        allocateTable();
    });
    
    // Botões de fechar modal
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Botões de cancelar nos modais
    document.querySelectorAll('#cancel-add-table, #cancel-status-change, #cancel-join-tables, #cancel-add-customer, #cancel-split-bill, #cancel-allocation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Botões de confirmar nos modais
    document.getElementById('confirm-add-table')?.addEventListener('click', addNewTable);
    document.getElementById('confirm-status-change')?.addEventListener('click', changeTableStatus);
    document.getElementById('confirm-join-tables')?.addEventListener('click', joinTables);
    document.getElementById('confirm-add-customer')?.addEventListener('click', addCustomerToQueue);
    document.getElementById('confirm-split-bill')?.addEventListener('click', splitBill);
    
    // Opções de status
    document.querySelectorAll('.status-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.status-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Opções de divisão de conta
    document.querySelectorAll('.split-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.split-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            const splitType = this.dataset.split;
            showSplitSection(splitType);
        });
    });
    
    // Número de pessoas para divisão igual
    document.getElementById('split-people')?.addEventListener('input', function() {
        updateSplitAmount();
    });
    
    // Checkboxes de juntar mesas
    document.querySelectorAll('#table-1, #table-6, #table-8').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateTotalCapacity();
        });
    });
    
    // Botão de salvar pedido
    document.getElementById('save-order-btn')?.addEventListener('click', function() {
        saveOrder();
    });
    
    // Botão de enviar pedido
    document.getElementById('send-order-btn')?.addEventListener('click', function() {
        sendOrder();
    });
    
    // Campo de busca de itens do menu
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchMenuItems(this.value);
        });
    }
    
    // Campo de observação do pedido
    const noteInput = document.querySelector('.add-note input');
    if (noteInput) {
        noteInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addOrderNote(this.value);
                this.value = '';
            }
        });
    }
    
    // Botão de imprimir conta
    document.getElementById('print-bill-btn')?.addEventListener('click', function() {
        printBill();
    });
    
    // Botão de aplicar desconto
    const discountButton = document.querySelector('.discount-input button');
    if (discountButton) {
        discountButton.addEventListener('click', function() {
            applyDiscount();
        });
    }
    
    // Filtros de data no dashboard
    document.querySelectorAll('.date-filter button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.date-filter button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.dataset.period;
            filterDashboardByPeriod(period);
        });
    });
    
    // Botões de exportar e imprimir relatórios
    const exportButton = document.querySelector('.dashboard-actions button:first-child');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            exportReport();
        });
    }
    
    const printButton = document.querySelector('.dashboard-actions button:last-child');
    if (printButton) {
        printButton.addEventListener('click', function() {
            printReport();
        });
    }
}

// Funções de manipulação da interface

// Mostrar uma tela específica
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
    
    // Atualizar dados específicos da tela
    updateScreenData(screenId);
}

// Atualizar dados específicos da tela
function updateScreenData(screenId) {
    switch (screenId) {
        case 'waiter-screen':
            updateTablesMap();
            break;
        case 'table-order-screen':
            updateTableOrderScreen();
            break;
        case 'kitchen-screen':
            updateKitchenScreen();
            break;
        case 'bar-screen':
            updateBarScreen();
            break;
        case 'cashier-screen':
            updateCashierScreen();
            break;
        case 'manager-screen':
            updateManagerScreen();
            break;
        case 'receptionist-screen':
            updateReceptionistScreen();
            break;
    }
}

// Mostrar um modal
function showModal(modalId) {
    document.getElementById('modal-overlay').classList.add('active');
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    
    document.getElementById(modalId).classList.add('active');
}

// Fechar todos os modais
function closeAllModals() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Abrir menu lateral
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Fechar menu lateral
function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('active');
}

// Filtrar mesas por status
function filterTables(status) {
    const tableItems = document.querySelectorAll('.table-item');
    
    tableItems.forEach(table => {
        if (status === 'all' || table.dataset.status === status) {
            table.style.display = 'block';
        } else {
            table.style.display = 'none';
        }
    });
}

// Filtrar itens do menu por categoria
function filterMenuItems(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Buscar itens do menu
function searchMenuItems(query) {
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (!query) {
        menuItems.forEach(item => {
            item.style.display = 'flex';
        });
        return;
    }
    
    query = query.toLowerCase();
    
    menuItems.forEach(item => {
        const name = item.querySelector('h4').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        
        if (name.includes(query) || description.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Mostrar seção de divisão de conta
function showSplitSection(type) {
    document.querySelector('.split-equal-section').style.display = type === 'equal' ? 'block' : 'none';
    document.querySelector('.split-items-section').style.display = type === 'items' ? 'block' : 'none';
    document.querySelector('.split-custom-section').style.display = type === 'custom' ? 'block' : 'none';
}

// Atualizar valor por pessoa na divisão igual
function updateSplitAmount() {
    const totalAmount = 253; // Valor fixo para exemplo
    const people = parseInt(document.getElementById('split-people').value) || 1;
    const perPerson = (totalAmount / people).toFixed(2);
    
    document.querySelector('.per-person').textContent = `Por pessoa: R$ ${perPerson}`;
}

// Atualizar capacidade total ao juntar mesas
function updateTotalCapacity() {
    let totalCapacity = 6; // Mesa principal (3)
    
    if (document.getElementById('table-1').checked) totalCapacity += 4;
    if (document.getElementById('table-6').checked) totalCapacity += 4;
    if (document.getElementById('table-8').checked) totalCapacity += 4;
    
    document.getElementById('total-capacity').textContent = totalCapacity;
}

// Atualizar mapa de mesas
function updateTablesMap() {
    const tablesMap = document.querySelector('.tables-map');
    if (!tablesMap) return;
    
    // Limpar mapa atual
    tablesMap.innerHTML = '';
    
    // Adicionar mesas ao mapa
    tables.forEach(table => {
        if (table.joined && !table.isMainJoined) return; // Pular mesas que foram juntadas e não são a principal
        
        const tableItem = document.createElement('div');
        tableItem.className = 'table-item';
        tableItem.dataset.tableId = table.id;
        tableItem.dataset.status = table.status;
        tableItem.dataset.capacity = table.capacity;
        
        let statusText = '';
        switch (table.status) {
            case 'free': statusText = 'Livre'; break;
            case 'occupied': statusText = 'Ocupada'; break;
            case 'waiting': statusText = 'Aguardando Pedido'; break;
            case 'cleaning': statusText = 'Em Limpeza'; break;
            case 'reserved': statusText = 'Reservada'; break;
            case 'blocked': statusText = 'Bloqueada'; break;
        }
        
        let timeInfo = '';
        if (table.openTime) {
            timeInfo = `<div class="table-time">${table.openTime}</div>`;
        }
        
        let joinedInfo = '';
        if (table.joined) {
            joinedInfo = `<div class="table-joined">Juntada com: ${table.joinedWith.join(', ')}</div>`;
        }
        
        tableItem.innerHTML = `
            <div class="table-number">${table.number}</div>
            <div class="table-info">
                <div class="table-capacity"><i class="fas fa-user"></i> ${table.capacity}</div>
                <div class="table-status">${statusText}</div>
                ${timeInfo}
                ${joinedInfo}
            </div>
        `;
        
        tableItem.addEventListener('click', function() {
            handleTableClick(table.id);
        });
        
        tablesMap.appendChild(tableItem);
    });
}

// Atualizar tela de pedido da mesa
function updateTableOrderScreen() {
    const tableNumber = document.getElementById('current-table-number').textContent;
    const table = tables.find(t => t.number == tableNumber);
    
    if (!table) return;
    
    currentTableId = table.id;
    
    // Atualizar informações da mesa
    document.querySelector('.table-timer').textContent = table.openTime || '00:00';
    
    // Atualizar status da mesa
    let statusText = '';
    let statusClass = '';
    switch (table.status) {
        case 'free': 
            statusText = 'Livre'; 
            statusClass = 'status-free';
            break;
        case 'occupied': 
            statusText = 'Ocupada'; 
            statusClass = 'status-occupied';
            break;
        case 'waiting': 
            statusText = 'Aguardando Pedido'; 
            statusClass = 'status-waiting';
            break;
        case 'cleaning': 
            statusText = 'Em Limpeza'; 
            statusClass = 'status-cleaning';
            break;
        case 'reserved': 
            statusText = 'Reservada'; 
            statusClass = 'status-reserved';
            break;
        case 'blocked': 
            statusText = 'Bloqueada'; 
            statusClass = 'status-blocked';
            break;
    }
    
    const statusElement = document.querySelector('.info-item .value.status-waiting');
    if (statusElement) {
        statusElement.textContent = statusText;
        statusElement.className = `value ${statusClass}`;
    }
    
    // Atualizar informações do garçom e clientes
    const waiterElement = document.querySelector('.info-item:first-child .value');
    if (waiterElement) {
        waiterElement.textContent = table.waiter || 'Não atribuído';
    }
    
    const customersElement = document.querySelector('.info-item:nth-child(2) .value');
    if (customersElement) {
        customersElement.textContent = `${table.customers || 0} pessoas`;
    }
    
    // Atualizar lista de itens do menu
    updateMenuItemsList();
    
    // Atualizar lista de itens do pedido
    updateOrderItemsList(tableNumber);
}

// Atualizar lista de itens do menu
function updateMenuItemsList() {
    const menuItemsList = document.querySelector('.menu-items-list');
    if (!menuItemsList) return;
    
    // Limpar lista atual
    menuItemsList.innerHTML = '';
    
    // Adicionar itens do menu à lista
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.dataset.itemId = item.id;
        menuItem.dataset.category = item.category;
        
        menuItem.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <span class="item-price">R$ ${item.price.toFixed(2)}</span>
            </div>
            <button class="btn add-item-btn"><i class="fas fa-plus"></i></button>
        `;
        
        menuItem.querySelector('.add-item-btn').addEventListener('click', function() {
            addItemToOrder(item.id);
        });
        
        menuItemsList.appendChild(menuItem);
    });
}

// Atualizar lista de itens do pedido
function updateOrderItemsList(tableNumber) {
    const orderItemsList = document.querySelector('.order-items-list');
    if (!orderItemsList) return;
    
    // Limpar lista atual
    orderItemsList.innerHTML = '';
    
    // Encontrar pedidos da mesa
    const tableOrders = orders.filter(o => o.tableId == tableNumber);
    
    // Se não houver pedidos, mostrar mensagem
    if (tableOrders.length === 0) {
        orderItemsList.innerHTML = '<div class="empty-order">Nenhum item adicionado ao pedido</div>';
        
        // Zerar totais
        document.querySelector('.subtotal span:last-child').textContent = 'R$ 0.00';
        document.querySelector('.service span:last-child').textContent = 'R$ 0.00';
        document.querySelector('.total span:last-child').textContent = 'R$ 0.00';
        
        return;
    }
    
    // Calcular subtotal, taxa de serviço e total
    let subtotal = 0;
    
    // Adicionar itens do pedido à lista
    tableOrders.forEach(order => {
        order.items.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.dataset.itemId = item.id;
            
            let statusText = '';
            let statusClass = '';
            switch (item.status) {
                case 'new': 
                    statusText = 'Novo'; 
                    statusClass = '';
                    break;
                case 'preparing': 
                    statusText = 'Em preparo'; 
                    statusClass = 'preparing';
                    break;
                case 'ready': 
                    statusText = 'Pronto'; 
                    statusClass = 'ready';
                    break;
                case 'delivered': 
                    statusText = 'Entregue'; 
                    statusClass = 'delivered';
                    break;
            }
            
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            orderItem.innerHTML = `
                <div class="item-info">
                    <div class="item-quantity">
                        <button class="btn quantity-btn minus"><i class="fas fa-minus"></i></button>
                        <span>${item.quantity}</span>
                        <button class="btn quantity-btn plus"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p class="item-status ${statusClass}">${statusText}</p>
                    </div>
                    <div class="item-actions">
                        <span class="item-price">R$ ${itemTotal.toFixed(2)}</span>
                        <button class="btn icon-btn delete-item"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                ${item.notes ? `<div class="item-notes"><i class="fas fa-comment"></i><span>${item.notes}</span></div>` : ''}
            `;
            
            orderItem.querySelector('.quantity-btn.minus').addEventListener('click', function() {
                updateItemQuantity(item.id, 'decrease');
            });
            
            orderItem.querySelector('.quantity-btn.plus').addEventListener('click', function() {
                updateItemQuantity(item.id, 'increase');
            });
            
            orderItem.querySelector('.delete-item').addEventListener('click', function() {
                removeItemFromOrder(item.id);
            });
            
            orderItemsList.appendChild(orderItem);
        });
    });
    
    // Atualizar totais
    const service = subtotal * 0.1; // 10% de taxa de serviço
    const total = subtotal + service;
    
    document.querySelector('.subtotal span:last-child').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.querySelector('.service span:last-child').textContent = `R$ ${service.toFixed(2)}`;
    document.querySelector('.total span:last-child').textContent = `R$ ${total.toFixed(2)}`;
}

// Atualizar tela da cozinha
function updateKitchenScreen() {
    // Atualizar contadores
    const newCount = orders.filter(o => o.status === 'new' && o.items.some(i => {
        const menuItem = menuItems.find(mi => mi.id === i.id);
        return menuItem && menuItem.category !== 'drinks';
    })).length;
    
    const preparingCount = orders.filter(o => o.status === 'preparing' && o.items.some(i => {
        const menuItem = menuItems.find(mi => mi.id === i.id);
        return menuItem && menuItem.category !== 'drinks';
    })).length;
    
    const readyCount = orders.filter(o => o.status === 'ready' && o.items.some(i => {
        const menuItem = menuItems.find(mi => mi.id === i.id);
        return menuItem && menuItem.category !== 'drinks';
    })).length;
    
    const newCountElement = document.querySelector('.board-column[data-status="new"] .count');
    if (newCountElement) newCountElement.textContent = newCount;
    
    const preparingCountElement = document.querySelector('.board-column[data-status="preparing"] .count');
    if (preparingCountElement) preparingCountElement.textContent = preparingCount;
    
    const readyCountElement = document.querySelector('.board-column[data-status="ready"] .count');
    if (readyCountElement) readyCountElement.textContent = readyCount;
    
    // Atualizar colunas
    updateKitchenColumn('new');
    updateKitchenColumn('preparing');
    updateKitchenColumn('ready');
}

// Atualizar coluna da cozinha
function updateKitchenColumn(status) {
    const columnContent = document.querySelector(`.board-column[data-status="${status}"] .column-content`);
    if (!columnContent) return;
    
    // Limpar coluna atual
    columnContent.innerHTML = '';
    
    // Filtrar pedidos pelo status e que não sejam bebidas
    const filteredOrders = orders.filter(o => {
        return o.status === status && o.items.some(i => {
            const menuItem = menuItems.find(mi => mi.id === i.id);
            return menuItem && menuItem.category !== 'drinks';
        });
    });
    
    // Se não houver pedidos, mostrar mensagem
    if (filteredOrders.length === 0) {
        columnContent.innerHTML = '<div class="empty-column">Nenhum pedido</div>';
        return;
    }
    
    // Adicionar pedidos à coluna
    filteredOrders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'kitchen-card';
        card.dataset.orderId = order.id;
        
        // Filtrar apenas itens que não são bebidas
        const foodItems = order.items.filter(i => {
            const menuItem = menuItems.find(mi => mi.id === i.id);
            return menuItem && menuItem.category !== 'drinks';
        });
        
        // Verificar se o tempo de espera é urgente (mais de 15 minutos)
        const isUrgent = parseInt(order.time.split(':')[0]) * 60 + parseInt(order.time.split(':')[1]) > 15;
        
        card.innerHTML = `
            <div class="card-header">
                <div class="table-info">
                    <i class="fas fa-table"></i>
                    <span>Mesa ${order.tableId}</span>
                </div>
                <div class="time-info ${isUrgent ? 'urgent' : ''}">
                    <i class="fas fa-clock"></i>
                    <span>${order.time}</span>
                </div>
            </div>
            <div class="card-content">
                ${foodItems.map(item => `
                    <div class="order-item">
                        <div class="item-quantity">${item.quantity}x</div>
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            ${item.notes ? `<p class="item-notes">${item.notes}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="card-footer">
                <button class="btn secondary-btn" data-action="view-details">
                    <i class="fas fa-eye"></i> Detalhes
                </button>
                ${status === 'new' ? `
                    <button class="btn primary-btn" data-action="start-preparing">
                        <i class="fas fa-utensils"></i> Iniciar Preparo
                    </button>
                ` : status === 'preparing' ? `
                    <button class="btn primary-btn" data-action="mark-ready">
                        <i class="fas fa-check"></i> Marcar como Pronto
                    </button>
                ` : `
                    <button class="btn primary-btn" data-action="mark-delivered">
                        <i class="fas fa-check-double"></i> Marcar como Entregue
                    </button>
                `}
            </div>
        `;
        
        // Adicionar event listeners para os botões
        card.querySelector('[data-action="view-details"]').addEventListener('click', function() {
            viewOrderDetails(order.id);
        });
        
        if (status === 'new') {
            card.querySelector('[data-action="start-preparing"]').addEventListener('click', function() {
                startPreparing(order.id);
            });
        } else if (status === 'preparing') {
            card.querySelector('[data-action="mark-ready"]').addEventListener('click', function() {
                markAsReady(order.id);
            });
        } else {
            card.querySelector('[data-action="mark-delivered"]').addEventListener('click', function() {
                markAsDelivered(order.id);
            });
        }
        
        columnContent.appendChild(card);
    });
}

// Atualizar tela do bar
function updateBarScreen() {
    // Atualizar contadores
    const newCount = orders.filter(o => o.status === 'new' && o.items.some(i => {
        const menuItem = menuItems.find(mi => mi.id === i.id);
        return menuItem && menuItem.category === 'drinks';
    })).length;
    
    const preparingCount = orders.filter(o => o.status === 'preparing' && o.items.some(i => {
        const menuItem = menuItems.find(mi => mi.id === i.id);
        return menuItem && menuItem.category === 'drinks';
    })).length;
    
    const readyCount = orders.filter(o => o.status === 'ready' && o.items.some(i => {
        const menuItem = menuItems.find(mi => mi.id === i.id);
        return menuItem && menuItem.category === 'drinks';
    })).length;
    
    const newCountElement = document.querySelector('.bar-board .board-column[data-status="new"] .count');
    if (newCountElement) newCountElement.textContent = newCount;
    
    const preparingCountElement = document.querySelector('.bar-board .board-column[data-status="preparing"] .count');
    if (preparingCountElement) preparingCountElement.textContent = preparingCount;
    
    const readyCountElement = document.querySelector('.bar-board .board-column[data-status="ready"] .count');
    if (readyCountElement) readyCountElement.textContent = readyCount;
    
    // Atualizar colunas
    updateBarColumn('new');
    updateBarColumn('preparing');
    updateBarColumn('ready');
}

// Atualizar coluna do bar
function updateBarColumn(status) {
    const columnContent = document.querySelector(`.bar-board .board-column[data-status="${status}"] .column-content`);
    if (!columnContent) return;
    
    // Limpar coluna atual
    columnContent.innerHTML = '';
    
    // Filtrar pedidos pelo status e que sejam bebidas
    const filteredOrders = orders.filter(o => {
        return o.status === status && o.items.some(i => {
            const menuItem = menuItems.find(mi => mi.id === i.id);
            return menuItem && menuItem.category === 'drinks';
        });
    });
    
    // Se não houver pedidos, mostrar mensagem
    if (filteredOrders.length === 0) {
        columnContent.innerHTML = '<div class="empty-column">Nenhum pedido</div>';
        return;
    }
    
    // Adicionar pedidos à coluna
    filteredOrders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'bar-card';
        card.dataset.orderId = order.id;
        
        // Filtrar apenas itens que são bebidas
        const drinkItems = order.items.filter(i => {
            const menuItem = menuItems.find(mi => mi.id === i.id);
            return menuItem && menuItem.category === 'drinks';
        });
        
        // Verificar se o tempo de espera é urgente (mais de 10 minutos para bebidas)
        const isUrgent = parseInt(order.time.split(':')[0]) * 60 + parseInt(order.time.split(':')[1]) > 10;
        
        card.innerHTML = `
            <div class="card-header">
                <div class="table-info">
                    <i class="fas fa-table"></i>
                    <span>Mesa ${order.tableId}</span>
                </div>
                <div class="time-info ${isUrgent ? 'urgent' : ''}">
                    <i class="fas fa-clock"></i>
                    <span>${order.time}</span>
                </div>
            </div>
            <div class="card-content">
                ${drinkItems.map(item => `
                    <div class="order-item">
                        <div class="item-quantity">${item.quantity}x</div>
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            ${item.notes ? `<p class="item-notes">${item.notes}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="card-footer">
                <button class="btn secondary-btn" data-action="view-details">
                    <i class="fas fa-eye"></i> Detalhes
                </button>
                ${status === 'new' ? `
                    <button class="btn primary-btn" data-action="start-preparing">
                        <i class="fas fa-glass-martini-alt"></i> Iniciar Preparo
                    </button>
                ` : status === 'preparing' ? `
                    <button class="btn primary-btn" data-action="mark-ready">
                        <i class="fas fa-check"></i> Marcar como Pronto
                    </button>
                ` : `
                    <button class="btn primary-btn" data-action="mark-delivered">
                        <i class="fas fa-check-double"></i> Marcar como Entregue
                    </button>
                `}
            </div>
        `;
        
        // Adicionar event listeners para os botões
        card.querySelector('[data-action="view-details"]').addEventListener('click', function() {
            viewOrderDetails(order.id);
        });
        
        if (status === 'new') {
            card.querySelector('[data-action="start-preparing"]').addEventListener('click', function() {
                startPreparing(order.id);
            });
        } else if (status === 'preparing') {
            card.querySelector('[data-action="mark-ready"]').addEventListener('click', function() {
                markAsReady(order.id);
            });
        } else {
            card.querySelector('[data-action="mark-delivered"]').addEventListener('click', function() {
                markAsDelivered(order.id);
            });
        }
        
        columnContent.appendChild(card);
    });
}

// Atualizar tela do caixa
function updateCashierScreen() {
    const tablesList = document.querySelector('.tables-list');
    if (!tablesList) return;
    
    // Limpar lista atual
    tablesList.innerHTML = '';
    
    // Filtrar mesas ocupadas
    const occupiedTables = tables.filter(t => t.status === 'occupied' || t.status === 'waiting');
    
    // Se não houver mesas ocupadas, mostrar mensagem
    if (occupiedTables.length === 0) {
        tablesList.innerHTML = '<div class="empty-tables">Nenhuma mesa ocupada</div>';
        return;
    }
    
    // Adicionar mesas à lista
    occupiedTables.forEach(table => {
        const tableItem = document.createElement('div');
        tableItem.className = 'table-item';
        tableItem.dataset.tableId = table.id;
        
        // Calcular total da mesa
        let tableTotal = 0;
        const tableOrders = orders.filter(o => o.tableId === table.id);
        
        tableOrders.forEach(order => {
            order.items.forEach(item => {
                tableTotal += item.price * item.quantity;
            });
        });
        
        tableItem.innerHTML = `
            <div class="table-number">Mesa ${table.number}</div>
            <div class="table-info">
                <div class="table-time">${table.openTime || '00:00'}</div>
                <div class="table-total">R$ ${tableTotal.toFixed(2)}</div>
            </div>
        `;
        
        tableItem.addEventListener('click', function() {
            selectTableForPayment(table.id);
        });
        
        tablesList.appendChild(tableItem);
    });
}

// Atualizar tela do gerente
function updateManagerScreen() {
    // Atualizar estatísticas
    updateDashboardStats();
    
    // Atualizar gráficos
    updateDashboardCharts();
    
    // Atualizar tabelas
    updateDashboardTables();
}

// Atualizar estatísticas do dashboard
function updateDashboardStats() {
    // Dados simulados para estatísticas
    const stats = [
        { id: 'total-sales', value: 'R$ 4.850,00', change: '+12%', positive: true },
        { id: 'avg-ticket', value: 'R$ 125,00', change: '+5%', positive: true },
        { id: 'customers', value: '38', change: '-3%', positive: false },
        { id: 'table-turnover', value: '2.5x', change: '+8%', positive: true }
    ];
    
    // Atualizar cada estatística
    stats.forEach(stat => {
        const statValue = document.querySelector(`#${stat.id} .stat-value`);
        const statChange = document.querySelector(`#${stat.id} .stat-change`);
        
        if (statValue) statValue.textContent = stat.value;
        if (statChange) {
            statChange.textContent = stat.change;
            statChange.className = `stat-change ${stat.positive ? 'positive' : 'negative'}`;
            statChange.innerHTML = `<i class="fas fa-${stat.positive ? 'arrow-up' : 'arrow-down'}"></i> ${stat.change}`;
        }
    });
}

// Atualizar gráficos do dashboard
function updateDashboardCharts() {
    // Dados simulados para o gráfico de barras
    const barHeights = [30, 45, 60, 40, 75, 55, 65];
    const barLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    
    // Atualizar gráfico de barras
    const barChart = document.querySelector('.bar-chart');
    if (barChart) {
        barChart.innerHTML = '';
        
        barHeights.forEach((height, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${height}%`;
            bar.innerHTML = `<span>${barLabels[index]}</span>`;
            
            barChart.appendChild(bar);
        });
    }
    
    // Dados simulados para os itens mais vendidos
    const topItems = [
        { name: 'Filé Mignon', value: 'R$ 1.360,00', percentage: 28 },
        { name: 'Risoto de Funghi', value: 'R$ 780,00', percentage: 16 },
        { name: 'Salmão Grelhado', value: 'R$ 720,00', percentage: 15 },
        { name: 'Caipirinha', value: 'R$ 660,00', percentage: 14 },
        { name: 'Bruschetta', value: 'R$ 560,00', percentage: 12 }
    ];
    
    // Atualizar lista de itens mais vendidos
    const topItemsList = document.querySelector('.top-items');
    if (topItemsList) {
        topItemsList.innerHTML = '';
        
        topItems.forEach((item, index) => {
            const topItem = document.createElement('div');
            topItem.className = 'top-item';
            
            topItem.innerHTML = `
                <div class="item-rank">${index + 1}</div>
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <div class="item-progress">
                        <div class="progress-bar" style="width: ${item.percentage}%"></div>
                    </div>
                </div>
                <div class="item-value">${item.value}</div>
            `;
            
            topItemsList.appendChild(topItem);
        });
    }
}

// Atualizar tabelas do dashboard
function updateDashboardTables() {
    // Dados simulados para o status das mesas
    const tableStatus = [
        { status: 'free', count: 8 },
        { status: 'occupied', count: 6 },
        { status: 'waiting', count: 3 },
        { status: 'cleaning', count: 1 },
        { status: 'reserved', count: 2 },
        { status: 'blocked', count: 0 }
    ];
    
    // Atualizar contadores de status
    tableStatus.forEach(status => {
        const statusCount = document.querySelector(`.status-item .status-color.${status.status} + .status-count`);
        if (statusCount) statusCount.textContent = status.count;
    });
    
    // Atualizar mini-mapa
    const miniMap = document.querySelector('.mini-map');
    if (miniMap) {
        miniMap.innerHTML = '';
        
        // Criar 20 mesas com status aleatórios baseados nas proporções acima
        for (let i = 0; i < 20; i++) {
            const miniTable = document.createElement('div');
            miniTable.className = `mini-table ${tables[i].status}`;
            
            miniMap.appendChild(miniTable);
        }
    }
    
    // Dados simulados para a tabela de reservas
    const reservations = [
        { name: 'Silva', time: '19:00', people: 4, table: 5, status: 'confirmed' },
        { name: 'Oliveira', time: '19:30', people: 2, table: 8, status: 'confirmed' },
        { name: 'Santos', time: '20:00', people: 6, table: null, status: 'pending' },
        { name: 'Pereira', time: '20:30', people: 3, table: 12, status: 'confirmed' }
    ];
    
    // Atualizar tabela de reservas
    const reservationsTable = document.querySelector('.reservations-table tbody');
    if (reservationsTable) {
        reservationsTable.innerHTML = '';
        
        reservations.forEach(reservation => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${reservation.name}</td>
                <td>${reservation.time}</td>
                <td>${reservation.people}</td>
                <td>${reservation.table || '-'}</td>
                <td>${reservation.status === 'confirmed' ? 'Confirmada' : 'Pendente'}</td>
            `;
            
            reservationsTable.appendChild(row);
        });
    }
}

// Atualizar tela do recepcionista
function updateReceptionistScreen() {
    // Atualizar lista de espera
    updateWaitingList();
    
    // Atualizar disponibilidade de mesas
    updateTablesAvailability();
}

// Atualizar lista de espera
function updateWaitingList() {
    const waitingContent = document.querySelector('.waiting-content');
    if (!waitingContent) return;
    
    // Limpar lista atual
    waitingContent.innerHTML = '';
    
    // Se não houver clientes na fila, mostrar mensagem
    if (waitingList.length === 0) {
        waitingContent.innerHTML = '<div class="empty-waiting">Nenhum cliente na fila</div>';
        return;
    }
    
    // Adicionar clientes à lista
    waitingList.forEach(customer => {
        const waitingItem = document.createElement('div');
        waitingItem.className = 'waiting-item';
        waitingItem.dataset.queueId = customer.id;
        
        waitingItem.innerHTML = `
            <div>
                <div class="customer-name">${customer.name}</div>
                <div class="customer-details">
                    <span><i class="fas fa-user"></i> ${customer.people}</span>
                    <span><i class="fas fa-clock"></i> ${customer.time}</span>
                </div>
            </div>
            <div class="waiting-actions">
                <button class="btn secondary-btn" data-action="view-details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn primary-btn" data-action="allocate-table">
                    <i class="fas fa-chair"></i>
                </button>
            </div>
        `;
        
        // Adicionar event listeners para os botões
        waitingItem.querySelector('[data-action="view-details"]').addEventListener('click', function() {
            viewCustomerDetails(customer.id);
        });
        
        waitingItem.querySelector('[data-action="allocate-table"]').addEventListener('click', function() {
            prepareTableAllocation(customer.id);
        });
        
        waitingContent.appendChild(waitingItem);
    });
}

// Atualizar disponibilidade de mesas
function updateTablesAvailability() {
    const availabilityContent = document.querySelector('.availability-content');
    if (!availabilityContent) return;
    
    // Limpar conteúdo atual
    availabilityContent.innerHTML = '';
    
    // Contar mesas por status
    const statusCounts = {
        free: tables.filter(t => t.status === 'free').length,
        occupied: tables.filter(t => t.status === 'occupied').length,
        waiting: tables.filter(t => t.status === 'waiting').length,
        cleaning: tables.filter(t => t.status === 'cleaning').length,
        reserved: tables.filter(t => t.status === 'reserved').length,
        blocked: tables.filter(t => t.status === 'blocked').length
    };
    
    // Criar resumo de status
    const statusSummary = document.createElement('div');
    statusSummary.className = 'status-summary';
    
    statusSummary.innerHTML = `
        <div class="status-item">
            <div class="status-color free"></div>
            <div class="status-label">Livre</div>
            <div class="status-count">${statusCounts.free}</div>
        </div>
        <div class="status-item">
            <div class="status-color occupied"></div>
            <div class="status-label">Ocupada</div>
            <div class="status-count">${statusCounts.occupied}</div>
        </div>
        <div class="status-item">
            <div class="status-color waiting"></div>
            <div class="status-label">Aguardando</div>
            <div class="status-count">${statusCounts.waiting}</div>
        </div>
        <div class="status-item">
            <div class="status-color cleaning"></div>
            <div class="status-label">Limpeza</div>
            <div class="status-count">${statusCounts.cleaning}</div>
        </div>
        <div class="status-item">
            <div class="status-color reserved"></div>
            <div class="status-label">Reservada</div>
            <div class="status-count">${statusCounts.reserved}</div>
        </div>
    `;
    
    availabilityContent.appendChild(statusSummary);
    
    // Criar mini-mapa
    const miniMap = document.createElement('div');
    miniMap.className = 'mini-map';
    
    tables.forEach(table => {
        const miniTable = document.createElement('div');
        miniTable.className = `mini-table ${table.status}`;
        miniTable.title = `Mesa ${table.number} - ${table.capacity} lugares`;
        
        miniTable.addEventListener('click', function() {
            handleTableClick(table.id);
        });
        
        miniMap.appendChild(miniTable);
    });
    
    availabilityContent.appendChild(miniMap);
}

// Funções de ação

// Lidar com login
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('profile').value; // Corrigido: 'profile' em vez de 'role'
    
    if (!username || !password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Simulação de login - em um sistema real, isso verificaria as credenciais no servidor
    currentUser = {
        username,
        role
    };
    
    // Redirecionar para a tela apropriada com base no papel
    switch (role) {
        case 'waiter':
            showScreen('waiter-screen');
            break;
        case 'kitchen':
            showScreen('kitchen-screen');
            break;
        case 'bar':
            showScreen('bar-screen');
            break;
        case 'cashier':
            showScreen('cashier-screen');
            break;
        case 'manager':
            showScreen('manager-screen');
            break;
        case 'receptionist':
            showScreen('receptionist-screen');
            break;
        default:
            showScreen('waiter-screen');
    }
    
    // Atualizar informações do usuário na interface
    document.querySelectorAll('.user-info').forEach(info => {
        info.textContent = username;
    });
    
    // Mostrar notificação
    showNotification(`Bem-vindo, ${username}!`);
}

// Lidar com logout
function handleLogout() {
    currentUser = null;
    showScreen('login-screen');
}

// Lidar com clique na mesa
function handleTableClick(tableId) {
    const table = tables.find(t => t.id == tableId);
    if (!table) return;
    
    // Se estiver na tela do garçom, ir para a tela de pedido da mesa
    if (currentScreen === 'waiter-screen') {
        document.getElementById('current-table-number').textContent = table.number;
        showScreen('table-order-screen');
    }
    // Se estiver na tela do recepcionista, mostrar modal de detalhes da mesa
    else if (currentScreen === 'receptionist-screen') {
        showTableDetails(tableId);
    }
}

// Preparar modal de adicionar mesa
function prepareAddTableModal() {
    // Limpar campos do modal
    document.getElementById('table-number').value = '';
    document.getElementById('table-capacity').value = '';
    document.getElementById('table-sector').value = 'main';
}

// Adicionar nova mesa
function addNewTable() {
    const number = parseInt(document.getElementById('table-number').value);
    const capacity = parseInt(document.getElementById('table-capacity').value);
    const sector = document.getElementById('table-sector').value;
    
    if (!number || !capacity) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Verificar se já existe uma mesa com esse número
    if (tables.some(t => t.number === number)) {
        alert('Já existe uma mesa com esse número.');
        return;
    }
    
    // Adicionar nova mesa
    const newTable = {
        id: tables.length + 1,
        number,
        status: 'free',
        capacity,
        customers: 0,
        waiter: null,
        openTime: null,
        orders: [],
        sector,
        joined: false,
        joinedWith: []
    };
    
    tables.push(newTable);
    
    // Atualizar mapa de mesas
    updateTablesMap();
    
    // Fechar modal
    closeAllModals();
    
    // Mostrar notificação
    showNotification(`Mesa ${number} adicionada com sucesso!`);
}

// Preparar modal de alterar status
function prepareChangeStatusModal() {
    const tableNumber = document.getElementById('current-table-number').textContent;
    const table = tables.find(t => t.number == tableNumber);
    
    if (!table) return;
    
    // Selecionar o status atual da mesa
    document.querySelectorAll('.status-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.status === table.status) {
            option.classList.add('active');
        }
    });
}

// Alterar status da mesa
function changeTableStatus() {
    const tableNumber = document.getElementById('current-table-number').textContent;
    const table = tables.find(t => t.number == tableNumber);
    
    if (!table) return;
    
    const statusOption = document.querySelector('.status-option.active');
    if (!statusOption) {
        alert('Por favor, selecione um status.');
        return;
    }
    
    const newStatus = statusOption.dataset.status;
    
    // Atualizar status da mesa
    table.status = newStatus;
    
    // Se a mesa estiver sendo ocupada, definir horário de abertura
    if (newStatus === 'occupied' && !table.openTime) {
        table.openTime = '00:00';
        table.waiter = currentUser.username;
    }
    
    // Se a mesa estiver sendo liberada, limpar dados
    if (newStatus === 'free' || newStatus === 'cleaning') {
        table.customers = 0;
        table.openTime = null;
    }
    
    // Atualizar interface
    updateTableOrderScreen();
    
    // Fechar modal
    closeAllModals();
    
    // Mostrar notificação
    showNotification(`Status da mesa ${tableNumber} alterado para ${getStatusText(newStatus)}`);
}

// Obter texto do status
function getStatusText(status) {
    switch (status) {
        case 'free': return 'Livre';
        case 'occupied': return 'Ocupada';
        case 'waiting': return 'Aguardando Pedido';
        case 'cleaning': return 'Em Limpeza';
        case 'reserved': return 'Reservada';
        case 'blocked': return 'Bloqueada';
        default: return status;
    }
}

// Juntar mesas
function joinTables() {
    const mainTable = document.getElementById('main-table').value;
    const additionalTables = [];
    
    if (document.getElementById('table-1').checked) additionalTables.push(1);
    if (document.getElementById('table-6').checked) additionalTables.push(6);
    if (document.getElementById('table-8').checked) additionalTables.push(8);
    
    const customerCount = document.getElementById('customer-count').value;
    
    if (!mainTable || additionalTables.length === 0 || !customerCount) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    // Atualizar mesas
    const mainTableObj = tables.find(t => t.number == mainTable);
    if (!mainTableObj) return;
    
    mainTableObj.joined = true;
    mainTableObj.joinedWith = additionalTables;
    mainTableObj.customers = parseInt(customerCount);
    mainTableObj.status = 'occupied';
    mainTableObj.openTime = '00:00';
    mainTableObj.waiter = currentUser.username;
    
    // Marcar mesas adicionais como ocupadas
    additionalTables.forEach(tableNumber => {
        const table = tables.find(t => t.number == tableNumber);
        if (table) {
            table.joined = true;
            table.isMainJoined = false;
            table.status = 'blocked';
        }
    });
    
    // Atualizar interface
    updateTablesMap();
    
    // Fechar modal
    closeAllModals();
    
    // Mostrar notificação
    showNotification(`Mesa ${mainTable} juntada com mesas ${additionalTables.join(', ')} para ${customerCount} clientes`);
}

// Adicionar cliente à fila
function addCustomerToQueue() {
    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const people = document.getElementById('customer-people').value;
    const notes = document.getElementById('customer-notes').value;
    
    if (!name) {
        alert('Por favor, informe o nome do cliente.');
        return;
    }
    
    // Adicionar cliente à fila
    const newCustomer = {
        id: waitingList.length + 1,
        name,
        phone,
        people: parseInt(people) || 1,
        time: '00:00',
        notes
    };
    
    waitingList.push(newCustomer);
    
    // Atualizar interface
    updateWaitingList();
    
    // Fechar modal
    closeAllModals();
    
    // Mostrar notificação
    showNotification(`Cliente ${name} adicionado à fila com sucesso!`);
}

// Preparar alocação de mesa
function prepareTableAllocation(queueId) {
    const customer = waitingList.find(c => c.id == queueId);
    if (!customer) return;
    
    // Preencher informações do cliente
    document.getElementById('allocation-customer-name').textContent = customer.name;
    document.getElementById('allocation-customer-people').textContent = customer.people;
    
    // Preencher select de mesas disponíveis
    const tableSelect = document.getElementById('allocation-table');
    tableSelect.innerHTML = '';
    
    // Filtrar mesas livres com capacidade suficiente
    const availableTables = tables.filter(t => 
        (t.status === 'free' || t.status === 'reserved') && 
        t.capacity >= customer.people
    );
    
    if (availableTables.length === 0) {
        tableSelect.innerHTML = '<option value="">Nenhuma mesa disponível</option>';
    } else {
        availableTables.forEach(table => {
            const option = document.createElement('option');
            option.value = table.id;
            option.textContent = `Mesa ${table.number} (${table.capacity} lugares)`;
            tableSelect.appendChild(option);
        });
    }
    
    // Armazenar ID do cliente para uso posterior
    tableSelect.dataset.queueId = queueId;
    
    // Mostrar modal
    showModal('allocation-modal');
}

// Alocar mesa
function allocateTable() {
    const tableSelect = document.getElementById('allocation-table');
    const tableId = tableSelect.value;
    const queueId = tableSelect.dataset.queueId;
    
    if (!tableId) {
        alert('Por favor, selecione uma mesa.');
        return;
    }
    
    const table = tables.find(t => t.id == tableId);
    const customer = waitingList.find(c => c.id == queueId);
    
    if (!table || !customer) return;
    
    // Atualizar mesa
    table.status = 'occupied';
    table.customers = customer.people;
    table.openTime = '00:00';
    table.waiter = document.getElementById('allocation-waiter').value || currentUser.username;
    
    // Remover cliente da fila
    waitingList = waitingList.filter(c => c.id != queueId);
    
    // Atualizar interface
    updateWaitingList();
    updateTablesAvailability();
    
    // Fechar modal
    closeAllModals();
    
    // Mostrar notificação
    showNotification(`Cliente ${customer.name} alocado na mesa ${table.number}`);
}

// Dividir conta
function splitBill() {
    const splitOption = document.querySelector('.split-option.active');
    const splitType = splitOption ? splitOption.dataset.split : null;
    
    if (!splitType) {
        alert('Selecione um tipo de divisão!');
        return;
    }
    
    let message = '';
    
    switch (splitType) {
        case 'equal':
            const people = document.getElementById('split-people').value;
            message = `Conta dividida igualmente entre ${people} pessoas.`;
            break;
        case 'items':
            message = 'Conta dividida por itens.';
            break;
        case 'custom':
            message = 'Conta dividida com valores personalizados.';
            break;
    }
    
    // Fechar modal
    closeAllModals();
    
    // Mostrar notificação
    showNotification(message);
}

// Adicionar item ao pedido
function addItemToOrder(itemId) {
    const menuItem = menuItems.find(i => i.id == itemId);
    if (!menuItem) return;
    
    // Verificar se o item já está no pedido atual
    const existingItem = currentOrderItems.find(i => i.id == itemId);
    
    if (existingItem) {
        // Aumentar quantidade
        existingItem.quantity += 1;
    } else {
        // Adicionar novo item
        currentOrderItems.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
            status: 'new',
            notes: ''
        });
    }
    
    // Atualizar interface
    updateCurrentOrderItems();
    
    // Mostrar notificação
    showNotification(`${menuItem.name} adicionado ao pedido`);
}

// Atualizar itens do pedido atual
function updateCurrentOrderItems() {
    const orderItemsList = document.querySelector('.order-items-list');
    if (!orderItemsList) return;
    
    // Limpar lista atual
    orderItemsList.innerHTML = '';
    
    // Se não houver itens, mostrar mensagem
    if (currentOrderItems.length === 0) {
        orderItemsList.innerHTML = '<div class="empty-order">Nenhum item adicionado ao pedido</div>';
        
        // Zerar totais
        document.querySelector('.subtotal span:last-child').textContent = 'R$ 0.00';
        document.querySelector('.service span:last-child').textContent = 'R$ 0.00';
        document.querySelector('.total span:last-child').textContent = 'R$ 0.00';
        
        return;
    }
    
    // Calcular subtotal, taxa de serviço e total
    let subtotal = 0;
    
    // Adicionar itens à lista
    currentOrderItems.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.dataset.itemId = item.id;
        
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        orderItem.innerHTML = `
            <div class="item-info">
                <div class="item-quantity">
                    <button class="btn quantity-btn minus"><i class="fas fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button class="btn quantity-btn plus"><i class="fas fa-plus"></i></button>
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                </div>
                <div class="item-actions">
                    <span class="item-price">R$ ${itemTotal.toFixed(2)}</span>
                    <button class="btn icon-btn delete-item"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            ${item.notes ? `<div class="item-notes"><i class="fas fa-comment"></i><span>${item.notes}</span></div>` : ''}
        `;
        
        orderItem.querySelector('.quantity-btn.minus').addEventListener('click', function() {
            updateItemQuantity(item.id, 'decrease');
        });
        
        orderItem.querySelector('.quantity-btn.plus').addEventListener('click', function() {
            updateItemQuantity(item.id, 'increase');
        });
        
        orderItem.querySelector('.delete-item').addEventListener('click', function() {
            removeItemFromOrder(item.id);
        });
        
        orderItemsList.appendChild(orderItem);
    });
    
    // Atualizar totais
    const service = subtotal * 0.1; // 10% de taxa de serviço
    const total = subtotal + service;
    
    document.querySelector('.subtotal span:last-child').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.querySelector('.service span:last-child').textContent = `R$ ${service.toFixed(2)}`;
    document.querySelector('.total span:last-child').textContent = `R$ ${total.toFixed(2)}`;
}

// Atualizar quantidade de um item
function updateItemQuantity(itemId, action) {
    const item = currentOrderItems.find(i => i.id == itemId);
    if (!item) return;
    
    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        item.quantity -= 1;
        
        // Remover item se quantidade for 0
        if (item.quantity <= 0) {
            removeItemFromOrder(itemId);
            return;
        }
    }
    
    // Atualizar interface
    updateCurrentOrderItems();
}

// Remover item do pedido
function removeItemFromOrder(itemId) {
    currentOrderItems = currentOrderItems.filter(i => i.id != itemId);
    
    // Atualizar interface
    updateCurrentOrderItems();
}

// Adicionar observação ao pedido
function addOrderNote(note) {
    if (!note) return;
    
    // Adicionar observação ao último item adicionado
    if (currentOrderItems.length > 0) {
        currentOrderItems[currentOrderItems.length - 1].notes = note;
        
        // Atualizar interface
        updateCurrentOrderItems();
    }
}

// Salvar pedido
function saveOrder() {
    if (currentOrderItems.length === 0) {
        alert('Adicione pelo menos um item ao pedido.');
        return;
    }
    
    const tableNumber = document.getElementById('current-table-number').textContent;
    const table = tables.find(t => t.number == tableNumber);
    
    if (!table) return;
    
    // Criar novo pedido
    const newOrder = {
        id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1001,
        tableId: table.id,
        items: [...currentOrderItems],
        status: 'new',
        time: '00:00',
        waiter: currentUser.username
    };
    
    orders.push(newOrder);
    
    // Atualizar status da mesa
    table.status = 'waiting';
    
    // Limpar pedido atual
    currentOrderItems = [];
    
    // Atualizar interface
    updateTableOrderScreen();
    
    // Mostrar notificação
    showNotification(`Pedido salvo com sucesso!`);
}

// Enviar pedido
function sendOrder() {
    if (currentOrderItems.length === 0) {
        alert('Adicione pelo menos um item ao pedido.');
        return;
    }
    
    const tableNumber = document.getElementById('current-table-number').textContent;
    const table = tables.find(t => t.number == tableNumber);
    
    if (!table) return;
    
    // Criar novo pedido
    const newOrder = {
        id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1001,
        tableId: table.id,
        items: [...currentOrderItems],
        status: 'new',
        time: '00:00',
        waiter: currentUser.username
    };
    
    orders.push(newOrder);
    
    // Atualizar status da mesa
    table.status = 'waiting';
    
    // Limpar pedido atual
    currentOrderItems = [];
    
    // Atualizar interface
    updateTableOrderScreen();
    
    // Mostrar notificação
    showNotification(`Pedido enviado para a cozinha/bar!`);
    
    // Voltar para a tela de mesas
    goBack();
}

// Solicitar conta
function requestBill(tableId) {
    const table = tables.find(t => t.id == tableId || t.number == tableId);
    if (!table) return;
    
    // Verificar se há pedidos para a mesa
    const tableOrders = orders.filter(o => o.tableId == table.id);
    
    if (tableOrders.length === 0) {
        alert('Não há pedidos para esta mesa.');
        return;
    }
    
    // Mostrar modal de divisão de conta
    showModal('split-bill-modal');
}

// Processar pagamento
function processPayment() {
    const paymentMethod = document.querySelector('.payment-method-btn.active');
    
    if (!paymentMethod) {
        alert('Selecione um método de pagamento.');
        return;
    }
    
    const tableId = document.querySelector('.tables-list .table-item.active')?.dataset.tableId;
    if (!tableId) return;
    
    const table = tables.find(t => t.id == tableId);
    if (!table) return;
    
    // Remover pedidos da mesa
    orders = orders.filter(o => o.tableId != tableId);
    
    // Atualizar status da mesa
    table.status = 'cleaning';
    table.customers = 0;
    table.openTime = null;
    
    // Atualizar interface
    updateCashierScreen();
    
    // Mostrar notificação
    showNotification(`Pagamento processado com sucesso! Mesa ${table.number} liberada para limpeza.`);
}

// Aplicar desconto
function applyDiscount() {
    const discountValue = document.querySelector('.discount-input input').value;
    const discountType = document.querySelector('.discount-input select').value;
    
    if (!discountValue) {
        alert('Informe o valor do desconto.');
        return;
    }
    
    // Mostrar notificação
    showNotification(`Desconto de ${discountType === 'percentage' ? discountValue + '%' : 'R$ ' + discountValue} aplicado com sucesso!`);
}

// Imprimir conta
function printBill() {
    // Simulação de impressão
    alert('Imprimindo conta...');
}

// Exportar relatório
function exportReport() {
    // Simulação de exportação
    alert('Exportando relatório...');
}

// Imprimir relatório
function printReport() {
    // Simulação de impressão
    alert('Imprimindo relatório...');
}

// Filtrar dashboard por período
function filterDashboardByPeriod(period) {
    // Simulação de filtragem
    updateDashboardStats();
    updateDashboardCharts();
    updateDashboardTables();
    
    // Mostrar notificação
    showNotification(`Dados filtrados por: ${period}`);
}

// Visualizar detalhes do pedido
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id == orderId);
    if (!order) return;
    
    // Mostrar detalhes do pedido (simulação)
    alert(`Detalhes do pedido #${orderId} para a mesa ${order.tableId}`);
}

// Iniciar preparo do pedido
function startPreparing(orderId) {
    const order = orders.find(o => o.id == orderId);
    if (!order) return;
    
    // Atualizar status do pedido
    order.status = 'preparing';
    
    // Atualizar status dos itens
    order.items.forEach(item => {
        item.status = 'preparing';
    });
    
    // Atualizar interface
    if (currentUser.role === 'kitchen') {
        updateKitchenScreen();
    } else if (currentUser.role === 'bar') {
        updateBarScreen();
    }
    
    // Mostrar notificação
    showNotification(`Pedido #${orderId} em preparo`);
}

// Marcar pedido como pronto
function markAsReady(orderId) {
    const order = orders.find(o => o.id == orderId);
    if (!order) return;
    
    // Atualizar status do pedido
    order.status = 'ready';
    
    // Atualizar status dos itens
    order.items.forEach(item => {
        item.status = 'ready';
    });
    
    // Atualizar interface
    if (currentUser.role === 'kitchen') {
        updateKitchenScreen();
    } else if (currentUser.role === 'bar') {
        updateBarScreen();
    }
    
    // Mostrar notificação
    showNotification(`Pedido #${orderId} pronto para entrega`);
}

// Marcar pedido como entregue
function markAsDelivered(orderId) {
    const order = orders.find(o => o.id == orderId);
    if (!order) return;
    
    // Atualizar status do pedido
    order.status = 'delivered';
    
    // Atualizar status dos itens
    order.items.forEach(item => {
        item.status = 'delivered';
    });
    
    // Atualizar status da mesa
    const table = tables.find(t => t.id == order.tableId);
    if (table && table.status === 'waiting') {
        table.status = 'occupied';
    }
    
    // Atualizar interface
    if (currentUser.role === 'kitchen') {
        updateKitchenScreen();
    } else if (currentUser.role === 'bar') {
        updateBarScreen();
    }
    
    // Mostrar notificação
    showNotification(`Pedido #${orderId} entregue com sucesso`);
}

// Visualizar detalhes do cliente
function viewCustomerDetails(customerId) {
    const customer = waitingList.find(c => c.id == customerId);
    if (!customer) return;
    
    // Mostrar detalhes do cliente (simulação)
    alert(`
        Nome: ${customer.name}
        Telefone: ${customer.phone}
        Pessoas: ${customer.people}
        Tempo de espera: ${customer.time}
        Observações: ${customer.notes || 'Nenhuma'}
    `);
}

// Mostrar detalhes da mesa
function showTableDetails(tableId) {
    const table = tables.find(t => t.id == tableId);
    if (!table) return;
    
    // Mostrar detalhes da mesa (simulação)
    alert(`
        Mesa: ${table.number}
        Status: ${getStatusText(table.status)}
        Capacidade: ${table.capacity} pessoas
        Clientes: ${table.customers || 0}
        Garçom: ${table.waiter || 'Não atribuído'}
        Tempo: ${table.openTime || '00:00'}
        Setor: ${table.sector}
    `);
}

// Lidar com ações da cozinha/bar
function handleKitchenBarAction(action, orderId) {
    switch (action) {
        case 'view-details':
            viewOrderDetails(orderId);
            break;
        case 'start-preparing':
            startPreparing(orderId);
            break;
        case 'mark-ready':
            markAsReady(orderId);
            break;
        case 'mark-delivered':
            markAsDelivered(orderId);
            break;
    }
}

// Voltar para a tela anterior
function goBack() {
    if (currentScreen === 'table-order-screen') {
        showScreen('waiter-screen');
    }
}

// Iniciar temporizadores
function startTimers() {
    // Atualizar tempos a cada minuto
    setInterval(updateTimers, 60000);
}

// Atualizar temporizadores
function updateTimers() {
    // Atualizar tempos das mesas
    tables.forEach(table => {
        if (table.openTime) {
            const [hours, minutes] = table.openTime.split(':').map(Number);
            let newMinutes = minutes + 1;
            let newHours = hours;
            
            if (newMinutes >= 60) {
                newMinutes = 0;
                newHours++;
            }
            
            table.openTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
        }
    });
    
    // Atualizar tempos dos pedidos
    orders.forEach(order => {
        const [hours, minutes] = order.time.split(':').map(Number);
        let newMinutes = minutes + 1;
        let newHours = hours;
        
        if (newMinutes >= 60) {
            newMinutes = 0;
            newHours++;
        }
        
        order.time = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    });
    
    // Atualizar tempos da fila de espera
    waitingList.forEach(customer => {
        const [hours, minutes] = customer.time.split(':').map(Number);
        let newMinutes = minutes + 1;
        let newHours = hours;
        
        if (newMinutes >= 60) {
            newMinutes = 0;
            newHours++;
        }
        
        customer.time = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    });
    
    // Atualizar interface se necessário
    if (document.querySelector('.screen.active')) {
        updateScreenData(currentScreen);
    }
}

// Simulação de notificações
function simulateNotifications() {
    setTimeout(() => {
        showNotification('Nova reserva recebida para hoje às 20:00');
    }, 120000); // 2 minutos
    
    setTimeout(() => {
        showNotification('Mesa 5 aguardando há mais de 15 minutos');
    }, 180000); // 3 minutos
}

// Mostrar notificação
function showNotification(message) {
    // Adicionar notificação à lista
    notifications.push({
        id: notifications.length + 1,
        message,
        time: new Date().toLocaleTimeString(),
        read: false
    });
    
    // Atualizar contador de notificações
    updateNotificationsCount();
    
    // Mostrar toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-bell"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => {
        toast.classList.add('active');
    }, 100);
    
    // Adicionar evento para fechar toast
    toast.querySelector('.toast-close').addEventListener('click', function() {
        toast.classList.remove('active');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Remover toast após 5 segundos
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
}

// Atualizar contador de notificações
function updateNotificationsCount() {
    const unreadCount = notifications.filter(n => !n.read).length;
    
    document.querySelectorAll('.notifications-count').forEach(count => {
        count.textContent = unreadCount;
        count.style.display = unreadCount > 0 ? 'flex' : 'none';
    });
}

// Selecionar mesa para pagamento
function selectTableForPayment(tableId) {
    const table = tables.find(t => t.id == tableId);
    if (!table) return;
    
    // Marcar mesa como selecionada
    document.querySelectorAll('.tables-list .table-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`.tables-list .table-item[data-table-id="${tableId}"]`).classList.add('active');
    
    // Atualizar detalhes do pagamento
    document.querySelector('.payment-header h3').textContent = `Mesa ${table.number}`;
    
    // Calcular total da mesa
    let tableTotal = 0;
    const tableOrders = orders.filter(o => o.tableId == tableId);
    
    // Limpar lista de itens
    const orderItemsList = document.querySelector('.order-items');
    orderItemsList.innerHTML = '<h4>Itens do Pedido</h4>';
    
    // Adicionar itens à lista
    tableOrders.forEach(order => {
        order.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            tableTotal += itemTotal;
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            
            orderItem.innerHTML = `
                <div class="item-info">
                    <div class="item-quantity">${item.quantity}x</div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                    </div>
                    <span class="item-price">R$ ${itemTotal.toFixed(2)}</span>
                </div>
            `;
            
            orderItemsList.appendChild(orderItem);
        });
    });
    
    // Atualizar totais
    const service = tableTotal * 0.1; // 10% de taxa
    const total = tableTotal + service;
    
    document.querySelector('.subtotal span:last-child').textContent = `R$ ${tableTotal.toFixed(2)}`;
    document.querySelector('.service span:last-child').textContent = `R$ ${service.toFixed(2)}`;
    document.querySelector('.total span:last-child').textContent = `R$ ${total.toFixed(2)}`;
}
