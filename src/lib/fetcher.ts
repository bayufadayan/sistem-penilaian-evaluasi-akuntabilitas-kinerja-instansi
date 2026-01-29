import axios from "axios";

// Fetcher function untuk SWR
export const fetcher = async (url: string) => {
  const res = await axios.get(url);
  return res.data;
};
