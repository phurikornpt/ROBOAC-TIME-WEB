function cal_time(start,stop){
    let start_h = Number(start.substring(0,2));
    let start_m = Number(start.substring(3,start.length));
    let stop_h = Number(stop.substring(0,2));
    let stop_m = Number(stop.substring(3,stop.length));

    let h =0;
    let m =0;

    let condition  = ((start_h*60)+start_m) <= ((stop_h*60)+stop_m);
    if( condition ){
        let m1 = (start_h * 60) + start_m;
        let m2 = (stop_h * 60) + stop_m;
        let dis = m2 - m1;
        h = parseInt(dis/60);
        m = dis % 60;

    }else{
        let midni_m = (24*60) - ( (start_h*60) +start_m )
        let m2 =(stop_h * 60) + stop_m
        let s = midni_m + m2
        h = parseInt(s/60)
        m = s % 60
    }
    let result = "";
    if(h<10){
        result += `0${h}`;
    }else{
        result += `${h}`;
    }
    result+=":";
    if(m<10){
        result += `0${m}`;
    }else{
        result += `${m}`;
    }

    return result;
}


module.exports = cal_time;