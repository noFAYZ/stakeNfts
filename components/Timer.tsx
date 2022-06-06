import { FC } from 'react';
import { TimerSettings, useStopwatch  } from 'react-timer-hook';

interface Props {
    days: Date ,
  }

const Timer:FC<Props> = (props) =>{

  const time = new Date();
  time.setSeconds(time.getSeconds()+ Date.now()/ 1000- Math.floor(props.days.getTime()) / 1000); 
    const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      reset,
    } = useStopwatch({ autoStart: true,offsetTimestamp:time });


  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '15px', color:"ButtonText"}}>
        <span>{days} d </span>  <span>{hours} h</span>  {minutes} m <span>{seconds} s</span>
      </div>
    </div>
  );
}
export default Timer
