import { ReactNode } from 'react';
import bgMeetCarrier from '../assets/img/bg-meetCarrier.webp';

interface LayoutPorps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutPorps) => {
  return (
    <div className="w-screen h-screen bg-[#404040] flex justify-center items-center">
      <div
        className="relative w-full h-full md:w-auto md:h-full md:aspect-[375/812] overflow-hidden flex flex-col-reverse items-center"
        style={{ backgroundImage: `url(${bgMeetCarrier})` }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
