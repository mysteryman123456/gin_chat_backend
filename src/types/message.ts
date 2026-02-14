export type MessageResponseType = {
  content: string | null | undefined;
  file_url: null | string | undefined;
  sender_id: string;
  type: "TEXT" | "AUDIO" | "VIDEO" | "IMAGE" | "FILE";
  conversation_id: string;
};
