import { describe, it, assert } from 'vitest';
import { generateAnswer } from './langchain';

describe('LangChain', () => {
  it('Answers a question', async () => {
    // 1. Add your own question here
    const answer = await generateAnswer('Is Japan a country, keep it short.');

    console.log({ answer })

    // 2. Match the answer from the LLM to a predicted value
    assert.include(answer.trim().toLowerCase(), "yes");
  });
});