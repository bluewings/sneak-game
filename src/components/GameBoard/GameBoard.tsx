import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { useImmer } from 'use-immer';
import Snake from '../Snake';
import Food from '../Food';
import { useHandle } from '../../hooks';

import styles from './GameBoard.module.scss';

const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';

interface IGameBoardProps {
  /**
   * Prop Description
   */
  message?: string;
  width?: number;
  height?: number;
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a: any[]) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

/**
 * Component Description
 */
function GameBoard({ width = 21, height = 21 }: IGameBoardProps) {
  const slots = useMemo(() => {
    let slots = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        slots.push([x, y]);
      }
    }
    return slots;
  }, [width, height]);
  const [state, updateState] = useImmer<any>({
    // name: 'Michel',
    // age: 33,

    // snake: {
    //   x: Math.floor(width / 2),
    //   y: Math.floor(height / 2),
    // },
    snake: [[Math.floor(width / 2), Math.floor(height / 2)]],
    snakeSpeed: 10,
    snakeLength: 10,
    direction: {
      x: 1,
      y: 0,
    },
    food: {
      x: -1,
      y: -1,
    },
  });

  const getFood = () => {
    updateState((draft) => {
      const snakeBody = draft.snake;

      const snakeHead = { ...snakeBody[0] };

      // console.log(snakeHead);

      if (draft.food.x === -1 || (snakeHead[0] === draft.food.x && snakeHead[1] === draft.food.y)) {
        const all: any = {};

        // console.log(draft.food.x, snakeHead.x === draft.food.x && snakeHead.y === draft.food.y);

        slots.forEach(([x, y]: number[]) => {
          all[`${x},${y}`] = true;
        });
        draft.snake.forEach(([x, y]: number[]) => {
          delete all[`${x},${y}`];
        });
        let candidates = shuffle(Object.keys(all));

        const target = candidates[~~(Math.random() * candidates.length)].split(',');

        draft.food = {
          x: ~~target[0],
          y: ~~target[1],
        };
        draft.snakeLength = draft.snakeLength + 3;
      }

      // shuffle(all);
    });
  };

  // 뱀의 진행 방향
  const setDirection = useCallback(
    (direction: string) => {
      updateState((draft) => {
        switch (direction) {
          case ARROW_UP:
          case ARROW_DOWN: {
            if (draft.direction.y === 0) {
              draft.direction.x = 0;
              draft.direction.y = direction === ARROW_UP ? -1 : 1;
            }
            break;
          }
          case ARROW_LEFT:
          case ARROW_RIGHT:
            if (draft.direction.x === 0) {
              draft.direction.x = direction === ARROW_LEFT ? -1 : 1;
              draft.direction.y = 0;
            }
            break;

          default:
            break;
        }
      });
    },
    [updateState],
  );

  const moveSnake = () => {
    updateState((draft) => {
      if (draft.direction.x !== 0 || draft.direction.y !== 0) {
        // console.log(draft.direction.x, draft.direction.y);
        const snakeHead = draft.snake[0];
        draft.snake = [[snakeHead[0] + draft.direction.x, snakeHead[1] + draft.direction.y], ...draft.snake].slice(
          0,
          draft.snakeLength,
        );
      }
    });
  };

  const checkGameEnd = () => {
    updateState((draft) => {
      const [snakeHead, ...snakeBody] = draft.snake;

      // console.log(snakeHead);

      // if (draft.direction.x !== 0 || draft.direction.y !== 0) {
      //   // console.log(draft.direction.x, draft.direction.y);
      //   const snakeHead = draft.snake[0];
      //   draft.snake = [[snakeHead[0] + draft.direction.x, snakeHead[1] + draft.direction.y], ...draft.snake].slice(
      //     0,
      //     draft.snakeLength,
      //   );
      // }
    });
  };

  const main = useHandle(() => {
    moveSnake();

    getFood();

    checkGameEnd();
  });

  const lastKey: any = useRef();

  let skipMove = useRef(false);

  // 방향키를 누른 상태
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case ARROW_UP:
        case ARROW_DOWN:
        case ARROW_LEFT:
        case ARROW_RIGHT:
          // lastKey.current = event.key;
          setDirection(event.key);
          main();
          skipMove.current = true;
          event.preventDefault();

          break;
        default:
          break;
      }
    };

    document.documentElement.addEventListener('keydown', handleKeyDown);

    return () => {
      document.documentElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [setDirection]);

  // 게임 루프
  useEffect(() => {
    let raf: number;
    let lastExecTime = 0;

    const handleLoop = (currTime: number) => {
      if (currTime - lastExecTime > 1000 / state.snakeSpeed) {
        // setDirection(lastKey.current);
        if (skipMove.current === false) {
          main();
        }
        skipMove.current = false;

        // console.log(currTime - lastExecTime);
        lastExecTime = currTime;
      }
      raf = requestAnimationFrame(handleLoop);
    };
    raf = requestAnimationFrame(handleLoop);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [setDirection, main, state.snakeSpeed]);

  return (
    <div className={styles.root}>
      {/* <h1>GameBoard</h1> */}
      <Snake snake={state.snake} />
      {state.food && <Food food={state.food} />}

      {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
    </div>
  );
}

export default GameBoard;
