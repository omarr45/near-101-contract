import { ContractPromiseBatch, context } from 'near-sdk-as';
import { Quote, likedQuotes, listedQuotes } from './model';

export function addQuote(quote: Quote): string {
  let storedQuote = listedQuotes.get(quote.id);
  if (storedQuote !== null) {
    throw new Error(`a quote with ${quote.id} already exists`);
  }
  listedQuotes.set(quote.id, Quote.fromPayload(quote));
  return `quote ${quote.text} with id ${quote.id} was added successfully`;
}

export function getQuote(id: string): Quote | null {
  return listedQuotes.get(id);
}

export function getQuotes(): Quote[] {
  return listedQuotes.values();
}

export function likeQuote(quoteId: string): string {
  const quote = getQuote(quoteId);
  if (quote == null) {
    throw new Error('quote not found');
  }
  if (quote.price.toString() != context.attachedDeposit.toString()) {
    throw new Error("attached deposit should equal to the quote's price");
  }
  ContractPromiseBatch.create(quote.owner).transfer(context.attachedDeposit);
  quote.incrementLikes();
  listedQuotes.set(quote.id, quote);

  // Get the old list of liked quotes
  let userQuotes = likedQuotes.get(context.sender);

  // Create a new list if it doesn't exist
  if (!userQuotes) {
    userQuotes = new Array<string>();
  }

  // Add the quote to the list
  userQuotes.push(quoteId);

  // Update the list in storage
  likedQuotes.set(context.sender, userQuotes);

  return `${context.sender} liked "${quote.text}" with id ${quote.id} successfully`;
}

export function getUserQuotes(): Quote[] {
  let quotes: Quote[] = [];

  const values = likedQuotes.get(context.sender);
  if (values) {
    for (let i = 0; i < values.length; i++) {
      const quote = getQuote(values[i]);
      if (quote) {
        quotes.push(quote);
      }
    }
  }
  return quotes;
}
