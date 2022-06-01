import { FC } from 'react';
import { TimerSettings, useTimer } from 'react-timer-hook';

interface Props {
    days: number ,
  }

const Timer:FC<Props> = (props) =>{

    const time:Date = new Date();
    time.setSeconds(time.getSeconds() + props.days);

    const sett = {expiryTimestamp:time, onExpire: () => console.warn('onExpire called') } as TimerSettings

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer(sett);


  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '20px'}}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}
export default Timer
