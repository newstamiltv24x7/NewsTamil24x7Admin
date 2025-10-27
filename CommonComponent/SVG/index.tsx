import React from "react";

interface SvgType {
  iconId?: string;
  className?: string;
  style?: {
    height: string;
    width: string;
    fill: string;
    marginRight: string;
  };
  onClick?: () => void;
}

const SVG = (props: SvgType) => {
  const { iconId, ...res } = props;
  return (
    <svg {...res}>
      <use href={`/assets/svg/icon-sprite.svg#${iconId}`}></use>
    </svg>
  );
};

export default SVG;
