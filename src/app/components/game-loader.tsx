import { Message, MessageContent } from "@/components/ai-elements/message";
import { Loader } from "@/components/ai-elements/loader";

export function GameLoader() {
  return (
    <Message
      from="assistant"
      className="flex justify-center space-x-2 animate-pulse"
    >
      <MessageContent>
        <Loader />
        <span>Loading your story...</span>
      </MessageContent>
    </Message>
  );
}
