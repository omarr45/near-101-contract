import { PersistentUnorderedMap, context, u128 } from 'near-sdk-as';

@nearBindgen
export class Quote {
  id: string; // unique ID for the quote
  text: string; // the text of the quote
  character: string; // the person who said the quote
  price: u128; // the price to like the quote
  owner: string; // the owner of the quote
  likes: u32; // the number of likes the quote has

  public static fromPayload(payload: Quote): Quote {
    const quote = new Quote();
    quote.id = payload.id;
    quote.text = payload.text;
    quote.character = payload.character;
    quote.price = payload.price;
    quote.owner = context.sender;
    return quote;
  }

  // increase likes counter
  public incrementLikes(): void {
    this.likes = this.likes + 1;
  }
}

// container for all listed quotes on the contract {quote ID : Quote}
export const listedQuotes = new PersistentUnorderedMap<string, Quote>('lq');

// container for all liked quotes on the contract {user ID : Array of Quotes}
export const likedQuotes = new PersistentUnorderedMap<string, Array<string>>(
  'ulq'
);
