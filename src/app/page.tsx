"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { GameInput } from "./components/game-input";
import { GameLoader } from "./components/game-loader";
import { GameMessage } from "./components/game-message";
import { useGameState } from "./hooks/useGameState";
import { Button } from "@/components/ui/button";

export default function Home() {
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    gameStarted,
    setGameStarted,
  } = useGameState();

  return (
    <main className="flex items-center justify-center w-full min-h-screen p-4">
      <div className="max-w-xl w-full">
        {!gameStarted ? (
          <section className="flex flex-col items-center justify-center h-[calc(100vh-2rem)]">
            <h1 className="mb-2 font-semibold wrap-break-word text-base sm:text-4xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 inline-block text-transparent bg-clip-text">
              AI Anime Story
            </h1>
            <Button
              onClick={() => setGameStarted(true)}
              disabled={isLoading}
              className="px-8 py-4 text-lg mt-8 cursor-pointer"
            >
              Start Adventure
            </Button>
          </section>
        ) : (
          <>
            <Conversation>
              <ConversationContent>
                {messages.map((message) => (
                  <GameMessage key={message.id} message={message} />
                ))}
                {isLoading && <GameLoader />}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            <GameInput
              input={input}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </main>
  );
}
