export class Coupon{
    public constructor(
        public id?:number,
        public category?:string,
        public title?:string,
        public startDate?:Date,
        public endDate?:Date,
        public amount?:number,
        public price?:number,
        public companyId?:number,
        public companyName?:string,
        public description?:string,
        public image?:string 
    ){}
}