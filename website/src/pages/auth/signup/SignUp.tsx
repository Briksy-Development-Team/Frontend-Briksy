import  { useState } from 'react';

const SignUp = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  

  return (
    <div className="min-h-screen bg-white-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-medium mb-6">Sign Up - Step {step}</h1>
        <p>Signup design goes here...</p>
        <button onClick={() => setStep(step < 3 ? step + 1 : 1 as any)} className="mt-4 bg-gray-200 px-4 py-2 rounded">
          Next Step
        </button>
      </div>
    </div>
  );
};

export default SignUp;
