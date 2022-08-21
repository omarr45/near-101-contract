import { ContractPromiseBatch, context } from 'near-sdk-as';
import { Quote, likedQuotes, listedQuotes } from './model';

// add a new quote to the contract
export function addQuote(quote: Quote): string {
  // check if the quote already exists
  let storedQuote = listedQuotes.get(quote.id);
  if (storedQuote !== null) {
    throw new Error(`a quote with ${quote.id} already exists`);
  }

  // add the quote to the contract
  listedQuotes.set(quote.id, Quote.fromPayload(quote));

  // confirm the quote was added
  return `quote ${quote.text} with id ${quote.id} was added successfully`;
}

// Get a quote by its ID
export function getQuote(id: string): Quote | null {
  return listedQuotes.get(id);
}

// Get all quotes
export function getQuotes(): Quote[] {
  return listedQuotes.values();
}

// Like a quote
export function likeQuote(quoteId: string): string {
  // check if the quote exists
  const quote = getQuote(quoteId);
  if (quote == null) {
    throw new Error('quote not found');
  }

  // check if attached deposit is enough to like the quote
  if (quote.price.toString() != context.attachedDeposit.toString()) {
    throw new Error("attached deposit should equal to the quote's price");
  }

  // Send the deposit to the quote owner
  ContractPromiseBatch.create(quote.owner).transfer(context.attachedDeposit);

  // increase the quote likes counter
  quote.incrementLikes();

  // update the quote in the contract (to update likes counter)
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

// Get all liked quotes by a user
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
