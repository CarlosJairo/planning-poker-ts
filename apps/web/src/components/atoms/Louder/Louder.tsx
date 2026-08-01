import { useEffect, useState } from "react";
import "./Louder.scss";

const Louder = () => {
  const initialPositions = [
    { cx: 13.4222, cy: 13.4556 },
    { cx: 61.2884, cy: 13.5435 },
    { cx: 168.578, cy: 13.5435 },
    { cx: 94.3626, cy: 13.4849 },
  ];

  const [positions, setPositions] = useState(initialPositions);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prevPositions) => {
        // Mover el elemento una posicion, dejando al primero de ultimo
        const newPositions = [prevPositions[3], ...prevPositions.slice(0, 3)];
        return newPositions;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      role="img"
      width="182"
      height="27"
      viewBox="0 0 182 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="louder"
    >
      {positions.map((pos, index) => (
        <circle
          key={index}
          cx={pos.cx}
          cy={pos.cy}
          r="13.4556"
          fill="#6429CD"
        />
      ))}
    </svg>
  );
};

export default Louder;
