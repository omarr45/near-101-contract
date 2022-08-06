import { PersistentUnorderedMap, context, u128 } from 'near-sdk-as';

@nearBindgen
export class Quote {
  id: string;
  text: string;
  character: string;
  price: u128;
  owner: string;
  likes: u32;

  public static fromPayload(payload: Quote): Quote {
    const quote = new Quote();
    quote.id = payload.id;
    quote.text = payload.text;
    quote.character = payload.character;
    quote.price = payload.price;
    quote.owner = context.sender;
    return quote;
  }

  public incrementLikes(): void {
    this.likes = this.likes + 1;
  }
}

export const listedQuotes = new PersistentUnorderedMap<string, Quote>('lq');
