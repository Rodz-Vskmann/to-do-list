document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    var input = document.getElementById('taskInput');
    var newTask = input.value.trim();
    if (newTask) {
        var listItem = document.createElement('li');
        var taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = newTask;

        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Deletar';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = function() {
            listItem.remove();
        };

        var completeButton = document.createElement('button');
        completeButton.textContent = 'Concluir';
        completeButton.className = 'complete-btn';
        completeButton.onclick = function() {
            listItem.classList.toggle('completed');
        };

        var actionsSpan = document.createElement('span');
        actionsSpan.className = 'task-actions';
        actionsSpan.appendChild(completeButton);
        actionsSpan.appendChild(deleteButton);

        listItem.appendChild(taskTextSpan);
        listItem.appendChild(actionsSpan);

        document.getElementById('taskList').appendChild(listItem);
        input.value = ''; // Limpa o input após adicionar
    }
}

var timerId;
function startTimer() {
    var timerInput = document.getElementById('timerInput');
    var time = parseInt(timerInput.value) * 60; // Convertendo minutos para segundos
    if (isNaN(time) || time <= 0) {
        alert('Por favor, insira um número válido de minutos.');
        return;
    }

    clearInterval(timerId); // Para qualquer temporizador existente
    timerId = setInterval(function() {
        if (time <= 0) {
            clearInterval(timerId);
            document.getElementById('timeRemaining').innerText = 'Tempo Expirado!';
            alert('O tempo expirou!');
        } else {
            var minutes = Math.floor(time / 60);
            var seconds = time % 60;
            document.getElementById('timeRemaining').innerText = 'Tempo Restante: ' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
            time--;
        }
    }, 1000);
}

// Notes handling
document.getElementById('notesInput').addEventListener('input', function() {
    localStorage.setItem('notes', this.value);
});

window.onload = function() {
    var savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        document.getElementById('notesInput').value = savedNotes;
    }
};

function insertSymbol(symbol) {
    document.execCommand('insertText', false, symbol + ' ');
}

document.getElementById('highlightButton').addEventListener('click', toggleHighlight);

function toggleHighlight() {
    let selection = window.getSelection();
    if (!selection.rangeCount) return; // Se não houver seleção, não faz nada

    let range = selection.getRangeAt(0);
    if (!range.collapsed) { // Verifica se há texto selecionado
        let selectedText = range.toString().trim();
        if (!selectedText) {
            return; // Se não há texto selecionado, sai da função
        }

        let span = document.createElement("span");
        let isHighlighted = range.startContainer.parentNode.nodeName === "SPAN" && 
                            range.startContainer.parentNode.style.backgroundColor === "yellow";

        if (isHighlighted) {
            // Se o texto já está em um span com fundo amarelo, remove o span
            span = range.startContainer.parentNode;
            let textNode = document.createTextNode(span.textContent);
            span.parentNode.replaceChild(textNode, span);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            // Se não, envolve o texto selecionado em um span com fundo amarelo
            span.style.backgroundColor = "yellow";
            range.surroundContents(span);
            selection.removeAllRanges(); // Limpa a seleção após aplicar a marcação
        }
    }
}


function changeTextColor(color) {
    document.execCommand('foreColor', false, color);
}

document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    var input = document.getElementById('taskInput');
    var newTask = input.value.trim();
    if (newTask) {
        addTaskToDOM(newTask);

        // Salva a nova lista de tarefas
        saveTasks();
        input.value = ''; // Limpa o input após adicionar
    }
}

function addTaskToDOM(taskText) {
    var listItem = document.createElement('li');
    var taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText;

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Deletar';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = function() {
        listItem.remove();
        saveTasks();  // Atualiza o localStorage após deletar
    };

    var completeButton = document.createElement('button');
    completeButton.textContent = 'Concluir';
    completeButton.className = 'complete-btn';
    completeButton.onclick = function() {
        listItem.classList.toggle('completed');
        saveTasks();  // Atualiza o localStorage após concluir
    };

    var actionsSpan = document.createElement('span');
    actionsSpan.className = 'task-actions';
    actionsSpan.appendChild(completeButton);
    actionsSpan.appendChild(deleteButton);

    listItem.appendChild(taskTextSpan);
    listItem.appendChild(actionsSpan);

    document.getElementById('taskList').appendChild(listItem);
}

