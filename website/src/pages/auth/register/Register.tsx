import { useState } from "react";
import { DetailsScreen } from "./screens/DetailsScreen";
import { PreferencesScreen } from "./screens/PreferencesScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { AuthModalLayout } from "../shared";

export type RegisterStep = "details" | "preferences" | "welcome";

const SCREENS: Record<
  RegisterStep,
  React.ComponentType<{ go: (s: RegisterStep) => void }>
> = {
  details: DetailsScreen,
  preferences: PreferencesScreen,
  welcome: WelcomeScreen,
};

const Register = () => {
  const [step, setStep] = useState<RegisterStep>("details");
  const Screen = SCREENS[step] || DetailsScreen;

  return (
    <AuthModalLayout>
      <Screen go={setStep} />
    </AuthModalLayout>
  );
};

export default Register;
