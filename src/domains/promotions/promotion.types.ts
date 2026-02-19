export interface DiscountResult{
    applicable:boolean;
    discountAmount:number; 
    label: string;
}

export interface PromotionRule{
    name: string;
    description:string;
    evaluate:(subtotal:number)=>DiscountResult;
}