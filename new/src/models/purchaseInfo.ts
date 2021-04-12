export class PurchaseInfo{
    public constructor(
        public id?: number,
        public amount?:number,
        public timestamp?: Date,
        public userId?: number,
        public couponId?:number,
        public couponTitle?: string,
        public price?: number,
        public image?: string,
        public companyName?: string
    ){}
}