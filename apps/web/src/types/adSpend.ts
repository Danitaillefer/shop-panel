type AdChannel = 'meta' | 'google'

export interface AdSpend {
    date:string;
    channel:AdChannel;
    amount:number;
}