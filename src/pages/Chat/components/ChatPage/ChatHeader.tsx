import back_arrow from "../../../../assets/img/icons/HobbyIcon/back_arrow.svg";
import search_icon from "../../../../assets/img/icons/ChatIcon/search.svg";

interface ChatHeaderProps {
  otherNickname: string;
  onBackClick: () => void;
  onSearchClick: () => void;
}

export const ChatHeader = ({
  otherNickname,
  onBackClick,
  onSearchClick,
}: ChatHeaderProps) => {
  return (
    <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
      <img
        src={back_arrow}
        alt="back_arrow"
        className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
        onClick={onBackClick}
      />
      <p className="text-[20px] font-MuseumClassic_L italic">{otherNickname}</p>
      <img
        src={search_icon}
        alt="search_icon"
        className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
        onClick={onSearchClick}
      />
    </div>
  );
};