function saveTasks() {
    var tasks = [];
    document.querySelectorAll('#taskList li').forEach(function(item) {
        var task = { 
            text: item.getElementsByTagName('span')[0].textContent,
            completed: item.classList.contains('completed')
        };
        tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

window.onload = function() {
    var savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        JSON.parse(savedTasks).forEach(function(task) {
            addTaskToDOM(task.text);
            if (task.completed) {
                document.querySelector('#taskList li:last-child').classList.add('completed');
            }
        });
    }

    var savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        document.getElementById('notesInput').value = savedNotes;
    }
};

// Notes handling
document.getElementById('notesInput').addEventListener('input', function() {
    localStorage.setItem('notes', this.innerHTML); // Usar innerHTML para manter formatação
});

window.onload = function() {
    // Carregar tarefas salvas
    var savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        JSON.parse(savedTasks).forEach(function(task) {
            addTaskToDOM(task.text);
            if (task.completed) {
                document.querySelector('#taskList li:last-child').classList.add('completed');
            }
        });
    }

    // Carregar notas salvas
    var savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        document.getElementById('notesInput').innerHTML = savedNotes; // Usar innerHTML para restaurar formatação
    }
};

function toggleBold() {
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        let selectedText = range.toString().trim();

        if (!selectedText) {
            return; // Não faz nada se não houver texto selecionado
        }

        let span = range.startContainer.parentNode;

        // Verifica se o elemento selecionado já é um span com estilo negrito
        if (span.style.fontWeight === 'bold' || (span.style.fontWeight >= 600 && span.style.fontWeight <= 900)) {
            // Remover o negrito substituindo o span pelo seu conteúdo
            let textNode = document.createTextNode(span.textContent);
            span.parentNode.replaceChild(textNode, span);
            selection.removeAllRanges(); // Limpa a seleção
        } else {
            // Criar um novo span para o texto selecionado com estilo negrito
            let newSpan = document.createElement("span");
            newSpan.style.fontWeight = 'bold';
            range.surroundContents(newSpan);
            selection.removeAllRanges(); // Limpa a seleção após aplicar o estilo
        }
    }
}

function limpar() {
    // Limpa todas as tarefas do DOM
    document.getElementById('taskList').innerHTML = '';

    // Limpa o conteúdo das notas
    document.getElementById('notesInput').innerHTML = '';

    // Limpa o localStorage removendo as entradas específicas
    localStorage.removeItem('tasks');
    localStorage.removeItem('notes');

    // Reseta o temporizador, se necessário
    clearInterval(timerId);
    document.getElementById('timeRemaining').innerText = 'Tempo Restante: 00:00';
    document.getElementById('timerInput').value = '';
}
function setTextSize(size) {
    let selection = window.getSelection();
    if (selection.rangeCount > 0 && selection.toString().trim() !== '') {
        let range = selection.getRangeAt(0);
        let selectedText = range.toString().trim();
        let span = document.createElement("span");
        
        // Define o tamanho do texto conforme o botão pressionado
        switch (size) {
            case 'h1':
                span.style.fontSize = '2em'; // Tamanho grande
                break;
            case 'h2':
                span.style.fontSize = '1.5em'; // Tamanho médio
                break;
            case 'h3':
                span.style.fontSize = '1.2em'; // Tamanho pequeno
                break;
            case 'p':
                span.style.fontSize = '1em'; // Tamanho padrão
                break;
        }

        if (range.startContainer.parentNode.nodeName === "SPAN") {
            range.startContainer.parentNode.style.fontSize = span.style.fontSize;
        } else {
            range.surroundContents(span);
        }

        selection.removeAllRanges(); // Limpa a seleção após aplicar o estilo
    }
}
document.getElementById('colorPicker').addEventListener('focus', function() {
    this.style.transform = 'scale(1.1)';
});

document.getElementById('colorPicker').addEventListener('blur', function() {
    this.style.transform = 'scale(1)';
});
