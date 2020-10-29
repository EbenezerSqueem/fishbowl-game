import React from "react";

export const IconSVG = ({
  width = 204,
  height = 204,
  viewBoxWidth = 208,
  viewBoxHeight = 208,
}) => {
  const viewBox = "0 0 " + viewBoxWidth + " " + viewBoxHeight;
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M135.968 127C135.968 128.657 134.625 130 132.968 130C131.311 130 129.968 128.657 129.968 127C129.968 125.343 131.311 124 132.968 124C134.625 124 135.968 125.343 135.968 127Z"
        fill="#FFA62B"
      />
      <path
        d="M128.112 115.692C94.9464 99.7402 83.7058 98.0025 84.1125 115.192M58.3361 124.151C46.206 100.664 42.8278 100.962 44.3361 131.151C42.8278 161.339 46.206 161.638 58.3361 138.151M56.1484 123.194C107.931 106.168 138.051 113.412 153.148 130.194C153.678 130.149 153.319 130.908 152.317 132.692M55.6125 139.192C106.817 156.028 143.291 147.391 152.317 132.692M152.317 132.692C152.419 132.527 152.518 132.36 152.612 132.192M100.896 127.113C89.9183 119.404 87.3468 120.711 87.8955 131.113C87.3468 141.515 89.9182 142.822 100.896 135.113M135.968 127C135.968 128.657 134.625 130 132.968 130C131.311 130 129.968 128.657 129.968 127C129.968 125.343 131.311 124 132.968 124C134.625 124 135.968 125.343 135.968 127Z"
        stroke="#FFA62B"
        stroke-width="4"
      />
      <path
        d="M103.763 203C-4.09176 203 -14.7786 114.719 22.3931 26.1523M102.237 203C210.092 203 220.779 114.719 183.607 26.1523M21.2463 3.04788H185.731M22.1755 3.0479C6.84228 1.94768 25.8929 20.1012 22.1756 26.7024M183.9 3.09578C199.233 1.99556 180.183 20.149 183.9 26.7503M16.6101 41.0052C87.1809 9.38329 150.533 53.025 189.39 41.0052"
        stroke="#16697A"
        stroke-width="6"
      />
      <path
        d="M175 83C175 85.7614 172.761 88 170 88C167.239 88 165 85.7614 165 83C165 80.2386 167.239 78 170 78C172.761 78 175 80.2386 175 83Z"
        fill="#16697A"
      />
      <path
        d="M165 103C165 106.314 162.314 109 159 109C155.686 109 153 106.314 153 103C153 99.6863 155.686 97 159 97C162.314 97 165 99.6863 165 103Z"
        fill="#16697A"
      />
      <path
        d="M160 71.5C160 73.433 158.433 75 156.5 75C154.567 75 153 73.433 153 71.5C153 69.567 154.567 68 156.5 68C158.433 68 160 69.567 160 71.5Z"
        fill="#16697A"
      />
    </svg>
  );
};
