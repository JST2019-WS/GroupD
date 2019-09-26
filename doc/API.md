# API 

## Recommendation request

Request is made to 
```
http://localhost:8080/api/recommend/{user}?portfolio={portfolio}
```
portfolio is a JSON-formatted list of the id's of stocks contained
in the user's portfolio.

## Recommendation response

JSON formatted array of stocks

## Feedback

Post request is made to 
```
http://localhost:8080/api/recommend/{user}
```
with JSON-formatted body
```
{
    choice: stock object as given in recommendation response,
    offered: list of id's of previously recommended stocks (alternatives),
    switchedPage: switch (true if the user navigated to the stock's url, false if only details were requested)
}
```