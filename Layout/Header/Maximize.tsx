import { Href } from '@/Constant';
import Link from 'next/link';
import React, { useState } from 'react';
import { Maximize } from 'react-feather';

const MaximizeScreen = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const fullScreenHandler = (isFullScreen: boolean) => {
    setFullScreen(isFullScreen);
    if (isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document?.exitFullscreen();
    }
  };

  return (
    <li className='maximize-btn'>
      <Link className='text-dark' onClick={() => fullScreenHandler(!fullScreen)} href={Href}>
        <Maximize />
      </Link>
    </li>
  );
};

export default MaximizeScreen;
