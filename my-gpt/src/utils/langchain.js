import { ChatOpenAI } from "@langchain/openai";
import {FewShotPromptTemplate, PromptTemplate} from "@langchain/core/prompts";
import z from 'zod'

const model = new ChatOpenAI({
  openAIApiKey: process.env.VITE_OPENAI_APIKEY,
  model: "gpt-4",
  temperature: 0.7, // lower temperature = less deterministic
  maxTokens: 150,
  maxRetries: 5,
});

export async function generateAnswer(question) {
  let answer = '';
  try {
    // answer = await getOneshotPrompt(model, question);
    answer = await getFewPrompt(question);
    // answer = await getRecommendations(question);
  } catch (e) {
    return 'Something went wrong';
  }

  return answer;
}

async function getOneshotPrompt(question) {
  const promptTemplate = PromptTemplate.fromTemplate(
      "Take the role of a personal travel assistant, and answer the following question in detail: {question}"
  );

  const formattedPrompt = await promptTemplate.invoke({ question });

  const response = await model.invoke(formattedPrompt);

  return response.content;
}


async function getFewPrompt(question) {
  const examplePrompt = PromptTemplate.fromTemplate(
      "Question: {question}\n\nAnswer: {answer}"
  );

  const examples = [
    {
      question: "What are the best museums in Amsterdam?",
      answer: "The highest rated museums in Amsterdam are: Rijksmuseum, Van Gogh Museum, Anne Frank Huis",
    },
    {
      question: "What is the best time of the year to visit The Netherlands?",
      answer: "The best time of the year to visit The Netherlands is: summer",
    },
    {
      question: "How would you recommend to travel in The Netherlands?",
      answer: "The recommended means of transportation in The Netherlands are: bike, boat, train",
    },
  ];

  const prompt = new FewShotPromptTemplate({
    examples,
    examplePrompt,
    suffix: "Question: {question}\n\n",
    inputVariables: ["question"],
  });

  const formattedPrompt = await prompt.format({
    question
  });

  const response = await model.invoke(formattedPrompt);

  console.log('response', response);
  return response.content;
}


async function getRecommendations(question) {
  console.log('getRecommendations');
  const recommendations = z.object({
    title: z.string().describe("Name of the recommendation"),
    description: z.string().describe("Description in maximum 2 sentences"),
    age: z.number().optional().describe("Minimal age for the recommendation"),
  });

  const prompt = PromptTemplate.fromTemplate(
      "Be a helpful assistant and give a recommendation for the following activity: {question}"
  );

  const formattedPrompt = await prompt.format({
    question
  });

  const structuredLlm = model.withStructuredOutput(recommendations);
  const structuredAnswer = await structuredLlm.invoke(formattedPrompt);

  console.log('structuredAnswer', structuredAnswer);

  return JSON.stringify(structuredAnswer);
}