export const Router = {
  OnbordingScreen: 'Onbording',
  SMSInputScreen: 'SignUp/In',
  SMSVerifyScreen: 'Verify',
  OpnerScreen: 'Opner',
  TestTorScreen: 'TestTorScreen',
} as const;
export type Router = typeof Router[keyof typeof Router];
