import React from "react";

interface FichaPokerProps {
  className: string;
}

const FichaPoker: React.FC<FichaPokerProps> = ({ className }) => {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || undefined}
    >
      <g clipPath="url(#clip0_60_857)">
        <path
          d="M8.80183 51.1983C20.5062 62.9259 39.5038 62.9346 51.2194 51.2189C62.9351 39.5033 62.9263 20.5057 51.1988 8.80134C39.4945 -2.92569 20.4969 -2.93498 8.78119 8.7807C-2.93449 20.4964 -2.9252 39.494 8.80183 51.1983ZM2.15661 31.0568H9.30232C9.54276 35.8177 11.4235 40.3489 14.6251 43.8808L9.57321 48.9322C5.03677 44.0562 2.4048 37.7118 2.15661 31.0568ZM16.1199 45.3756C19.6517 48.5766 24.1825 50.4569 28.9433 50.6973V57.843C22.2883 57.5948 15.9439 54.9623 11.068 50.4259L16.1199 45.3756ZM31.0568 50.6973C35.8481 50.4553 40.4057 48.5529 43.9468 45.3162L48.9971 50.3666C44.1135 54.9391 37.7427 57.5943 31.0568 57.8435V50.6973ZM45.4338 43.8147C48.6004 40.2922 50.4589 35.7872 50.6978 31.0568H57.8435C57.5969 37.6819 54.9871 44 50.4862 48.8677L45.4338 43.8147ZM50.6978 28.9434C50.4573 24.1825 48.5771 19.6512 45.375 16.1194L50.4269 11.0675C54.9638 15.9434 57.5963 22.2878 57.8445 28.9434H50.6978ZM43.8813 14.6251C40.3489 11.4235 35.8176 9.54279 31.0568 9.30235V2.15561C37.7123 2.40379 44.0567 5.03629 48.9326 9.57272L43.8813 14.6251ZM28.9433 9.30235C24.2129 9.54124 19.7085 11.3998 16.1854 14.5663L11.1325 9.51338C16.0007 5.01255 22.3183 2.40276 28.9433 2.15561V9.30235ZM30.0001 11.3895C40.2622 11.3889 48.6112 19.7379 48.6112 30.0001C48.6112 40.2623 40.2622 48.6107 30.0001 48.6107C19.7379 48.6107 11.3889 40.2628 11.3889 30.0001C11.3889 19.7374 19.7384 11.3889 30.0001 11.3889V11.3895ZM9.63358 11.003L14.6844 16.0539C11.4472 19.5945 9.54483 24.152 9.30284 28.9434H2.15713C2.40634 22.2579 5.06102 15.8872 9.63358 11.003Z"
          fill="white"
        />
        <path
          d="M34.0432 22.2534C34.9201 22.2534 35.6311 21.5544 35.6311 20.6921C35.6311 19.8299 34.9201 19.1309 34.0432 19.1309C33.1662 19.1309 32.4553 19.8299 32.4553 20.6921C32.4553 21.5544 33.1662 22.2534 34.0432 22.2534Z"
          fill="white"
        />
        <path
          d="M35.6239 26.8256C35.6239 23.5149 32.9008 20.8245 29.5509 20.8245C26.2011 20.8245 23.478 23.508 23.478 26.8256C23.478 30.1433 26.2011 32.8267 29.5509 32.8267C32.9008 32.8267 35.6239 30.1433 35.6239 26.8256ZM25.3863 26.8465C25.3863 24.5534 27.2666 22.6925 29.5927 22.6925C31.9188 22.6925 33.7992 24.5534 33.7992 26.8465C33.7992 29.1396 31.9188 31.0006 29.5927 31.0006C27.2666 31.0006 25.3863 29.1396 25.3863 26.8465Z"
          fill="white"
        />
        <path
          d="M31.4873 32.6455C29.189 32.6455 27.3226 34.4856 27.3226 36.7577C27.3226 39.0299 29.189 40.87 31.4873 40.87C33.7855 40.87 35.6519 39.0299 35.6519 36.7577C35.6519 34.4856 33.7855 32.6455 31.4873 32.6455ZM31.5151 39.1554C30.178 39.1554 29.0915 38.082 29.0915 36.7647C29.0915 35.4474 30.178 34.374 31.5151 34.374C32.8523 34.374 33.9387 35.4474 33.9387 36.7647C33.9387 38.082 32.8523 39.1554 31.5151 39.1554Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_60_857">
          <rect width="60" height="60" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const Logo = () => {
  return (
    <svg
      width="149"
      height="42"
      viewBox="0 0 149 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_60_860)">
        <path
          d="M35.8614 4.55078C33.9832 4.55078 31.7537 5.57419 30.5781 7.5402C30.47 7.71526 30.1998 7.63446 30.1998 7.43247V4.95476C30.1998 4.84703 30.1052 4.75277 29.9971 4.75277H26.6866C26.5785 4.75277 26.4839 4.84703 26.4839 4.95476V25.0323C26.4839 25.1401 26.5785 25.2343 26.6866 25.2343H29.9971C30.1052 25.2343 30.1998 25.1401 30.1998 25.0323V15.0811C30.1998 11.6608 32.0374 8.18656 35.5236 8.18656C36.2668 8.18656 36.8073 8.28082 37.4288 8.50974L37.5505 8.55014V4.72584H37.4829C36.9424 4.59118 36.4424 4.55078 35.8614 4.55078Z"
          fill="white"
        />
        <path
          d="M116.206 4.34961C113.355 4.34961 110.895 5.79046 109.666 8.16045C109.585 8.30857 109.382 8.30857 109.301 8.16045C108.139 5.73659 105.923 4.34961 103.153 4.34961C100.802 4.34961 98.7208 5.37301 97.3966 7.11011C97.275 7.25823 97.0318 7.17744 97.0318 6.98892V4.95557C97.0318 4.84785 96.9372 4.75358 96.8291 4.75358H93.5186C93.4105 4.75358 93.3159 4.84785 93.3159 4.95557V25.0332C93.3159 25.1409 93.4105 25.2352 93.5186 25.2352H96.8291C96.9372 25.2352 97.0318 25.1409 97.0318 25.0332V15.0819C97.0318 10.692 99.2748 7.743 102.612 7.743C105.072 7.743 106.544 9.78982 106.544 13.2101V25.0332C106.544 25.1409 106.639 25.2352 106.747 25.2352H110.058C110.166 25.2352 110.26 25.1409 110.26 25.0332V15.0819C110.26 10.6247 112.436 7.743 115.8 7.743C118.287 7.743 119.773 9.78982 119.773 13.2101V25.0332C119.773 25.1409 119.868 25.2352 119.976 25.2352H123.286C123.394 25.2352 123.489 25.1409 123.489 25.0332V12.685C123.489 7.62181 120.638 4.34961 116.206 4.34961Z"
          fill="white"
        />
        <path
          d="M85.8845 6.0327C87.586 6.0327 88.9653 4.68224 88.9653 3.01635C88.9653 1.35047 87.586 0 85.8845 0C84.183 0 82.8037 1.35047 82.8037 3.01635C82.8037 4.68224 84.183 6.0327 85.8845 6.0327Z"
          fill="white"
        />
        <path
          d="M88.9512 14.8656C88.9512 8.4693 83.6679 3.27148 77.1685 3.27148C70.669 3.27148 65.3857 8.45584 65.3857 14.8656C65.3857 21.2753 70.669 26.4597 77.1685 26.4597C83.6679 26.4597 88.9512 21.2753 88.9512 14.8656ZM69.0881 14.906C69.0881 10.4757 72.7364 6.88033 77.2495 6.88033C81.7626 6.88033 85.4109 10.4757 85.4109 14.906C85.4109 19.3362 81.7626 22.9316 77.2495 22.9316C72.7364 22.9316 69.0881 19.3362 69.0881 14.906Z"
          fill="white"
        />
        <path
          d="M80.9251 26.1094C76.466 26.1094 72.8447 29.6644 72.8447 34.0542C72.8447 38.4441 76.466 41.9991 80.9251 41.9991C85.3841 41.9991 89.0054 38.4441 89.0054 34.0542C89.0054 29.6644 85.3841 26.1094 80.9251 26.1094ZM80.9791 38.6865C78.3848 38.6865 76.2768 36.6127 76.2768 34.0677C76.2768 31.5226 78.3848 29.4489 80.9791 29.4489C83.5735 29.4489 85.6814 31.5226 85.6814 34.0677C85.6814 36.6127 83.5735 38.6865 80.9791 38.6865Z"
          fill="white"
        />
        <path
          d="M10.9855 3.97266C8.06684 3.97266 5.43194 5.09032 3.45915 6.90821V3.99959H0V14.2606C0 14.4356 0 14.5972 0 14.7723C0 14.9473 0 15.1089 0 15.284V32.8165H3.47266V22.6498C5.44545 24.4677 8.08035 25.5854 10.999 25.5854C17.066 25.5854 21.9845 20.7511 21.9845 14.7857C21.9845 8.82036 17.066 3.97266 10.9855 3.97266ZM11.0666 22.2997C6.86424 22.2997 3.45915 18.9467 3.45915 14.8261C3.45915 10.7056 6.86424 7.35259 11.0666 7.35259C15.2689 7.35259 18.674 10.7056 18.674 14.8261C18.674 18.9467 15.2689 22.2997 11.0666 22.2997Z"
          fill="white"
        />
        <path
          d="M61.157 14.3414V3.97266H57.6979V6.97554C55.7251 5.15765 53.0902 4.03999 50.1715 4.03999C44.1045 4.03999 39.186 8.87423 39.186 14.8396C39.186 20.805 44.1045 25.6392 50.1715 25.6392C53.0902 25.6392 55.7251 24.5216 57.6979 22.7037V25.5988H61.157V15.3378C61.157 15.1628 61.157 15.0012 61.157 14.8261C61.157 14.6511 61.157 14.4895 61.157 14.3144V14.3414ZM50.104 22.2997C45.9016 22.2997 42.4965 18.9467 42.4965 14.8261C42.4965 10.7056 45.9016 7.35259 50.104 7.35259C54.3063 7.35259 57.7114 10.7056 57.7114 14.8261C57.7114 18.9467 54.3063 22.2997 50.104 22.2997Z"
          fill="white"
        />
        <path
          d="M149 14.8531C149 14.678 149 14.5164 149 14.3414V3.97266H145.541V6.97554C143.568 5.15765 140.933 4.03999 138.014 4.03999C131.947 4.03999 127.029 8.87423 127.029 14.8396C127.029 20.805 131.947 25.6392 138.014 25.6392C140.933 25.6392 143.568 24.5216 145.541 22.7037V25.5988H149V15.3378C149 15.1628 149 15.0012 149 14.8261V14.8531ZM137.933 22.2997C133.731 22.2997 130.326 18.9467 130.326 14.8261C130.326 10.7056 133.731 7.35259 137.933 7.35259C142.136 7.35259 145.541 10.7056 145.541 14.8261C145.541 18.9467 142.136 22.2997 137.933 22.2997Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_60_860">
          <rect width="149" height="42" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const UserPlus: React.FC<FichaPokerProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      className={className ? className : ""}
    >
      <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
    </svg>
  );
};

const CloseSvg = () => {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.66683 3.66602L18.3335 18.3327"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3335 3.66602L3.66683 18.3327"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const ReetWeet = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
      <path d="M272 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-112 0c-17.7 0-32-14.3-32-32l0-128 32 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l32 0 0 128c0 53 43 96 96 96l112 0zM304 96c-17.7 0-32 14.3-32 32s14.3 32 32 32l112 0c17.7 0 32 14.3 32 32l0 128-32 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8l-32 0 0-128c0-53-43-96-96-96L304 96z" />
    </svg>
  );
};

export { FichaPoker, Logo, UserPlus, CloseSvg, ReetWeet };
