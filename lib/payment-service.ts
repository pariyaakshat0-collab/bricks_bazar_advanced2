import Stripe from 'stripe';
import Razorpay from 'razorpay';
import * as crypto from 'crypto-js';

// Initialize payment gateways only on server side
let stripe: Stripe | null = null;
let razorpay: Razorpay | null = null;

// Initialize payment gateways only on server side
if (typeof window === 'undefined') {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20' as any,
  });

  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  gateway: 'stripe' | 'razorpay';
  customerId?: string;
  orderId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  provider: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

export interface RefundRequest {
  paymentIntentId: string;
  amount: number;
  reason: string;
  refundId?: string;
  status?: 'pending' | 'processing' | 'succeeded' | 'failed';
}

export class PaymentService {
  /**
   * Create payment intent with selected gateway
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    gateway: 'stripe' | 'razorpay',
    orderId: string,
    customerData: {
      email: string;
      name: string;
      phone?: string;
      customerId?: string;
    },
    metadata?: Record<string, any>
  ): Promise<{
    clientSecret: string;
    paymentIntentId: string;
    gateway: string;
  }> {
    try {
      if (gateway === 'stripe') {
        return await this.createStripePaymentIntent(
          amount,
          currency,
          orderId,
          customerData,
          metadata
        );
      } else {
        return await this.createRazorpayOrder(
          amount,
          currency,
          orderId,
          customerData,
          metadata
        );
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Create Stripe payment intent
   */
  private async createStripePaymentIntent(
    amount: number,
    currency: string,
    orderId: string,
    customerData: {
      email: string;
      name: string;
      phone?: string;
      customerId?: string;
    },
    metadata?: Record<string, any>
  ): Promise<{
    clientSecret: string;
    paymentIntentId: string;
    gateway: string;
  }> {
    if (!stripe) {
      throw new Error('Stripe is not initialized. This method can only be called on the server.');
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100);

    // Create or retrieve customer
    let customerId = customerData.customerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        metadata: {
          orderId,
          ...metadata,
        },
      });
      customerId = customer.id;
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      customer: customerId,
      metadata: {
        orderId,
        customerEmail: customerData.email,
        customerName: customerData.name,
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      setup_future_usage: 'off_session',
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      gateway: 'stripe',
    };
  }

  /**
   * Create Razorpay order
   */
  private async createRazorpayOrder(
    amount: number,
    currency: string,
    orderId: string,
    customerData: {
      email: string;
      name: string;
      phone?: string;
      customerId?: string;
    },
    metadata?: Record<string, any>
  ): Promise<{
    clientSecret: string;
    paymentIntentId: string;
    gateway: string;
  }> {
    if (!razorpay) {
      throw new Error('Razorpay is not initialized. This method can only be called on the server.');
    }

    // Convert amount to paise for Razorpay
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: orderId,
      notes: {
        customerEmail: customerData.email,
        customerName: customerData.name,
        orderId,
        ...metadata,
      },
    });

    return {
      clientSecret: razorpayOrder.id,
      paymentIntentId: razorpayOrder.id,
      gateway: 'razorpay',
    };
  }

  /**
   * Confirm payment with selected gateway
   */
  async confirmPayment(
    paymentIntentId: string,
    gateway: 'stripe' | 'razorpay',
    paymentData: any
  ): Promise<{
    success: boolean;
    paymentIntent?: any;
    error?: string;
  }> {
    try {
      if (gateway === 'stripe') {
        return await this.confirmStripePayment(paymentIntentId, paymentData);
      } else {
        return await this.confirmRazorpayPayment(paymentIntentId, paymentData);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: 'Failed to confirm payment',
      };
    }
  }

  /**
   * Confirm Stripe payment
   */
  private async confirmStripePayment(
    paymentIntentId: string,
    paymentData: any
  ): Promise<{
    success: boolean;
    paymentIntent?: any;
    error?: string;
  }> {
    if (!stripe) {
      return {
        success: false,
        error: 'Stripe is not initialized. This method can only be called on the server.',
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentIntent,
        };
      } else {
        return {
          success: false,
          error: `Payment status: ${paymentIntent.status}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Stripe payment confirmation failed',
      };
    }
  }

  /**
   * Confirm Razorpay payment
   */
  private async confirmRazorpayPayment(
    paymentIntentId: string,
    paymentData: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }
  ): Promise<{
    success: boolean;
    paymentIntent?: any;
    error?: string;
  }> {
    if (!razorpay) {
      return {
        success: false,
        error: 'Razorpay is not initialized. This method can only be called on the server.',
      };
    }

    try {
      // Verify the signature
      const generatedSignature = crypto
        .HmacSHA256(
          `${paymentData.razorpay_order_id}|${paymentData.razorpay_payment_id}`,
          process.env.RAZORPAY_KEY_SECRET!
        )
        .toString();

      if (generatedSignature !== paymentData.razorpay_signature) {
        return {
          success: false,
          error: 'Invalid payment signature',
        };
      }

      // Fetch payment details
      const payment = await razorpay.payments.fetch(paymentData.razorpay_payment_id);
      
      if (payment.status === 'captured') {
        return {
          success: true,
          paymentIntent: payment,
        };
      } else {
        return {
          success: false,
          error: `Payment status: ${payment.status}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Razorpay payment confirmation failed',
      };
    }
  }

  /**
   * Process refund
   */
  async processRefund(
    paymentIntentId: string,
    amount: number,
    reason: string,
    gateway: 'stripe' | 'razorpay'
  ): Promise<{
    success: boolean;
    refundId?: string;
    error?: string;
  }> {
    if (gateway === 'stripe' && !stripe) {
      return {
        success: false,
        error: 'Stripe is not initialized. This method can only be called on the server.',
      };
    }
    
    if (gateway === 'razorpay' && !razorpay) {
      return {
        success: false,
        error: 'Razorpay is not initialized. This method can only be called on the server.',
      };
    }

    try {
      if (gateway === 'stripe') {
        const refund = await stripe!.refunds.create({
          payment_intent: paymentIntentId,
          amount: Math.round(amount * 100), // Convert to cents
          reason: 'requested_by_customer',
          metadata: {
            reason,
          },
        });

        return {
          success: true,
          refundId: refund.id,
        };
      } else {
        const refund = await razorpay!.payments.refund(paymentIntentId, {
          amount: Math.round(amount * 100), // Convert to paise
          notes: {
            reason,
          },
        });

        return {
          success: true,
          refundId: refund.id,
        };
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        error: 'Failed to process refund',
      };
    }
  }

  /**
   * Get payment methods for customer
   */
  async getPaymentMethods(
    customerId: string,
    gateway: 'stripe' | 'razorpay'
  ): Promise<PaymentMethod[]> {
    try {
      if (gateway === 'stripe') {
        if (!stripe) {
          throw new Error('Stripe is not initialized. This method can only be called on the server.');
        }
        const paymentMethods = await stripe.paymentMethods.list({
          customer: customerId,
          type: 'card',
        });

        return paymentMethods.data.map((pm: any) => ({
          id: pm.id,
          type: 'card',
          provider: 'stripe',
          last4: pm.card?.last4,
          brand: pm.card?.brand,
          expiryMonth: pm.card?.exp_month,
          expiryYear: pm.card?.exp_year,
        }));
      } else {
        // For Razorpay, you would typically store payment methods in your database
        // as Razorpay doesn't provide a direct API to list saved payment methods
        return [];
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  /**
   * Calculate transaction fees
   */
  calculateTransactionFee(amount: number, gateway: 'stripe' | 'razorpay'): number {
    if (gateway === 'stripe') {
      // Stripe fees: 2.9% + ₹3 per transaction (example rates)
      return Math.round((amount * 0.029 + 3) * 100) / 100;
    } else {
      // Razorpay fees: 2% + ₹3 per transaction (example rates)
      return Math.round((amount * 0.02 + 3) * 100) / 100;
    }
  }

  /**
   * Validate payment amount
   */
  validatePaymentAmount(amount: number): boolean {
    return amount > 0 && amount <= 1000000; // Max ₹10,00,000
  }

  /**
   * Generate secure payment reference
   */
  generatePaymentReference(orderId: string): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    return `PAY_${orderId}_${timestamp}_${random}`;
  }
}

// Export singleton instance
export const paymentService = new PaymentService();

export default paymentService;