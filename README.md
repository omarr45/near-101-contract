# 👨🏻‍💻 near-101-contract
## The smart contract code for my near-101 project "The Quotes Archive"

You can find the frontend code [here](https://github.com/omarr45/quotes-archive)
<br>
You can also find the deployed version demo [here](https://omarr45.github.io/quotes-archive/)

## Folder Structure
```
my-document/          # Root directory.
|- assembly/          # Folder used to store .ts files.
|--|- index.ts            # Main contract
|--|- model.ts            # Object(s) used in the contract
|--|- as_types.d.ts       # Config files
|--|- tsconfig.json       # Config files
|- build/             # Contains the final .wasm file.
```

## 1️⃣ Model.ts
**`Quote`** -> the main object of the contract

**`listedQuotes : {id : Quote}`** -> Contains all quotes stored on the contract  

**`likedQuotes : {id : [Quotes]}`** -> Contains all quotes liked by each user


## 2️⃣ Index.ts
**`addQuote(quote)`** -> Adds a new quote to the contract after making sure no quote exists with the same id

**`likeQuote(id)`** -> Increments the likes counter and transfers the requires NEAR ammount to the quote owner

**`getQuote(id)`** -> Gets a quote by its unique ID

**`getQuotes()`** -> Gets all quotes stored on the contract

**`getUserQuotes()`** -> Gets all the liked quotes by the current user based on *`context.sender`*
