const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');

let server;

function createWindow() {
  // Jalankan server SvelteKit (dev mode — bisa ganti ke preview nanti)
  server = spawn('npm', ['run', 'dev'], {
    cwd: __dirname + '/../',
    shell: true,
    stdio: 'inherit'
  });

  // Tunggu server siap
  setTimeout(() => {
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        contextIsolation: false
      }
    });

    win.loadURL('http://localhost:5173');
  }, 3000);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (server) server.kill();
  app.quit();
});

