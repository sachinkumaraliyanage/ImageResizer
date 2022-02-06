const {app, BrowserWindow, Menu, globalShortcut} = require('electron')
try {
    require('electron-reloader')(module)
  } catch (_) {}
const path = require('path')
//Set Env
process.env.NODE_ENV='development';
const isDev=process.env.NODE_ENV=='development'?true:false;
//get platform
var currentPlatformTemp= process.platform;
const macArray=['darwin']
const winArray=['win32']
const linuxArray=['linux']
if(macArray.includes(currentPlatformTemp)){
    currentPlatformTemp='mac'
}else if(winArray.includes(currentPlatformTemp)){
    currentPlatformTemp='win'
}else if(linuxArray.includes(currentPlatformTemp)){
    currentPlatformTemp='linux'
}
const currentPlatform=currentPlatformTemp;

isDev?console.log(isDev):"";
isDev?console.log(currentPlatform):"";

//var
var mainWindow;
const menuTemplate=[
    ...(currentPlatform=="mac"?[{role:"appMenu"}]:[]),
    {
        // label:"File",
        // submenu:[
        //     {
        //         label:"Quit",
        //         accelerator:currentPlatform=="mac"?"Command+Q":"Ctrl+Q",
        //         click:()=>app.quit()
        //     }
        // ]
        role:"fileMenu"
    },
    ...(isDev?[{
        label:"Dev",
        submenu:[
            {role:"reload"},
            {role:'forcereload'},
            {type:'separator'},
            {role:'toggledevtools'}

        ]
    }]:[]),
];
const programMenu= Menu.buildFromTemplate(menuTemplate)
function createMainWindow(){
    mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        width: 500,
        height:600,
        icon: path.join(__dirname, 'assets/icon.ico'),
        resizable:isDev,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    
    });

    mainWindow.loadFile(path.join(__dirname, 'app/index.html'));

    
}

app.on('window-all-closed', () => {
    if (currentPlatform !== 'mac'){
        app.quit();
    } 
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    }
})

app.whenReady().then(()=>{
    createMainWindow();
    Menu.setApplicationMenu(programMenu);
    mainWindow.on("close",()=>mainWindow=null);
});