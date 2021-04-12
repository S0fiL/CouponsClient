export function createDate(date: Date) {
    
    let newDate = new Date(date);
    let stringDate = String(newDate.getDate() + "/" + (newDate.getMonth()+1) + "/" + newDate.getFullYear());
    return stringDate;

}