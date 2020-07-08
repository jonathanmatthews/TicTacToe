# TicTacToe

## Running in local development
```
cd TicTacToe/server
dotnet user-secrets set connectionString "<SQL Server connection string>"
dotnet ef database update
dotnet watch run
```
```
cd TicTacToe/client
npm i
ng serve
```
## TODO
- Fix leaderboard submission.
    - Browser console suggests server error when submitting, however dotnet console logging doesn't indicate anything went wrong, or that the method was called at all.
- Add timeout to game such that game gets deleted after AFK for too long.