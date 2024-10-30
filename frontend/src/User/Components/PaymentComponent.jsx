import React, { useState, useEffect } from 'react';

import { 
  CreditCard, 
  Wallet, 
  Building2, 
  Banknote,
  Car, 
  Calculator,
  PiggyBank,
  Percent,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const PaymentComponent = () => {
  const [emiDetails, setEmiDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchEmiDetails();
  }, []);

  const fetchEmiDetails = async () => {
    try {
      const response = await fetch(`/api/emi-details/${userId}`);
      const data = await response.json();
      if (data.length > 0) {
        setEmiDetails(data[0]);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch EMI details');
      setLoading(false);
    }
  };

  const handlePayment = async (paymentMode) => {
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emi_application_id: emiDetails.application_id,
          user_id: userId,
          payment_amount: emiDetails.emi_amount,
          payment_mode: paymentMode
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setPaymentSuccess(true);
        fetchEmiDetails();
      } else {
        setError(data.error || 'Payment failed');
      }
    } catch (err) {
      setError('Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!emiDetails) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-lg text-gray-600">No active EMI found</p>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <PiggyBank className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">EMI Payment</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Car className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium">{emiDetails.brand} {emiDetails.model_name}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calculator className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">EMI Amount</p>
                <p className="font-medium">₹{Number(emiDetails.emi_amount).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Banknote className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="font-medium">₹{Number(emiDetails.loan_amount).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Percent className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="font-medium">{emiDetails.interest_rate}%</p>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {paymentSuccess && (
            <Alert className="bg-green-50 border-green-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <AlertDescription className="text-green-800">
                Payment processed successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="font-medium flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-gray-500" />
              <span>Select Payment Method</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => handlePayment('Credit Card')}
                disabled={processing}
                className="w-full flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Credit Card</span>
              </Button>
              <Button 
                onClick={() => handlePayment('Debit Card')}
                disabled={processing}
                className="w-full flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Debit Card</span>
              </Button>
              <Button 
                onClick={() => handlePayment('Net Banking')}
                disabled={processing}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Net Banking</span>
              </Button>
              <Button 
                onClick={() => handlePayment('UPI')}
                disabled={processing}
                className="w-full flex items-center justify-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>UPI</span>
              </Button>
            </div>
          </div>

          {processing && (
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing payment...</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentComponent;