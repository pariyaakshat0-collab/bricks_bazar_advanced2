declare module 'razorpay' {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  interface Payment {
    id: string;
    status: string;
    amount: number;
    [key: string]: any;
  }

  interface RefundResponse {
    id: string;
    [key: string]: any;
  }

  interface PaymentFetchResponse {
    data: Payment[];
  }

  class Razorpay {
    constructor(options: RazorpayOptions);
    
    payments: {
      fetch(paymentId: string): Promise<Payment>;
      refund(paymentId: string, options: { amount?: number; notes?: Record<string, string> }): Promise<RefundResponse>;
      all(params?: { from?: string; to?: string }): Promise<PaymentFetchResponse>;
    };
    
    orders: {
      create(options: {
        amount: number;
        currency: string;
        receipt?: string;
        payment_capture?: boolean;
        notes?: Record<string, string>;
      }): Promise<any>;
    };
  }

  export default Razorpay;
}