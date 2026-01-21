// A curated list of standard Lorem Ipsum words
const WORDS = [
  "ad", "adipiscing", "aliqua", "aliquip", "amet", "anim", "aute", "cillum", "commodo",
  "consectetur", "consequat", "culpa", "cupidatat", "deserunt", "do", "dolor", "dolore",
  "duis", "ea", "eiusmod", "elit", "enim", "esse", "est", "et", "eu", "ex", "excepteur",
  "exercitation", "fugiat", "id", "in", "incididunt", "ipsum", "irure", "labore", "laboris",
  "laborum", "lorem", "magna", "minim", "mollit", "nisi", "non", "nostrud", "nulla",
  "occaecat", "officia", "pariatur", "proident", "qui", "quis", "reprehenderit", "sed",
  "sint", "sit", "sunt", "tempor", "ullamco", "ut", "velit", "veniam", "voluptate"
];

const STARTER_SENTENCE = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateSentence = (minWords = 8, maxWords = 15): string => {
  const length = randomInt(minWords, maxWords);
  const sentenceWords: string[] = [];
  
  for (let i = 0; i < length; i++) {
    const word = WORDS[randomInt(0, WORDS.length - 1)];
    sentenceWords.push(word);
  }
  
  // Add some punctuation occasionally
  if (length > 10 && Math.random() > 0.7) {
    const commaIndex = randomInt(3, length - 3);
    sentenceWords[commaIndex] += ",";
  }

  return capitalize(sentenceWords.join(" ")) + ".";
};

export const generateParagraph = (numSentences: number, isFirst: boolean = false): string => {
  const sentences: string[] = [];
  let count = numSentences;

  if (isFirst) {
    sentences.push(STARTER_SENTENCE);
    count = Math.max(0, count - 1);
  }

  for (let i = 0; i < count; i++) {
    // Vary sentence length slightly for realism
    const sLen = generateSentence(5, 12);
    sentences.push(sLen);
  }

  return sentences.join(" ");
};

export const generateLoremIpsum = (paragraphs: number, sentencesPerPara: number): string[] => {
  const result: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    result.push(generateParagraph(sentencesPerPara, i === 0));
  }
  return result;
};
