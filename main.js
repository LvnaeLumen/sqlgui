const {BrowserWindow, Component, app, ipcMain, Notification,
Menu} = require('electron');
const path = require('path');

let mainWindow;
let addWindow;
let closeWindow;

function App()
{
    return null;
}
function createWindow()
{
    

    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: "white",
        webPreferences:
        {
            nodeIntegration: true,
            contextIsolation: false         
        }

    })

    global.mainWindow = mainWindow;
    
    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.loadFile('mainWindow.html')


    let server = require('./server/server.js')

    //Quit app when closed
    mainWindow.on('closed', function()
    {
        app.quit();
    })
}

require('electron-reload')(__dirname,{
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
})



app.whenReady().then(createWindow);



//Handle create add window
function createAddWindowIncident()
{
    
    addWindow = new BrowserWindow({
        width: 300,
        height: 300,
        title: 'Add Element',
        
        webPreferences:
        {
            nodeIntegration: true,
            contextIsolation: false
            
        },
        
    })
    addWindow.loadFile('loadWindow.html')

    //Garbage
    addWindow.on('close', function()
    {
        addWindow = null;
    })

}

function createRemoveWindow()
{
    
    removeWindow = new BrowserWindow({
        width: 300,
        height: 300,
        title: 'Remove Element',
        
        webPreferences:
        {
            nodeIntegration: true,
            contextIsolation: false
            
        },
        
    })
    removeWindow.loadFile('removeWindow.html')

    //Garbage
    removeWindow.on('close', function()
    {
        removeWindow = null;
    })

}

function refreshDatabase()
{
    global.mainWindow.webContents.send("database:refresh", 1);
}

function loadDatabase()
{

    let mysql = require('mysql');

    let connection = mysql.createConnection({
      host: 'localhost',
      user: 'ivan',
      password: 'root',
      port: '3306',
      database: 'mydb'
    });
    connection.connect(function(err) {
        if (err) {
          return console.error('error: ' + err.message);
        }



      
        console.log('Connected to the MySQL server.');
        connection.end();

       
      });

      
       connection.end();
    

}



const mainMenuTemplate = 
[
    {
        label:'База данных',
        submenu:[
            {
                label:'Обновить',
                accelerator:'F5',
                click()
                {
                    refreshDatabase();
                }
            },
            {
                label:'Загрузить',
                click()
                {
                    loadDatabase();
                }
            },
            {
                label:'Выйти',
                accelerator: 'Ctrl+Q',
                click()
                {
                    app.quit();
                }
            },
            
        ]
    }
];

mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:
    [
        {
            label: 'Devtools',
            accelerator: 'Ctrl+i',
            click(item, focusedWindow)
            {
                focusedWindow.toggleDevTools();
            }
        },
        {
            role: 'reload'
        }
    ]
})