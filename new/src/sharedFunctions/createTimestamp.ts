export function createTimestamp(date: Date) {
    
    let newDate = new Date(date);
    let stringDate = String(newDate.getDate() + "/" + (newDate.getMonth()+1) + "/" + newDate.getFullYear() + "  " + newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds());
    console.log(stringDate);
    return stringDate;

}