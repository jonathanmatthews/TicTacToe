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
ng serve
```
