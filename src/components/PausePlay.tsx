import { useEffect, useState } from "react";

export type PausePlayProps = {
  onClick: (pause: boolean) => void;
  value?: boolean;
};

function PausePlay({ onClick = () => {}, value = false }: PausePlayProps) {
  const [pause, setPause] = useState(value);

  const handleClick = () => {
    setPause((pause) => {
      const newPause = !pause;

      return newPause;
    });
  };

  useEffect(() => {
    onClick(pause);
    // eslint-disable-next-line
  }, [pause]);

  return (
    <div
      className="cursor-pointer duration-150 bg-dark ease-in-out hover:bg-dark-dark flex gap-1 justify-center items-center h-6 w-8 lg:h-9 lg:w-12 rounded-sm"
      onClick={handleClick}
    >
      <div
        className={`bg-primary-main transition-all  duration-150 w-[3px] h-[15px] lg:w-1 lg:h-5 ${
          pause
            ? "bg-transparent w-0 h-0  border-l-primary-main border-y-transparent border-l-10 lg:border-l-15 border-y-[7.3px] lg:border-y-11"
            : ""
        }`}
      />
      <div
        className={`bg-primary-main transition-all duration-150 w-[3px] h-[15px] lg:w-1 lg:h-5 ${
          pause ? "hidden" : ""
        }`}
      />
    </div>
  );
}

export default PausePlay;
