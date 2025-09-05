import { useState, useEffect, useCallback } from "react";
import type { GameMessage, GenerateStoryResponse } from "@/lib/types";

export function useGameState() {
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const generateImage = useCallback(
    async (messageId: string, imagePrompt: string) => {
      try {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          body: JSON.stringify({
            imagePrompt: imagePrompt,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate image");
        }

        const imageData = await response.json();

        setMessages((prevMessages) =>
          prevMessages.map((message) => {
            if (message.id === messageId) {
              return {
                ...message,
                image: imageData.image,
                imageLoading: false,
              };
            }

            return message;
          })
        );
      } catch {
        setMessages((prevMessages) =>
          prevMessages.map((message) => {
            if (message.id === messageId) {
              return { ...message, imageLoading: false };
            }

            return message;
          })
        );
      }
    },
    [setMessages]
  );

  const startGame = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        body: JSON.stringify({ isStart: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const data = (await response.json()) as GenerateStoryResponse;

      const messageId = crypto.randomUUID();

      const newMessage: GameMessage = {
        id: messageId,
        role: "assistant",
        content: data.narrative,
        imageLoading: true,
      };

      setMessages([newMessage]);
      generateImage(messageId, data.imagePrompt);
    } catch (error) {
      console.error("Error generating story:", error);
    } finally {
      setIsLoading(false);
    }
  }, [generateImage, setMessages, setIsLoading]);

  useEffect(() => {
    if (gameStarted) {
      startGame();
    }
  }, [gameStarted, startGame]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage: GameMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: input,
      };

      setIsLoading(true);
      setInput("");
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        const response = await fetch("/api/generate-story", {
          method: "POST",
          body: JSON.stringify({
            userMessage: input,
            conversationHistory: messages,
            isStart: false,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate story");
        }

        const data = (await response.json()) as GenerateStoryResponse;

        const messageId = crypto.randomUUID();

        const assistantMessage: GameMessage = {
          id: messageId,
          role: "assistant",
          content: data.narrative,
          imageLoading: true,
        };

        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        generateImage(messageId, data.imagePrompt);
      } catch (error) {
        console.error("Error generating story:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      input,
      isLoading,
      messages,
      generateImage,
      setIsLoading,
      setInput,
      setMessages,
    ]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return {
    messages,
    input,
    isLoading,
    startGame,
    handleSubmit,
    handleInputChange,
    gameStarted,
    setGameStarted,
  };
}
