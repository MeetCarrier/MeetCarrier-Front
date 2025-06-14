import axios from "axios";

export interface UserProfileData {
  userId: number;
  nickname: string;
  imageUrl: string | null;
  imgUrl?: string | null;
  age?: number;
  gender?: string;
  footprint?: number;
  interests?: string;
  question?: string;
  // imgUrl 등은 imageUrl로 통일
}

export const fetchUserById = async (
  userId: number
): Promise<UserProfileData> => {
  try {
    const res = await axios.get(
      `https://www.mannamdeliveries.link/api/user/${userId}`,
      {
        withCredentials: true,
      }
    );
    console.log("[상대방 정보 조회 성공]", res.data);
    return res.data;
  } catch (error) {
    console.error("[상대방 정보 조회 실패]", error);
    throw error;
  }
};
