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
- API seems to have trouble with PlayerRecord naming convention again.
    - Temporarily just changed interface definition to lowercase, however if Nswag was run again, this would reproduce the problem, so a real fix is still needed.
