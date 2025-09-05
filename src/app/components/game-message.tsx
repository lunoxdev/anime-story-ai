import { Message, MessageContent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { type GameMessage as GameMessageType } from "@/lib/types";
import { Image } from "@/components/ai-elements/image";
import { UI_MESSAGES } from "@/lib/consts";
import { Loader } from "@/components/ai-elements/loader";

export function GameMessage({ message }: { message: GameMessageType }) {
  const { role, content, image, imageLoading } = message;

  return (
    <Message from={role}>
      <MessageContent>
        {role === "assistant" && (
          <picture>
            {imageLoading && (
              <div className="flex justify-center space-x-2 animate-pulse">
                <Loader />
                <span>{UI_MESSAGES.LOADING.IMAGE}</span>
              </div>
            )}

            {image && (
              <Image
                base64={image.base64Data}
                mediaType={image.mediaType}
                uint8Array={new Uint8Array()}
                alt="anime cyberpunk scene"
                className="w-full max-w-xl aspect-video rounded-md shadow-md mb-2 object-cover"
              />
            )}
          </picture>
        )}

        <Response>{content}</Response>
      </MessageContent>
    </Message>
  );
}
