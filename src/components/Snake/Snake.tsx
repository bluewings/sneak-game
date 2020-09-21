import * as React from 'react';
import styles from './Snake.module.scss';

interface ISnakeProps {
  /**
   * Prop Description
   */
  snake: any[];
  message?: string;
}

/**
 * Component Description
 */
function Snake({ snake }: ISnakeProps) {
  return (
    <div className={styles.root}>
      {/* <h1>Snake</h1>
      <pre>{JSON.stringify(snake)}</pre> */}
      <ul>
        {snake.map(([x, y]: any, i) => {
          return <li key={i} className={styles.body} style={{ top: y * 10, left: x * 10 }}></li>;
        })}
      </ul>
    </div>
  );
}

export default Snake;
