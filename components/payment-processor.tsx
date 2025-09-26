'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { paymentService } from '@/lib/payment-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Smartphone, Building2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

let stripePromise: Promise<any> | null = null;

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

interface PaymentFormProps {
  amount: number;
  orderId: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, orderId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<'stripe' | 'razorpay'>('stripe');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, [amount, orderId, selectedGateway]);

  const createPaymentIntent = async () => {
    try {
      const response = await api.post('/payments', {
        amount,
        currency: 'INR',
        gateway: selectedGateway,
        orderId,
      });

      if (response.data.success) {
        setClientSecret(response.data.clientSecret);
        setPaymentIntentId(response.data.paymentIntentId);
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      onError('Failed to initialize payment');
    }
  };

  const handleStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: user?.name,
            email: user?.email,
          },
        },
      });

      if (result.error) {
        onError(result.error.message || 'Payment failed');
        toast({
          title: 'Payment Failed',
          description: result.error.message,
          variant: 'destructive',
        });
      } else if (result.paymentIntent?.status === 'succeeded') {
        // Confirm payment on our server
        await confirmPaymentOnServer();
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      onError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: Math.round((amount + (amount * 0.02)) * 100), // Add 2% fee, convert to paise
          currency: 'INR',
          name: 'BBMS Advanced',
          description: `Payment for Order ${orderId}`,
          order_id: paymentIntentId,
          handler: async (response: any) => {
            try {
              // Confirm payment on server
              const confirmResponse = await api.post('/payments/confirm', {
                paymentIntentId,
                gateway: 'razorpay',
                paymentData: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
              });

              if (confirmResponse.data.success) {
                onSuccess(paymentIntentId);
                toast({
                  title: 'Payment Successful',
                  description: 'Your payment has been processed successfully',
                });
              }
            } catch (error) {
              console.error('Razorpay confirmation error:', error);
              onError('Payment confirmation failed');
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: '#3399cc',
          },
        };

        // @ts-ignore
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
    } catch (error) {
      console.error('Razorpay payment error:', error);
      onError('Razorpay payment failed');
    }
  };

  const confirmPaymentOnServer = async () => {
    try {
      const response = await api.post('/payments/confirm', {
        paymentIntentId,
        gateway: 'stripe',
        paymentData: {
          paymentMethod: 'card',
          confirmedAt: new Date(),
        },
      });

      if (response.data.success) {
        onSuccess(paymentIntentId);
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully',
        });
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      onError('Payment confirmation failed');
    }
  };

  const transactionFee = paymentService.calculateTransactionFee(amount, selectedGateway);
  const finalAmount = amount + transactionFee;

  return (
    <form onSubmit={handleStripePayment} className="space-y-6">
      {/* Gateway Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Payment Gateway</h3>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={selectedGateway === 'stripe' ? 'default' : 'outline'}
            onClick={() => setSelectedGateway('stripe')}
            className="flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Stripe
          </Button>
          <Button
            type="button"
            variant={selectedGateway === 'razorpay' ? 'default' : 'outline'}
            onClick={() => setSelectedGateway('razorpay')}
            className="flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Razorpay
          </Button>
        </div>
      </div>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Order: {orderId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Transaction Fee ({selectedGateway === 'stripe' ? '2.9%' : '2%'} + ₹3):</span>
            <span>₹{transactionFee.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total Amount:</span>
            <span>₹{finalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      {selectedGateway === 'stripe' && (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ₹{finalAmount.toFixed(2)}
              </>
            )}
          </Button>
        </div>
      )}

      {selectedGateway === 'razorpay' && (
        <Button
          type="button"
          onClick={handleRazorpayPayment}
          className="w-full"
        >
          <Smartphone className="mr-2 h-4 w-4" />
          Pay with Razorpay - ₹{finalAmount.toFixed(2)}
        </Button>
      )}
    </form>
  );
};

interface PaymentProcessorProps {
  amount: number;
  orderId: string;
  onPaymentComplete: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  amount,
  orderId,
  onPaymentComplete,
  onPaymentError,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successPaymentIntentId, setSuccessPaymentIntentId] = useState('');

  const handleSuccess = (paymentIntentId: string) => {
    setPaymentStatus('success');
    setSuccessPaymentIntentId(paymentIntentId);
    onPaymentComplete(paymentIntentId);
  };

  const handleError = (error: string) => {
    setPaymentStatus('error');
    setErrorMessage(error);
    onPaymentError(error);
  };

  if (paymentStatus === 'success') {
    return (
      <Alert className="border-green-500 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Payment successful! Payment ID: {successPaymentIntentId}
        </AlertDescription>
      </Alert>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <Alert className="border-red-500 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Payment failed: {errorMessage}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={amount}
        orderId={orderId}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </Elements>
  );
};

export default PaymentProcessor;