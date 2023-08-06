export class User{
    constructor(
        public uid:string='',
        public email:string='',
        public displayName:string='',
        public imageUrl:string='',
        public emailVerified:boolean=false,
        public name:string='',
        public about:string='',
        public password:string='',
    ){}
}