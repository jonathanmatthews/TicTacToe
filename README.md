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
- Fix NSwag leaderboard API call.
    - NSwag tries to stick array responses into typed arrays in the client, however it seems to be trying to access variables using the server-side naming convention, giving a load of annoying 'undefined's when called and causing the table to contain nonsense.