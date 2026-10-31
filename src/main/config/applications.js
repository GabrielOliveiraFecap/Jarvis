export const applications = [
  {
    id: 'vscode',
    name: 'VS Code',
    executablePath: 'C:\\Users\\w10\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
    args: []
  },
  {
    id: 'opera',
    name: 'Opera',
    executablePath: 'C:\\Users\\w10\\AppData\\Local\\Programs\\Opera GX\\opera.exe',
    args: ['https://github.com']
  },
  {
    id: 'riot',
    name: 'Riot Client',
    executablePath: 'C:\\Riot Games\\Riot Client\\RiotClientServices.exe',
    args: []
  },
  {
    id: 'lol',
    name: 'League of Legends',
    executablePath: 'C:\\Riot Games\\Riot Client\\RiotClientServices.exe',
    args: ['--launch-product=league_of_legends', '--launch-patchline=live'],
    riotProduct: { product: 'league_of_legends', patchline: 'live' }
  },
  {
    id: 'radmin',
    name: 'Radmin VPN',
    executablePath: 'C:\\Program Files (x86)\\Radmin VPN\\RvRvpnGui.exe',
    args: []
  },
  {
    id: 'sklauncher',
    name: 'SKLauncher',
    executablePath: 'C:\\Users\\w10\\AppData\\Roaming\\sklauncher\\jre\\bin\\javaw.exe',
    args: ['-jar', 'C:\\Users\\w10\\AppData\\Roaming\\sklauncher\\SKlauncher.jar']
  }
]
