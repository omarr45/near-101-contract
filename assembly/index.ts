import { ContractPromiseBatch, context } from 'near-sdk-as';
import { Quote, listedQuotes } from './model';

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
  return `${context.sender} liked "${quote.text}" with id ${quote.id} successfully`;
}
