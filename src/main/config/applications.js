export const applications = [
  {
    id: 'vscode',
    name: 'VS Code',
    processName: 'Code.exe',
    executablePath: 'C:\\Users\\w10\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
    args: []
  },
  {
    id: 'opera',
    name: 'Opera',
    processName: 'opera.exe',
    executablePath: 'C:\\Users\\w10\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
    args: ['https://github.com'],
    alwaysLaunch: true
  },
  {
    id: 'riot',
    name: 'Riot Client',
    processName: 'RiotClientServices.exe',
    executablePath: 'C:\\Riot Games\\Riot Client\\RiotClientServices.exe',
    args: []
  },
  {
    id: 'lol',
    name: 'League of Legends',
    processName: 'LeagueClient.exe',
    executablePath: 'C:\\Riot Games\\Riot Client\\RiotClientServices.exe',
    args: ['--launch-product=league_of_legends', '--launch-patchline=live'],
    riotProduct: { product: 'league_of_legends', patchline: 'live' }
  },
  {
    id: 'radmin',
    name: 'Radmin VPN',
    processName: 'RvRvpnGui.exe',
    executablePath: 'C:\\Program Files (x86)\\Radmin VPN\\RvRvpnGui.exe',
    args: []
  },
  {
    id: 'sklauncher',
    name: 'SKLauncher',
    processName: 'javaw.exe',
    executablePath: 'C:\\Users\\w10\\AppData\\Roaming\\sklauncher\\jre\\bin\\javaw.exe',
    args: ['-jar', 'C:\\Users\\w10\\AppData\\Roaming\\sklauncher\\SKlauncher.jar']
  }
]
