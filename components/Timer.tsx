import { FC } from 'react';
import { TimerSettings, useTimer } from 'react-timer-hook';

interface Props {
    days: Date ,
  }

const Timer:FC<Props> = (props) =>{


    const sett = {expiryTimestamp:props.days, onExpire: () => console.warn('onExpire called') } as TimerSettings

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
      <div style={{fontSize: '15px', color:"ButtonText"}}>
        <span>{days} d </span>  <span>{hours} h</span>  {minutes} m <span>{seconds} s</span>
      </div>
    </div>
  );
}
export default Timer
