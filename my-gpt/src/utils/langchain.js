import { ChatOpenAI } from "@langchain/openai";

export async function generateAnswer(question) {
  const model = new ChatOpenAI({
    openAIApiKey: process.env.VITE_OPENAI_APIKEY,
    model: "gpt-4o-mini",
    temperature: 0 // lower temperature = less deterministic
  });

  let answer = '';

  try {
    const response = await model.invoke(question);
    if (typeof response.content !== 'string') {
      throw new Error('The answer should be a string');
    }
    answer = response.content;
  } catch (e) {
    return 'Something went wrong';
  }

  return answer;
}