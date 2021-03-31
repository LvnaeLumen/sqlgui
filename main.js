const {BrowserWindow, Component, app, ipcMain, Notification,
Menu} = require('electron');
const path = require('path');
let mainWindow;
let addWindow;

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
function createAddWindow()
{
    
    addWindow = new BrowserWindow({
        width: 300,
        height: 300,
        title: 'Add Element',
        backgroundColor: "white",
        webPreferences:
        {
            nodeIntegration: true,
            contextIsolation: false
            
        },
        title:'Загрузка таблицы'
    })
    addWindow.loadFile('loadWindow.html')

    //Garbage
    addWindow.on('close', function()
    {
        addWindow = null;
    })

}

//Add element
ipcMain.on('item:add', function(e, item)
{
    console.log(item);
    
    global.mainWindow.webContents.send("item:add", item);
    
}
);


const mainMenuTemplate = 
[
    {
        label:'База данных',
        submenu:[
            {
                label:'Обновить'
            },
            {
                label:'Загрузить'
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
    },
    {
        label:'Инциденты',
        submenu:[
            {
                label:'Добавить',
                click()
                {
                    createAddWindow();
                }
            },
            {
                label:'Убрать'
            },
            
        ]
    },
    {
        label:'Нарушители',
        submenu:[
            {
                label:'Добавить'
            },
            {
                label:'Убрать'
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