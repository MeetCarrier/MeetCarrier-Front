import { useState } from "react";
import axios from "axios";

export const useFetchUser = () => {
  const [loading, setLoading] = useState(false);

  const fetchUser = async (userId: number) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://www.mannamdeliveries.link/api/user/${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log("[상대방 정보 조회]", res.data);
      return res.data;
    } catch (err) {
      console.error("[조회 실패]", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchUser, loading };
};
