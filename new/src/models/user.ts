export class User{
    public constructor(
        public userName?:string,
        public password?:string,
        public userType?: string,
        public firstName?:string,
        public lastName?:string,
        public id?: number,
        public companyId?:number
    ){}
}