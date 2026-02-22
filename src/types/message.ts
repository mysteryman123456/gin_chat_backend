export type MessageResponseType = {
  content: string | null | undefined;
  file_url: null | string | undefined;
  receiver_info: {
    by: string;
    receiver_id: string;
  };
  sender_id: string;
  type: "TEXT" | "AUDIO" | "VIDEO" | "IMAGE" | "FILE";
  conversation_id: string;
};
