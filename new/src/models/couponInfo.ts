export class CouponInfo{
    public constructor(
        public id?:number,
        public category?:string,
        public title?:string,
        public endDate?:Date,
        public price?:number,
        public companyId?:number,
        public image?:string  
    ){}
}