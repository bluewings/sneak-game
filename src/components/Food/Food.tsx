import * as React from 'react';
import styles from './Food.module.scss';

interface IFoodProps {
  /**
   * Prop Description
   */
  message?: string;
  food: any;
}

/**
 * Component Description
 */
function Food({ food }: IFoodProps) {
  const { x, y } = food;
  return (
    <div className={styles.root}>
      {/* <h1>Food</h1>
       */}
      <pre>{JSON.stringify(food, null, 2)}</pre>
      <ul>
        <li className={styles.body} style={{ top: y * 10, left: x * 10 }}></li>
      </ul>
    </div>
  );
}

export default Food;
