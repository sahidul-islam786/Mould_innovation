import media from "./media.json";

// The 13 client logos from the live home page, in source order. Names are the source alt texts;
// files are byte-exact copies (500×500 originals).
export type Client = { name: string; src: string; width: number; height: number };

export const clients: Client[] = media.clients;
