import {useState} from 'react'
import Message from "./components/api/Message.jsx";
import Loader from "./components/api/Loader.jsx";

export default function App() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSubmitQuestion(question) {
    setLoading(true);
    const body = JSON.stringify({question})
    setQuestion('');
    try {
      const response = await fetch('http://localhost:3000/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      const data = await response.json();
      setMessages([
        {role: "user", content: question},
        {role: "assistant", content: data.answer}
      ]);
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="overflow-hidden w-full h-screen relative flex">
      <div className="flex max-w-full flex-1 flex-col">
        <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
          <div className="flex-1 overflow-hidden dark:bg-gray-800">

            <h1
              className="text-2xl sm:text-4xl font-semibold text-center text-gray-200 dark:text-gray-600 flex gap-4 p-4 items-center justify-center">
              My GPT
            </h1>
            <div className="h-4/5 overflow-auto">
              <div className="h-full flex flex-col items-center text-sm dark:bg-gray-800">
                {messages.map(message => {
                  return <Message key={message.content} role={message.role} content={message.content} />
                })}
              </div>

            </div>
          </div>



          <div
            className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
            {loading && <Loader />}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmitQuestion(question)
              }}
              className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
              <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                <div
                  className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                  <textarea
                    value={question}
                    tabIndex={0}
                    data-id="root"
                    placeholder="Send a message..."
                    className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                    onChange={(e) => setQuestion(e.currentTarget.value)}
                    onKeyDown={(e) => {e.key === 'Enter' && handleSubmitQuestion(question)}}
                  ></textarea>
                  <button
                      onClick={() => handleSubmitQuestion(question)}
                    className="absolute p-1 rounded-md bottom-1.5 md:bottom-2.5 bg-transparent disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
                  >
                    &#11157;
                  </button>
                </div>
              </div>
            </form>
            <div
              className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
              <span>
                The responses may include inaccurate information about people, places, or facts.
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};