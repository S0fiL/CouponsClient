export class Purchase{
    public constructor(
        public amount?:number,
        public couponId?:number,
        public id?: number,
        public timestamp?: Date,
        public userId?: number
    ){}
}