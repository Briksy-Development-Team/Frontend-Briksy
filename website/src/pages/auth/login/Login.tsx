import { useEffect, useRef, useState, type ComponentType } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../../auth/AuthContext";
import {
  clearPendingFavoriteAction,
  readPendingFavoriteAction,
} from "../../../auth/auth.intent";

import { AuthModalLayout, type Screen } from "../shared";

import { LoginScreen } from "./LoginScreen";
import { ForgotScreen } from "./ForgotScreen";
import { LinkSentScreen } from "./LinkSentScreen";
import { NewPasswordScreen } from "./NewPasswordScreen";
import { UpdatedScreen } from "./UpdatedScreen";

const LOGIN_SCREENS: Record<
  Screen,
  ComponentType<{ go: (screen: Screen) => void }>
> = {
  login: LoginScreen,
  forgot: ForgotScreen,
  "link-sent": LinkSentScreen,
  "new-password": NewPasswordScreen,
  updated: UpdatedScreen,
};

const Login = () => {
  const { isAuthenticated, isBootstrapping, isSeeker } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const redirectingRef = useRef(false);
  const [screen, setScreen] = useState<Screen>("login");

  const fromPath =
    (location.state as { from?: string } | null)?.from ?? "/account/profile";
  const Screen = LOGIN_SCREENS[screen] || LoginScreen;

  useEffect(() => {
    if (
      isBootstrapping ||
      !isAuthenticated ||
      !isSeeker ||
      redirectingRef.current
    ) {
      return;
    }

    redirectingRef.current = true;

    const pending = readPendingFavoriteAction();

    const finish = async (): Promise<void> => {
      try {
        if (pending?.type === "favorite" && pending.targetId) {
          clearPendingFavoriteAction();

          navigate(pending.fromPath ?? fromPath, { replace: true });

          return;
        }

        navigate(fromPath, { replace: true });
      } catch (error) {
        console.error("Failed to complete pending seeker action.", error);

        navigate(fromPath, { replace: true });
      }
    };

    void finish();
  }, [fromPath, isAuthenticated, isSeeker, isBootstrapping, navigate]);

  return (
    <AuthModalLayout>
      <Screen go={setScreen} />
    </AuthModalLayout>
  );
};

export default Login;
