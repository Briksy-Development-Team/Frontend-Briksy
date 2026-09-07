import { useRef, useState } from "react";
import { StepIndicator, AuthHeader, Btn, ScreenWrapper } from "../../shared";
import { type RegisterStep } from "../Register";

// ponytail: mock OTP | upgrade: call /api/verify-otp
const VALID_CODE = "417293";

export const VerifyScreen = ({ go }: { go: (s: RegisterStep) => void }) => {
  const [code, setCode] = useState(["4", "1", "7", "", "", ""]);
  const [error, setError] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focus = (i: number) => refs.current[i]?.focus();

  const onInput = (i: number, v: string) => {
    const next = [...code];
    next[i] = v.replace(/\D/, "").slice(-1);
    setCode(next);
    setError("");
    if (v && i < 5) focus(i + 1);
  };
  const onKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) focus(i - 1);
  };

  const full = code.every(Boolean);
  const verify = () => {
    if (code.join("") === VALID_CODE) go("preferences");
    else setError("Incorrect code. Please try again.");
  };

  const focusIdx = code.findIndex((c) => !c);

  return (
    <ScreenWrapper>
      <StepIndicator step={2} />
      <AuthHeader 
        title="Confirm your email"
        subtitle="We sent a 6-digit code to abhiguleria1599@gmail.com. It expires in 10 minutes."
      />
      <div className="flex gap-[0.75rem] my-[1rem]">
        {code.map((val, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onChange={(e) => onInput(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            className={`flex-1 h-[3.5rem] w-[1rem] rounded-xl text-center text-xl font-medium text-primary-brown outline-none transition-all border-2 ${
              error
                ? "border-red-400"
                : i === focusIdx
                  ? "border-primary-brown"
                  : "border-[#EDE8E4]"
            } focus:border-primary-brown`}
          />
        ))}
      </div>
      {error && (
        <p className="text-[0.75rem] text-red-500 text-center">{error}</p>
      )}
      <Btn onClick={verify} disabled={!full}>
        Verify and continue
      </Btn>
      <div className="flex flex-col items-center gap-4 text-[0.75rem]">
        <p className="text-primary-light-brown">
          Didn't get it? Resend in 0:42
        </p>
        <button
          onClick={() => go("details")}
          className="text-primary-brown underline "
        >
          Use a different email address
        </button>
      </div>
    </ScreenWrapper>
  );
};
