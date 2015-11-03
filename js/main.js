"use strict";

var resource = "http://localhost:8000";
var token;

$(document).on('ready', function()
{
    $('#login-form').submit(function(e)
    {
        login();
        return false;
    });

    $('#create-form').on('submit', function()
    {
        createTask();
        return false;
    });
});

// Validar inicio de sesión
var login = function()
{
    $.ajax({
        method: 'POST',
        url: resource + '/api/login',
        data: {
            email: $('#email').val(),
            password: $('#password').val(),
        },
        success: function(data)
        {
            token = data.token;
            $('#user-name').html(data.user.name);
            loadTasks();
        },
        error: function(error)
        {
            console.log(error);
        }
    });
}

// Crear tarea.
var createTask = function()
{
    $.ajax({
        method: 'POST',
        url: resource + '/api/tasks/?token=' + token,
        data: {
            description: $('#description').val(),
            done: false,
        },
        success: function(data)
        {
            showTask(data.task);
        },
        error: function(error)
        {
            console.log(error);
        }
    });
}

// Borrar tarea.
var deleteTask = function()
{
    var id = $(this).data('id');
    
    $.ajax({
        method: 'DELETE',
        url: resource + '/api/tasks/'+id+'?token=' + token,
        success: function(data)
        {
            loadTasks();
        },
        error: function(error)
        {
            console.log(error);
        }
    });
}

// Cargar tareas del servidor.
var loadTasks = function()
{
    $.ajax({
        method: 'GET',
        url: resource + '/api/tasks?token=' + token,
        success: function(data)
        {
            showTasks(data);
        },
        error: function(error)
        {
            console.log(error);
        }
    });
}

// Mostrar tareas en pantalla.
var showTasks = function(tasks)
{
    $('#tasks').html('');
    
    for (var i = 0; i < tasks.length; i++) 
    {
        var task = tasks[i];
        showTask(task);
    }
    loadTasksEvents();
}

// Mostar tarea en pantalla.
var showTask = function(task)
{
    var hDelete = "<button data-id='"+task.id+"' class='waves-effect waves-light btn deep-orange accent-3'>delete</button>";
    var hDone;
    
    if (task.done > 0) {
         hDone = 'Done';
    } else {
         hDone = 'Pending';
    }
    
    $('#tasks').append('<tr><td>'+hDone+'</td><td>'+task.description+'</td><td>'+hDelete+'</td></tr>');
}

// Cargar eventos a tareas.
var loadTasksEvents = function()
{
    var buttons = $('#tasks').find('button');
    buttons.unbind('click');
    buttons.on('click', deleteTask);
}