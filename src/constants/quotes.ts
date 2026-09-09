import quotesData from '../../assets/data/exercise_quotes.json';

type Quote = {
  id: number;
  quote: string;
  author: string;
  role?: string;
};

export const quotes: Quote[] = quotesData.quotes;